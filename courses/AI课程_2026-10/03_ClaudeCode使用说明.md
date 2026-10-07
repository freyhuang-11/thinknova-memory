# 第 3 课 · Claude Code 使用说明（Anthropic）

> 官方文档：code.claude.com/docs。Claude Code 迭代很快，命令以会话里输入 `/` 弹出的菜单和 `claude --help` 为准。

---

## 3.1 Claude Code 有哪几种形态

| 形态 | 入口 | 适合 |
|---|---|---|
| **CLI（终端）** | `claude` | 本地开发主力 |
| **桌面 App** | Mac / Windows 客户端的 Code 页 | 图形界面、多会话并行 |
| **网页 / 云端** | claude.ai/code | 在云端容器里跑，手机上也能看进度 |
| **IDE 插件** | VS Code / JetBrains | 边看代码边改 |
| **GitHub 集成** | 在 PR / Issue 里 @claude | 自动审查、自动修 CI |
| **Agent SDK** | Python `claude-agent-sdk` / TS `@anthropic-ai/claude-agent-sdk` | 用同一套 Harness 搭自己的 Agent |

---

## 3.2 上手三步

```bash
npm install -g @anthropic-ai/claude-code   # 或按官网用原生安装脚本
cd 你的项目
claude                                       # 首次运行会引导登录
```

进入后第一件事：
```
/init        ← 让 Claude 读项目，生成一份 CLAUDE.md 初稿
```

---

## 3.3 规则与记忆：CLAUDE.md + Auto Memory

### CLAUDE.md（人写的规则）

| 位置 | 作用范围 | 是否进 git |
|---|---|---|
| `~/.claude/CLAUDE.md` | 你本机所有项目（个人习惯，如「回复用中文」） | 否 |
| `<项目>/CLAUDE.md` 或 `<项目>/.claude/CLAUDE.md` | 本项目，团队共享 | 是 |
| `<项目>/子目录/CLAUDE.md` | 只在处理该子目录时加载 | 是 |
| 组织级托管策略 | 全公司强制 | 由管理员下发 |

- 可以在 CLAUDE.md 里用 `@路径` 引用别的文件，把细节拆出去。
- 会话里用 `/memory` 查看和编辑记忆文件。

### Auto Memory（AI 自己写的记忆）

Claude Code 会把「你纠正过它的做法、项目状态、常用参考」自动写进项目专属的记忆目录：一个 `MEMORY.md` 索引 + 若干主题文件，每次会话开始时加载索引。

> 📌 **本仓库 `thinknova-memory` 就是我们 ThinkNova 的 Auto Memory 备份**：`MEMORY.md` 是索引，`feedback_*` / `project_*` / `reference_*` 是主题文件。管理方法见第 5 课。

---

## 3.4 权限与安全

### 权限模式（Shift+Tab 循环切换，或 `/permissions`）

| 模式 | 行为 | 适合 |
|---|---|---|
| `default` | 改文件、跑命令前都问你 | 新项目、不熟悉的代码 |
| `acceptEdits` | 改文件自动通过，跑命令还问 | 日常开发 |
| `plan` | **只读，只出方案**，你批准后才动手 | 大改动、需要先拍板的事 |
| `auto` | 由安全分类器判断每个操作能不能自动做 | 长任务、少打扰 |
| `dontAsk` | 不在白名单里的操作直接拒绝，不弹窗 | 无人值守 |
| `bypassPermissions` | 全部放行 | **只在一次性隔离容器里用** |

### 权限规则（settings.json）

```json
{
  "permissions": {
    "allow": ["Bash(npm test *)", "Bash(git status)", "Edit(src/**)"],
    "ask":   ["Bash(git push *)"],
    "deny":  ["Bash(rm -rf *)", "Read(./.env)", "Read(~/.ssh/**)"]
  }
}
```

### settings.json 放哪

| 文件 | 范围 |
|---|---|
| `~/.claude/settings.json` | 个人，所有项目 |
| `.claude/settings.json` | 项目，团队共享（进 git） |
| `.claude/settings.local.json` | 项目，仅本机（不进 git） |
| 组织托管设置 | 管理员下发，优先级最高 |

> 小技巧：`/fewer-permission-prompts` 会扫描你的历史记录，把常用的只读命令加进白名单，减少弹窗。

---

## 3.5 Hooks：让规则「一定执行」

写在 settings.json 的 `hooks` 字段。常用事件：

| 事件 | 时机 | 典型用途 |
|---|---|---|
| `SessionStart` | 会话开始 | 拉最新记忆库、装依赖 |
| `UserPromptSubmit` | 你发出消息时 | 自动附加上下文（如当前日期） |
| `PreToolUse` | 工具执行前 | **拦截危险命令**（退出码 2 = 阻止，并把原因反馈给 Claude） |
| `PostToolUse` | 工具执行后 | 自动格式化、自动跑 lint |
| `Notification` | 需要你确认 / 空闲时 | 推送提醒 |
| `Stop` / `SubagentStop` | 回答结束时 | 检查是否真的完成、自动提交记忆 |
| `PreCompact` | 压缩上下文前 | 先备份重要信息 |

```json
{
  "hooks": {
    "PostToolUse": [
      { "matcher": "Edit|Write",
        "hooks": [{ "type": "command", "command": "npx prettier --write ." }] }
    ]
  }
}
```

---

## 3.6 Skills：可复用的专业能力

```
~/.claude/skills/<技能名>/SKILL.md          ← 个人
<项目>/.claude/skills/<技能名>/SKILL.md     ← 项目共享
插件里的 skills/<技能名>/SKILL.md            ← 随插件安装
```

```markdown
---
name: release-notes
description: 写版本更新说明时使用。读 git log，按「新功能/修复/破坏性变更」分类输出。
allowed-tools: Bash(git log *) Read
---
## 步骤
1. git log 上一个 tag..HEAD
2. 按类别归类，每条一句话，用户视角
3. 输出到 CHANGELOG.md 顶部
```

- `description` 是**触发器**：写清「什么时候用」，Claude 才会在对的时机自动调用。
- 也可以手动调用：输入 `/release-notes`。（旧版的「自定义斜杠命令」现在已并入 Skills。）
- 渐进式披露：平时只占一行描述，用到才加载全文——所以可以装很多。
- 内置的 `/skill-creator` 类技能可以帮你写 skill、测 skill。

---

## 3.7 Sub-agents：派子智能体

```
.claude/agents/<名字>.md     ← 项目
~/.claude/agents/<名字>.md   ← 个人
```

```markdown
---
name: code-reviewer
description: 代码改完后做审查。重点查正确性和安全问题。
tools: Read, Grep, Glob
model: sonnet
---
你是资深审查员。只报告有把握的问题，每条给出文件:行号和修复建议。
```

- 子 agent 有**独立上下文**，看不到主对话历史，只拿到任务说明 + CLAUDE.md。
- 内置的 `Explore`（只读大范围搜索）、`Plan`（规划）开箱即用。
- `/agents` 管理。派任务时说「用 code-reviewer 子 agent 审一下」。

---

## 3.8 MCP：接外部工具

```bash
claude mcp add --transport http github https://api.githubcopilot.com/mcp/
claude mcp add --transport stdio myserver -- npx some-mcp-server
claude mcp list
```

| 作用域 | 存放 | 共享 |
|---|---|---|
| local（默认） | 本机，仅本项目 | 否 |
| project | 项目根 `.mcp.json` | 进 git，团队共享 |
| user | 本机，所有项目 | 否 |

会话里 `/mcp` 查看连接状态、登录授权。

---

## 3.9 Plugins：把 skills + agents + hooks + MCP 打包分发

- `/plugin` 浏览、安装、管理插件；插件市场（marketplace）可以是官方的，也可以是公司内部 git 仓库。
- 适合团队：把统一的规范、审查 agent、格式化 hook 做成一个插件，全员一键装。

---

## 3.10 上下文管理

| 命令 | 作用 |
|---|---|
| `/context` | 看上下文窗口被什么占了 |
| `/compact [保留重点]` | 手动压缩对话（快满时也会自动压缩） |
| `/clear` | 清空，开始新话题 |
| `/resume`、`claude --continue` | 接着上次的会话 |
| `/model`、`/effort` | 切换模型、调推理强度 |

**原则**：一个任务一个会话；上下文越干净，表现越好；大范围搜索交给子 agent，别让它塞满主对话。

---

## 3.11 自动化

```bash
# 无头模式：执行完就退出，适合脚本/CI/定时任务
claude -p "检查 src/ 有没有未使用的导出，列出来"
claude -p "..." --output-format json        # 结构化输出
claude -p "..." --output-format stream-json # 流式事件

# 会话内
/loop 30m 检查部署状态    ← 定时重复执行
```

- **GitHub Actions**：PR 里 @claude 让它审查或修复。
- **Worktree**：多个会话在同一仓库的不同工作树里并行干活，互不干扰。
- **多 Agent 编排（Workflows）**：用脚本同时调度多个子 agent（例如「审查 → 验证」流水线），适合大规模任务，消耗也大，需要明确开启。

---

## 3.12 常用斜杠命令速查

| 命令 | 作用 |
|---|---|
| `/init` | 生成 CLAUDE.md |
| `/memory` | 编辑记忆 |
| `/permissions` | 权限规则 |
| `/hooks` | 查看钩子 |
| `/agents` | 子 agent 管理 |
| `/mcp` | MCP 连接 |
| `/plugin` | 插件 |
| `/model` `/effort` `/fast` | 模型 / 推理强度 / 快速模式 |
| `/context` `/compact` `/clear` `/resume` | 上下文管理 |
| `/code-review` `/security-review` | 审查当前改动 |
| `/loop` | 定时任务 |
| `/config` | 设置面板 |

---

## 3.13 Claude Code 标准用法（最佳实践）

1. **先 `/init`，再精修 CLAUDE.md**：命令、约定、红线、路由表。
2. **探索 → 计划 → 编码 → 提交**：大任务先用 Plan 模式让它只读调研、出方案，你批准后再动手。
3. **给它验证手段**：测试命令、截图、预期输出。「能自己检查对错」的 AI 比「写完就交」的强得多。
4. **说具体**：❌「优化一下」 ✅「把 `utils/date.ts` 的 `format` 改成支持时区参数，补测试」。
5. **及时打断纠偏**：方向不对按 Esc 停下，比让它跑完再返工便宜。
6. **事故级规则写成权限 / Hook**，不只写进 CLAUDE.md。
7. **重复的事沉淀成 Skill**，被纠正的事写进记忆。
8. **子 agent 的结论自己复核**再转述。

---

## 3.14 Claude Code vs Codex 对照表

| 维度 | Claude Code | Codex |
|---|---|---|
| 厂商 / 模型 | Anthropic / Claude 系列 | OpenAI / GPT 系列 |
| 规则文件 | `CLAUDE.md` | `AGENTS.md`（合计默认 32 KiB 上限） |
| 配置文件 | `settings.json`（JSON） | `config.toml`（TOML） |
| 权限设计 | 权限模式 + allow/ask/deny 规则 | 审批策略 × 沙箱模式，两个旋钮 |
| 计划模式 | Plan 模式 | `/plan` |
| Skills | `.claude/skills/` | `.agents/skills/`（同为 SKILL.md 格式） |
| Hooks | settings.json `hooks` | `hooks.json` / `[hooks]`，需先信任 |
| 子 Agent | `.claude/agents/*.md` | `/agents`、`/subagents` |
| MCP | `claude mcp add` / `.mcp.json` | `codex mcp` / `[mcp_servers.*]` |
| 无头模式 | `claude -p` | `codex exec` |
| 云端 | claude.ai/code | chatgpt.com/codex |
| 自动记忆 | Auto Memory（`MEMORY.md`） | `/memories` |
| 互通 | — | `/import` 可从 Claude Code 导入 |

**怎么选**：两者能力已高度趋同，差别主要在模型风格和生态。团队可以**同一仓库同时维护 `CLAUDE.md` 和 `AGENTS.md`**（或让一个引用另一个），Skills 用同一套 `SKILL.md`，就能两边通用。
