---
name: reference-whatsapp-ops
description: WhatsApp 回客户的操作要点 —— 走 web.whatsapp.com；看到「AI 正在回复」要点手动回复
metadata:
  node_type: memory
  type: reference
  originSessionId: 5415ca52-b559-4c91-a28d-36c22f0d137f
  modified: 2026-09-25T07:49:34.295Z
---

# 🔴 WhatsApp 回客户：动手前必读（2026-09-25 实测）

WhatsApp 是目前**唯一有活人的线**。⛔ 这里操作错一步就丢一个客户。

## 一、走哪条通道

| 通道 | 能不能发 |
|---|---|
| **`web.whatsapp.com`** | ✅ **能发** |
| Meta Business Suite 收件箱 | ⛔ **打字能过，按发送键被权限拦**（`Real-World Transactions`），重试两次都拦 |

⇒ **一律走 `web.whatsapp.com`。**

## 二、🔴 没有输入框 ≠ 超窗

会话底部如果显示：
```
AI 正在此聊天中回复。
    手动回复
```
⇒ **是 Meta AI 接管了会话**，点「**手动回复**」输入框才出现。
⇒ **跟 24 小时窗口没有任何关系。**

⚠️ 2026-09-25 我在这里判错过：看到没输入框就往「24 小时窗口锁死」上套，编了结论，还让老板去配模板消息。
**真实原因写在会话底部，我没看。** ⇒ 这条进 [[feedback-verify-before-relaying]] 的同类。

## 三、发送流程（⛔ 每步都要）

1. 搜索框输号码 → 点会话
2. **确认会话对象**（`find 输入框` 的 accessibility 名字里带号码，用它核对）
3. 底部有「手动回复」就先点
4. 点输入框 → type
5. **非 ASCII（越南语等）必须回读输入框验证**——渲染器冻住时 type 会打坏声调符号
6. Enter 发送
7. **用哨兵串回读会话验证送达**（⛔ 不搜字段名，只认自己埋的独一无二字串）

⛔ **不在同一个 batch 里切会话**——ref 会失效，可能发错人。

## 四、跟进口径（老板 2026-09-25 定）

**第 1 条**：介绍平台是什么（两句）→ `https://thinknova.top`（**必须带协议头**，否则 WhatsApp 不做成可点链接）→ 问一个问题

**🔴 三选一，别开放提问**（老板 09-25：「他不会回店名」）：
⛔ 别问店名、别问「你卖什么」 ⇒ 问两件：**注册了没** ＋ **第一条视频要 (a) 产品 / (b) 带价促销 / (c) 店铺本身**。
客户回一个字母就行。a 那一项按他的行业换成具体的（美发店写「美发美甲作品」）。

**教程改发 YouTube unlisted 链接，⛔ 不再发文件**（2026-09-25）：
12 条×5 语字幕全上线（逐条回读验过）。零体积、手机直接播、客户自己切字幕语言，教程③ 16MB 超限的问题没了。
对照表＋现成话术（英/印尼/越/中）：`03_工作台\教程视频_0923\教程链接卡_发给客户_2026-09-25.md`
🔴 **一次只发一条；教程由老板发**（他亲口定的）。
⛔ **一天主动发不超 8 条**—— WhatsApp Business 号被标记成骚扰就全没了。

**客户回话后**：问**有没有注册**、**想做什么样的视频**（给选项：产品展示 / 带价格的促销 / 店铺整体），
说清**有问题随时发截图来问**。客户说了要什么 ⇒ **报老板，老板发对应教程视频**。

**他不回**：⛔ 不要再推链接，改问「你卡在哪一步」。

## 五、⛔ 三条已证伪的做法

| ⛔ | 证据 |
|---|---|
| 兜底话术「I'll ask a representative to respond / someone will be with you shortly」 | **掐断了 3 个主动咨询的客户**（Shing's 已经把旅行社全部业务列完了） |
| 一上来甩三档价 S$40/35/30 | Junni 拿到报价后就不回了 |
| 说「请用电脑打开，手机体验不好」 | **手机完全能用**，这句劝退过至少 3 个人 |

## 六、24 小时窗口（真实存在，但不是上面那个）

WhatsApp Business **API**（云 API / Business Suite）有 24 小时客服窗口；
**WhatsApp Business App（含 web.whatsapp.com）没有这个限制**。
我们用的是后者 ⇒ **可以随时主动发**。

相关：[[reference-thinknova-fb-ads-truth]] [[feedback-verify-before-relaying]]

## 09-27 · 发视频文件给客户（唯一跑通的路径，别再试别的）
- 页面常驻的 `input[type=file]` 只收 `image/*`（粘贴图用），视频塞进去 → 弹「不支持你尝试添加的 1 个文件」，说明文字掉回输入框，**看起来像发了其实没发**。判「发出」只认会话尾行出现文件气泡 + 时间戳。
- 「照片和视频」/「文档」的 input 是点菜单项那一刻动态建的并立即 `.click()` 弹系统选窗。做法：JS 把 `HTMLInputElement.prototype.click` 拦成只记录（`window.__caught.push(this)`）→ 点 ＋ → JS `.click()`「文档」菜单项 → `find` 拿到新出现的 file input ref → `file_upload`（扩展受信事件；JS 合成 `change`/`drop`/预填 `files` 一律无效）→ 说明框打字回读 → **JS 找 `aria-label` 以「发送」开头的按钮 `.click()`**（低内存时坐标点击会漏）→ 回读尾行 `data-icon` 含 `document-MP4-icon`。
- 「照片和视频」入口对 H.264+AAC 的 mp4 三次失败（转圈后回落，原因未定位）；文档形式客户手机可直接播放，接受。
- `find` 工具走模型会触发用量限流；能用 JS 定位就别用 find。

## 09-28 00:0x 老板定：成片发出后客户没回 → 24 小时后跟进一句
- 一句话模板：「Did the video play OK on your phone? Anything you'd change?」；再 24 h 无回 ⇒ 判死不再发。已写进 SOP v2 §一。
- 今日到点：ai beautique（17:25 发）→ 09-28 17:25 跟；rhodapana617（18:04 发）→ 09-28 18:04 跟；Shing's 由老板亲自聊，不跟。
