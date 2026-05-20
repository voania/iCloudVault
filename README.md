# iCloudVault

独立于系统相册的 iCloud 私人相册管理应用 —— 基于 MiMo-V2.5 多模态 AI 自动分类、搜索、去重。

## 痛点

iOS 用户将照片存入 iCloud Drive 后，只能通过"文件"App 查看，无法像系统相册一样按时间线浏览、按内容搜索、自动分类、去重。系统相册与 iCloud Drive 照片完全割裂。

## 特性

- **iCloud Drive 直读**：访问 iCloud Drive 指定文件夹，与系统相册完全隔离
- **AI 智能分类**：多模态模型自动打标签（人物、场景、物体、OCR 文字提取）
- **自然语言搜索**：支持"去年在海边拍的日落"级别语义搜索
- **时间线 + 地图**：EXIF 元数据提取，时空双维度浏览
- **去重引擎**：感知哈希 + 特征向量相似度，识别重复/相似照片
- **端到端加密**：照片不出 iCloud，AI 分析在本地完成，仅上传特征向量

## 技术栈

| 层 | 技术 |
|------|------|
| iOS 客户端 | SwiftUI + FileManager + iCloud Entitlement |
| 后端 | Vapor (Swift) / Cloudflare Workers |
| AI 推理 | MiMo-V2.5-Pro（多模态标签 + OCR） |
| 向量检索 | FAISS / USearch |
| 去重 | pHash + CLIP 特征相似度 |

## 开发方式

全流程 **Agent 驱动开发**：Claude Code 调度 + MiMo-V2.5 推理。工作流覆盖需求分析→架构设计→模块子代理并行实现→代码审查→TDD。

## 路线图

- [ ] **Phase 1**：iCloud 同步层 + 基础相册 UI（瀑布流、时间线）
- [ ] **Phase 2**：MiMo-V2.5 多模态分类引擎 + 标签系统
- [ ] **Phase 3**：自然语言语义搜索
- [ ] **Phase 4**：去重引擎
- [ ] **Phase 5**：Web 端（电脑浏览）
- [ ] **Phase 6**：端到端加密 + 隐私保护

## 状态

🚧 早期开发中 | 预计 2026 Q3 发布 MVP

## Agent 驱动开发日志

本项目全流程由 Claude Code Agent 驱动，以下为实际开发过程记录：

| 阶段 | Agent 类型 | Token 消耗（估） | 产出 |
|------|-----------|-----------------|------|
| 需求调研 | Explore Agent × 2 | ~200K | iCloud API 可行性分析、竞品对比 |
| 方案设计 | Plan Agent | ~500K | 架构设计、技术选型、分阶段路线图 |
| GitHub 项目搭建 | General-Purpose Agent | ~100K | Repo 创建、README 撰写、文档结构 |

> 完整 Claude Code 对话记录：1972+ 行交互，覆盖需求分析→架构设计→项目初始化全过程。
> 日均 Token 消耗：5-15M（含多轮 Agent 调度）

## MiMo Token 需求预估

| 模块 | 模型 | 预估 Token |
|------|------|-----------|
| 图片多模态分类 | MiMo-V2.5-Pro | 5K/张 × 2249 张 = ~11M |
| 特征向量生成 | Embedding | 2K/张 × 2249 张 = ~4.5M |
| Agent 开发调度 | MiMo-V2.5-Pro | 15-30M/天 |
| 测试与调试 | MiMo-V2.5-Pro | 5-10M/天 |

## 影响力证明

- GitHub：https://github.com/XSYRY/iCloudVault
- 测试数据：iCloud Drive 2249 张真实照片
- 开发工具链：Claude Code + DeepSeek + Obsidian
- 计划开源后首月目标 500+ Star

## 许可证

MIT
