# Agent Kit CLI

一个使用 Node.js、React 和 Ink 构建的 CLI 脚手架工具。

## 技术栈

- **Node.js** - 运行时环境
- **React** - UI 框架
- **Ink** - React 在终端中的渲染库
- **TypeScript** - 类型安全
- **Biome** - 代码规范和格式化
- **pnpm** - 包管理器
- **Monorepo** - 工作空间管理

## 项目结构

```
agent-kit/
├── packages/
│   ├── cli/          # CLI 主程序
│   └── ui/           # React + Ink 组件库
├── package.json      # 根配置
├── pnpm-workspace.yaml
├── biome.json        # Biome 配置
└── tsconfig.json     # TypeScript 配置
```

## 安装依赖

```bash
pnpm install
```

## 构建项目

```bash
# 构建所有包
pnpm build

# 或者分别构建
pnpm --filter @agent-kit/ui build
pnpm --filter @agent-kit/cli build
```

## 运行 CLI

```bash
# 直接运行构建后的文件
node packages/cli/dist/index.mjs hello

# 或者全局安装后使用
pnpm --filter @agent-kit/cli exec npm link
agent-kit hello
```

## 开发

```bash
# 代码检查
pnpm lint

# 代码格式化
pnpm format

# 类型检查
pnpm typecheck

# 清理构建文件
pnpm clean
```

## 可用命令

- `hello` - 显示 Hello World 消息

## 扩展

你可以添加更多命令到 `packages/cli/src/index.tsx` 中的 Commander 配置中，并创建相应的 React 组件到 `packages/ui/` 中。

## 许可证

MIT
