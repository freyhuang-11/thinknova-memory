---
name: feedback-no-import-scripts-for-functions
description: 借别的脚本里的函数时 ⛔ import 那个脚本——一次性脚本的顶层常直接写线上；要用就把函数复制出来
metadata:
  node_type: memory
  type: feedback
  originSessionId: 6862e621-cd1a-482c-a813-ec6d018d14ad
  modified: 2026-11-21T17:12:39.530Z
---

11-22 01:08 事故：为了借 博客发布/_cover.py 的 upload()，我 `from _cover import upload`；它的「上传封面 + PUT 整篇文章」写在模块顶层，import 一执行就用 9 月原稿把两篇已发博客整篇覆盖（字数缩一半、SEO 标题变空）。老板授权后用备份 + 重跑扩写脚本恢复（_restore_incident_1122.py）。

**Why:** 工作台里大量一次性脚本没有 `if __name__ == "__main__"`，import 就等于运行；博客接口 PUT 是整体覆盖，一跑就把后来所有改动冲掉。
**How to apply:** 需要别的脚本里的函数 → 读源码、把函数复制进自己的新脚本；⛔ import 一次性脚本（只 import 公共库 _blog / _cta1002 这类已确认顶层无写入的）。写新脚本时写线上的代码一律放 `__main__` 里并要求 --run。改已发内容前先确认最新备份在哪。相关 [[feedback-action-gates]]。
