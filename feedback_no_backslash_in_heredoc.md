---
name: feedback-no-backslash-in-heredoc
description: bash heredoc 会吃掉一层反斜杠，Windows 路径写进去必坏 —— 一律用正斜杠或 chr(92)
metadata:
  node_type: memory
  type: feedback
  originSessionId: 5415ca52-b559-4c91-a28d-36c22f0d137f
  modified: 2026-09-26T05:17:28.676Z
---

# ⛔ heredoc 里绝不写反斜杠（2026-09-26 一天踩五次）

`Bash` 工具跑 `python - <<'PYEOF' ... PYEOF` 时，**反斜杠会被吃掉一层**，
哪怕 heredoc 定界符是加引号的 `'PYEOF'`（理论上应该原样传递）。

**后果长这样**（都是真事）：

| 我写的 | 落到文件里的 |
|---|---|
| `03_工作台\\日报\\_hb_stamp.py` | `03_工作台\u65e5报\_hb_stamp.py` |
| `03_工作台\\教程视频_0923` | `03_工作台教程视频_0923`（分隔符整个没了）|
| `"\\u0"`（想要字面量）| `"\u0"` → **SyntaxError: truncated \uXXXX escape** |
| `\\03_工作台` | `\03` 被当成八进制转义 → 一个不可见控制字符 |

⚠️ **最阴的是第二种**：文件看起来"有内容"，路径却是坏的。
心跳本子里那条读快照的命令就这么坏过一次 —— **它是要被执行的**，坏了心跳就读不到数据。

## How to apply

1. **写 Windows 路径一律用正斜杠**：`D:/SamsoData/Documents/...`。
   Python、PowerShell 在 Windows 上都认正斜杠，Markdown 文档里给人读也没问题。
2. 非要反斜杠 ⇒ 在 python 里 `BS = chr(92)` 然后拼，**别在字面量里打 `\`**。
3. **改已有文件里的单行**（尤其是带路径的）⇒ 直接用 `Edit` 工具，**别绕 bash**。
   这是"Bash genuinely cannot do the job"的情形。
4. **写完必须回读验证**，⛔ 不许看到"写入成功"就算完：
   ```
   PYTHONIOENCODING=utf-8 python -c "import io;print([l for l in io.open('<文件>',encoding='utf-8').read().split(chr(10)) if 'D:' in l])"
   ```
   扫两样：字面 `chr(92)+'u'` 残留、`ord(c)<32` 的控制字符。
5. 更狠的一条：**落到文件里的命令，当场原样跑一遍**。心跳那条读快照的命令我跑过才敢留。

⇒ 这条和 [[feedback-evidence-standard]] 同源：**"写进去了" ≠ "写对了"**。
相关：[[feedback-heartbeat-not-cron]]（那条读快照的命令就在心跳本子里）
