@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

title Momento App Launcher
echo ===============================================
echo          Momento 鐩稿唽 - React Native 鍚姩鑴氭湰
echo ===============================================
echo.

set "PROJECT_DIR=%~dp0"
if "%PROJECT_DIR:~-1%"=="\" set "PROJECT_DIR=%PROJECT_DIR:~0,-1%"
set "ANDROID_HOME=C:\Users\voania\AppData\Local\Android\Sdk"
set "EMULATOR_AVD=Pixel_10_Pro"
set "METRO_PORT=8081"

rem 璁剧疆鐜鍙橀噺
set "PATH=%ANDROID_HOME%\platform-tools;%ANDROID_HOME%\emulator;%PATH%"

echo [1/4] 妫€鏌ラ」鐩洰褰?..
if not exist "%PROJECT_DIR%\package.json" (
    echo 鉂?閿欒锛氶」鐩洰褰曚笉瀛樺湪
    pause
    exit /b 1
)
echo 鉁?椤圭洰鐩綍姝ｅ父

echo.
echo [2/4] 鍚姩 Metro 鏈嶅姟鍣?..
start "Metro Server" cmd /k "cd %PROJECT_DIR% && npx react-native start --port %METRO_PORT%"

echo 鈴?绛夊緟 Metro 鍚姩...
timeout /t 10 /nobreak >nul

echo.
echo [3/4] 鍚姩 Android 妯℃嫙鍣?..
echo 姝ｅ湪鍚姩 %EMULATOR_AVD%...
start "Emulator" "%ANDROID_HOME%\emulator\emulator.exe" -avd %EMULATOR_AVD% -no-boot-anim

echo 鈴?绛夊緟妯℃嫙鍣ㄥ惎鍔?..
timeout /t 30 /nobreak >nul

echo.
echo [4/4] 瀹夎骞惰繍琛屽簲鐢?..
cd %PROJECT_DIR%

:WAIT_FOR_DEVICE
echo 妫€鏌ヨ澶囪繛鎺?..
adb devices | findstr /r "^emulator.*device$" >nul
if errorlevel 1 (
    echo 鈴?绛夊緟璁惧灏辩华...
    timeout /t 10 /nobreak >nul
    goto WAIT_FOR_DEVICE
)
echo 鉁?璁惧宸茶繛鎺?
echo 瀹夎搴旂敤...
npx react-native run-android --port %METRO_PORT%

echo.
echo ===============================================
echo                    鍚姩瀹屾垚锛?echo ===============================================
echo.
echo 濡傛灉搴旂敤鏈嚜鍔ㄥ惎鍔細
echo 1. 纭繚妯℃嫙鍣ㄥ凡瀹屽叏鍚姩
echo 2. 鍦ㄦā鎷熷櫒涓墦寮€ Momento 搴旂敤
echo 3. 鎸?Ctrl+M 鎵撳紑璋冭瘯鑿滃崟锛岄€夋嫨 Reload
echo.
pause
