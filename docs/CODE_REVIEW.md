# Memo App Code Review Report

## 评审概览

| 项目 | 信息 |
|------|------|
| 项目名称 | Memo App - 个人备忘录 |
| 代码总量 | ~1700 行（JS + CSS） |
| 评审范围 | 前端组件、API路由、样式、数据库 |
| 评审日期 | 2026-07-17 |

---

## 1. 安全问题（P0 - 严重）

### 1.1 密码仅用 SHA256 存储，未加盐
**文件**: \pp/api/auth/register/route.js\
SHA256 无盐哈希易受彩虹表攻击。建议使用 bcrypt 或加盐。
\\\javascript
// 当前
const hash = createHash('sha256').update(password).digest('hex');

// 建议
import bcrypt from 'bcrypt';
const hash = await bcrypt.hash(password, 10);
\\\

### 1.2 XSS 风险 - 用户内容直接渲染
**文件**: \pp/memos/[id]/page.js\
便签内容直接渲染在 div 中，若包含恶意脚本会执行。需对用户输入做转义。

### 1.3 Token 存储 localStorage
**文件**: \pp/auth.js\
登录 token 存储在 localStorage，易受 XSS 攻击窃取。建议使用 httpOnly Cookie。

---

## 2. 代码质量问题（P1 - 重要）

### 2.1 NotesTab.js 中文字符乱码
**文件**: \pp/NotesTab.js\
\\\
'璇峰厛鐧诲綍'  ->  '请先登录'
'鎴戠殑渚跨'  ->  '我的便签'
'鏂板缓'       ->  '新建'
\\\
文件编码损坏，后续新增修改会丢失中文可读性。

### 2.2 NewMemo page 中文字符乱码
**文件**: \pp/memos/new/page.js\
同上，所有中文提示均显示为乱码（UTF-8 编码损坏）。

### 2.3 layout.js metadata 乱码
**文件**: \pp/layout.js\
\\\javascript
title: '涓汉澶囧繕褰?',  // 应为 '个人备忘录'
\\\

### 2.4 混用 var / let / const
**文件**: 多个文件
部分使用 \ar\（函数作用域）而非 \let\/\const\（块级作用域），容易引起变量提升问题。
\\\javascript
// ProfileTab.js
var saved = localStorage.getItem('avatar_' + user.id) || '';
var file = e.target.files && e.target.files[0];
\\\

### 2.5 后端错误响应格式不一致
部分路由返回 \{e: '...'}\，部分返回 \{error: '...'}\
\\\javascript
// memos/route.js
return NextResponse.json({e:'x'},{status:401});

// auth/login/route.js
return NextResponse.json({error:'请输入用户名和密码'},{status:400});
\\\

### 2.6 空 catch 块静默吞掉错误
\\\javascript
// auth.js
try { ... } catch(e) {}
// 多个 API route
.catch(() => setLoading(false));
\\\

---

## 3. 架构与设计问题（P2 - 建议）

### 3.1 无 TypeScript
纯 JS 导致缺少类型检查，运行时才能发现类型错误。

### 3.2 无分页功能
便签和待办全部加载，数据量大时性能下降。

### 3.3 头像存储使用 localStorage
Base64 图片存入 localStorage 受 5MB 限制，且每次请求都加载。
建议：上传至 Supabase Storage。

### 3.4 Token 无过期机制
登录后 token 永久有效。建议添加过期时间和自动刷新机制。

### 3.5 无统一错误处理中间件
每个 API 路由重复编写 try-catch。建议封装统一错误处理。

---

## 4. 可维护性改进（P3 - 优化）

### 4.1 getUser 函数重复定义
**涉及文件**: 所有 API 路由
\\\javascript
// 每个 route.js 都重复定义
async function getUser(r) { ... }
\\\
建议提取为公共模块。

### 4.2 CSS 中部分重复样式
\\\css
.profile-avatar { ... }  // 定义两次
.profile-card { ... }     // 定义两次
\\\

### 4.3 魔法字符串
直接写 API 路径，没有集中管理。
建议抽离为常量文件。

### 4.4 缺少加载骨架屏
目前加载态仅显示文字，视觉体验可以优化。

---

## 5. 改进建议总结

| 优先级 | 问题 | 工作量 |
|--------|------|--------|
| P0 | 密码存储安全（加盐/bcrypt） | 小 |
| P0 | XSS 防护 | 中 |
| P1 | 修复中文乱码（3个文件） | 小 |
| P1 | 统一错误响应格式 | 中 |
| P1 | 补全空 catch 错误处理 | 小 |
| P2 | 添加 TypeScript | 大 |
| P2 | Token 过期机制 | 中 |
| P2 | 头像改用 Supabase Storage | 中 |
| P3 | 提取公共 getUser 模块 | 小 |
| P3 | CSS 去重 | 小 |

---

## 6. 评分

| 维度 | 评分（满分5） | 说明 |
|------|:--------:|------|
| 功能完整性 | 4 | 核心功能完整 |
| 代码质量 | 3 | 编码风格不一致，有乱码问题 |
| 安全性 | 2 | 密码无盐、XSS、localStorage |
| 性能 | 3 | 无分页，小规模数据可用 |
| 可维护性 | 3 | 部分重复代码，缺类型 |
| 综合 | 3.0 | 功能可用，安全与编码需加强 |
