---
name: feedback-rule-hygiene
description: 规则与 skill 的写法纪律(老板 09-07 定):WHAT+DONE、六类必留、skill 描述短触发准、不强制全读全跑;每月清一次
metadata:
  type: feedback
---

规则写 WHAT+DONE(要什么、做到什么算完),不写 HOW;只留六类硬规则:权限边界、失败停止条件、验收标准、真实业务规则、不可逆操作审批、任务完成标准;skill 描述短、触发准、需要时再读正文,不用的归档(`~/.claude/skills_archive_*`);不写「每次必读全部/必跑全部」。

**Why:** 老板 09-07 转来的外部经验:规则越多越 HOW,模型越乱;好规则告诉它权限做到哪里,不是教它怎么想。09-07 已按此归档 4 个 skill、合并 3 组、压缩 5 条记忆。
**How to apply:** 新写 feedback/skill 前先对照六类;每月清一次并在总览写一行;章程 v1.5 第 11 条已发全线。
