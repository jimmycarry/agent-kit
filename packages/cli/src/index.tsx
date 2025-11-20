#!/usr/bin/env node

import { HelloWorld } from "@agent-kit/ui"
import { Command } from "commander"
import { render } from "ink"
import React from "react"
import { spawn, execSync } from "node:child_process"
import { fileURLToPath } from "node:url"
import { dirname, join, resolve } from "node:path"
import { existsSync } from "node:fs"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const program = new Command()

program
  .name("agent-kit")
  .description("A CLI tool built with Node.js, React, and Ink")
  .version("1.0.0")

program
  .command("hello")
  .description("Display hello world message")
  .action(() => {
    render(<HelloWorld />)
  })

program
  .command("claude")
  .description("Start Claude Code CLI")
  .option("--base-url <url>", "ANTHROPIC_BASE_URL")
  .option("--auth-token <token>", "ANTHROPIC_AUTH_TOKEN")
  .option("--timeout <ms>", "API_TIMEOUT_MS")
  .option("--model <model>", "ANTHROPIC_MODEL")
  .option("--small-fast-model <model>", "ANTHROPIC_SMALL_FAST_MODEL")
  .allowUnknownOption()
  .action((options, command) => {
    const isWindows = process.platform === "win32"
    // 查找 claude 可执行文件
    // Windows 上优先查找 .ps1 文件（兼容性更好），然后是 .cmd，最后是普通脚本
    const possiblePaths: string[] = []

    if (isWindows) {
      // Windows 上优先使用 .ps1 文件
      possiblePaths.push(
        join(__dirname, "../node_modules/.bin/claude.ps1"),
        join(__dirname, "../../../node_modules/.bin/claude.ps1"),
        resolve(process.cwd(), "node_modules/.bin/claude.ps1"),
        join(__dirname, "../node_modules/.bin/claude.cmd"),
        join(__dirname, "../../../node_modules/.bin/claude.cmd"),
        resolve(process.cwd(), "node_modules/.bin/claude.cmd"),
      )
    }

    // 添加普通脚本路径（Unix 和 Windows 通用）
    possiblePaths.push(
      join(__dirname, "../node_modules/.bin/claude"),
      join(__dirname, "../../../node_modules/.bin/claude"),
      resolve(process.cwd(), "node_modules/.bin/claude"),
    )

    let claudePath = possiblePaths.find((path) => existsSync(path))

    console.log("claudePath", claudePath);

    if (!claudePath) {
      // 尝试使用 which/where 命令查找
      try {
        const findCommand = isWindows ? "where claude" : "which claude"
        claudePath = execSync(findCommand, { encoding: "utf-8" }).trim()
      } catch {
        console.error("Error: Could not find claude executable")
        process.exit(1)
      }
    }

    // 设置环境变量
    const env: Record<string, string> = {
      ...process.env,
      CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC: "1",
      ANTHROPIC_AUTH_TOKEN: options.authToken,
      ANTHROPIC_BASE_URL: options.baseUrl,
      API_TIMEOUT_MS: options.timeout,
      ANTHROPIC_MODEL: options.model,
      ANTHROPIC_SMALL_FAST_MODEL: options.smallFastModel,
    }

    // 获取传递给 claude 的其他参数
    const claudeArgs = command.args || []

    // 启动 claude 进程
    // Windows 上 .ps1 文件需要使用 PowerShell 执行
    const isPs1 = isWindows && claudePath.endsWith(".ps1")
    let spawnCommand = claudePath
    let spawnArgs = claudeArgs

    if (isPs1) {
      // 优先使用 pwsh (PowerShell Core)，如果不存在则使用 powershell (Windows PowerShell)
      spawnCommand = "powershell.exe"
      spawnArgs = ["-File", claudePath, ...claudeArgs]
    }

    const claudeProcess = spawn(spawnCommand, spawnArgs, {
      env,
      stdio: "inherit",
      shell: isWindows && !isPs1, // Windows 上 .cmd 文件需要 shell，但 .ps1 不需要
    })

    claudeProcess.on("error", (error) => {
      console.error(`Error spawning claude: ${error.message}`)
      process.exit(1)
    })

    claudeProcess.on("exit", (code) => {
      process.exit(code || 0)
    })
  })

program.parse()
