# MiMo 相册 — React Native App

## 开发环境
- 项目路径：`C:\Users\voania\Desktop\iCloudVault\MiMoApp`
- Node.js ≥ 22.11，npm 已装
- Java 21：`C:\Program Files\Android\Android Studio\jbr`
- Android SDK：`C:\Users\voania\AppData\Local\Android\Sdk`
- 模拟器：Pixel 10 Pro (AVD 名: `Pixel_10_Pro`)
- Metro：`npx react-native start`，端口 8081

## 快速启动
```bash
cd C:\Users\voania\Desktop\iCloudVault\MiMoApp
# 启动模拟器 + Metro + 构建 + 安装：
cd android && export ANDROID_HOME="C:\Users\voania\AppData\Local\Android\Sdk" && export JAVA_HOME="C:\Program Files\Android\Android Studio\jbr" && bash gradlew assembleDebug
# 模拟器：
C:\Users\voania\AppData\Local\Android\Sdk\emulator\emulator.exe -avd Pixel_10_Pro
# 安装：
C:\Users\voania\AppData\Local\Android\Sdk\platform-tools\adb.exe -s emulator-5554 install android/app/build/outputs/apk/debug/app-debug.apk
```

## 技术栈
React Native 0.85 (New Architecture) · TypeScript 5.9 strict · React Navigation 7 · Zustand 5 · react-native-paper (MD3) · reanimated 4 · Metro

## 项目结构
- `src/screens/` — 23 个屏幕
- `src/components/` — 28 个组件
- `src/store/` — 5 个 Zustand 切片
- `src/ai/` — AI 管线（NLU、dedup、embedding）
- `src/db/` — WatermelonDB schema（mock 阶段）
- `android/` — Android 原生配置

## 关键文件
- `PROJECT_OVERVIEW.md` — 完整项目文档和接口速查
- `src/types/index.ts` — 所有 TS 类型定义
- `src/navigation/RootNavigator.tsx` — 导航结构
- `src/store/settingsStore.ts` — 设置（主题/PIN/网格列数）

## 已知修改
- `android/build.gradle`：buildTools 36.1.0, compileSdk/targetSdk 36
- `android/gradle/wrapper/gradle-wrapper.properties`：Gradle 8.13 阿里云镜像
- `android/settings.gradle`：添加了阿里云 Maven 镜像
- `src/store/settingsStore.ts`：onboardingComplete 默认 false

## Phase 当前进度
Phase 1 完成，Phase 2 进行中（真实照片/相机/EXIF）
