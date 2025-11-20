import { Box, Text } from "ink"
import React from "react"

export const HelloWorld = () => {
  return (
    <Box flexDirection="column" padding={1}>
      <Text color="green" bold>
        Hello, World! 👋
      </Text>
      <Text>Welcome to Agent Kit CLI!</Text>
      <Text color="gray">A CLI tool built with Node.js, React, and Ink</Text>
    </Box>
  )
}
