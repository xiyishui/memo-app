# Memo App - API 文档

**基准地址**（Base URL）：
- 本地开发：\http://localhost:3000\
- 线上部署：\https://memo-app-orcin-chi.vercel.app\

**认证方式**：所有业务接口需要在请求头传入 \Authorization: Bearer <token>\
Token 在用户登录/注册成功后返回，前端存储在 localStorage。

---

## 一、认证接口（Auth）

### 1.1 用户注册

\POST /api/auth/register\

**请求体：**
\\\json
{
  "username": "用户名（至少2位字符）",
  "password": "密码（至少6位字符）"
}
\\\

**成功响应（201）：**
\\\json
{
  "id": 1784045768214,
  "username": "test",
  "token": "uuid-uuid"
}
\\\

**错误响应：**
| 状态码 | 说明 |
|--------|------|
| 400 | 用户名或密码格式不符合要求 |
| 409 | 用户名已被占用（该用户名已经被占用）|
| 500 | 服务器内部错误 |

---

### 1.2 用户登录

\POST /api/auth/login\

**请求体：**
\\\json
{
  "username": "用户名",
  "password": "密码（SHA256 加密验证）"
}
\\\

**成功响应（200）：**
\\\json
{
  "id": 1784045768214,
  "username": "test",
  "token": "新的登录令牌"
}
\\\

**错误响应：**
| 状态码 | 说明 |
|--------|------|
| 400 | 未输入用户名或密码 |
| 401 | 用户名或密码错误 |
| 500 | 服务器内部错误 |

---

## 二、便签接口（Memos）

所有接口需要 \Authorization: Bearer <token>\ 请求头。

### 2.1 获取便签列表

\GET /api/memos\

**响应（200）：**
\\\json
[
  {
    "id": 1784045768214,
    "userid": 1784045700001,
    "title": "会议记录",
    "content": "下午3点周会",
    "tags": ["工作", "会议"],
    "pinned": true,
    "createdat": "2026-07-17T10:00:00.000Z",
    "updatedat": "2026-07-17T10:00:00.000Z"
  }
]
\\\

**排序规则：** 置顶（pinned=true）优先 → 按更新时间倒序

**错误响应：** 401 未认证

---

### 2.2 创建便签

\POST /api/memos\

**请求体：**
\\\json
{
  "title": "必填，标题",
  "content": "必填，内容",
  "tags": ["可选", "标签数组"]
}
\\\

**成功响应（201）：** 返回创建的便签对象

**错误响应：**
| 状态码 | 说明 |
|--------|------|
| 400 | 标题或内容为空，或插入失败 |
| 401 | 未认证 |

---

### 2.3 获取单条便签

\GET /api/memos/{id}\

**路径参数：**
| 参数 | 说明 |
|------|------|
| id | 便签的数字 ID |

**成功响应（200）：** 返回便签对象

**错误响应：**
| 状态码 | 说明 |
|--------|------|
| 401 | 未认证 |
| 404 | 便签不存在 |

---

### 2.4 更新便签

\PUT /api/memos/{id}\

**请求体（所有字段可选）：**
\\\json
{
  "title": "新标题",
  "content": "新内容",
  "tags": ["新", "标签"],
  "pinned": true
}
\\\

**成功响应（200）：** 返回更新后的便签对象

---

### 2.5 删除便签（移入回收站）

\DELETE /api/memos/{id}\

**说明：** 该接口会将便签从 memos 表删除，同时插入 trash 表。

**成功响应（200）：**
\\\json
{
  "message": "ok"
}
\\\

**错误响应：** 401 / 404

---

## 三、待办事项接口（Todos）

所有接口需要 \Authorization: Bearer <token>\ 请求头。

### 3.1 获取待办列表

\GET /api/todos\

**成功响应（200）：**
\\\json
[
  {
    "id": 1784045769000,
    "userid": 1784045700001,
    "text": "完成项目报告",
    "done": false,
    "createdat": "2026-07-17T10:00:00.000Z"
  }
]
\\\

---

### 3.2 创建待办

\POST /api/todos\

**请求体：**
\\\json
{
  "text": "待办事项内容"
}
\\\

**成功响应（201）：** 返回创建的待办对象

---

### 3.3 更新待办

\PUT /api/todos/{id}\

**请求体（所有字段可选）：**
\\\json
{
  "text": "修改后的内容",
  "done": true
}
\\\

**成功响应（200）：** 返回更新后的待办对象

---

### 3.4 删除待办

\DELETE /api/todos/{id}\

**成功响应（200）：**
\\\json
{
  "message": "ok"
}
\\\

---

## 四、回收站接口（Trash）

所有接口需要 \Authorization: Bearer <token>\ 请求头。

### 4.1 获取回收站列表

\GET /api/trash\

**成功响应（200）：**
\\\json
[
  {
    "id": 1784045768214,
    "userid": 1784045700001,
    "title": "已删除的便签标题",
    "content": "已删除的便签内容",
    "tags": ["标签"],
    "createdat": "2026-07-17T10:00:00.000Z",
    "deletedat": "2026-07-17T11:00:00.000Z"
  }
]
\\\

---

### 4.2 还原便签

\POST /api/trash/{id}/restore\

**说明：** 将回收站中的便签移回到 memos 表，并从 trash 表删除。

**成功响应（200）：**
\\\json
{
  "message": "ok"
}
\\\

---

## 五、最近查看接口（Recent）

所有接口需要 \Authorization: Bearer <token>\ 请求头。

### 5.1 获取最近查看记录

\GET /api/recent\

**说明：** 返回当前用户最近的查看历史，最多20条，按查看时间倒序。

**成功响应（200）：**
\\\json
[
  {
    "id": 1,
    "userid": 1784045700001,
    "memoid": 1784045768214,
    "title": "便签标题",
    "viewedat": "2026-07-17T12:00:00.000Z"
  }
]
\\\

---

### 5.2 记录查看历史

\POST /api/recent\

**请求体：**
\\\json
{
  "memoid": 1784045768214,
  "title": "便签标题"
}
\\\

**说明：** 同一便签重复查看会自动更新时间为最新（先删旧记录再插入新记录）。

**成功响应（200）：**
\\\json
{
  "message": "ok"
}
\\\

---

## 六、错误码汇总

| 状态码 | 含义 |
|--------|------|
| 200 | 请求成功 |
| 201 | 创建成功 |
| 400 | 请求参数错误（格式不对、必填字段缺失） |
| 401 | 未认证（token 无效或未提供） |
| 404 | 资源不存在 |
| 409 | 资源冲突（如用户名重复）|
| 500 | 服务器内部错误 |

---

## 七、数据库表结构

### users 表
| 字段 | 类型 | 说明 |
|------|------|------|
| id | BIGINT PK | 用户ID（时间戳）|
| username | TEXT UNIQUE | 用户名 |
| password | TEXT | SHA256 密码哈希 |
| token | TEXT | 登录令牌 |
| createdat | TIMESTAMP | 注册时间 |

### memos 表
| 字段 | 类型 | 说明 |
|------|------|------|
| id | BIGINT PK | 便签ID |
| userid | BIGINT FK | 所属用户 |
| title | TEXT | 标题 |
| content | TEXT | 内容 |
| tags | TEXT[] | 标签数组 |
| pinned | BOOLEAN | 是否置顶 |
| createdat | TIMESTAMP | 创建时间 |
| updatedat | TIMESTAMP | 更新时间 |

### todos 表
| 字段 | 类型 | 说明 |
|------|------|------|
| id | BIGINT PK | 待办ID |
| userid | BIGINT FK | 所属用户 |
| text | TEXT | 待办内容 |
| done | BOOLEAN | 是否完成 |
| createdat | TIMESTAMP | 创建时间 |

### trash 表
| 字段 | 类型 | 说明 |
|------|------|------|
| id | BIGINT PK | 便签ID |
| userid | BIGINT FK | 所属用户 |
| title | TEXT | 标题 |
| content | TEXT | 内容 |
| tags | TEXT[] | 标签 |
| createdat | TIMESTAMP | 创建时间 |
| deletedat | TIMESTAMP | 删除时间 |

### recent 表
| 字段 | 类型 | 说明 |
|------|------|------|
| id | SERIAL PK | 记录ID |
| userid | BIGINT FK | 所属用户 |
| memoid | BIGINT | 便签ID |
| title | TEXT | 标题 |
| viewedat | TIMESTAMP | 查看时间 |

---
