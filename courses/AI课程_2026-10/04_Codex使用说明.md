# 第 4 课 · Codex 使用说明（OpenAI）

> 核对依据：openai/codex 仓库 `main` 分支源码（2026-10-07）。官方文档站 developers.openai.com/codex。
> Codex 更新很快，命令名以 `codex --help` 和 TUI 里的 `/` 菜单为准。

---

## 4.1 Codex 有哪几种形态

| 形态 | 入口 | 适合 |
|---|---|---|
| **CLI（终端）** | `codex` | 本地开发主力，和 Claude Code 对位 |
| **IDE 插件** | VS Code / Cursor / Windsurf | 边看代码边让 AI 改 |
| **桌面 App** | `codex app`；会话里 `/app` 转到 App（macOS / Windows） | 图形界面 |
| **Codex Cloud（网页）** | chatgpt.com/codex；CLI 里 `codex cloud`（实验功能） | 后台跑任务，跑完把改动拉回本地 `codex apply` |
| **代码审查** | 会话里 `/review`；非交互 `codex review` | 审未提交改动 / 对比分支 / 审某个 commit |
| **SDK** | TypeScript `@openai/codex-sdk`；Python `openai-codex` | 把 Codex 嵌进自己的程序 |

---

## 4.2 安装与登录

```bash
# macOS / Linux
curl -fsSL https://chatgpt.com/codex/install.sh | sh
# 或
npm install -g @openai/codex
brew install --cask codex

# 登录：运行 codex，选「Sign in with ChatGPT」（Plus / Pro / Business / Edu / Enterprise）
codex
# 或用 API Key
printenv OPENAI_API_KEY | codex login --with-api-key
```

---

## 4.3 规则文件：AGENTS.md

AGENTS.md 是 Codex 的「项目说明书」，作用等同 Claude Code 的 `CLAUDE.md`。

**加载顺序**（先加载的在前，后加载的更具体）：

```
~/.codex/AGENTS.md            ← 全局（个人习惯）
<项目根>/AGENTS.md            ← 项目共享规则
<项目根>/子目录/AGENTS.md     ← 子模块规则（从根一路走到当前目录，每层一份）
```

- 每个目录优先读 `AGENTS.override.md`，没有才读 `AGENTS.md`（适合临时覆盖规则，不改共享文件）。
- 项目根由 `.git` 判定，**不会往根目录之外找**。
- 🔴 **大小上限**：所有项目文档合计默认 **32 KiB**（`project_doc_max_bytes`），**超出部分直接截断**。→ 再次证明：规则文件要短。
- 不受信任的项目，其 AGENTS.md 会被跳过。
- `/init` 自动生成一份初稿。

---

## 4.4 配置：config.toml

位置：用户级 `~/.codex/config.toml`；项目级 `.codex/config.toml`（受信任项目才生效）。

```toml
model = "<用 /model 查看可选模型>"
model_reasoning_effort = "medium"      # low / medium / high / xhigh …（视模型而定）
approval_policy = "on-request"         # 何时问你
sandbox_mode = "workspace-write"       # 能动哪里

[mcp_servers.github]                   # 接 MCP 工具
command = "npx"
args = ["-y", "@modelcontextprotocol/server-github"]
env_vars = ["GITHUB_TOKEN"]
```

- 也可以用命令管理 MCP：`codex mcp ...`
- 多套配置用 `--profile / -p <名字>` 切换。

---

## 4.5 安全两件套：审批策略 × 沙箱

Codex 的权限设计是**两个独立旋钮**，这是它和 Claude Code 最大的设计差异：

**审批策略 `approval_policy`（什么时候问你）**

| 值 | 含义 |
|---|---|
| `untrusted` | 只有已知安全的命令自动跑，其余都问 |
| `on-request` | **默认**。模型认为需要时才申请（`on-failure` 现在是它的别名） |
| `never` | 从不问（配合沙箱使用） |
| `granular` | 按类别细粒度配置 |

**沙箱 `sandbox_mode`（物理上能动哪里）**

| 值 | 含义 |
|---|---|
| `read-only` | 只读（默认） |
| `workspace-write` | 可写当前工作区 |
| `danger-full-access` | 不设限，**仅在隔离环境（容器/虚拟机）里用** |

**常用组合**

```bash
codex                                  # 默认：只读 + 按需申请
codex -s workspace-write -a on-request # 日常开发推荐
codex --approve-for-me                 # 审批交给自动审查，沙箱为 workspace-write
codex --yolo                           # = --dangerously-bypass-approvals-and-sandbox，只在一次性容器里用
```

> ⚠️ 旧教程里的 `--full-auto` 和 `/approvals` 在当前版本已经没有了，分别用 `--approve-for-me` 和 `/permissions` 代替。

---

## 4.6 会话里常用的斜杠命令

| 类别 | 命令 |
|---|---|
| 会话 | `/init` `/new` `/clear` `/resume` `/fork` `/compact` `/recap` `/quit` |
| 模型与工作 | `/model`（选模型和推理强度）`/plan`（计划模式）`/goal` `/review` `/diff` `/status` `/usage` `/agents` `/subagents` |
| 权限 | `/permissions` |
| 扩展 | `/mcp` `/skills` `/hooks` `/plugins` `/memories` |
| 其他 | `/worktree` `/side`（顺便问个题外话，不打断主任务）`/import`（从 Claude Code 导入配置） |

`@文件名` 可以把指定文件直接放进上下文。

---

## 4.7 Skills / Hooks / 子 Agent

**Skills**（和 Claude Code 同一种 `SKILL.md` 格式，可以互通）

```
~/.agents/skills/<技能名>/SKILL.md       ← 个人
<项目>/.agents/skills/<技能名>/SKILL.md  ← 项目共享
```

**Hooks**：写在 `hooks.json` 或 config.toml 的 `[hooks]`。事件包括 `PreToolUse`、`PostToolUse`、`PermissionRequest`、`SessionStart`、`UserPromptSubmit`、`PreCompact`、`SubagentStart/Stop`、`Stop` 等。**Hook 需先被信任才会执行。**

**子 Agent**：`/agents`、`/subagents` 管理。

---

## 4.8 非交互 / 自动化：codex exec

```bash
# 一次性任务，跑完退出
codex exec "把 src/ 下所有 var 改成 const，并跑测试"

# 输出 JSONL 事件流，方便程序解析
codex exec --json "..."

# 要求最终输出符合 JSON Schema（适合接进流水线）
codex exec --output-schema schema.json "提取这份文档里的所有接口"

# 把最后一条回复写进文件
codex exec -o result.md "..."

# 接着上次的会话继续
codex exec resume --last "继续"

# 非交互代码审查
codex exec review --base main
```

管道输入：`cat error.log | codex exec "分析这个报错"`

---

## 4.9 Codex 标准用法（最佳实践）

1. **先写 AGENTS.md**：命令、约定、红线、目录说明。控制在 32 KiB 以内，越短越好。
2. **大任务先 `/plan`**：先出方案再动手。
3. **日常用 `workspace-write` + `on-request`**，`--yolo` 只在一次性容器里用。
4. **一个任务一个会话**，换话题用 `/new`；上下文长了用 `/compact`。
5. **让它自己验证**：在 AGENTS.md 里写清测试命令，提示里要求「改完跑测试」。
6. **用 `/review` 自审**，再提交。
7. **重复流程沉淀成 Skill**。
8. **长任务丢 Cloud**，本地继续干别的，跑完 `codex apply` 拉回。
