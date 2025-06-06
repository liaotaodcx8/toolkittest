<a href="https://glama.ai/mcp/servers/@liaotaodcx8/toolkittest">
  <img width="380" height="200" src="https://glama.ai/mcp/servers/@liaotaodcx8/toolkittest/badge" />
</a>

# MCP Server 学习实验室

一个基于 **Node.js + TypeScript** 的 MCP Server 开发实践仓库，使用官方 SDK `@modelcontextprotocol/sdk`，专注于探索如何将本地服务、API、工具封装为符合 MCP 协议的标准化服务。适合 AI 开发者学习协议实现、工具链集成及服务扩展。

## 安装使用

### 安装

```sh
# 环境配置
cp .env.example .env

# 项目安装
npm install

# 项目构建
npm run build
```

### 本地测试 & 调试

推荐使用 `@modelcontextprotocol/inspector` 进行测试运行，您可以通过以下命令快速启动：

```sh
# 启动默认 inspector 工具服务
npm run inspector

# 启动官方示例（仅默认命令不同，工具是同一个）
npm run inspector:everything
```

关于该工具的使用方法，参考：<https://github.com/modelcontextprotocol/inspector>

## 项目说明

```json
// This example demonstrated an MCP server using the stdio format
// Cursor automatically runs this process for you
// This uses a Node.js server, ran with `npx`
{
  "mcpServers": {
    "mcp-server-toolkit": {
      "command": "node",
      "args": ["build/index.js"],
      "env": {
        "API_KEY": "value"
      }
    }
  }
}
```

## 参考文档

- <https://github.com/modelcontextprotocol/typescript-sdk>
- <https://github.com/liaokongVFX/MCP-Chinese-Getting-Started-Guide>
