# Kener SVE-API Monitor Cloudflare Worker

本项目基于 Cloudflare Worker，使用 bun 作为包管理工具，实现对 kener 的 SVE-API monitor 的请求，并将结果转为 shields.io 可识别的 endpoint 格式。

[![Server Status](https://img.shields.io/endpoint?url=https%3A%2F%2Fkener-sve-monitor-to-shieldsendpoints.it-edu.workers.dev%2Fstatus)](https://status.itcox.cn/?monitor=sve-api)
[![Server Uptime](https://img.shields.io/endpoint?url=https%3A%2F%2Fkener-sve-monitor-to-shieldsendpoints.it-edu.workers.dev%2Fuptime)](https://status.itcox.cn/?monitor=sve-api)

## 快速开始

### 安装依赖

```sh
bun install
```

### 本地开发

```sh
bun run dev
```

### 部署到 Cloudflare

```sh
bun run deploy
```

### 生成类型（同步 Worker 配置）

```sh
bun run cf-typegen
```

## 目录结构说明

- `src/controllers/`：业务处理逻辑（controller）
- `src/routes/`：统一路由注册
- `src/index.ts`：入口文件，Hono 实例化，绑定 CloudflareBindings

## 主要功能

- 请求 kener 的 SVE-API monitor 接口
- 将返回结果转为 shields.io endpoint 格式（JSON）

## shields.io endpoint 格式

shields.io 支持如下格式的 JSON：

```json
{
  "schemaVersion": 1,
  "label": "sve-monitor",
  "message": "up",
  "color": "green"
}
```

## 示例请求

假设你的 Worker 已部署，访问如下 endpoint：

```txt
npm install
npm run dev
```

```txt
npm run deploy
```

[For generating/synchronizing types based on your Worker configuration run](https://developers.cloudflare.com/workers/wrangler/commands/#types):

```txt
npm run cf-typegen
```

Pass the `CloudflareBindings` as generics when instantiation `Hono`:

```ts
// src/index.ts
const app = new Hono<{ Bindings: CloudflareBindings }>()
```

## 代码片段

入口文件示例：

```ts
// src/index.ts
import { Hono } from 'hono'
import routes from './routes'

const app = new Hono<{ Bindings: CloudflareBindings }>()
app.route('/', routes)

export default app
```

## 依赖说明

请参考 `package.json`，本项目已充分利用相关依赖包实现功能。

---

如需自定义 shields label/message/color，可在 controller 逻辑中根据实际 API 返回结果进行处理。

## 配置 API 密钥

本项目需要访问 kener 的 SVE-API monitor 接口，因此需要配置 API Key。请使用以下命令将你的 API Key 以密钥形式注入到 Cloudflare Worker 环境变量中：

```sh
wrangler secret put KENER_APIKEY
```

### 说明

- 该命令会提示你输入 kener SVE-API 的密钥（API Key），输入后会安全地存储在 Cloudflare Worker 的环境变量中，Worker 运行时可通过 `env.KENER_APIKEY` 访问。
- 你必须在首次部署前执行此命令，或每次更换 API Key 后重新执行。
- 该密钥不会被上传到代码仓库，保证安全性。
