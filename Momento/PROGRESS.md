# Momento 代码改善进度

更新时间：2026-05-26

## 当前目标

围绕大图库相册体验做性能专项改善，优先降低首屏渲染、长列表滚动、图片缓存、导入、AI 分析、去重扫描、批量写库带来的卡顿和内存压力。

## 已完成

### 1. 基础健康与启动稳定

- 修复跨平台清理脚本，新增 `scripts/clean.js`。
- `package.json` 的 `clean`、`clean:android`、`clean:ios` 改为 Node 脚本。
- 修正 `PROJECT_OVERVIEW.md` 顶部技术栈版本，和实际依赖保持一致。
- 优化 `useAppInit`，先完成设置加载和照片水合再进入 UI，减少启动后数据二次覆盖。

主要文件：

- `package.json`
- `scripts/clean.js`
- `PROJECT_OVERVIEW.md`
- `src/hooks/useAppInit.ts`

### 2. 主网格渲染与缩略图预取

- `GridScreen` 改为复用 `usePhotos`，移除重复过滤/排序逻辑。
- `PhotoGrid` 增加稳定 `extraData`、`drawDistance`，并让传入 `style` 生效。
- 缩略图预取改成“优先可见项 + 每批限量”，减少快速滚动时的预取堆积。

主要文件：

- `src/screens/GridScreen.tsx`
- `src/components/photo/PhotoGrid.tsx`
- `src/hooks/usePhotos.ts`
- `src/utils/thumbnailCache.ts`

### 3. 导入与内存压力控制

- 导入服务在批次之间让出 UI，避免大批量导入时长时间占用 JS 线程。
- 图片缓存和缩略图缓存增加主动 trim 能力。
- `memoryManager` 监听 `memoryWarning`，系统内存压力升高时主动收缩缓存。
- `PhotoCard` 接入图片内存追踪。

主要文件：

- `src/services/photoImport/PhotoImportService.ts`
- `src/hooks/usePhotoImport.ts`
- `src/utils/imageCache.ts`
- `src/utils/thumbnailCache.ts`
- `src/utils/memoryManager.ts`
- `src/components/photo/PhotoCard.tsx`

### 4. 查询层与按 id 查找优化

- 新增 `photoQuery` 工具层，集中处理照片筛选、排序、搜索文本缓存、按月分组、按地点分组。
- `usePhotos` 和 `photoStore.getFilteredPhotos()` 改为复用同一查询逻辑。
- `photoStore` 新增 `photoMap`，按 id 查找从 O(n) 变为 O(1)。
- 多个页面从 `photos.find(...)` 切换为 `photoMap.get(...)`。

主要文件：

- `src/utils/photoQuery.ts`
- `src/hooks/usePhotos.ts`
- `src/store/photoStore.ts`
- `src/screens/AlbumDetailScreen.tsx`
- `src/screens/CollageScreen.tsx`
- `src/screens/CompareScreen.tsx`
- `src/screens/DiscoveryScreen.tsx`
- `src/screens/EditPanelScreen.tsx`
- `src/screens/SlideshowScreen.tsx`
- `src/screens/VersionHistoryScreen.tsx`
- `src/components/overlays/ShareSheet.tsx`

### 5. 增量加载与布局级分页

- `PhotoGrid` 改为先渲染一批照片，滚动到底再追加。
- 新增 `useIncrementalList`，复用在相册详情、收藏、隐藏、回收站等页面。
- `PhotosScreen` 的故事墙/微缩时间线改为布局级增量构建，避免一次性为全部照片生成 layout。
- Lightbox 仍保留完整照片 id 列表，不影响大图浏览序列。

主要文件：

- `src/components/photo/PhotoGrid.tsx`
- `src/hooks/useIncrementalList.ts`
- `src/screens/AlbumDetailScreen.tsx`
- `src/screens/FavoritesScreen.tsx`
- `src/screens/HiddenScreen.tsx`
- `src/screens/TrashScreen.tsx`
- `src/screens/PhotosScreen.tsx`

### 6. 后台任务调度

- 新增 `backgroundTask` 工具，统一提供空闲等待、后台让步、可取消 controller。
- AI pipeline 每处理小批照片后让出 UI，停止时可取消。
- 去重扫描新增异步版本，O(n^2) 扫描分批执行并支持取消。
- 去重弹窗增加扫描进度。
- 修复 AI 分析错误时进度不推进的问题。

主要文件：

- `src/utils/backgroundTask.ts`
- `src/ai/pipeline.ts`
- `src/ai/dedup.ts`
- `src/components/overlays/DedupOverlay.tsx`
- `src/store/aiStore.ts`
- `src/services/photoImport/PhotoImportService.ts`

### 7. 批量写入与批量 Store 更新

- 数据库接口新增 `insertPhotos` 和 `updatePhotos`。
- MockDB 和 WatermelonDB 都实现批量写入。
- 导入照片改为批量 insert。
- 批量收藏、删除、隐藏改为批量 update。
- AI pipeline 合并每小批照片更新，减少 React store 通知次数。
- 标签重命名、合并、删除改为批量更新。

主要文件：

- `src/db/database.ts`
- `src/db/WatermelonDatabase.ts`
- `src/store/photoStore.ts`
- `src/ai/pipeline.ts`
- `src/services/tags/TagService.ts`

### 8. 核心性能逻辑测试

- 新增 `photoQuery` 单元测试，覆盖筛选、搜索、排序、limit、分组和缓存命中。
- 新增 `photoStore` 批量路径测试，覆盖 `addPhotos`、`updatePhotos` 和 `photoMap` 更新。
- 测试重点放在纯逻辑和 store 层，避免依赖原生运行环境。

主要文件：

- `__tests__/photoQuery.test.ts`
- `__tests__/photoStore.test.ts`

### 9. 照片页缩放流畅度

- `PhotosScreen` 的 pinch 手势增加 UI 线程上的轻量缩放预览。
- 缩放过程中不触发 JS 重布局，只通过 shared value 对照片墙整体做 scale/opacity 动画。
- 缩放结束后通过 `InteractionManager.runAfterInteractions` 延后提交模式切换、列数变化或 row height 变化，减少手势结束瞬间掉帧。
- FlatList 外层增加 `Animated.View` 承载缩放预览。

主要文件：

- `src/screens/PhotosScreen.tsx`

## 验证结果

最近一次验证：

```powershell
npm.cmd run typecheck
npm.cmd test -- --runInBand
```

结果：

- TypeScript 检查通过。
- Jest 测试通过。
- 当前测试套件：3 个测试套件通过，7 个测试通过。

## 预期收益

- 大图库首屏压力降低：主网格、相册详情、收藏、隐藏、回收站、照片墙均已增量渲染。
- 长时间滚动更稳：缩略图预取限流，缓存支持内存压力修剪。
- 导入更不容易卡 UI：批次间让出 UI，并批量写入数据库。
- AI/去重不再长时间独占 JS 线程：后台任务分批执行，支持取消。
- 批量操作更轻：减少 store 更新次数和 DB 写事务次数。

## 剩余建议

1. 给大图库场景补性能基准脚本，例如 1k、5k、10k mock photos 的首屏时间、滚动 FPS、内存峰值。
2. 继续把 `PhotosScreen` 中的大组件拆分成更小模块，降低维护难度。
3. 考虑给 WatermelonDB 增加真实分页查询，进一步减少启动时全量读取。
4. 清理项目中文乱码问题，统一文档和源码注释编码。
5. 为 AI pipeline、去重扫描、批量 DB 写入继续补更细的单元测试和集成测试。
