# settings.json Template for Ops Repos

This is the `.claude/settings.json` and `.claude/settings.local.json` template for ops repos scaffolded with `/ops:scaffold`.

## .claude/settings.json (version controlled)

```json
{
  "permissions": {
    "allow": []
  },
  "enabledPlugins": {
    "ops@ops-workflow": true
  }
}
```

- **Enables ops plugin** — the ops plugin is disabled at user level by default, so ops repos must explicitly activate it.
- The `permissions.allow` array starts empty. The scaffold skill may add entries based on connected codebases or other project needs.

## .claude/settings.local.json (gitignored)

```json
{
  "enabledPlugins": {
    "typescript-lsp@claude-plugins-official": false,
    "pyright-lsp@claude-plugins-official": false,
    "feature-dev@claude-plugins-official": false,
    "context7@claude-plugins-official": false
  }
}
```

- **Disables coding plugins** — LSP servers, feature-dev, and context7 are irrelevant in a non-code repo. Disabling them here overrides the user-level setting for this project only.
- This file is gitignored so it doesn't affect teammates who may have different plugin setups.

## Notes

- Only include plugins that need to differ from user-level defaults. Plugins not listed here inherit the user-level setting.
