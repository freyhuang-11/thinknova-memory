---
name: reference-publish-ops-gotchas
description: 营销线发布/回读/渲染的坑（10-05~10 实测）：队列绝对路径、每周任务一错整批停、TikTok 商业标网页删不掉、列表虚拟滚动、抖音列表滚不到、内存与夜间渲染窗口
metadata:
  node_type: memory
  type: reference
  originSessionId: 6862e621-cd1a-482c-a813-ec6d018d14ad
  modified: 2026-10-10T04:27:33.103Z
---

脚本都在 `03_工作台\发布队列\`、`TikTok\_auto\`、`周复盘_1007\`、`新内容_M系列_1008\_build\`。

**发布队列**
- `_auto_publish.py --queue` 必须给**绝对路径**：它会切到平台目录再调 publish.py，相对路径会 FileNotFoundError，0 秒就失败。
- 子进程用 `sys.executable`，⛔ 裸 `python`（Windows 下会解析到没装 playwright 的那个解释器）。
- 每周任务 `ThinkNova_PublishQueue` 只在**周日 22:00** 跑。批里任何一条失败，整批就停，后面全不上平台（10-04 卡在一条 TikTok，10-11~18 的 24 条差点漏）。⇒ 周日前后都要核：`已批准\` 里 10 天内的 job 是否已移到 `已上线\`。
- 超过 10 天的会「留到下次」。抖音在内存很低时可能 2400s 超时、无日志：先去后台核确实没发出，再重跑；可以把小红书拆到单独队列先跑。

**TikTok**
- 带「商业内容」声明（brand:true）的定时帖，**网页版删不掉、改不了**（Delete 是灰的），只能老板在 App 里操作 ⇒ 上平台前文案一定要定稿。菜单里照样有 Delete（`_del_sched_tt.py` 的 dry 会显示 ok），点了也不报错，但帖子不会删。回读必须先在搜索框里搜文案，虚拟列表里没看到不等于删掉了（10-11 A3 就这么误报过一次）。
- Studio 作品列表按发布时间倒序、虚拟滚动。`_probe_sched_row.py` 找不到靠后的行；要边滚边读 inner_text（每次 wheel 600，最多约 30 次）。
- 单条留存：`周复盘_1007\_tt_an.py <item_id...>`，2 秒留存在 `_原始数据\tt_an\net_*.json` 的 `video_retention_rate_realtime` 里取 timestamp=2000；item_id 从 `pull.py tt` 的 net json 里拿（schedule_time 是 UTC 秒，+8 小时）。
  - 🔴 `_tt_an.py` 每跑一次 net 文件都从 000 重新编号（会覆盖），`net_index.txt` 却只追加 ⇒ 跨次读会串号（10-10 把 0.30 误读成 0.16–0.18，差点误杀一个角度）。**一次只跑一个 id，跑前把 net_* 挪走，跑完马上读**。24h 播放直接看 `an_<id>.txt` 里 `Video views` 下一行。
- 改简介会弹拼图验证码 ⇒ 交老板在 App 里改。用发片档案搜索也会触发验证码，⛔ 用它做搜索。

**抖音 / 小红书**
- 抖音作品管理列表超过约 36 条以后，`_probe_dump.py` 的鼠标滚轮滚不到老的行，要换成拉内层容器的 scrollTop，或者抓列表接口。
- 小红书回读用 `_resched_xhs_probe.py "<标题>"`（它会滚内层 div.content），稳定可用。
- 定时换新版：`发布队列\_swap_sub_1007.py Lx` 流程是删旧 → 回读剩 0 → 排新；删不干净就停，避免一条变两条。删定时属于删平台内容，要老板亲口同意。

**渲染 / 内存**
- 本机总内存 7.8GB，白天空闲常常只有 0.1–0.4GB。HyperFrames 渲染要空闲 ≥0.8GB，否则会截图失败（Page.captureScreenshot）。后台等待 2 小时会被系统停掉。
- 总指挥批的夜间窗口：**每天 01:00–05:00 M 系列优先渲**。白天只做轻活：ffmpeg 剪切、写 spec、调 API。
- `_render.lock` 有残留时，先看 token 是谁的、那个进程还在不在，再只删自己 / 已经死掉的那一个。
- ⛔ 同时挂两条都在等锁的后台任务：锁一释放，两边同一秒抢锁，双双报 `RACE on lock` 退出，还留下一个拼坏的锁文件（10-10 实测）。要排多件重活，就写成**一条**顺序链。

**平台出片**
- 平台标「成功」，交付件也可能是坏的（解码报错，或只有 48 字节）。这时去同一子任务下找能解码的原片，并报技术。

- 🔴 **小红书封面 = 视频第 0 帧**（publish.py 不设封面）。L 系列午间档第 0 帧是黑底 / 还没出字，发出去封面一片黑（10-12 老板截图指出「招牌墙」那条）。规矩：**建小红书 job 前先抽第 0 帧看一眼**，必须有画面和标题；不行就让成片第 0 帧带标题，或者给 publish.py 加上传封面这一步。看已发 / 已排的封面：`发布队列/_xhs_covers.py [N]` → `_xhs_covers.jpg`（只读）。
- **TikTok 自定义封面（10-13 dry 通过）**：job 写 `"cover": 本地 jpg/png`，publish.py 会 Edit cover → Upload cover（文件框 accept=image/jpeg,png）→ Save。**主页九宫格只显示封面中间 3:4**（弹窗里写着 Preview in profile (4:3)）⇒ 标题放画面中间那块。
- **统一封面模板（总指挥 10-13 定）**：`新内容_知识片_1012/mk_cover_916.py 视频 秒 第一行 第二行 输出.jpg`（9:16，标题在中间 3:4 区，白 / 黄两行，⛔ 标点 / 品牌标 / 网站）。**第二行黄字 = 钩子句：观众痛点或反常识断言**（例「店里一个人都没有」），⛔ 产品 / 功能词。从下一批新排的 TT 起用，抖音 / 小红书先各 dry 一条。

