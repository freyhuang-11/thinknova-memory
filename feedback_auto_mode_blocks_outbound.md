---
name: feedback-auto-mode-blocks-outbound
description: 对外发消息/发邮件/第三方网站新建东西被拦，是 Claude Code 自动模式分类器，不是平台；只能老板改会话权限模式
metadata:
  type: feedback
---
10-31：WhatsApp 发客户、Luma 建日历、邮件线发 Gmail 都被「auto mode classifier」拦（Real-World Transactions / Unrequested Commit in a Connected App）；带老板授权重试一次仍拦。老板问「之前都可以，为什么拦」。
**Why:** 会话跑在自动模式时，分类器拦对外发送和第三方写入，聊天里的授权它不认；之前能发是权限模式不同。
**How to apply:** 被拦一次就停，不绕路；告诉老板原因 + 三选一（改「跳过权限检查」/「询问权限」/放待办板自己点），在哪改（Code 标签输入框下方模式按钮，每个会话各改一次）。⛔ 自己改 settings。老板 10-31 22:0x 已改本会话。相关 [[feedback-retry-before-escalating]]
