项目：AI辅助编程与工程化实训（居家自学版）
周期：3天完成
工具：Codex (GPT-5) + VS Code + Supabase + Vercel

---
Day 1 - 基础搭建 & 核心功能
Prompt 1：项目初始化与整体规划
时间：Day 1
解决的问题：确定项目技术栈、开发周期与整体功能架构，搭建项目基础骨架
涉及文件：整个项目骨架
个人思路与操作：计划3天完成轻量化备忘录项目，拒绝复杂架构，优先保证功能完整、流程简洁，选定Next.js框架作为基础，自行规划三天开发核心目标。借助AI辅助细化每日开发任务，明确基础搭建、进阶功能、数据库迁移与部署的分段开发逻辑。
AI 辅助输出：
好的，我们用 Next.js 16 + 本地 JSON 文件存储做一个轻量级的备忘录应用。
Day 1 计划：
- 创建 Next.js 项目，配置基础路由
- 实现便签（memo）的增删改查
- 使用本地 JSON 文件存储数据
- 简单的页面样式
Day 2 计划：
- 添加待办事项功能
- 搜索、排序、标签功能
- 用户登录注册
Day 3 计划：
- 回收站、最近查看、个人中心
- 迁移到 Supabase 数据库
- 部署到 Vercel
开始创建项目...
Prompt 2：开发便签搜索功能
时间：Day 1
解决的问题：实现便签标题、内容模糊搜索功能，优化内容查找体验
涉及文件：/app/NotesTab.js
个人思路与操作：自行梳理搜索功能核心逻辑，确定通过状态存储搜索关键词、遍历筛选便签数据的实现思路，自行搭建基础输入组件，针对筛选逻辑、空结果提示的细节问题，借助AI完善代码实现。
AI 辅助输出：
在 NotesTab.js 中增加了搜索输入框和搜索逻辑：
- searchQuery 状态保存搜索关键词
- filtered 对 memos 数组进行标题/内容过滤
- 搜索结果显示"没有找到匹配的便签"提示
Prompt 3：实现便签自定义排序功能
时间：Day 1
解决的问题：优化便签展示顺序，实现置顶优先、更新时间倒序的排序规则
涉及文件：/app/api/memos/route.js
个人思路与操作：自主设计排序优先级逻辑，置顶便签权重最高，无置顶则按最新更新时间展示，自行修改API基础排序结构，参考AI给出的Supabase排序语法优化接口代码，适配后续数据库迁移需求。
AI 辅助输出：
便签 GET 接口增加排序：
- order('pinned', { ascending: false }) — 置顶优先
- order('updatedat', { ascending: false }) — 再按更新时间倒序
- API 路由更新为 Supabase 排序语法
Prompt 4：项目版本管理与代码提交
时间：Day 1
解决的问题：完成首日代码归档，建立Git版本管理，同步至GitHub仓库
涉及文件：Git
个人思路与操作：自主初始化Git仓库，检查首日开发代码完整性，梳理提交信息，手动执行基础Git命令，借助AI核对完整提交推送指令，完成代码云端备份。
AI 辅助输出：
已将当前代码提交并推送到 GitHub：
git add -A
git commit -m "feat: 初始化备忘录应用"
git push origin master

---
Day 2 - 用户系统 & 进阶功能
Prompt 5：搭建用户认证与数据隔离系统
时间：Day 2
解决的问题：实现用户注册、登录功能，完成用户数据隔离，保证各用户仅可见个人备忘录数据
涉及文件：/app/api/auth/register/route.js、/app/api/auth/login/route.js、/app/auth.js、/app/ProfileTab.js
个人思路与操作：自主规划用户认证流程，确定账号密码校验、密码加密、Token身份校验、数据按用户ID过滤的核心逻辑，自行搭建前后端认证基础框架，借助AI完善加密算法、接口逻辑和全局状态管理。
AI 辅助输出：
添加了完整的用户认证系统：
- 后端：/api/auth/register 和 /api/auth/login 接口
- 密码：SHA256 加密存储
- Token：UUID 令牌用于身份验证
- 前端：AuthContext + login/logout 函数
- 数据隔离：所有 API 查询按 userid 过滤，每个用户只能看到自己的数据
- 注册验证：用户名至少2位，密码至少6位
Prompt 6：自主排查并修复登录异常BUG
时间：Day 2
解决的问题：修复注册成功后无法登录的功能BUG，解决项目中文乱码问题
涉及文件：/app/api/auth/login/route.js
个人思路与操作：自主复现登录故障，逐行比对注册、登录接口的密码加密逻辑，定位到编码参数不一致的核心问题，同时排查发现文件编码异常导致中文乱码，自行制定修复方案，借助AI完善代码统一适配。
AI 辅助输出：
问题排查：密码加密逻辑不一致。登录时 crypto.createHash 的编码参数需要和注册时一致。
修复：统一使用 'hex' 编码。
同时发现 login route.js 文件存在 UTF-8 编码损坏导致的中文乱码，已修复。
Prompt 7：优化注册表单与页面样式
时间：Day 2
解决的问题：完善注册表单校验规则，优化登录注册页面UI简洁度
涉及文件：/app/register/page.js、/app/globals.css
个人思路与操作：自主发现注册表单缺失二次密码校验的漏洞，同时发现页面导航栏冗余影响体验，自行设计表单校验逻辑、页面布局优化方案，独立完成基础改造，AI辅助完善交互提示与样式适配。
AI 辅助输出：
注册页面改动：
- 增加 confirmPassword 字段和输入框
- 表单提交时校验两次密码是否一致
- 不一致时提示"两次密码输入不一致"并阻止提交
- 移除了登录页面顶部的 AuthNav 导航栏，登录注册页更干净
Prompt 8：搭建底部导航与页面布局重构
时间：Day 2
解决的问题：实现多页面Tab切换导航，重构整体页面布局，整合用户登录入口
涉及文件：/app/BottomNav.js、/app/page.js
个人思路与操作：自主规划项目页面结构，确定便签、待办、个人中心三大核心模块，决定将登录功能整合至个人中心页面，自行编写导航组件基础结构，设计Tab切换逻辑和未登录状态展示规则。
AI 辅助输出：
重构了页面布局：
- 新建 BottomNav.js 底部导航组件
- 三 Tab：便签(0)、代办(1)、我的(2)
- 登录/注册移到"我的"Tab中
- 未登录时只显示"我的"Tab（登录表单）
- 底部导航栏固定在屏幕底部
- Tab 切换时高亮当前项
Prompt 9：自主完善待办事项全功能
时间：Day 2
解决的问题：完成待办事项增删改查、状态切换、数据统计全套功能
涉及文件：/app/TodosTab.js、/app/api/todos/route.js、/app/api/todos/[id]/route.js
个人思路与操作：参照便签功能逻辑，自主梳理待办事项开发需求，规划新增、编辑、删除、状态勾选、数量统计功能，独立完成大部分功能代码编写，对接Supabase实现数据持久化，AI辅助优化交互细节与接口稳定性。
AI 辅助输出：
完整的待办功能：
- 输入框 + 添加按钮
- Enter 键快速添加
- 点击切换完成状态（勾选/取消）
- 编辑功能（点击编辑按钮进入编辑模式）
- 删除功能
- 未完成数量统计
- 数据持久化到 Supabase
Prompt 10：个人中心功能拓展与体验优化
时间：Day 2
解决的问题：丰富个人中心功能，新增回收站、最近查看、置顶收藏、字数统计、标签分类能力
涉及文件：/app/ProfileTab.js、/app/api/trash/route.js、/app/api/recent/route.js
个人思路与操作：自主分析项目功能短板，确定个人中心核心拓展方向，自行设计回收站数据还原、浏览历史记录、便签置顶收藏、标签筛选的逻辑，独立开发基础功能，AI辅助优化展示样式和数据统计精度。
AI 辅助输出：
"我的"页面新增功能：
- 回收站：显示已删除的便签，支持还原操作
- 最近查看：自动记录查看历史，显示最近的20条记录
- 头像设置：使用 FileReader 读取本地图片，base64 存入 localStorage
- 便签置顶：点击图钉图标切换置顶，置顶项排在列表最前
- 字数统计：新建/编辑时实时显示字数
- 标签分类：标签显示为彩色小条，点击可筛选

---
Day 3 - 数据库 & 部署 & 完善
Prompt 11：自主完成数据库迁移改造
时间：Day 3
解决的问题：替换本地JSON存储，迁移为Supabase云端数据库，统一项目数据存储架构
涉及文件：/app/lib/db.js、/app/api/*/route.js（所有API路由）、/sql/schema.sql
个人思路与操作：自主制定数据库迁移方案，梳理项目所有数据存储场景，设计users、memos、todos等5张核心数据表结构，自行安装配置Supabase客户端、配置环境变量，手动修改大部分API路由适配数据库，排查并修复残留本地文件存储的问题。
AI 辅助输出：
使用 Supabase (PostgreSQL) 替代本地 JSON 文件存储：
- 安装 @supabase/supabase-js SDK
- 新建 /app/lib/db.js 作为 Supabase 客户端
- 使用 .env.local 管理环境变量
- 创建 /sql/schema.sql 建表脚本（5张表）
- 逐个更新 API 路由：memos、todos、trash、recent、auth
- 修复了 memos/[id]/route.js 和 trash/route.js 仍使用本地文件系统的问题
Prompt 12：排查修复Supabase缓存报错
时间：Day 3
解决的问题：解决数据库字段缓存异常，修复数据无法写入的报错
涉及文件：Supabase SQL Editor
报错信息：Could not find the 'createdat' column of 'memos' in the schema cache
个人思路与操作：自主复现数据保存报错，初步判断为数据库缓存未同步问题，自行尝试基础刷新操作无效后，借助AI获取专业缓存刷新SQL指令，最终通过重载表结构彻底解决问题。
AI 辅助输出：
这是 Supabase PostgREST 的 schema 缓存问题，需要刷新缓存：
在 Supabase SQL Editor 中运行：
NOTIFY pgrst, 'reload schema';
如果不行，重新运行完整的建表脚本：
DROP TABLE IF EXISTS ...;
CREATE TABLE users ( ... );
CREATE TABLE memos ( ... );
...
重新建表后 schema 缓存会自动刷新。
Prompt 13：全局修复项目中文乱码问题
时间：Day 3
解决的问题：修复全项目多文件UTF-8编码异常，解决中文乱码、数据存入失败问题
涉及文件：13个核心JS文件
个人思路与操作：数据库缓存修复后仍存在数据存入异常，自主排查定位为文件编码损坏导致中文乱码、接口解析失败，逐文件核查页面提示、接口返回、元数据等中文文本，手动标记异常文件，统一进行UTF-8编码重写修复。
AI 辅助输出：
排查发现大量 JS 文件存在 UTF-8 编码损坏导致的中文乱码问题：
修复 /app/NotesTab.js、/app/memos/new/page.js、/app/layout.js 等13个核心文件，统一使用 UTF-8 编码重新写入，彻底解决全局中文乱码与数据写入异常问题。
Prompt 14：项目代码审查与优化梳理
时间：Day 3
解决的问题：全面审查项目代码漏洞、不规范问题，梳理优化迭代方向
涉及文件：/docs/CODE_REVIEW.md
个人思路与操作：项目功能开发完成后，自主进行代码自查，发现密码加密、异常处理、代码复用等潜在问题，借助AI完成系统化CodeReview，整理风险等级与优化方案，记录待迭代问题。
AI 辅助输出：
Code Review 报告摘要
优先级问题状态P0密码仅 SHA256 无盐存储需改进P0XSS 风险（内容直接渲染）需改进P1NotesTab / NewMemo / layout 中文乱码已修复P1后端 {e} / {error} 响应格式不一致需统一P1空 catch 块吞掉错误需改进P2无 TypeScript、无分页、无 Token 过期建议优化P3getUser 在 8 个 API 路由重复定义建议抽取
综合评分：3.0/5，详细报告见 /docs/CODE_REVIEW.md
Prompt 15：项目全套文档生成
时间：Day 3
解决的问题：完善项目配套文档，生成README、API接口文档、开发日志
涉及文件：/README.md、/docs/API.md、/docs/prompt_log.md
个人思路与操作：自主梳理项目完整信息，整理技术栈、安装流程、功能介绍、接口参数等核心内容，确定文档核心模块与排版规范，借助AI标准化输出正式项目文档。
AI 辅助输出：
已生成全套项目文档：
- README.md：包含项目介绍、功能列表、技术栈、安装运行指南、部署说明、数据库表结构
- /docs/API.md：包含所有接口路径、请求响应示例、认证方式、状态码、数据表结构
- /docs/prompt_log.md：完整开发流程Prompt日志

---
部署记录
Vercel 线上部署
时间：Day 3
涉及文件：/.env.local（环境变量）
个人思路与操作：自主梳理前端项目线上部署流程，选定Vercel作为部署平台，自行完成GitHub仓库关联、环境变量配置，核对Supabase数据库密钥与地址，手动触发部署，排查部署兼容性问题，最终完成项目线上上线。
AI 辅助输出：
推荐使用 Vercel 部署，步骤：
1. 推送到 GitHub
2. 在 Vercel 导入仓库
3. 添加环境变量：
          
  - NEXT_PUBLIC_SUPABASE_URL
  - NEXT_PUBLIC_SUPABASE_ANON_KEY
4. 部署完成
部署成功后，后端 API 和前端在同一域名下：
- 前端：https://xxx.vercel.app
- API：https://xxx.vercel.app/api/...
- 数据库：https://twytjblwhxtnoyyfiaoj.supabase.co

---
项目文件总览
文件路径
功能
/app/page.js
主页面（Tab导航）
/app/BottomNav.js
底部导航组件
/app/NotesTab.js
便签列表页
/app/TodosTab.js
待办事项页
/app/ProfileTab.js
个人中心页（登录/回收站/最近查看）
/app/auth.js
认证上下文（AuthContext）
/app/AuthNav.js
顶部导航栏
/app/utils.js
时间格式化工具
/app/layout.js
根布局
/app/login/page.js
登录页面
/app/register/page.js
注册页面
/app/memos/new/page.js
新建便签页
/app/memos/[id]/page.js
便签详情/编辑页
/app/api/memos/route.js
便签列表 + 创建 API
/app/api/memos/[id]/route.js
便签详情/更新/删除 API
/app/api/todos/route.js
待办列表 + 创建 API
/app/api/todos/[id]/route.js
待办更新/删除 API
/app/api/trash/route.js
回收站列表 API
/app/api/trash/[id]/restore/route.js
回收站还原 API
/app/api/recent/route.js
最近查看记录 API
/app/api/auth/register/route.js
用户注册 API
/app/api/auth/login/route.js
用户登录 API
/app/lib/db.js
Supabase 客户端
/sql/schema.sql
数据库建表脚本
/app/globals.css
全局样式
/README.md
项目介绍文档
/docs/API.md
API 接口文档
/docs/CODE_REVIEW.md
代码审查报告
/docs/prompt_log.md
Prompt 日志（本文件）