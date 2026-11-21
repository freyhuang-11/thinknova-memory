---
name: feedback-chrome-no-new-window
description: 用浏览器做事时别一直新开 Chrome 窗口 / 标签组——老板的 Chrome 本来就登着 freyhuang 账号，就在已开的窗口里做
metadata:
  node_type: memory
  type: feedback
  originSessionId: 6862e621-cd1a-482c-a813-ec6d018d14ad
  modified: 2026-11-21T17:10:18.090Z
---

老板 11-22 01:1x 原话：「每次打开新的chrome都是用freyhuang的账号做事啊。你不要一直开新的chrome啊」。

**Why:** 我反复 tabs_context_mcp(createIfEmpty) / tabs_create_mcp，每次都弹出一个新 Chrome 窗口（MCP 标签组），窗口常被最小化后冻住（visibilityState=hidden，Search Console 等点不动），桌面上越开越多；而老板已登录的那个 Chrome 本来就带 freyhuang 账号，新窗口没必要。
**How to apply:** 先 tabs_context_mcp（不带 createIfEmpty）看已有标签，有就在已有标签里 navigate；只有一个都没有时才新建一个，并且整段活只用这一个，做完别关成一堆空窗口也别再开新的。脚本型浏览器（playwright 的 _profile）不受这条影响。相关 [[feedback-boss-computer-and-review]]。
