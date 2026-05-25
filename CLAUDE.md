# iCloudVault — experiment 分支

> ⚠️ 此分支为实验分支，用于测试/试验新功能。所有改动可能随时被丢弃或 rebase。

## 与 main 的关系
- **main**：稳定分支，所有实验成熟后合入
- **experiment**：当前所在分支，可以随便改，破坏性操作也没关系

## 实验目标
在此分支上尝试新功能、重构、技术验证。成功后 cherry-pick 或 merge 回 main。

## 开发方式
- 由 Claude Code / 其他 AI Agent 驱动开发
- AI 需要阅读 CLAUDE.md 了解上下文
- 如需引用 main 分支的代码，使用 `git merge main` 同步

## 当前状态
初始创建，基于 main 的最新提交。
