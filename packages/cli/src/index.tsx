#!/usr/bin/env node

import { HelloWorld } from "@agent-kit/ui"
import { Command } from "commander"
import { render } from "ink"
import React from "react"

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

program.parse()
