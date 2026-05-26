# Momento 鐩稿唽 鈥?React Native 椤圭洰鎬昏

**160+ 婧愭枃浠?路 25000+ 琛?TypeScript 路 strict 妯″紡 路 闆剁紪璇戦敊璇?*

## 鎶€鏈爤

| 灞?| 鎶€鏈?| 鐗堟湰 |
|---|------|------|
| 妗嗘灦 | React Native | 0.72.10 |
| 璇█ | TypeScript | 5.4.3 |
| 瀵艰埅 | React Navigation (native-stack + bottom-tabs) | 6.x |
| 鐘舵€佺鐞?| Zustand (5 鍒囩墖) | 4.5.x |
| UI 缁勪欢搴?| react-native-paper (MD3) | 5.11.1 |
| 鍔ㄧ敾 | react-native-reanimated | 3.5.0 |
| 鎵嬪娍 | react-native-gesture-handler | 2.14.x |
| 鍥剧墖閫夋嫨 | react-native-image-picker | 5.6.x |
| 鍥剧墖缂╂斁 | @bam.tech/react-native-image-resizer | 3.x |
| 鏁版嵁搴?| @nozbe/watermelondb (SQLite) | latest |
| KV 瀛樺偍 | react-native-mmkv | latest |
| 鍥炬爣 | react-native-vector-icons | 10.x |
| 瑙︽劅鍙嶉 | react-native-haptic-feedback | latest |
| AI 鏍囩 | @react-native-ml-kit/image-labeling | latest |
| AI 浜鸿劯 | @react-native-ml-kit/face-detection | latest |
| 鍥惧儚澶勭悊 | @shopify/react-native-skia | latest |
| 鍦板浘 | react-native-maps | latest |
| 鍒嗕韩 | react-native-share | latest |
| AI 鎺ㄧ悊 | Google ML Kit + TFLite | 鉁?宸叉帴鍏?|

## 椤圭洰缁撴瀯

```
Momento/
鈹溾攢鈹€ App.tsx                          # GestureHandler 鈫?SafeArea 鈫?Paper 鈫?Theme 鈫?Navigation
鈹溾攢鈹€ index.js                         # RN 鍏ュ彛
鈹溾攢鈹€ babel.config.js                  # reanimated plugin
鈹溾攢鈹€ tsconfig.json                    # strict + baseUrl paths
鈹溾攢鈹€ package.json
鈹溾攢鈹€ PROJECT_OVERVIEW.md              # 鏈枃浠?鈹溾攢鈹€ src/
鈹?  鈹溾攢鈹€ types/
鈹?  鈹?  鈹溾攢鈹€ index.ts                 # Photo, Album, ExifData, EditState, AiAnalysisResult...
鈹?  鈹?  鈹斺攢鈹€ react-native-push-notification.d.ts # 绗笁鏂瑰簱绫诲瀷琛ヤ竵 + TextEncoder
鈹?  鈹溾攢鈹€ store/
鈹?  鈹?  鈹溾攢鈹€ index.ts                 # barrel
鈹?  鈹?  鈹溾攢鈹€ photoStore.ts            # CRUD + 绛涢€?+ 鎺掑簭 + 澶氶€?+ 鎵归噺鎿嶄綔
鈹?  鈹?  鈹溾攢鈹€ albumStore.ts            # CRUD + 鏅鸿兘鐩稿唽瑙勫垯寮曟搸
鈹?  鈹?  鈹溾攢鈹€ uiStore.ts               # Toast / Modal / Overlay / FAB / search / storyCache
鈹?  鈹?  鈹溾攢鈹€ settingsStore.ts         # 涓婚 / 鍒楁暟 / PIN / 鎼滅储鍘嗗彶
鈹?  鈹?  鈹斺攢鈹€ aiStore.ts               # AI 绠＄嚎鐘舵€?+ 缁撴灉 Map
鈹?  鈹溾攢鈹€ db/
鈹?  鈹?  鈹溾攢鈹€ index.ts                 # barrel
鈹?  鈹?  鈹溾攢鈹€ schema.ts                # WatermelonDB 7 琛?schema
鈹?  鈹?  鈹溾攢鈹€ database.ts              # IDatabase 鎺ュ彛 + MockDatabase 瀹炵幇
鈹?  鈹?  鈹溾攢鈹€ migrations.ts            # 杩佺Щ妗嗘灦
鈹?  鈹?  鈹斺攢鈹€ models/
鈹?  鈹?      鈹溾攢鈹€ index.ts             # barrel
鈹?  鈹?      鈹溾攢鈹€ Photo.ts             # photoToRecord / recordToPhoto
鈹?  鈹?      鈹溾攢鈹€ Album.ts             # albumToRecord / recordToAlbum
鈹?  鈹?      鈹斺攢鈹€ FaceGroup.ts         # FaceGroup 搴忓垪鍖?鈹?  鈹溾攢鈹€ services/
鈹?  鈹?  鈹溾攢鈹€ photoImport/             # 鉁?鐓х墖瀵煎叆鏈嶅姟灞傦紙閫傞厤鍣ㄦā寮忥級
鈹?  鈹?  鈹?  鈹溾攢鈹€ types.ts             # IPhotoPicker / IThumbnailGenerator / IExifParser / IColorExtractor
鈹?  鈹?  鈹?  鈹溾攢鈹€ ImagePickerAdapter.ts # react-native-image-picker 閫傞厤
鈹?  鈹?  鈹?  鈹溾攢鈹€ ThumbnailGenerator.ts # @bam.tech/react-native-image-resizer 閫傞厤
鈹?  鈹?  鈹?  鈹溾攢鈹€ ExifParserAdapter.ts  # EXIF 鍏冩暟鎹В鏋愶紙iOS/Android 鍘熺敓鏍煎紡锛?鈹?  鈹?  鈹?  鈹溾攢鈹€ SkiaColorExtractor.ts # @shopify/react-native-skia 鍍忕礌閲囨牱涓昏壊鎻愬彇
鈹?  鈹?  鈹?  鈹溾攢鈹€ FallbackColorExtractor.ts # 涓昏壊鎻愬彇 fallback
鈹?  鈹?  鈹?  鈹溾攢鈹€ PhotoImportService.ts # 缂栨帓灞傦細閫夋嫨 鈫?缂╃暐鍥?鈫?EXIF 鈫?棰滆壊 鈫?Photo
鈹?  鈹?  鈹?  鈹溾攢鈹€ factory.ts           # 宸ュ巶鍑芥暟锛屾敮鎸佷緷璧栬鐩?鈹?  鈹?  鈹?  鈹斺攢鈹€ index.ts             # barrel
鈹?  鈹?  鈹溾攢鈹€ faceCluster/             # 鉁?浜鸿劯鑱氱被鏈嶅姟灞?鈹?  鈹?  鈹?  鈹溾攢鈹€ FaceClusterService.ts # IFaceClusterService + 鑱氱被/鍛藉悕/鍚堝苟/鎷嗗垎
鈹?  鈹?  鈹?  鈹斺攢鈹€ index.ts             # barrel
鈹?  鈹?  鈹溾攢鈹€ haptics/                 # 鉁?瑙︽劅鍙嶉鏈嶅姟
鈹?  鈹?  鈹?  鈹斺攢鈹€ index.ts             # triggerHaptic + 7 绉嶈Е鎰熺被鍨?鈹?  鈹?  鈹溾攢鈹€ backup/                  # 鉁?澶囦唤鎭㈠鏈嶅姟
鈹?  鈹?  鈹?  鈹溾攢鈹€ types.ts             # IBackupService / BackupData / BackupMeta / BackupProgress
鈹?  鈹?  鈹?  鈹溾攢鈹€ JsonBackupService.ts # JSON 鏍煎紡澶囦唤 + RNFS 鏂囦欢鍐欏叆 + 鍐呭瓨 fallback
鈹?  鈹?  鈹?  鈹斺攢鈹€ index.ts             # barrel
鈹?  鈹?  鈹溾攢鈹€ stories/                 # 鉁?鏁呬簨鐢熸垚鏈嶅姟
鈹?  鈹?  鈹?  鈹溾攢鈹€ types.ts             # IStoryGenerator / Story / StorySlide / StoryLayout
鈹?  鈹?  鈹?  鈹溾攢鈹€ StoryGenerator.ts    # 鏅鸿兘鍒嗙粍 + 杞満閫夋嫨 + 鏃堕暱璁＄畻 + 鏍囬鐢熸垚
鈹?  鈹?  鈹?  鈹斺攢鈹€ index.ts             # barrel
鈹?  鈹?  鈹溾攢鈹€ tags/                    # 鉁?鏍囩绠＄悊鏈嶅姟
鈹?  鈹?  鈹?  鈹溾攢鈹€ types.ts             # ITagService / TagInfo
鈹?  鈹?  鈹?  鈹溾攢鈹€ TagService.ts        # CRUD + 閲嶅懡鍚?鍚堝苟/鍒犻櫎 + 寤鸿 + 鐑棬
鈹?  鈹?  鈹?  鈹斺攢鈹€ index.ts             # barrel
鈹?  鈹?  鈹溾攢鈹€ mapClustering/           # 鉁?鍦板浘鑱氬悎鏈嶅姟
鈹?  鈹?  鈹?  鈹溾攢鈹€ types.ts             # IMapClusterService / Cluster / ClusterItem / GeoPoint
鈹?  鈹?  鈹?  鈹溾攢鈹€ GridClusterService.ts # 缃戞牸鑱氱被绠楁硶 + 缂╂斁鑷€傚簲
鈹?  鈹?  鈹?  鈹斺攢鈹€ index.ts             # barrel
鈹?  鈹?  鈹溾攢鈹€ video/                   # 鉁?瑙嗛鏀寔鏈嶅姟
鈹?  鈹?  鈹?  鈹溾攢鈹€ types.ts             # IVideoThumbnailService / IVideoMetadataService / VideoMetadata
鈹?  鈹?  鈹?  鈹溾攢鈹€ VideoThumbnailService.ts # 瑙嗛甯ф埅鍙?鈹?  鈹?  鈹?  鈹溾攢鈹€ VideoMetadataService.ts  # 瑙嗛鍏冩暟鎹鍙?鈹?  鈹?  鈹?  鈹斺攢鈹€ index.ts             # barrel
鈹?  鈹?  鈹溾攢鈹€ print/                   # 鉁?鎵撳嵃鏈嶅姟
鈹?  鈹?  鈹?  鈹溾攢鈹€ types.ts             # IPrintService / PrintLayout / PrintOptions
鈹?  鈹?  鈹?  鈹溾攢鈹€ ReactNativePrintService.ts # react-native-print 閫傞厤
鈹?  鈹?  鈹?  鈹斺攢鈹€ index.ts             # barrel
鈹?  鈹?  鈹溾攢鈹€ filters/                 # 鉁?婊ら暅鏈嶅姟
鈹?  鈹?  鈹?  鈹斺攢鈹€ index.ts             # 7 绉?Skia ColorMatrix 婊ら暅
鈹?  鈹?  鈹溾攢鈹€ biometrics/              # 鉁?鐢熺墿璇嗗埆鏈嶅姟
鈹?  鈹?  鈹?  鈹斺攢鈹€ index.ts             # react-native-biometrics 閫傞厤
鈹?  鈹?  鈹溾攢鈹€ notifications/           # 鉁?閫氱煡璋冨害鏈嶅姟
鈹?  鈹?  鈹?  鈹斺攢鈹€ index.ts             # react-native-push-notification 璁板繂鎺ㄩ€?鈹?  鈹?  鈹溾攢鈹€ memories/                # 鉁?璁板繂鏈嶅姟
鈹?  鈹?  鈹?  鈹斺攢鈹€ index.ts             # 閭ｅ勾浠婂ぉ + 瀛ｈ妭鍥炲繂 + 鍦扮偣鍥炲繂
鈹?  鈹?  鈹溾攢鈹€ deepLinking/             # 鉁?娣卞害閾炬帴
鈹?  鈹?  鈹?  鈹斺攢鈹€ index.ts             # momento:// 鍗忚瑙ｆ瀽
鈹?  鈹?  鈹溾攢鈹€ accessibility/           # 鉁?鏃犻殰纰?鈹?  鈹?  鈹?  鈹斺攢鈹€ index.ts             # 杈呭姪灞炴€у伐鍏?鈹?  鈹?  鈹斺攢鈹€ share/                   # 鉁?鍒嗕韩鏈嶅姟
鈹?  鈹?      鈹斺攢鈹€ index.ts             # react-native-share 閫傞厤
鈹?  鈹溾攢鈹€ navigation/
鈹?  鈹?  鈹溾攢鈹€ index.ts                 # barrel
鈹?  鈹?  鈹溾攢鈹€ types.ts                 # 瀵艰埅鍙傛暟宸ュ叿绫诲瀷
鈹?  鈹?  鈹溾攢鈹€ RootNavigator.tsx        # Lock 鈫?Onboarding 鈫?Main(6 tabs) 鈫?18 瀛愰〉闈?鈹?  鈹?  鈹斺攢鈹€ TabNavigator.tsx         # 6 鏍囩搴曢儴瀵艰埅
鈹?  鈹溾攢鈹€ screens/                     # 27 涓睆骞?鈹?  鈹?  鈹溾攢鈹€ GridScreen.tsx           # 鉁?缃戞牸 + 鎼滅储 + 绛涢€?+ 閫夋嫨 + FAB + 4 瑕嗙洊灞?鈹?  鈹?  鈹溾攢鈹€ DiscoveryScreen.tsx      # 鉁?鍙戠幇椤碉紙鍥炲繂/鏁呬簨/鏍囩/鍦扮偣/鍒嗙被/绮鹃€夛級
鈹?  鈹?  鈹溾攢鈹€ LockScreen.tsx           # 鉁?4 浣?PIN 閿洏 + 鐢熺墿璇嗗埆 + 閿欒鍔ㄧ敾
鈹?  鈹?  鈹溾攢鈹€ OnboardingScreen.tsx     # 鉁?3 椤靛紩瀵?+ 椤甸潰鎸囩ず鍣?鈹?  鈹?  鈹溾攢鈹€ LightboxScreen.tsx       # 鉁?FlatList 姘村钩婊戝姩 + PinchZoom + 鎵撳嵃
鈹?  鈹?  鈹溾攢鈹€ TimelineScreen.tsx       # 鉁?鎸夋湀鍒嗙粍 + sticky headers + 琛屽竷灞€
鈹?  鈹?  鈹溾攢鈹€ MapScreen.tsx            # 鉁?鍦板浘鑱氬悎鏍囪 + 缂╃暐鍥?+ 搴曢儴鍦扮偣鍒楄〃
鈹?  鈹?  鈹溾攢鈹€ CategoryScreen.tsx       # 鉁?鎸?AI 鍒嗙被鑱氬悎 + 姣忕被鍐呰甯冨眬
鈹?  鈹?  鈹溾攢鈹€ TrashScreen.tsx          # 鉁?鎭㈠/褰诲簳鍒犻櫎/娓呯┖ + 30澶╁€掕鏃?鈹?  鈹?  鈹溾攢鈹€ EditPanelScreen.tsx      # 鉁?4 鏍囩缂栬緫鍣紙璋冩暣/婊ら暅/瑁佸壀/鏍囨敞锛? 鐗堟湰淇濆瓨
鈹?  鈹?  鈹溾攢鈹€ SettingsScreen.tsx       # 鉁?鍏ㄩ〉锛氫富棰?鍒楁暟/PIN/鐢熺墿/鍏充簬
鈹?  鈹?  鈹溾攢鈹€ AlbumDetailScreen.tsx    # 鉁?鐩稿唽鍐呯収鐗囩綉鏍?鈹?  鈹?  鈹溾攢鈹€ AlbumsScreen.tsx         # 鉁?鐩稿唽鍒楄〃 + 鍒涘缓瀵硅瘽妗?鈹?  鈹?  鈹溾攢鈹€ PeopleScreen.tsx         # 鉁?浜鸿劯鑱氱被姒傝 + 鍛藉悕 + FaceClusterService
鈹?  鈹?  鈹溾攢鈹€ FaceGroupDetailScreen.tsx # 鉁?浜鸿劯鑱氱被璇︽儏 + 鎸?groupId 杩囨护
鈹?  鈹?  鈹溾攢鈹€ HiddenScreen.tsx         # 鉁?闅愯棌鐓х墖缃戞牸 + 鍙栨秷闅愯棌
鈹?  鈹?  鈹溾攢鈹€ FavoritesScreen.tsx      # 鉁?鏀惰棌鐓х墖缃戞牸
鈹?  鈹?  鈹溾攢鈹€ SlideshowScreen.tsx      # 鉁?Ken Burns 鍔ㄧ敾骞荤伅鐗?+ 鎾斁/鏆傚仠
鈹?  鈹?  鈹溾攢鈹€ CollageScreen.tsx        # 鉁?鎷煎浘鍒朵綔锛?-9 寮狅紝闂磋窛/鍦嗚鍙皟锛?鈹?  鈹?  鈹溾攢鈹€ VersionHistoryScreen.tsx # 鉁?缂栬緫鐗堟湰鍘嗗彶娴忚/鎭㈠/鍒犻櫎
鈹?  鈹?  鈹溾攢鈹€ StorageDashboardScreen.tsx # 鉁?瀛樺偍缁熻 + 鍒嗙被鍗犵敤 + 娓呯悊寤鸿
鈹?  鈹?  鈹溾攢鈹€ SearchResultsScreen.tsx  # 鉁?璇箟鎼滅储缁撴灉椤?+ 璇勫垎鎺掑簭
鈹?  鈹?  鈹溾攢鈹€ StoryViewerScreen.tsx    # 鉁?鍏ㄥ睆鏁呬簨鎾斁鍣?+ 杞満鍔ㄧ敾 + 杩涘害鏉?鈹?  鈹?  鈹溾攢鈹€ TagsScreen.tsx           # 鉁?鏍囩绠＄悊 + 鏍囩浜?+ 閲嶅懡鍚?鍚堝苟/鍒犻櫎
鈹?  鈹?  鈹溾攢鈹€ VideoPlayerScreen.tsx    # 鉁?鍏ㄥ睆瑙嗛鎾斁鍣?+ 杩涘害鏉?+ 鎺у埗鏍?鈹?  鈹?  鈹斺攢鈹€ CompareScreen.tsx        # 鉁?婊戝姩鍒嗗睆瀵规瘮
鈹?  鈹溾攢鈹€ components/
鈹?  鈹?  鈹溾攢鈹€ photo/
鈹?  鈹?  鈹?  鈹溾攢鈹€ PhotoCard.tsx        # 鏍囩/鏀惰棌/閫変腑閬僵/memo + 瑙嗛鏍囪瘑
鈹?  鈹?  鈹?  鈹溾攢鈹€ PhotoGrid.tsx        # FlatList numColumns + 鍔ㄦ€佸崱灏哄
鈹?  鈹?  鈹?  鈹溾攢鈹€ DateGroupHeader.tsx  # 鏈堜唤鍒嗙粍澶?鈹?  鈹?  鈹?  鈹斺攢鈹€ VideoIndicator.tsx   # 瑙嗛鎾斁鏍囪瘑锛堚柖 + 鏃堕暱锛?鈹?  鈹?  鈹溾攢鈹€ lightbox/
鈹?  鈹?  鈹?  鈹溾攢鈹€ LightboxImage.tsx    # 鎹忓悎缂╂斁 + 鍙屽嚮 + 鎷栨嫿鍏抽棴 (reanimated)
鈹?  鈹?  鈹?  鈹溾攢鈹€ LightboxFooter.tsx   # 鍏冩暟鎹?+ 缂栬緫/鏀惰棌/鍒嗕韩/鎵撳嵃/鍒犻櫎鎸夐挳
鈹?  鈹?  鈹?  鈹溾攢鈹€ ExifCard.tsx         # EXIF 淇℃伅缃戞牸锛?1 涓瓧娈碉級
鈹?  鈹?  鈹?  鈹斺攢鈹€ EditPanel/
鈹?  鈹?  鈹?      鈹溾攢鈹€ AdjustTab.tsx    # 浜害/瀵规瘮搴?楗卞拰搴?(鈭?+ 鎸夐挳)
鈹?  鈹?  鈹?      鈹溾攢鈹€ FilterTab.tsx    # 8 绉嶆护闀滈璁撅紙鏆栬壊/鍐疯壊/榛戠櫧...锛?鈹?  鈹?  鈹?      鈹溾攢鈹€ CropTab.tsx      # 5 绉嶈鍒囨瘮渚?+ 鏃嬭浆鎸夐挳
鈹?  鈹?  鈹?      鈹斺攢鈹€ DrawTab.tsx      # 8 鑹?+ 4 绗斿埛澶у皬 + 娓呴櫎/淇濆瓨
鈹?  鈹?  鈹溾攢鈹€ search/
鈹?  鈹?  鈹?  鈹溾攢鈹€ SearchBar.tsx        # 鎼滅储鏍?+ 鍙栨秷鎸夐挳
鈹?  鈹?  鈹?  鈹溾攢鈹€ SearchSuggestions.tsx # 鎼滅储鍘嗗彶 + 鎺ㄨ崘鏌ヨ
鈹?  鈹?  鈹?  鈹斺攢鈹€ SemanticChips.tsx    # 鉁?鏌ヨ瑙ｆ瀽鑺墖锛堟椂闂?鍦扮偣/鍐呭/鍒嗙被/瀛ｈ妭锛?鈹?  鈹?  鈹溾攢鈹€ filter/
鈹?  鈹?  鈹?  鈹溾攢鈹€ FilterRow.tsx        # 鍒嗙被 + 鏀惰棌绛涢€夋粴鍔ㄦ潯
鈹?  鈹?  鈹?  鈹斺攢鈹€ FilterChip.tsx       # MD3 chip
鈹?  鈹?  鈹溾攢鈹€ overlays/
鈹?  鈹?  鈹?  鈹溾攢鈹€ AiOverlay.tsx        # AI 绠＄嚎杩涘害鏉?+ 寮€濮?鏆傚仠
鈹?  鈹?  鈹?  鈹溾攢鈹€ DedupOverlay.tsx     # 鍘婚噸鎵弿 + 鐩镐技搴?+ 鏍囪
鈹?  鈹?  鈹?  鈹溾攢鈹€ ImportProgressModal.tsx # 鉁?鐪熷疄瀵煎叆杩涘害锛堟浛浠ｆā鎷熷畾鏃跺櫒锛?鈹?  鈹?  鈹?  鈹溾攢鈹€ StatsModal.tsx       # 鐓х墖缁熻 + 鍒嗙被鍒嗗竷
鈹?  鈹?  鈹?  鈹溾攢鈹€ SettingsModal.tsx    # 涓婚/鍒楁暟/PIN/鐢熺墿/FAB 寮€鍏?鈹?  鈹?  鈹?  鈹溾攢鈹€ BackupModal.tsx      # 澶囦唤/鎭㈠鍙屾爣绛鹃〉 + 杩涘害鏉?鈹?  鈹?  鈹?  鈹溾攢鈹€ DataExportModal.tsx  # JSON/CSV 鍙屾牸寮忓鍑?+ 瀹炴椂棰勮
鈹?  鈹?  鈹?  鈹溾攢鈹€ PrintModal.tsx       # 鎵撳嵃瀵硅瘽妗嗭紙6 绉嶅竷灞€ + 璐ㄩ噺 + 浠芥暟锛?鈹?  鈹?  鈹?  鈹溾攢鈹€ BatchEditModal.tsx   # 鎵归噺缂栬緫锛堝垎绫?+ 鏍囩锛?鈹?  鈹?  鈹?  鈹溾攢鈹€ ShareSheet.tsx       # 鍒嗕韩 + 5 绉嶅鍑洪€夐」
鈹?  鈹?  鈹?  鈹斺攢鈹€ PhotoActionSheet.tsx # 鐓х墖鎿嶄綔闈㈡澘
鈹?  鈹?  鈹溾攢鈹€ albums/
鈹?  鈹?  鈹?  鈹溾攢鈹€ AlbumCreateDialog.tsx # 鍒涘缓鐩稿唽寮圭獥
鈹?  鈹?  鈹?  鈹溾攢鈹€ AlbumChipMenu.tsx    # 搴曢儴鍒楄〃娣诲姞鍒扮浉鍐岋紙鏀寔鎵归噺锛?鈹?  鈹?  鈹?  鈹溾攢鈹€ AlbumDropZone.tsx    # 鎷栨斁鐓х墖鍒扮浉鍐?drop targets
鈹?  鈹?  鈹?  鈹溾攢鈹€ PhotoPickerDialog.tsx # 澶氶€夌収鐗囧脊绐?鈹?  鈹?  鈹?  鈹溾攢鈹€ AlbumSortBar.tsx     # 鐩稿唽鎺掑簭鏍?鈹?  鈹?  鈹?  鈹斺攢鈹€ SmartAlbumDialog.tsx  # 鍒涘缓鏅鸿兘鐩稿唽寮圭獥
鈹?  鈹?  鈹溾攢鈹€ fab/
鈹?  鈹?  鈹?  鈹溾攢鈹€ FabButton.tsx        # FAB 椤?鈹?  鈹?  鈹?  鈹斺攢鈹€ FabMenu.tsx          # 鉁?鐩稿唽瀵煎叆/鎷嶇収瀵煎叆/AI/鎷煎浘/骞荤伅鐗?鍘婚噸/瀛樺偍
鈹?  鈹?  鈹溾攢鈹€ gestures/
鈹?  鈹?  鈹?  鈹溾攢鈹€ index.ts             # barrel
鈹?  鈹?  鈹?  鈹溾攢鈹€ SwipeablePhotoCard.tsx # 宸﹀彸婊戝姩锛堟敹钘?鍒犻櫎锛?鈹?  鈹?  鈹?  鈹溾攢鈹€ PinchGridResize.ts   # 鎹忓悎缂╂斁缃戞牸鍒楁暟
鈹?  鈹?  鈹?  鈹溾攢鈹€ SwipeSelect.ts       # 婊戝姩鎵归噺閫夋嫨
鈹?  鈹?  鈹?  鈹溾攢鈹€ FlipLayout.ts        # 缈昏浆甯冨眬
鈹?  鈹?  鈹?  鈹斺攢鈹€ StaggeredEntrance.ts # 浜ら敊鍏ュ満鍔ㄧ敾
鈹?  鈹?  鈹斺攢鈹€ shared/
鈹?  鈹?      鈹溾攢鈹€ Toolbar.tsx          # 鏍囬鏍?+ 杩斿洖鎸夐挳 + actions
鈹?  鈹?      鈹溾攢鈹€ Toast.tsx            # Toast 闃熷垪 + 鑷姩娑堝け
鈹?  鈹?      鈹溾攢鈹€ EmptyState.tsx       # 鍥炬爣 + 鏍囬 + 鍓爣棰樼┖鐘舵€?鈹?  鈹?      鈹溾攢鈹€ ContextMenu.tsx      # 闀挎寜寮瑰嚭鑿滃崟
鈹?  鈹?      鈹溾攢鈹€ PeekOverlay.tsx      # 妯℃€侀瑙堝崱鐗?+ 蹇€熸搷浣?鈹?  鈹?      鈹溾攢鈹€ MemoryCard.tsx       # "閭ｅ勾浠婂ぉ" 鍗＄墖
鈹?  鈹?      鈹溾攢鈹€ NotificationBadge.tsx # 閫氱煡寰界珷
鈹?  鈹?      鈹斺攢鈹€ PullToRefresh.tsx    # 涓嬫媺鍒锋柊
鈹?  鈹溾攢鈹€ theme/
鈹?  鈹?  鈹斺攢鈹€ index.tsx                # 5 濂楅厤鑹?+ ThemeProvider + useAppTheme
鈹?  鈹溾攢鈹€ hooks/
鈹?  鈹?  鈹溾攢鈹€ index.ts                 # barrel
鈹?  鈹?  鈹溾攢鈹€ useAppInit.ts            # 鍚姩鍒濆鍖栵紙璁剧疆 + mock 鏁版嵁锛?鈹?  鈹?  鈹溾攢鈹€ usePhotos.ts             # 绛涢€?鎺掑簭/鍒嗙粍锛坢onth/location锛?鈹?  鈹?  鈹溾攢鈹€ useSemanticSearch.ts     # 鉁?SearchIndex + 璇勫垎鎺掑簭 + 鏅鸿兘寤鸿
鈹?  鈹?  鈹溾攢鈹€ useMemoryPhotos.ts       # "閭ｅ勾浠婂ぉ"
鈹?  鈹?  鈹溾攢鈹€ usePhotoImport.ts        # 鉁?鐓х墖瀵煎叆 hook锛堢浉鍐?鐩告満/杩涘害/鍙栨秷锛?鈹?  鈹?  鈹溾攢鈹€ useHaptics.ts            # 鉁?瑙︽劅鍙嶉 hook
鈹?  鈹?  鈹斺攢鈹€ useShare.ts              # 鉁?鍒嗕韩 hook
鈹?  鈹溾攢鈹€ ai/
鈹?  鈹?  鈹溾攢鈹€ index.ts                 # barrel
鈹?  鈹?  鈹溾攢鈹€ pipeline.ts              # 鉁?IAiProcessor 鎻掍欢寮忕绾?+ 鑷姩鏇存柊 photoStore
鈹?  鈹?  鈹溾攢鈹€ mockProcessors.ts        # 鉁?MockLabelProcessor / MockFaceProcessor / MockEmbeddingProcessor
鈹?  鈹?  鈹溾攢鈹€ dedup.ts                 # 鉁?pHash DCT 瀹炵幇 + 姹夋槑璺濈 + 蹇€熸帓闄?+ 鐩镐技瀵规煡鎵?鈹?  鈹?  鈹溾攢鈹€ searchIndex.ts           # 鉁?鍊掓帓绱㈠紩锛圤(k) 璇嶆潯鏌ユ壘 + OR/AND 鎼滅储锛?鈹?  鈹?  鈹溾攢鈹€ nlu/parser.ts            # 鉁?澧炲己涓枃鎰忓浘瑙ｆ瀽锛堟椂闂?鍦扮偣/鍐呭/鍒嗙被/瀛ｈ妭 + 鏅鸿兘寤鸿锛?鈹?  鈹?  鈹溾攢鈹€ embedding/index.ts       # TFLite 宓屽叆鎺ュ彛 + 浣欏鸡鐩镐技搴?鈹?  鈹?  鈹斺攢鈹€ processors/
鈹?  鈹?      鈹溾攢鈹€ index.ts             # barrel
鈹?  鈹?      鈹溾攢鈹€ MlKitLabelProcessor.ts # ML Kit 鍥惧儚鏍囩
鈹?  鈹?      鈹溾攢鈹€ MlKitFaceProcessor.ts  # ML Kit 浜鸿劯妫€娴?鈹?  鈹?      鈹斺攢鈹€ TfliteEmbeddingProcessor.ts # TFLite 宓屽叆
鈹?  鈹溾攢鈹€ utils/
鈹?  鈹?  鈹溾攢鈹€ index.ts                 # barrel
鈹?  鈹?  鈹溾攢鈹€ image.ts                 # 鉁?ThumbnailGenerator + ColorExtractor + set* 鏇挎崲鎺ュ彛
鈹?  鈹?  鈹溾攢鈹€ exif.ts                  # 鉁?ExifParserAdapter + setExifParser 鏇挎崲鎺ュ彛
鈹?  鈹?  鈹溾攢鈹€ date.ts                  # 鏃ユ湡鏍煎紡鍖栵紙鐩稿/缁濆锛?鈹?  鈹?  鈹溾攢鈹€ collages.ts              # 鎷煎浘甯冨眬绠楁硶 + Skia 娓叉煋鍛戒护
鈹?  鈹?  鈹溾攢鈹€ mockData.ts              # 24 寮犳ā鎷熺収鐗囩敓鎴愬櫒
鈹?  鈹?  鈹溾攢鈹€ constants.ts             # 甯搁噺 + 涓婚鍚?+ 鍒嗙被鏍囩 + emoji
鈹?  鈹?  鈹溾攢鈹€ logger.ts                # __DEV__ 妯″紡鏃ュ織
鈹?  鈹?  鈹斺攢鈹€ accessibility.ts         # 鏃犻殰纰嶅伐鍏峰嚱鏁?鈹?  鈹斺攢鈹€ gestures/
鈹?      鈹斺攢鈹€ index.ts                 # 鎵嬪娍 barrel
```

## 鏁版嵁妯″瀷锛堟牳蹇冿級

```typescript
interface Photo {
  id: string; uri: string; thumbnailUri?: string;
  filename: string; sizeBytes: number; width: number; height: number;
  createdAt: number; dateTaken: string; timeTaken: string;
  latitude: number | null; longitude: number | null; locationName: string | null;
  exif: ExifData; color: string;
  isFavorite: boolean; isHidden: boolean; isPinned: boolean; isDeleted: boolean;
  aiTags: string[] | null; aiCategory: Category | null; faceCount: number | null;
  phash: string | null; embedding: number[] | null; duplicateOfId: string | null;
  edits: EditState; versions: EditVersion[]; rating: number;
  mediaType: 'photo' | 'video'; duration: number | null;
}
```

## 瀵艰埅缁撴瀯

```
RootStack (NativeStackNavigator)
鈹溾攢鈹€ Lock          鈫?LockScreen 鉁?鈹溾攢鈹€ Onboarding    鈫?OnboardingScreen 鉁?鈹溾攢鈹€ Main          鈫?TabNavigator (BottomTabs)
鈹?  鈹溾攢鈹€ GridTab       鈫?GridScreen 鉁?(鍚?4 涓鐩栧眰)
鈹?  鈹溾攢鈹€ DiscoveryTab  鈫?DiscoveryScreen 鉁?(鍥炲繂/鏁呬簨/鏍囩/鍦扮偣/鍒嗙被/绮鹃€?
鈹?  鈹溾攢鈹€ TimelineTab   鈫?TimelineScreen 鉁?鈹?  鈹溾攢鈹€ MapTab        鈫?MapScreen 鉁?(鑱氬悎鏍囪)
鈹?  鈹溾攢鈹€ CategoryTab   鈫?CategoryScreen 鉁?鈹?  鈹斺攢鈹€ TrashTab      鈫?TrashScreen 鉁?鈹溾攢鈹€ Lightbox      鈫?LightboxScreen 鉁?(鎹忓悎缂╂斁 + 鎵撳嵃)
鈹溾攢鈹€ EditPanel     鈫?EditPanelScreen 鉁?(璋冩暣/婊ら暅/瑁佸壀/鏍囨敞)
鈹溾攢鈹€ Settings      鈫?SettingsScreen 鉁?鈹溾攢鈹€ AlbumDetail   鈫?AlbumDetailScreen 鉁?鈹溾攢鈹€ Albums        鈫?AlbumsScreen 鉁?鈹溾攢鈹€ People        鈫?PeopleScreen 鉁?(FaceClusterService + 鍛藉悕)
鈹溾攢鈹€ FaceGroupDetail 鈫?FaceGroupDetailScreen 鉁?鈹溾攢鈹€ Hidden        鈫?HiddenScreen 鉁?鈹溾攢鈹€ Favorites     鈫?FavoritesScreen 鉁?鈹溾攢鈹€ Slideshow     鈫?SlideshowScreen 鉁?(Ken Burns)
鈹溾攢鈹€ Collage       鈫?CollageScreen 鉁?鈹溾攢鈹€ VersionHistory 鈫?VersionHistoryScreen 鉁?鈹溾攢鈹€ StorageDashboard 鈫?StorageDashboardScreen 鉁?鈹溾攢鈹€ SearchResults 鈫?SearchResultsScreen 鉁?鈹溾攢鈹€ Compare       鈫?CompareScreen 鉁?鈹溾攢鈹€ StoryViewer   鈫?StoryViewerScreen 鉁?(杞満鍔ㄧ敾 + 杩涘害鏉?
鈹溾攢鈹€ Tags          鈫?TagsScreen 鉁?(鏍囩浜?+ 绠＄悊)
鈹斺攢鈹€ VideoPlayer   鈫?VideoPlayerScreen 鉁?(鍏ㄥ睆鎾斁鍣?
```

## Store 鎺ュ彛閫熸煡

| Store | 鍏抽敭 state | 鍏抽敭 actions |
|-------|-----------|-------------|
| `photoStore` | photos[], filter, sortMode, selectedIds, isGridReady | setPhotos, addPhotos, updatePhoto, batchFavorite/Delete/Hide, getFilteredPhotos() |
| `albumStore` | albums[] | createAlbum, createSmartAlbum, addToAlbum, removeFromAlbum |
| `uiStore` | toasts[], isFabOpen, gridColumns, modals, storyCache | showToast, toggleFab, set*Visible(), cacheStory, getStory |
| `settingsStore` | theme, gridColumns, pinEnabled, pinCode, lastImportTimestamp | setTheme, setGridColumns, setPin, load/persist |
| `aiStore` | status (isRunning, queueSize, ...), results Map | startPipeline, reportResult, reportError |

## 鍚庢湡淇敼鎺ュ彛閫熸煡

| 淇敼闇€姹?| 鐩爣鏂囦欢 | 鏂规硶 |
|---------|---------|------|
| 鏂板涓婚閰嶈壊 | `theme/index.tsx` 鈫?`SCHEME_SOURCES` | 鍔犱竴琛?{ light, dark } 鑹叉簮 |
| 鏂板鐓х墖灞炴€?| `types/index.ts` 鈫?`Photo` | 鍔犲瓧娈?|
| 鏇挎崲鏁版嵁搴?| `db/database.ts` | `setDatabase(new RealDB())` 鈥?鎺ュ彛涓嶅彉 |
| 鎺ュ叆鐪熷疄 AI | `ai/pipeline.ts` | 娉ㄥ唽 IAiProcessor |
| 鏇挎崲鍥剧墖閫夋嫨鍣?| `services/photoImport/` | 瀹炵幇 IPhotoPicker锛屼紶鍏?factory |
| 鏇挎崲缂╃暐鍥剧敓鎴?| `utils/image.ts` | `setThumbnailGenerator(gen)` |
| 鏇挎崲 EXIF 瑙ｆ瀽 | `utils/exif.ts` | `setExifParser(parser)` |
| 鏇挎崲涓昏壊鎻愬彇 | `utils/image.ts` | `setColorExtractor(ext)` |
| 鏇挎崲浜鸿劯鑱氱被 | `services/faceCluster/` | 瀹炵幇 IFaceClusterService |
| 鏇挎崲澶囦唤鏈嶅姟 | `services/backup/` | 瀹炵幇 IBackupService |
| 鏇挎崲鏁呬簨鐢熸垚 | `services/stories/` | 瀹炵幇 IStoryGenerator |
| 鏇挎崲鏍囩鏈嶅姟 | `services/tags/` | 瀹炵幇 ITagService |
| 鏇挎崲鍦板浘鑱氬悎 | `services/mapClustering/` | 瀹炵幇 IMapClusterService |
| 鏇挎崲瑙嗛缂╃暐鍥?| `services/video/` | 瀹炵幇 IVideoThumbnailService |
| 鏇挎崲鎵撳嵃鏈嶅姟 | `services/print/` | 瀹炵幇 IPrintService |
| 鏂板鏍囩椤?| `navigation/TabNavigator.tsx` | 鍔?Tab.Screen |
| 鏂板璺敱 | `types/index.ts` 鈫?RootNavigator | 鍔?ParamList + Screen |
| 鏇挎崲鎸佷箙鍖?| `store/settingsStore.ts` | 鏀?loadSettings/persistSettings 鍐呴儴 |
| 鏂板绛涢€夌淮搴?| `store/photoStore.ts` | PhotoFilter + getFilteredPhotos() |
| 鏂板鍒嗙被 emoji | `utils/constants.ts` 鈫?`CATEGORY_EMOJI` | 鍔犱竴琛?|
| 鎵╁睍 NLU 妯″紡 | `ai/nlu/parser.ts` | 娣诲姞 PatternRule 鍒板搴旀暟缁?|

## AI 瀵规爣

| Web 妯℃嫙 | React Native 鐪熷疄瀹炵幇 |
|---------|---------------------|
| MobileNet 鍒嗙被 | ML Kit Image Labeling锛?00+ 绫诲埆锛?|
| face-api.js | ML Kit Face Detection锛堢壒寰佺偣 + 鎻忚堪绗︼級 |
| CLIP 宓屽叆 | TFLite MobileCLIP 鈫?璇箟鎼滅储 |
| pHash DCT 瀹炵幇 鉁?| TS 鍘熺敓 8x8 DCT + 姹夋槑璺濈 + 蹇€熸帓闄?|
| 涓枃 NLU 鉁?| 澧炲己姝ｅ垯 + 鍏抽敭璇?+ 瀛ｈ妭鏄犲皠 + 鍒嗙被鏄犲皠 + 鏅鸿兘寤鸿 |
| MockProcessor 鉁?| MockLabel / MockFace / MockEmbedding 妯℃嫙 AI 鍒嗘瀽 |

## 寮€鍙戦樁娈?
| 闃舵 | 鍐呭 | 鐘舵€?|
|------|------|------|
| Phase 0 | 妗嗘灦鎼缓 + TS 绫诲瀷 + 鎺ュ彛璁捐 | 鉁?瀹屾垚 |
| Phase 1 | 瀵艰埅 + 5 Store + 涓婚 + 20 灞忓箷 + 28 缁勪欢 + 4 hooks | 鉁?瀹屾垚 |
| Phase 2 | 鐪熷疄鐓х墖锛堢浉鏈?鐩稿唽/EXIF/缂╃暐鍥?瀵煎叆绠＄嚎锛?| 鉁?瀹屾垚 |
| Phase 3 | 鎼滅储澧炲己 + 浜鸿劯鑱氱被 + 鍘婚噸寮曟搸 + AI Pipeline | 鉁?瀹屾垚 |
| Phase 4 | 鏈湴 AI锛圡L Kit + TFLite锛?| 鉁?瀹屾垚锛圡L Kit + Skia + WatermelonDB锛?|
| Phase 5 | 鎵撶（锛堝姩鐢?鎬ц兘/瑙︽劅/鎵嬪娍锛?| 鉁?瀹屾垚 |
| Phase 6 | 鎷撳睍锛堝浠?鏁呬簨/鏍囩/鑱氬悎/瑙嗛/鎵撳嵃/鍙戠幇锛?| 鉁?瀹屾垚 |

### Phase 2-3 瀹屾垚鏄庣粏

| 鍔熻兘 | 鏂囦欢 | 璇存槑 |
|------|------|------|
| 鐓х墖瀵煎叆鏈嶅姟灞?| `services/photoImport/` | 閫傞厤鍣ㄦā寮忥細IPhotoPicker / IThumbnailGenerator / IExifParser / IColorExtractor |
| 鐪熷疄鍥剧墖閫夋嫨 | `ImagePickerAdapter.ts` | react-native-image-picker 閫傞厤锛堢浉鍐?+ 鐩告満锛?|
| 缂╃暐鍥剧敓鎴?| `ThumbnailGenerator.ts` | @bam.tech/react-native-image-resizer 閫傞厤 |
| EXIF 瑙ｆ瀽 | `ExifParserAdapter.ts` | 鏀寔 iOS/Android 鍘熺敓 EXIF 鏍煎紡锛圡ake/Model/FNumber/ISO/GPS 绛夛級 |
| 瀵煎叆 Hook | `hooks/usePhotoImport.ts` | React 灞傚皝瑁咃細鐩稿唽/鐩告満 + 杩涘害 + 鍙栨秷 |
| 瀵煎叆杩涘害 | `ImportProgressModal.tsx` | 鐪熷疄杩涘害鏇夸唬妯℃嫙瀹氭椂鍣?|
| FAB 鑿滃崟 | `FabMenu.tsx` | 鐩稿唽瀵煎叆 + 鎷嶇収瀵煎叆 + AI + 鎷煎浘 + 骞荤伅鐗?+ 鍘婚噸 + 瀛樺偍 |
| 鎼滅储澧炲己 | `useSemanticSearch.ts` | SearchIndex 闆嗘垚 + 璇勫垎鎺掑簭 + 鏅鸿兘寤鸿 |
| NLU 澧炲己 | `nlu/parser.ts` | 8 绉嶆椂闂存ā寮?+ 瀛ｈ妭鏄犲皠 + 7 鍒嗙被鍏抽敭璇?+ 鏅鸿兘寤鸿 |
| 浜鸿劯鑱氱被 | `services/faceCluster/` | FaceClusterService + 鑱氱被/鍛藉悕/鍚堝苟/鎷嗗垎 |
| PeopleScreen | `PeopleScreen.tsx` | FaceClusterService + 闀挎寜鍛藉悕 |
| FaceGroupDetail | `FaceGroupDetailScreen.tsx` | 鎸?groupId 杩囨护 + 浜鸿劯缂╃暐鍥?|
| pHash 鍘婚噸 | `ai/dedup.ts` | 8x8 DCT + 鍙岀嚎鎬х缉鏀?+ 姹夋槑璺濈 + 蹇€熸帓闄?+ 鐩镐技瀵规煡鎵?|
| AI Pipeline | `ai/pipeline.ts` | 鑷姩鏇存柊 photoStore锛坅iTags/aiCategory/faceCount/embedding锛?|
| Mock AI | `ai/mockProcessors.ts` | MockLabelProcessor / MockFaceProcessor / MockEmbeddingProcessor |
| utils 澧炲己 | `utils/image.ts` + `utils/exif.ts` | setThumbnailGenerator / setColorExtractor / setExifParser 鏇挎崲鎺ュ彛 |

### Phase 4-5 瀹屾垚鏄庣粏

| 鍔熻兘 | 鏂囦欢 | 璇存槑 |
|------|------|------|
| AI Pipeline 鎺ュ叆 | `AiOverlay.tsx` | 娉ㄥ唽 MockLabel/MockFace/MockEmbedding + 鍚姩/鏆傚仠 + 瀹屾垚閫氱煡 |
| 瑙︽劅鍙嶉 | `services/haptics/index.ts` | react-native-haptic-feedback 7 绉嶈Е鎰熺被鍨?|
| 瑙︽劅 Hook | `hooks/useHaptics.ts` | 鐪熷疄瑙︽劅鏇夸唬 no-op锛屾帴鍙ｄ笉鍙?|
| 婊戝姩瀵规瘮 | `CompareScreen.tsx` | Reanimated + GestureDetector 婊戝姩鍒嗗睆瀵规瘮 |
| 鍏ュ満鍔ㄧ敾 | `PhotoCard.tsx` | Reanimated stagger fade-in + scale锛?0ms 闂撮殧锛屾渶澶?600ms锛?|
| 婊戝姩閫夋嫨 | `SwipeSelect.ts` | 鍛戒腑娴嬭瘯 + registerLayout + Pan 鎵嬪娍鎵归噺閫変腑 |
| 鎼滅储缁撴灉 | `SearchResultsScreen.tsx` | useSemanticSearch + SemanticChips + 璇勫垎鎺掑簭 |

### Phase 4 瀹屾垚鏄庣粏锛圡L Kit + Skia + WatermelonDB锛?
| 鍔熻兘 | 鏂囦欢 | 璇存槑 |
|------|------|------|
| ML Kit 鏍囩 | `ai/processors/MlKitLabelProcessor.ts` | @react-native-ml-kit/image-labeling 閫傞厤锛?00+ 绫诲埆锛岃嚜鍔ㄥ垎绫绘槧灏?|
| ML Kit 浜鸿劯 | `ai/processors/MlKitFaceProcessor.ts` | @react-native-ml-kit/face-detection 閫傞厤锛屼汉鑴歌鏁?+ 蹇€熸ā寮?|
| TFLite 宓屽叆 | `ai/processors/TfliteEmbeddingProcessor.ts` | TFLite 宓屽叆鎺ュ彛 + MockEmbedding fallback |
| Skia 涓昏壊 | `services/photoImport/SkiaColorExtractor.ts` | @shopify/react-native-skia 鍍忕礌閲囨牱 鈫?骞冲潎鑹叉彁鍙?|
| WatermelonDB | `db/WatermelonDatabase.ts` | SQLite 鎸佷箙鍖栵細Photo/Album/KV CRUD + 鍏宠仈琛?+ 鏅鸿兘鐩稿唽瑙勫垯 |
| 鑷姩鍒囨崲 | `AiOverlay.tsx` + `factory.ts` + `database.ts` | require() 妫€娴?鈫?鏈夌湡瀹炲簱鐢ㄧ湡瀹烇紝鏃犲垯 fallback Mock |

### 鐢熶骇绾у寮烘槑缁?
| 鍔熻兘 | 鏂囦欢 | 璇存槑 |
|------|------|------|
| 鐪熷疄鍦板浘 | `MapScreen.tsx` | react-native-maps MapView + Marker + Callout + 搴曢儴妯悜鍦扮偣鍒楄〃 |
| 璁剧疆鎸佷箙鍖?| `settingsStore.ts` | react-native-mmkv 鏇夸唬鍐呭瓨瀛樺偍锛宭oadSettings/persistSettings 鐪熷疄璇诲啓 |
| 婊ら暅鐭╅樀 | `services/filters/index.ts` | 7 绉?Skia ColorMatrix 婊ら暅锛堟殩鑹?鍐疯壊/榛戠櫧/椴滆壋/瑜壊/澶嶅彜/鎴忓墽锛?|
| 鏁版嵁搴撴寔涔呭寲 | `photoStore.ts` | addPhotos/updatePhoto/batch* 鑷姩鍐欏叆 WatermelonDB锛宧ydrateFromDb 鍚姩姘村悎 |
| 鍒嗕韩鍔熻兘 | `services/share/index.ts` | react-native-share 鍗曞紶/澶氬紶鍒嗕韩 |
| 閿欒杈圭晫 | `ErrorBoundary.tsx` | 鍏ㄥ眬 React 閿欒鎹曡幏 + 閲嶈瘯 |
| 鍒嗕韩 Hook | `hooks/useShare.ts` | react-native-share 灏佽 |
| 鐩稿唽鎸佷箙鍖?| `albumStore.ts` | WatermelonDB 鑷姩鍐欏叆 + hydrateFromDb |
| 璁板繂鏈嶅姟 | `services/memories/index.ts` | 閭ｅ勾浠婂ぉ + 瀛ｈ妭鍥炲繂 + 鍦扮偣鍥炲繂 |
| 娣卞害閾炬帴 | `services/deepLinking/index.ts` | momento:// 鍗忚瑙ｆ瀽 + 瀵艰埅璺敱鏄犲皠 |
| 鏃犻殰纰?| `services/accessibility/index.ts` | PhotoCard/Button/Header/List/Tab 杈呭姪灞炴€?|

### 浠ｇ爜瀹¤淇鏄庣粏

| 淇 | 鏂囦欢 | 璇存槑 |
|------|------|------|
| Tab 鍥炬爣 | `TabNavigator.tsx` | 6 涓爣绛惧叏閮ㄦ樉绀?Unicode 鍥炬爣 + 涓婚鑹?|
| 绌哄洖璋?| `HiddenScreen/TrashScreen/DedupOverlay/SearchResultsScreen` | 杩炴帴鐪熷疄瀵艰埅/鎿嶄綔 |
| 绌?catch | `photoStore.ts` + `albumStore.ts` | 缁熶竴 logError 鏃ュ織锛?4 澶勶級 |
| 閿欒鏃ュ織 | `utils/logger.ts` | __DEV__ 妯″紡 console.warn |
| 鎵嬪娍 barrel | `gestures/index.ts` | 瀵煎嚭 SwipeablePhotoCard + useSwipeSelect + usePinchGridResize |
| ShareSheet | `ShareSheet.tsx` | 鎺ュ叆 react-native-share + 5 绉嶅鍑洪€夐」 |
| 璁板繂杩炴帴 | `useMemoryPhotos.ts` + `MemoryCard.tsx` | 鎺ュ叆 memories 鏈嶅姟锛屾敮鎸?4 绉嶅洖蹇嗙被鍨?|
| GridScreen | `GridScreen.tsx` | MemoryGroup 灞炴€ч€傞厤 |

### 鏈€缁堟墦纾ㄦ槑缁?
| 鍔熻兘 | 鏂囦欢 | 璇存槑 |
|------|------|------|
| Skia 鎷煎浘 | `utils/collages.ts` | computeCellFrames + computeSkiaDrawCommands 甯冨眬寮曟搸 |
| 鐢熺墿璇嗗埆 | `services/biometrics/index.ts` | react-native-biometrics 閫傞厤锛團aceID/TouchID/鎸囩汗锛?|
| LockScreen | `LockScreen.tsx` | 鑷姩妫€娴嬬敓鐗╄瘑鍒?+ 涓€閿В閿佹寜閽?|
| ContextMenu | `ContextMenu.tsx` | 鐪熷疄妯℃€佽彍鍗曪紙鍥炬爣 + 鐮村潖鎬ф搷浣?+ 绂佺敤鐘舵€侊級 |
| 閫氱煡璋冨害 | `services/notifications/index.ts` | react-native-push-notification 璁板繂鎺ㄩ€?+ 8 灏忔椂寤惰繜 |
| 鏁版嵁瀵煎嚭 | `DataExportModal.tsx` | JSON/CSV 鍙屾牸寮忓鍑?+ 瀹炴椂棰勮 |
| 绫诲瀷娓呯悊 | `types/index.ts` | 绉婚櫎 MemoryPhoto锛屽鍑?MemoryGroup/BackupMeta |
| 绫诲瀷澹版槑 | `types/react-native-push-notification.d.ts` | 绗笁鏂瑰簱绫诲瀷琛ヤ竵 + TextEncoder |

### Phase 6 鎷撳睍鏄庣粏

| 鍔熻兘 | 鏂囦欢 | 璇存槑 |
|------|------|------|
| 澶囦唤鎭㈠ | `services/backup/` | IBackupService + JsonBackupService锛圧NFS 鏂囦欢鍐欏叆 + 鍐呭瓨 fallback锛?|
| 澶囦唤 UI | `BackupModal.tsx` | 澶囦唤/鎭㈠鍙屾爣绛鹃〉 + 杩涘害鏉?+ 澶囦唤鍒楄〃 |
| 鏁呬簨鐢熸垚 | `services/stories/` | IStoryGenerator + 鏅鸿兘鍒嗙粍/杞満/鏃堕暱/鏍囬鑷姩鐢熸垚 |
| 鏁呬簨鎾斁 | `StoryViewerScreen.tsx` | 鍏ㄥ睆鎾斁鍣?+ fade/slide/zoom 杞満 + 杩涘害鏉?+ 鎾斁/鏆傚仠 |
| 鏁呬簨缂撳瓨 | `uiStore.ts` | storyCache Map + cacheStory/getStory |
| 鏍囩绠＄悊 | `services/tags/` | ITagService + CRUD + 閲嶅懡鍚?鍚堝苟/鍒犻櫎 + 寤鸿 + 鐑棬 |
| 鏍囩椤甸潰 | `TagsScreen.tsx` | 鏍囩浜?+ 鎼滅储 + 闀挎寜鑿滃崟锛堥噸鍛藉悕/鍚堝苟/鍒犻櫎锛?|
| 鍦板浘鑱氬悎 | `services/mapClustering/` | IMapClusterService + 缃戞牸鑱氱被绠楁硶 + 缂╂斁鑷€傚簲 |
| 鍦板浘鑱氬悎 UI | `MapScreen.tsx` | 鑱氬悎 Marker锛堝渾褰?鏁板瓧锛? 鐐瑰嚮鏀惧ぇ + 鍗曚釜 Marker 瀵艰埅 |
| 瑙嗛鏀寔 | `services/video/` | IVideoThumbnailService + IVideoMetadataService |
| 瑙嗛鏍囪瘑 | `VideoIndicator.tsx` | 鈻?+ mm:ss 鏃堕暱鍙犲姞鍦ㄧ缉鐣ュ浘鍙充笅瑙?|
| 瑙嗛鎾斁 | `VideoPlayerScreen.tsx` | 鍏ㄥ睆鎾斁鍣?+ 杩涘害鏉?+ 鎾斁/鏆傚仠 + 鎺у埗鏍?|
| 瑙嗛鏁版嵁 | `types/index.ts` | Photo 鏂板 mediaType/duration 瀛楁 |
| 鎵撳嵃鏈嶅姟 | `services/print/` | IPrintService + ReactNativePrintService锛? 绉嶅竷灞€ + 璐ㄩ噺 + 浠芥暟锛?|
| 鎵撳嵃 UI | `PrintModal.tsx` | 甯冨眬閫夋嫨 + 璐ㄩ噺閫夋嫨 + 浠芥暟璋冩暣 + 鏍囬寮€鍏?|
| 鎵撳嵃鍏ュ彛 | `LightboxFooter.tsx` + `LightboxScreen.tsx` | 馃枿锔?鎵撳嵃鎸夐挳 + PrintModal |
| 鍙戠幇椤甸潰 | `DiscoveryScreen.tsx` | 鍥炲繂/鏁呬簨/鏍囩/鍦扮偣/鍒嗙被/绮鹃€?6 鍖哄潡 |
| 鍙戠幇鏍囩 | `TabNavigator.tsx` | 鏂板 DiscoveryTab锛堭煍?鍙戠幇锛?|

## 杩愯

```bash
cd Momento
npm install
npx react-native run-android  # 闇€瑕?Android SDK
```

## 璁捐鍘熷垯

- **鎺ュ彛闅旂**锛氭瘡涓ā鍧楅€氳繃鏄庣‘鐨?TS 鎺ュ彛鏆撮湶锛屽疄鐜板彲鏁翠綋鏇挎崲
- **鍗曚竴鑱岃矗**锛歋tore 鍒囩墖鐙珛锛涚粍浠剁函灞曠ず vs 瀹瑰櫒鍒嗙
- **渚濊禆鍊掔疆**锛欼Database 鈫?MockDB/MelonDB锛汭AiProcessor 鈫?ML Kit/TFLite锛汭PhotoPicker 鈫?ImagePicker
- **鏈€灏戝奖鍝?*锛氫慨鏀归€氬父鍙奖鍝嶅崟涓枃浠讹紝璺ㄦā鍧楅€氳繃 barrel index
- **宸ュ巶妯″紡**锛歝reatePhotoImportService(overrides?) 鏀寔渚濊禆娉ㄥ叆
- **閫傞厤鍣ㄦā寮?*锛氭墍鏈夌涓夋柟搴撻€氳繃鎺ュ彛閫傞厤锛屼笉鍙敤鏃惰嚜鍔?fallback


