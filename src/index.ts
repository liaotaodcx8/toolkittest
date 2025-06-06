#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
const MARKET_RESEARCH_ASSISTANT = {
  name: "market_research_tool",
  description:  "This is an intelligent market research report generation assistant, specifically designed to efficiently and professionally build research plans.",
  inputSchema: {
    type: "object",
    properties: {
      query: {
        type: "string",
        description: "Search query (max 400 chars, 50 words)"
      }
    },
    required: ["query"],
  },
};
// Server implementation
const server = new Server(
    {
      name: "bailian-mcp-workflow-server",
      version: "0.1.0",
    },
    {
      capabilities: {
        tools: {},
      },
    }
);
// Check for API key
const DASHSCOPE_API_KEY = process.env.DASHSCOPE_API_KEY!;
if (!DASHSCOPE_API_KEY) {
  console.error("Error: DASHSCOPE_API_KEY environment variable is required");
  process.exit(1);
}
const APP_ID = process.env.APP_ID!;
if (!APP_ID) {
  console.error("Error: APP_ID environment variable is required");
  process.exit(1);
}
async function performWebMarketResearch(query: any) {
  const url = 'https://dashscope.aliyuncs.com/api/v1/apps/'+APP_ID+'/completion';
  // 构造请求体x`x`x`x`
  const requestBody = {
    "input": {
      "prompt": query
    },
    "parameters":  {},
    "debug": {}
  };
  const response = await fetch(url, {
    method: 'POST', // 修改为 POST 请求
    headers: {
      'Content-Type': 'application/json', // 指定请求体为 JSON 格式
      'Authorization': "Bearer "+DASHSCOPE_API_KEY
    },
    body: JSON.stringify(requestBody) // 将请求体序列化为 JSON 字符串
  });
  if (!response.ok) {
    throw new Error(`Bailian API error: ${response.status} ${response.statusText}\n${await response.text()}`);
  }
  const descriptionsData = await response.json(); // 解析响应 JSON 数据
  const strjson = JSON.stringify(descriptionsData)
  return strjson;
}
// Tool handlers
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [MARKET_RESEARCH_ASSISTANT],
}));
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  try {
    const { name, arguments: args } = request.params;
    if (!args) {
      throw new Error("No arguments provided");
    }
    switch (name) {
      case "market_research_tool": {
        const { query } = args;
        const results = await performWebMarketResearch(query);
        return {
          content: [{ type: "text", text: results }],
          isError: false,
        };
      }
      default:
        return {
          content: [{ type: "text", text: `Unknown tool: ${name}` }],
          isError: true,
        };
    }
  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: `Error: ${error instanceof Error ? error.message : String(error)}`,
        },
      ],
      isError: true,
    };
  }
});
async function runServer() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Bailian Mcp Workflow Server running on stdio");
}
runServer().catch((error) => {
  console.error("Fatal error running server:", error);
  process.exit(1);
});