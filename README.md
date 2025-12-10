# coc-ty

[ty](https://github.com/astral-sh/ty) language server extension for [coc.nvim](https://github.com/neoclide/coc.nvim).

## Install

**CocInstall**:

```vim
:CocInstall @yaegassy/coc-ty
```

> scoped packages

**e.g. vim-plug**:

```vim
Plug 'yaegassy/coc-ty', {'do': 'yarn install --frozen-lockfile'}
```

## Configuration options

- `ty.enable`: Enable coc-ty extension, default: `true`
- `ty.path`: Custom path for the `ty` binary. If no value is set, the `ty` command will be detected from the runtime environment, , default: `""`
- `ty.disableCompletion`: Disable completion only, default: `false`
- `ty.disableDiagnostics`: Disable diagnostics only, default: `false`
- `ty.disableHover`: Disable hover only, default: `false`
- `ty.disableInlayHint`: Disable inlayHint only, default: `false`
- `ty.disableTypeDefinition`: Disable typeDefinition only, default: `false`
- `ty.trace.server`: Traces the communication between coc.nvim and the ty language server, default: `"off"`

Other settings have the same configuration as [ty-vscode](https://github.com/astral-sh/ty-vscode).

## Commands

- `ty.showLogs`: Show logs
- `ty.restart`: Restart Server

## Thanks

- [astral-sh/ty](https://github.com/astral-sh/ty)
- [astral-sh/ty-vscode](https://github.com/astral-sh/ty-vscode)

## License

MIT

---

> This extension is built with [create-coc-extension](https://github.com/fannheyward/create-coc-extension)
