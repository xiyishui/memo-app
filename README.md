# Memo App - 个人备忘录

一个功能完整的个人备忘录与待办事项管理应用，支持用户注册登录、便签管理、待办事项、标签分类、收藏置顶、回收站等功能。基于 **Next.js 16** + **Supabase** 构建。

## 项目介绍

Memo App 是一个轻量级的个人效率工具，帮助用户管理日常的笔记和待办事项。用户注册后可以在三种视图间切换：**便签**、**代办** 和 **我的**。

### 主要功能

- **用户系统**：注册 / 登录，用户名唯一校验，密码 SHA256 加密
- **便签管理**：创建、编辑、删除便签，支持标题 + 内容 + 标签
- **待办事项**：添加、编辑、完成/取消、删除待办事项
- **标签分类**：便签支持标签，可按标签筛选
- **收藏/置顶**：便签可置顶，置顶项排在列表最前
- **搜索**：按标题/内容搜索便签
- **回收站**：删除的便签进入回收站，可还原
- **最近查看**：自动记录最近查看的便签历史
- **个人中心**：头像设置（本地存储）、最近查看、回收站、退出登录

### 页面路由

| 路由 | 页面 |
|------|------|
| / | 主页面（底部导航：便签/代办/我的） |
| /login | 登录页面 |
| /register | 注册页面（确认密码） |
| /memos/new | 新建便签 |
| /memos/[id] | 便签详情 / 编辑 |

## 技术栈

| 技术 | 用途 |
|------|------|
| **Next.js 16** | React 框架、路由、API 层 |
| **React 19** | 前端 UI 构建 |
| **Supabase** | 云端数据库（PostgreSQL） |
| **CSS** | 纯 CSS 样式（globals.css） |
| **Node.js** | 运行环境 |
| **pnpm / npm** | 包管理 |

### 前端

- React 函数组件 + Hooks（useState, useEffect, useRef）
- Next.js App Router（pp/ 目录结构）
- 客户端组件（'use client'）
- 无第三方 UI 库，纯手写 CSS

### 后端（API Routes）

所有 API 路由通过 Next.js API Routes 实现，部署在 /app/api/ 目录下，使用 **Supabase** SDK 操作 PostgreSQL 数据库。

## 安装 / 运行指南

### 前置要求

- Node.js >= 18
- pnpm 或 npm
- Supabase 账号（免费即可）

### 1. 克隆项目

\\\ash
git clone https://github.com/xiyishui/memo-app.git
cd memo-app
\\\

### 2. 安装依赖

\\\ash
pnpm install
\\\

### 3. 配置 Supabase

在 Supabase 控制台创建一个新项目，然后运行 \sql/schema.sql\ 中的 SQL 创建数据库表。

### 4. 设置环境变量

创建 \.env.local\ 文件：

\\\env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
\\\

### 5. 启动开发服务器

\\\ash
pnpm dev
\\\

访问 http://localhost:3000

### 6. 构建生产版本

\\\ash
pnpm build
pnpm start
\\\

## API 文档

所有 API 路由均需要 \Authorization: Bearer <token>\ 请求头（用户登录后获取）。

### 认证

| 方法 | 端点 | 描述 | 请求体 |
|------|------|------|--------|
| POST | \/api/auth/register\ | 注册新用户 | \{ username, password }\ |
| POST | \/api/auth/login\ | 用户登录 | \{ username, password }\ |

**注册响应示例：**
\\\json
{ \"id\": 1784045768214, \"username\": \"test\", \"token\": \"uuid-uuid\" }
\\\

### 便签（Memos）

| 方法 | 端点 | 描述 | 请求体 |
|------|------|------|--------|
| GET | \/api/memos\ | 获取当前用户所有便签 | — |
| POST | \/api/memos\ | 创建新便签 | \{ title, content, tags? }\ |
| GET | \/api/memos/[id]\ | 获取单条便签详情 | — |
| PUT | \/api/memos/[id]\ | 更新便签 | \{ title?, content?, tags?, pinned? }\ |
| DELETE | \/api/memos/[id]\ | 删除便签（移入回收站） | — |

**GET /api/memos 返回排序：** 置顶优先 → 按更新时间倒序

**POST 请求体示例：**
\\\json
{ \"title\": \"会议记录\", \"content\": \"下午3点周会\", \"tags\": [\"工作\", \"会议\"] }
\\\

### 待办事项（Todos）

| 方法 | 端点 | 描述 | 请求体 |
|------|------|------|--------|
| GET | \/api/todos\ | 获取当前用户所有待办 | — |
| POST | \/api/todos\ | 创建新待办 | \{ text }\ |
| PUT | \/api/todos/[id]\ | 更新待办（文本/完成状态） | \{ text?, done? }\ |
| DELETE | \/api/todos/[id]\ | 删除待办 | — |

### 回收站（Trash）

| 方法 | 端点 | 描述 | 请求体 |
|------|------|------|--------|
| GET | \/api/trash\ | 获取回收站列表 | — |
| POST | \/api/trash/[id]/restore\ | 从回收站还原便签 | — |

### 最近查看（Recent）

| 方法 | 端点 | 描述 | 请求体 |
|------|------|------|--------|
| GET | \/api/recent\ | 获取最近查看记录（最多20条） | — |
| POST | \/api/recent\ | 记录查看历史 | \{ memoid, title }\ |

---

## 数据库表结构

### users
| 列 | 类型 | 说明 |
|----|------|------|
| id | BIGINT PK | 用户ID |
| username | TEXT UNIQUE | 用户名 |
| password | TEXT | 密码（SHA256 哈希） |
| token | TEXT | 登录令牌 |
| createdat | TIMESTAMP | 注册时间 |

### memos
| 列 | 类型 | 说明 |
|----|------|------|
| id | BIGINT PK | 便签ID |
| userid | BIGINT FK | 所属用户 |
| title | TEXT | 标题 |
| content | TEXT | 内容 |
| tags | TEXT[] | 标签数组 |
| pinned | BOOLEAN | 是否置顶 |
| createdat | TIMESTAMP | 创建时间 |
| updatedat | TIMESTAMP | 更新时间 |

### todos
| 列 | 类型 | 说明 |
|----|------|------|
| id | BIGINT PK | 待办ID |
| userid | BIGINT FK | 所属用户 |
| text | TEXT | 待办内容 |
| done | BOOLEAN | 是否完成 |
| createdat | TIMESTAMP | 创建时间 |

### trash
| 列 | 类型 | 说明 |
|----|------|------|
| id | BIGINT PK | 便签ID |
| userid | BIGINT FK | 所属用户 |
| title | TEXT | 标题 |
| content | TEXT | 内容 |
| tags | TEXT[] | 标签 |
| createdat | TIMESTAMP | 创建时间 |
| deletedat | TIMESTAMP | 删除时间 |

### recent
| 列 | 类型 | 说明 |
|----|------|------|
| id | SERIAL PK | 记录ID |
| userid | BIGINT FK | 所属用户 |
| memoid | BIGINT | 便签ID |
| title | TEXT | 便签标题 |
| viewedat | TIMESTAMP | 查看时间 |

## 部署

推荐使用 Vercel 部署（Next.js 官方平台）：

1. 将代码推送到 GitHub
2. 在 Vercel 导入项目
3. 设置环境变量 \NEXT_PUBLIC_SUPABASE_URL\ 和 \NEXT_PUBLIC_SUPABASE_ANON_KEY\
4. 部署完成

---

## 考核信息

- **项目**：AI辅助编程与工程化实训（居家自学版）
- **时间**：3天完成
