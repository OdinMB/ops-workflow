import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { query } from "@anthropic-ai/claude-agent-sdk";
import type { SDKMessage } from "@anthropic-ai/claude-agent-sdk";
import { readFileSync, writeFileSync, existsSync, readdirSync } from "fs";
import { join, dirname, resolve } from "path";
import { fileURLToPath } from "url";
import { z } from "zod";

// ── Config ─────────────────────────────────────────────

const __dirname = dirname(fileURLToPath(import.meta.url));
const pluginRoot = resolve(__dirname, "..", "..");
const configPath = join(__dirname, "..", "projects.json");

let projects: Record<string, string> = {};
if (existsSync(configPath)) {
  projects = JSON.parse(readFileSync(configPath, "utf-8"));
}

function saveProjects(): void {
  writeFileSync(configPath, JSON.stringify(projects, null, 2));
}

// ── Project Resolution ─────────────────────────────────

let activeProject: string | undefined = process.env.OPS_PROJECT_DIR;

function resolveProject(project?: string): string {
  if (project && projects[project]) return projects[project];
  if (project && existsSync(project)) return project;
  if (project) {
    const available = Object.keys(projects).join(", ");
    throw new Error(`Unknown project "${project}". Available: ${available}`);
  }
  if (activeProject) return activeProject;
  if (Object.keys(projects).length === 1) return Object.values(projects)[0];
  throw new Error("No active project — use ops_dir or pass a project name.");
}

// ── Summary Styles ─────────────────────────────────────

const SUMMARY_PROMPTS: Record<string, string> = {
  compact: `

When you are completely done, output ONLY this summary block as your final output:

<ops-result>
## Status
[completed | partial | blocked]

## Files changed
- [bullet list of files created or modified, or "none"]

## Result
[1-3 sentence summary of what was accomplished]
</ops-result>`,

  detailed: `

When you are completely done, output ONLY this summary block as your final output:

<ops-result>
## Status
[completed | partial | blocked]

## Analysis
[full analysis output — this IS the deliverable]

## Recommendations
[prioritized action items with rationale]
</ops-result>`,

  passthrough: "",
};

// ── Claude Code Runner ─────────────────────────────────

interface RunOpsOptions {
  maxTurns?: number;
  summaryStyle?: keyof typeof SUMMARY_PROMPTS;
}

async function runOps(
  projectDir: string,
  prompt: string,
  opts: RunOpsOptions = {}
): Promise<string> {
  const style = opts.summaryStyle ?? "compact";
  const suffix = SUMMARY_PROMPTS[style];
  const fullPrompt = suffix ? prompt + suffix : prompt;

  let resultText = "";
  let lastAssistantText = "";

  for await (const msg of query({
    prompt: fullPrompt,
    options: {
      cwd: projectDir,
      maxTurns: opts.maxTurns ?? 250,
      plugins: [{ type: "local", path: pluginRoot }],
      permissionMode: "bypassPermissions",
      allowDangerouslySkipPermissions: true,
      persistSession: false,
    },
  })) {
    const m = msg as SDKMessage & Record<string, unknown>;

    if (m.type === "result" && "result" in m && typeof m.result === "string") {
      resultText = m.result;
    }

    if (m.type === "assistant" && m.message) {
      const message = m.message as {
        content?: Array<{ type: string; text?: string }>;
      };
      if (Array.isArray(message.content)) {
        for (const block of message.content) {
          if (block.type === "text" && block.text) {
            lastAssistantText = block.text;
          }
        }
      }
    }
  }

  const raw = resultText || lastAssistantText;

  // For passthrough style, return full output
  if (style === "passthrough") {
    return raw.slice(-2000);
  }

  const match = raw.match(/<ops-result>([\s\S]*?)<\/ops-result>/);
  return match?.[1]?.trim() ?? raw.slice(-1000);
}

function readLatestFile(dir: string, filter?: string): string | null {
  if (!existsSync(dir)) return null;
  const files = readdirSync(dir)
    .filter((f) => f.endsWith(".md") && (!filter || f.includes(filter)))
    .sort()
    .reverse();
  if (files.length === 0) return null;
  return readFileSync(join(dir, files[0]), "utf-8");
}

// ── Server ─────────────────────────────────────────────

const SERVER_INSTRUCTIONS = `You are connected to the ops-workflow plugin, which manages structured non-code projects (research, strategy, content, compliance).

## How ops projects are organized

Each project is a folder with this structure:
- state/ — living documents describing what currently exists (updated with _Last updated: YYYY-MM-DD_)
- backlog/ — prioritized work items, grouped by category
- references/ — input research, external context
- artifacts/ — deliverables and work products (date-prefixed when delivered)
- plans/ — active work plans; plans/completed/ for finished ones
- CLAUDE.md — project-specific rules and constraints
- MEMORY.md — stable context: project description, goals, key learnings

Every folder has an INDEX.md that provides an overview at its level of abstraction.

## How to work with the tools

- Start with ops_context to load the active project's rules and context
- Use ops_dir to switch between registered projects
- Use ops_whats_next for orientation — it reads state, backlog, and plans to recommend priorities
- Use ops_plan to propose work, then ops_execute after the user approves
- Use ops_update to integrate new information the user provides
- Use ops_recap to summarize recent activity

## Important conventions

- State files track reality. Backlog files track intentions. Don't confuse the two.
- INDEX.md files are substantive overviews, not just file listings.
- WAITING markers in state/backlog indicate blocked items: WAITING (who/what, since YYYY-MM-DD)
- Plans have a lifecycle: draft in backlog → active in plans/ → completed in plans/completed/
- Always reference specific files when discussing project state so the user can dig deeper.`;

const server = new McpServer(
  { name: "ops-workflow", version: "1.0.0" },
  { instructions: SERVER_INSTRUCTIONS }
);

const projectParam = z
  .string()
  .optional()
  .describe("Project name or absolute path — omit to use the active project");

// ── Project Management Tools ───────────────────────────

server.tool(
  "ops_context",
  "Load the active project's CLAUDE.md (rules and constraints) and MEMORY.md (goals, description, key learnings). Call this when starting work on a project to understand its specific context.",
  {
    project: projectParam,
  },
  async ({ project }) => {
    const dir = resolveProject(project);
    const parts: string[] = [];

    const claudeMd = join(dir, "CLAUDE.md");
    if (existsSync(claudeMd)) {
      parts.push("# CLAUDE.md\n\n" + readFileSync(claudeMd, "utf-8"));
    }

    const memoryMd = join(dir, "MEMORY.md");
    if (existsSync(memoryMd)) {
      parts.push("# MEMORY.md\n\n" + readFileSync(memoryMd, "utf-8"));
    }

    if (parts.length === 0) {
      return {
        content: [
          {
            type: "text" as const,
            text: `No CLAUDE.md or MEMORY.md found in ${dir}. This may not be an ops project — try ops_scaffold first.`,
          },
        ],
      };
    }

    return {
      content: [{ type: "text" as const, text: parts.join("\n\n---\n\n") }],
    };
  }
);



server.tool(
  "ops_list_projects",
  "List all registered ops projects and show which is active.",
  {},
  async () => {
    const entries = Object.entries(projects);
    if (entries.length === 0 && !activeProject) {
      return {
        content: [
          {
            type: "text" as const,
            text: "No projects registered. Use ops_add_project to add one.",
          },
        ],
      };
    }
    const lines = entries.map(([name, path]) => {
      const marker = path === activeProject ? " (active)" : "";
      return `- **${name}**: ${path}${marker}`;
    });
    if (activeProject && !entries.some(([, p]) => p === activeProject)) {
      lines.push(`- **(active, unregistered)**: ${activeProject}`);
    }
    return { content: [{ type: "text" as const, text: lines.join("\n") }] };
  }
);

server.tool(
  "ops_add_project",
  "Register a new ops project folder.",
  {
    name: z.string().describe("Short project name (e.g. marketing, hiring)"),
    path: z.string().describe("Absolute path to the project folder"),
  },
  async ({ name, path }) => {
    if (!existsSync(path)) {
      return {
        content: [
          { type: "text" as const, text: `Directory not found: ${path}` },
        ],
      };
    }
    projects[name] = path;
    saveProjects();
    return {
      content: [
        { type: "text" as const, text: `Added project "${name}" → ${path}` },
      ],
    };
  }
);

server.tool(
  "ops_remove_project",
  "Unregister an ops project.",
  {
    name: z.string().describe("Project name to remove"),
  },
  async ({ name }) => {
    if (!projects[name]) {
      return {
        content: [
          { type: "text" as const, text: `No project named "${name}".` },
        ],
      };
    }
    const path = projects[name];
    delete projects[name];
    saveProjects();
    if (activeProject === path) activeProject = undefined;
    return {
      content: [
        { type: "text" as const, text: `Removed project "${name}".` },
      ],
    };
  }
);

server.tool(
  "ops_dir",
  "Switch the active project. All subsequent calls will target this project unless overridden.",
  {
    project: z.string().describe("Project name or absolute path"),
  },
  async ({ project }) => {
    const dir = resolveProject(project);
    activeProject = dir;
    return {
      content: [{ type: "text" as const, text: `Active project: ${dir}` }],
    };
  }
);

// ── Ops Workflow Tools ─────────────────────────────────

server.tool(
  "ops_whats_next",
  "Get an executive overview of the ops project — priorities, state, and recommended next actions.",
  {
    project: projectParam,
    focus: z
      .string()
      .optional()
      .describe("Optional focus area to narrow the analysis"),
  },
  async ({ project, focus }) => {
    const dir = resolveProject(project);
    const prompt = focus
      ? `Run /ops:overview with focus on: ${focus}`
      : "Run /ops:overview";
    const result = await runOps(dir, prompt, {
      maxTurns: 50,
      summaryStyle: "detailed",
    });
    return { content: [{ type: "text" as const, text: result }] };
  }
);

server.tool(
  "ops_recap",
  "Summarize what happened in the project since a given date. Produces a structured overview of completed work, state changes, backlog movement, and key decisions.",
  {
    project: projectParam,
    since: z
      .string()
      .describe(
        "Date to recap from — absolute (2026-03-01) or relative (last week, Monday)"
      ),
  },
  async ({ project, since }) => {
    const dir = resolveProject(project);
    const result = await runOps(
      dir,
      `Run /ops:recap ${since}`,
      { maxTurns: 50, summaryStyle: "passthrough" }
    );
    return { content: [{ type: "text" as const, text: result }] };
  }
);

server.tool(
  "ops_scaffold",
  "Set up a new ops project repo with the standard folder structure (state/, backlog/, references/, artifacts/, plans/), CLAUDE.md, MEMORY.md, and INDEX.md files. Use when starting a new project from scratch.",
  {
    path: z
      .string()
      .describe("Absolute path to the directory to scaffold as an ops project"),
    description: z
      .string()
      .optional()
      .describe("Brief description of the project — what it's for"),
  },
  async ({ path, description }) => {
    if (!existsSync(path)) {
      return {
        content: [
          { type: "text" as const, text: `Directory not found: ${path}` },
        ],
      };
    }
    const prompt = description
      ? `Run /ops:scaffold in the current directory. Project description: ${description}`
      : "Run /ops:scaffold in the current directory";
    const result = await runOps(path, prompt, { maxTurns: 50 });
    return { content: [{ type: "text" as const, text: result }] };
  }
);

server.tool(
  "ops_plan",
  "Create an ops plan for a task. Returns the plan contents for review before execution.",
  {
    project: projectParam,
    task: z.string().describe("What to plan — a task, initiative, or problem"),
  },
  async ({ project, task }) => {
    const dir = resolveProject(project);
    await runOps(
      dir,
      `Run /ops:plan for: ${task}. Create the plan file and stop — do not execute it.`,
      { maxTurns: 100 }
    );

    const plansDir = join(dir, "plans");
    const planContent = readLatestFile(plansDir);
    if (planContent) {
      return { content: [{ type: "text" as const, text: planContent }] };
    }
    return {
      content: [
        {
          type: "text" as const,
          text: "Plan created — check the plans/ folder.",
        },
      ],
    };
  }
);

server.tool(
  "ops_execute",
  "Execute an approved ops plan.",
  {
    project: projectParam,
    plan_file: z
      .string()
      .describe("Plan filename (e.g. 2026-03-18-rebrand.md)"),
  },
  async ({ project, plan_file }) => {
    const dir = resolveProject(project);
    const result = await runOps(
      dir,
      `Run /ops:execute on the plan at plans/${plan_file}`,
      { maxTurns: 200 }
    );
    return { content: [{ type: "text" as const, text: result }] };
  }
);

server.tool(
  "ops_update",
  "Integrate new information into the ops knowledge base. Pass content inline, or omit to process the .update/ inbox.",
  {
    project: projectParam,
    content: z
      .string()
      .optional()
      .describe(
        "Content to integrate — omit to process the .update/ inbox"
      ),
  },
  async ({ project, content }) => {
    const dir = resolveProject(project);
    const prompt = content
      ? `Run /ops:update with this content:\n\n${content}`
      : "Run /ops:update to process the .update/ inbox";
    const result = await runOps(dir, prompt, { maxTurns: 50 });
    return { content: [{ type: "text" as const, text: result }] };
  }
);

server.tool(
  "ops_tidy",
  "Run consistency checks and auto-fix structural issues in the ops project.",
  {
    project: projectParam,
  },
  async ({ project }) => {
    const dir = resolveProject(project);
    const result = await runOps(dir, "Run /ops:tidy", { maxTurns: 50 });
    return { content: [{ type: "text" as const, text: result }] };
  }
);

server.tool(
  "ops_get_to_work",
  "Start an autonomous ops work session. Identifies tasks, prioritizes, and executes. Returns a summary when done.",
  {
    project: projectParam,
    mode: z
      .enum(["tasks", "opps", "full", "escalating"])
      .default("escalating")
      .describe(
        "What to look for: tasks, opportunities, both, or escalating"
      ),
    repeat: z
      .enum(["cycle", "once"])
      .default("once")
      .describe("Run one pass or keep cycling"),
  },
  async ({ project, mode, repeat }) => {
    const dir = resolveProject(project);
    const result = await runOps(
      dir,
      `Run /ops:get-to-work ${mode} ${repeat}`,
      { maxTurns: 500 }
    );

    const followupContent = readLatestFile(dir, "followup");
    const output = followupContent
      ? `${result}\n\n---\n\n## Follow-up Items\n\n${followupContent}`
      : result;

    return { content: [{ type: "text" as const, text: output }] };
  }
);

server.tool(
  "ops_batch_plan",
  "Create plans for multiple tasks in one go. Returns a summary.",
  {
    project: projectParam,
    tasks: z
      .string()
      .describe(
        "List of tasks to plan — one per line, or comma-separated"
      ),
  },
  async ({ project, tasks }) => {
    const dir = resolveProject(project);
    const result = await runOps(
      dir,
      `Run /ops:batch-plan for these tasks:\n\n${tasks}`,
      { maxTurns: 300 }
    );
    return { content: [{ type: "text" as const, text: result }] };
  }
);

server.tool(
  "ops_batch_execute",
  "Execute multiple approved plans in sequence. Returns a summary.",
  {
    project: projectParam,
    plans: z
      .string()
      .describe(
        "Plan filenames to execute — one per line, or comma-separated"
      ),
  },
  async ({ project, plans }) => {
    const dir = resolveProject(project);
    const result = await runOps(
      dir,
      `Run /ops:batch-execute for these plans:\n\n${plans}`,
      { maxTurns: 500 }
    );
    return { content: [{ type: "text" as const, text: result }] };
  }
);

// ── Start Server ───────────────────────────────────────

const transport = new StdioServerTransport();
await server.connect(transport);
