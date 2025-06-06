/**
 * 自定义 MCP 服务内容
 *
 * 打包后位置 build/index.js
 */
import {
  McpServer,
  ResourceTemplate,
} from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

// 创建一个 MCP Server
const server = new McpServer({
  name: "McpServerToolkit",
  version: "0.1.0",
});

// MCP 工具
server.tool(
    "number_add",
    "简单的求和工具，当想要计算两个数字相加后的结果时调用",
    {
      a: z.number().describe("第一个数字"),
      b: z.number().describe("第二个数字"),
    },
    async ({ a, b }) => ({
      content: [{ type: "text", text: String(a + b) }],
    })
);

// MCP 工具 - 获取现在时间
server.tool("get_current_time", "返回当前的日期和时间", {}, async () => ({
  content: [{ type: "text", text: new Date().toISOString() }],
}));

// MCP 提示词
server.prompt(
    "translate_master",
    "简单的翻译工具，可以将内容翻译成指定语言",
    { target_language: z.string().describe("目标语言") },
    ({ target_language }) => ({
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: `你是一个翻译专家，擅长将任何语言翻译成${target_language}。请翻译以下内容：`,
          },
        },
      ],
    })
);

// MCP 静态资源
server.resource("config", "config://app", async (uri) => ({
  contents: [
    {
      uri: uri.href,
      text: "App configuration here",
    },
  ],
}));

// MCP 资源模板
server.resource(
    "user-profile",
    new ResourceTemplate("users://{userId}/profile", { list: undefined }),
    async (uri, { userId }) => ({
      contents: [
        {
          uri: uri.href,
          text: `Profile data for user ${userId}`,
        },
      ],
    })
);

// stdio 模式运行
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
