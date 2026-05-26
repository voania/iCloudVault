### 鍦?Android Studio 涓繍琛?Momento 鐩稿唽

#### 1. 鎵撳紑椤圭洰

1. 鎵撳紑 Android Studio
2. 閫夋嫨 `Open` 鈫?瀵艰埅鍒?`<Momento 项目目录>\android`
3. 绛夊緟 Gradle 鍚屾瀹屾垚

#### 2. 閰嶇疆妫€鏌?
纭繚浠ヤ笅閰嶇疆姝ｇ‘锛?
**local.properties**锛堝凡閰嶇疆锛夛細
```properties
sdk.dir=C:\\Users\\voania\\AppData\\Local\\Android\\Sdk
```

**build.gradle**锛堥」鐩骇锛夛細
```gradle
buildToolsVersion = "36.1.0"
minSdkVersion = 24
compileSdkVersion = 36
targetSdkVersion = 36
```

#### 3. 杩愯姝ラ

1. **鍚姩 Metro 鏈嶅姟鍣?*锛堢粓绔級锛?```bash
cd <Momento 项目目录>
npx react-native start --port 8081
```

2. **鍚姩妯℃嫙鍣?*锛?   - 鎵撳紑 Android Studio 鐨?Device Manager
   - 閫夋嫨 `Pixel_10_Pro` 妯℃嫙鍣?   - 鐐瑰嚮鍚姩鎸夐挳

3. **杩愯搴旂敤**锛?   - 鍦?Android Studio 涓€夋嫨 `app` 妯″潡
   - 鐐瑰嚮宸ュ叿鏍忕殑 **Run** 鎸夐挳锛堢豢鑹蹭笁瑙掑舰锛?   - 閫夋嫨宸茶繛鎺ョ殑璁惧

#### 4. 鏁呴殰鎺掗櫎

**Gradle 鍚屾澶辫触**锛?- 娓呯悊缂撳瓨锛歚File` 鈫?`Invalidate Caches...` 鈫?`Invalidate and Restart`
- 閲嶆柊鍚屾锛氱偣鍑?`Sync Project with Gradle Files`

**璁惧鏈壘鍒?*锛?- 纭繚妯℃嫙鍣ㄥ凡鍚姩
- 妫€鏌?`adb devices` 鍛戒护杈撳嚭
- 閲嶅惎 ADB锛歚adb kill-server && adb start-server`

**Metro 杩炴帴澶辫触**锛?- 纭繚 Metro 鏈嶅姟鍣ㄥ湪绔彛 8081 杩愯
- 鍦ㄦā鎷熷櫒涓寜 `Ctrl + M`锛圵indows锛夋墦寮€璋冭瘯鑿滃崟
- 閫夋嫨 `Reload` 鎴?`Debug JS Remotely`

#### 5. 椤圭洰缁撴瀯

```
Momento/
鈹溾攢鈹€ android/                    # Android 妯″潡
鈹?  鈹溾攢鈹€ app/                   # 搴旂敤浠ｇ爜
鈹?  鈹溾攢鈹€ build.gradle           # 椤圭洰绾ч厤缃?鈹?  鈹斺攢鈹€ local.properties       # SDK 璺緞
鈹溾攢鈹€ ios/                       # iOS 妯″潡
鈹溾攢鈹€ src/                       # React Native 婧愪唬鐮?鈹?  鈹溾攢鈹€ screens/               # 27 涓睆骞曠粍浠?鈹?  鈹溾攢鈹€ components/            # 30+ UI 缁勪欢
鈹?  鈹溾攢鈹€ services/              # 8 涓湇鍔℃ā鍧?鈹?  鈹溾攢鈹€ store/                 # Zustand 鐘舵€佺鐞?鈹?  鈹斺攢鈹€ navigation/            # React Navigation
鈹斺攢鈹€ package.json               # 渚濊禆閰嶇疆
```

#### 6. 鍔熻兘娓呭崟

| 妯″潡 | 鍔熻兘 |
|------|------|
| 鐓х墖绠＄悊 | 缃戞牸/鏃堕棿绾?鍦板浘/鍒嗙被瑙嗗浘 |
| AI 鍒嗘瀽 | ML Kit 鏍囩/浜鸿劯妫€娴?|
| 缂栬緫鍣?| 璋冩暣/婊ら暅/瑁佸壀/鏍囨敞 |
| 鏁呬簨鐢熸垚 | 鏅鸿兘鍒嗙粍 + 杞満鍔ㄧ敾 |
| 澶囦唤鎭㈠ | JSON 鏍煎紡澶囦唤 |
| 鏍囩绠＄悊 | 鏍囩浜?+ 閲嶅懡鍚?鍚堝苟 |
| 瑙嗛鏀寔 | 鍏ㄥ睆鎾斁鍣?|
| 鎵撳嵃鏈嶅姟 | 6 绉嶅竷灞€閫夋嫨 |

#### 7. 鍚姩鑴氭湰

鍒涘缓 `run_momento.bat` 鍦ㄩ」鐩牴鐩綍锛?
```batch
@echo off
echo Starting Metro server...
start cmd /k "cd <Momento 项目目录> && npx react-native start --port 8081"

echo Waiting for Metro...
timeout /t 5 /nobreak

echo Starting emulator...
start "" "C:\Users\voania\AppData\Local\Android\Sdk\emulator\emulator.exe" -avd Pixel_10_Pro

echo Done! Open Android Studio and run the app.
```

---

**娉ㄦ剰**锛氶娆¤繍琛屽彲鑳介渶瑕佷笅杞介澶栫殑 Gradle 渚濊禆鍜屾瀯寤哄伐鍏凤紝鑰愬績绛夊緟鍗冲彲銆

