---
name: feedback-wa-unread-hides-customers
description: WhatsApp 只看「未读」会漏掉客户 —— Meta AI 接管的会话未读数是 0，必须扫整个列表的时间戳
metadata:
  node_type: memory
  type: feedback
  originSessionId: 5415ca52-b559-4c91-a28d-36c22f0d137f
  modified: 2026-09-26T06:36:42.975Z
---

# 🔴 WhatsApp 巡检 ⛔ 不许只看「未读」（2026-09-26 差点丢一个客户）

## 事故

`+63 915 906 2449`（Queen，菲律宾）：

```
周二 00:27  她主动问 "Hello! Can I get more info on this?"
周二 00:28  Meta AI 自动回了介绍
周二 01:28  Meta AI 又跟进一次
09-26 14:05 她回了 "yes"        ← 活人，等了三天
09-26 14:06 Meta AI 又推了一遍链接（重复推链接是已证伪的做法）
09-26 14:35 我才发现并接管
```

⚠️ **全程「未读」计数是 0**，浏览器标题一直是 `WhatsApp Business` 没有 `(N)` 前缀。
⇒ 因为 **Meta AI 接管会话后会"读"掉消息**，未读标记被清。
⇒ 我当天早些时候按「未读=0」判了「零新回复」，**那个判断是错的**。

**Why**：未读数衡量的是「有没有人读过」，不是「有没有客户说话」。
AI 接管的会话里，AI 就是那个"读过的人"。**判据和目标错位。**
⇒ 这和 [[feedback-no-backslash-in-heredoc]]、评论线那次「查 `<a>` 判失败」是同一个病：
**没确认"我量的这个东西，是不是真能反映我要的结果"。**

## How to apply

**每次巡检 WhatsApp，⛔ 不许只看未读筛选或标题计数。必做这一条**：

```js
const p=document.querySelector('#pane-side'); p.scrollTop=0;
await new Promise(r=>setTimeout(r,700));
const g=p.querySelector('[role="grid"]');
[...g.children].map(r=>(r.innerText||'').replace(/\n+/g,' | ').slice(0,95)).filter(Boolean).slice(0,10)
```

然后**逐行看两样**：
1. **时间戳是今天的** → 不管有没有未读标记，都点进去看
2. **最后一条不是我们发的** → 那就是客户说话了

⚠️ 还有一个陷阱：**AI 发的消息在列表预览里看着像我们发的**（带 ✓✓），
所以"最后一条是我们发的"也不能当成"没新消息"——**AI 回复的下面可能压着客户的话**。
⇒ 今天有动静的会话，**一律点进去读会话尾部**，不靠列表预览下判断。

**标题栏 `(N)` 只能证明"有未读"，⛔ 不能证明"没客户说话"。**
（单向判据：有 N 一定要看；没有 N 不代表没事。）

相关：[[reference-whatsapp-ops]]（AI 接管要点「手动回复」才有输入框）
