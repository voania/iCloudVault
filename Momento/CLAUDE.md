# Momento 鐩稿唽 鈥?React Native App

## 寮€鍙戠幆澧?- 椤圭洰璺緞锛歚<Momento 项目目录>`
- Node.js 鈮?22.11锛宯pm 宸茶
- Java 17锛堟瀯寤虹敤锛夛細`C:\Program Files\Microsoft\jdk-17.0.19.10-hotspot`
- Java 21锛圓ndroid Studio JBR锛夛細`C:\Program Files\Android\Android Studio\jbr`锛圓GP 7.4.2 涓嶅吋瀹癸紝鏋勫缓璇风敤 JDK 17锛?- Android SDK锛歚C:\Users\voania\AppData\Local\Android\Sdk`
- 妯℃嫙鍣細Pixel 10 Pro (AVD 鍚? `Pixel_10_Pro`)
- Metro锛歚npx react-native start`锛岀鍙?8081

## 蹇€熷惎鍔?```bash
cd <Momento 项目目录>
# 鍚姩妯℃嫙鍣?+ Metro + 鏋勫缓 + 瀹夎锛?cd android && export ANDROID_HOME="C:\Users\voania\AppData\Local\Android\Sdk" && export JAVA_HOME="C:\Program Files\Microsoft\jdk-17.0.19.10-hotspot" && bash gradlew assembleDebug
# 妯℃嫙鍣細
C:\Users\voania\AppData\Local\Android\Sdk\emulator\emulator.exe -avd Pixel_10_Pro
# 瀹夎锛?C:\Users\voania\AppData\Local\Android\Sdk\platform-tools\adb.exe -s emulator-5554 install android/app/build/outputs/apk/debug/app-debug.apk
```

## 鎶€鏈爤
React Native 0.72.10 (Hermes, old arch) 路 TypeScript 5.4 路 React Navigation 6 路 Zustand 4 路 react-native-paper 5 (MD3) 路 reanimated 3.5 路 Metro

## 椤圭洰缁撴瀯
- `src/screens/` 鈥?23 涓睆骞?- `src/components/` 鈥?28 涓粍浠?- `src/store/` 鈥?5 涓?Zustand 鍒囩墖
- `src/ai/` 鈥?AI 绠＄嚎锛圢LU銆乨edup銆乪mbedding锛?- `src/db/` 鈥?WatermelonDB schema锛坢ock 闃舵锛?- `android/` 鈥?Android 鍘熺敓閰嶇疆

## 鍏抽敭鏂囦欢
- `PROJECT_OVERVIEW.md` 鈥?瀹屾暣椤圭洰鏂囨。鍜屾帴鍙ｉ€熸煡
- `src/types/index.ts` 鈥?鎵€鏈?TS 绫诲瀷瀹氫箟
- `src/navigation/RootNavigator.tsx` 鈥?瀵艰埅缁撴瀯
- `src/store/settingsStore.ts` 鈥?璁剧疆锛堜富棰?PIN/缃戞牸鍒楁暟锛?
## 宸茬煡淇敼
- `android/build.gradle`锛歜uildTools 36.1.0, compileSdk/targetSdk 36
- `android/gradle/wrapper/gradle-wrapper.properties`锛欸radle 8.13 闃块噷浜戦暅鍍?- `android/settings.gradle`锛氭坊鍔犱簡闃块噷浜?Maven 闀滃儚
- `android/gradle.properties`锛氬惎鐢?Jetifier锛坧ush-notification 鐨勬棫 support 搴撯啋AndroidX锛?- `src/store/settingsStore.ts`锛歁MKV 鎸佷箙鍖栵紙闇€ nitro-modules 鐩存帴渚濊禆锛?- `package.json`锛氭坊鍔?react-native-nitro-modules 涓虹洿鎺ヤ緷璧栵紙mmkv 鐨勪紶閫掍緷璧栦笉琚嚜鍔ㄩ摼鎺ワ級

## Phase 褰撳墠杩涘害
- **Masonry 鐎戝竷娴?*锛圥hase 1-4锛夛細鍏ㄩ儴瀹屾垚 鉁?- **瑙嗛鎾斁 & 瀹炲喌鐓х墖浼樺寲**锛? Phase锛夛細**Phase 1-5锛堝惈缂╃暐鍥鹃鍔犺浇銆佸姩鎬佺収鐗囩湡鏈哄鍏ヤ笌 AI 鍘婚噸鎵撻€氾級鍏ㄩ儴瀹屾垚 鉁?*
- 璇︾粏璁″垝瑙侊細`C:\Users\voania\.claude\plans\structured-jumping-sifakis.md` 鍜?[walkthrough.md](file:///C:/Users/voania/.gemini/antigravity/brain/705dcedc-97bf-4d44-afe6-408d457241fb/walkthrough.md)

**鏋勫缓**: 蹇呴』鐢?JDK 17锛坄C:/Program Files/Microsoft/jdk-17.0.19.10-hotspot`锛夛紝JDK 21 涓嶅吋瀹?AGP 7.4.2


