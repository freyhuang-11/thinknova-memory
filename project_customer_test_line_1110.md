---
name: project-customer-test-line-1110
description: 客户实测线（11-10 起，总指挥派）：扮客户 AI 实测 ThinkNova 工具包 / 话术 / 脚本；掉线先读轮次_4「当前状态_断点.md」
metadata:
  node_type: memory
  type: project
  originSessionId: dfdde839-3802-479e-a6bb-9deab2cf8013
  modified: 2026-11-16T10:37:56.080Z
---

客户实测线 = 扮成新客户的 AI（先是本机 Codex，轮次_4 起是我自己用本会话 MCP），从零用 ThinkNova 工具包和给客户的话术做片，找出卡点报总指挥。

- 🔴 **掉线 / 压缩后先读** `03_工作台/客户视角实测_1110/轮次_4_话术实跑/当前状态_断点.md`（正在做什么、等谁、文件在哪）；轮次_1～3 和各版工具包验收的明细在 `实测报告.md` 末尾各节。
- 汇报只给「ThinkNova 总指挥交接」：SendMessage to `local_dc6a6e40-e3ff-4970-a20a-2f6d7af4797e`（按名字常找不到）。回老板中文。
- **现在（11-16 02:3x）**：脚本规则 v2.1 聊天版已定稿并回写（`轮次_4_话术实跑/脚本规则和模板_v2.1_聊天.md`，2195 字，上限 2200）。待命等竖屏；竖屏未恢复，⛔ 建横屏视频单；C 路 daily-film 等老板自己跑 enable-production 配对。
- 11-16 轮次 5「MCP 出片对照」（`轮次_5_MCP出片对照/`）：竖屏已修好（9:16 → 实出 768×1344）。拉低质量的是：末帧没脸就拿来当下一段首帧 → 人和店全换；v3 规则每段 60～70 字，而模型每秒说 5.5 字，超过检查上限 5.2；「门店成片」文档没写 `film_profile: store_v2` + `film_schema_version: 3`，照文档拼会撞 S4。
- GPT 实测结论：astra 照规则写得和 sonnet 一个水平；客户用的 gpt-6-luna 弱。脚本质量主要看店铺资料厚不厚，厚资料能把 FAQ 味从 7/7 压到 1/7；建档三类要求在 39_附件。
- 轮次_4 结论：A 花店 30 秒对白片只差 FILM_SENTENCE_PAUSE；B 15 秒产品片被 FILM_DURATION（30–40）拦死；片尾叠字只有服务端短片路径能做；工具包 / 标准冲突 15 条在 `工具包和标准冲突清单_给技术.md`；积分账已结算 432。

## 可复用的坑（每条都踩过）
- **每单先 get_balance 报价**：报价里看得到画幅 / 时长 / 积分；11-15 20:34 线上默认变 21:9 时，没报价直接建单白花 60。本会话 animate_image 工具说明是旧缓存，没有 ratio / duration_seconds；ratio 传了也被忽略；edit_image 没有 21:9。
- **审片**：不能只信 check 的 no FAIL；量 silencedetect + 逐镜看动态 + 逐 20ms 音量包络查切点吃字，转写字数相同不算证据。
- 视频模型原声约 5.3～5.6 字 / 秒，写字数、改声音描述都压不下来；面部大特写最容易换脸；第二段只带末帧 + 人物三视图时门店会换。
- 字幕每屏 ≤7 字（技能写 9 字会被 FILM_SUBTITLE_SPLIT_REQUIRED 拦）。
- 实跑目录放 git 仓库外（scratchpad），克隆用 `-c core.autocrlf=false`；MCP 下载先下到 scratchpad 再拷进中文路径；转写设 `CT2_USE_MKL=0 OMP_NUM_THREADS=2 HF_HUB_OFFLINE=1`。
- 测 recover / setup：用短路径（本机 LongPathsEnabled=0），LOCALAPPDATA 重定向到 scratchpad 并拷 ego 安装标记，否则会弹 ego 安装器、在真 AppData 建目录；⛔ `rm -rf` 相对路径（安全检查拦）。
- Codex exec 测脚本：`-s read-only --ephemeral --skip-git-repo-check -C 空目录 -o 输出`。⛔ 提示词写「不运行任何命令」，否则 GPT 读不了文件、直接停。老板 ChatGPT 额度 4 次并发就会打满（11-15 23:15 打满过一次），并发别超过 2。老板 config 挂着 node_repl 等插件，要干净环境加 `--ignore-user-config -m <模型>`，**同时必须加 `-c windows.sandbox=elevated`**，否则 Windows 只读沙箱把读文件命令全拒（blocked by policy），11-16 01:30 三次白跑。
- Codex 实测（轮次_1～3）：日志末尾 `tokens used` 是会话累计；报额度只看会话 jsonl 的 rate_limits.used_percent；`--approve-for-me` 另起 guardian 子会话吃大量 token；改定时前先按 PID 停旧脚本。
- 设备配对（enable-production）要老板本人在 ThinkNova 网页确认，本机权限检查也拦，⛔ 代授权。

## 边界
⛔ 发布到任何平台、⛔ 给技术发邮件、⛔ 改老板 ~/.codex、⛔ 换 Codex 账号、⛔ 往老板 pro 号存内容规则。虚构店和测试片一律标「测试」。

**Why:** 验证客户 AI 只靠工具包和我们的话术能不能做出合格成片，把挡路的地方变成给技术的清单和话术修改。
**How to apply:** 接线先读断点文件，再照总指挥最新一条消息做；口径见 [[feedback-boss-rulings]]。
