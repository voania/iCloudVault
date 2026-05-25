# Momento

独立于系统相册的私人相册管理应用 —— 基于多模态 AI 自动分类、语义搜索、去重。

<p align="center">
  <img src="https://img.shields.io/badge/status-prototype-purple?style=flat-square" alt="status">
  <img src="https://img.shields.io/badge/license-MIT-green?style=flat-square" alt="license">
  <img src="https://img.shields.io/badge/platform-iOS%20%7C%20Web-blue?style=flat-square" alt="platform">
  <img src="https://img.shields.io/badge/design-Material%20Design%203-6750A4?style=flat-square" alt="design">
</p>

## 痛点

iOS 用户将照片存入相册后，需要一个更智能的管理方式，支持按时间线浏览、按内容搜索、自动分类、去重。

## 特性

- **隐私保护**：照片本地存储，与系统相册完全隔离
- **AI 智能分类**：多模态模型自动打标签（人物、场景、物体、OCR 文字提取）
- **自然语言搜索**：支持"去年在海边拍的日落"级别语义搜索
- **时间线 + 地图**：EXIF 元数据提取，时空双维度浏览
- **去重引擎**：感知哈希 + 特征向量相似度，识别重复/相似照片
- **端到端加密**：照片不出 iCloud，AI 分析在本地完成

## 原型

当前原型为单文件 HTML/CSS/JS Web 应用，包含以下完整功能：

```
prototype/
  index.html          # 单文件应用（~2200 行）
  images/             # 测试图片集（36 张）
    01.png … 36.png
```

| 功能模块 | 说明 |
|---------|------|
| Grid 相册 | CSS Grid 3 列布局，Material Design 3 风格 |
| 大图浏览 | Hero 动画 Container Transform，左右滑动切换 |
| 时间线 | 按月份分组浏览 |
| 地图视图 | 按拍摄地点聚合 |
| 分类导航 | 人物/风景/文档/宠物/食物 分类筛选 |
| 语义搜索 | 中文自然语言解析（时间+地点+内容） |
| 多选模式 | 批量分享/删除 |
| 收藏 | 右滑收藏 / 取消收藏 |
| AI 模拟 | 多模态标签生成流程演示 |
| 去重模拟 | pHash + 特征向量相似度检测流程 |
| 幻灯片 | Ken Burns 效果全屏放映 |
| 主题切换 | 5 套 MD3 配色方案 |
| PIN 锁屏 | 4 位数字密码保护 |
| 新手引导 | 3 页 onboarding |

## 快速开始

在浏览器中直接打开即可运行（无需构建工具、无需服务器）：

```bash
open prototype/index.html
```

或通过 HTTP 服务获得完整的触摸交互体验：

```bash
cd prototype && python3 -m http.server 8080
# 浏览器打开 http://localhost:8080
```

## 技术栈

| 层 | 技术 |
|------|------|
| iOS 客户端 | SwiftUI + FileManager + iCloud Entitlement |
| 后端 | Vapor (Swift) / Cloudflare Workers |
| AI 推理 | 多模态视觉模型（标签 + OCR + Embedding） |
| 向量检索 | FAISS / USearch |
| 去重 | pHash + 特征向量相似度 |
| 原型设计 | Material Design 3 + CSS Grid |

## 开发方式

全流程 **Agent 驱动开发**：Claude Code 调度 + 多模态推理。工作流覆盖需求分析→架构设计→模块子代理并行实现→代码审查。

## 路线图

- [x] **Phase 0**：Web 原型验证（Grid、时间线、地图、搜索、Lightbox）
- [ ] **Phase 1**：iCloud 同步层 + 基础相册 UI
- [ ] **Phase 2**：多模态分类引擎 + 标签系统
- [ ] **Phase 3**：自然语言语义搜索
- [ ] **Phase 4**：去重引擎
- [ ] **Phase 5**：Web 端（电脑浏览）
- [ ] **Phase 6**：端到端加密 + 隐私保护

## 状态

🚧 原型开发阶段 | 2026 Q3 发布 MVP

## Agent 驱动开发日志

本项目全流程由 Claude Code Agent 驱动：

| 阶段 | 产出 |
|------|------|
| 需求调研 | iCloud API 可行性分析、竞品对比 |
| 方案设计 | 架构设计、技术选型、分阶段路线图 |
| 原型搭建 | 36 张测试图片、完整 UI 交互 |
| Grid 重构 | CSS Grid 布局、零重叠、MD3 风格 |
| 真实图片 | 替换 emoji 占位符、Hero 动画对齐 |

## 开发工具链

- **编辑器**：VS Code + Claude Code 扩展
- **AI 调度**：Claude Code Agent（Explore / Plan / General-Purpose）
- **设计系统**：Material Design 3 + UI UX Pro Max
- **知识管理**：Obsidian

## 许可证

MIT
