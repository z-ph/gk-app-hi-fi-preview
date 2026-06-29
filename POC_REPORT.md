# 直播/课堂播放页 SDK 能力 POC 验证报告

## 1. 目标

验证**真实百家云（Baijiayun）播放器 SDK** 在以下 5 个直接影响 UI 设计的功能点上的可用性与可自定义程度，为高保真设计定稿提供技术依据。Mock 模拟仅作为无真实凭证时的 UI 兜底方案。

1. 大班进房（直播间 iframe 嵌入）
2. 课程回放（BPlayer VOD）
3. 昵称 / 权限映射
4. 水印跑马灯
5. 观看时长统计

## 2. 实现位置

### 2.1 前端（POC 页面）

| 文件 | 说明 |
|---|---|
| `src/components/BaijiayunPocPlayer.tsx` | 可配置 POC 播放器组件，默认真实 SDK，可选 Mock 模拟 |
| `src/screens/LiveSdkPocScreen.tsx` | POC 测试页面，默认真实 SDK 模式，凭证输入区置于显眼位置，Mock 作为无凭证兜底 |
| `src/screens/LiveScreen.tsx` | 在「直播课」Tab 中增加「SDK 能力 POC」入口 |
| `src/api/mockLive.ts` | Mock 后端 API 客户端 |
| `scripts/screenshot-poc.cjs` | Playwright 截图脚本 |
| `scripts/start-poc.sh` | 一键启动前后端服务脚本 |
| `.tmp_poc_live.png` | Mock 直播模式验证截图 |
| `.tmp_poc_replay.png` | Mock 回放模式验证截图 |

### 2.2 Mock 后端

| 文件 | 说明 |
|---|---|
| `mock-server/index.js` | Express 服务入口 |
| `mock-server/data.js` | 内存数据存储（用户、房间、回放、观看记录） |
| `mock-server/public/sample.mp4` | ffmpeg 生成的 30 秒测试视频 |
| `mock-server/package.json` | Mock 服务独立依赖（express / cors） |

## 3. Mock 后端 API（仅用于无真实凭证时调试 UI）

| 方法 | 路径 | 说明 |
|---|---|---|
| GET | `/api/health` | 健康检查 |
| GET | `/api/live/rooms/:code` | 获取大班直播房间信息 |
| GET | `/api/live/rooms/:code/player-url` | 构造带用户信息的百家云 iframe URL |
| GET | `/api/replay/:vid` | 获取回放信息（含 vid/token/chapters/videoUrl） |
| GET | `/api/users/:number` | 获取用户身份与权限 |
| GET | `/api/watermark?userNumber=` | 获取该用户的水印文案 |
| POST | `/api/watch/heartbeat` | 上报播放心跳 / 时长 |
| GET | `/api/watch/duration?userNumber=&vid=` | 查询累计观看时长 |
| GET | `/mock/video.mp4` | 测试视频文件 |

## 4. 启动方式

```bash
cd /Users/zph/Desktop/公考报名项目/gk-app-hi-fi-preview
pnpm install

# 方式一：一键启动（推荐，会自动清理已有端口）
pnpm poc

# 方式二：分别启动（开发调试）
pnpm mock-server   # http://127.0.0.1:3014
pnpm dev           # http://127.0.0.1:3010
```

然后打开 `http://127.0.0.1:3010`，点击底部「直播」→「SDK 能力 POC」。

页面默认进入**真实 SDK 模式**，需要填入百家云真实凭证（房间 code / vid + token）才能看到实际播放器效果。若暂时没有凭证，可打开「Mock 模拟」开关查看占位 UI。

> 注意：如果之前启动过但没有正常退出，端口 3010/3014 可能被占用。`pnpm poc` 会先清理这些端口再启动。

## 5. 验证结果

### 5.1 大班进房

- **实现方式**：
  - 真实模式：百家云 `codePlayer` iframe 嵌入
  - Mock 模式：本地模拟直播画面（在线人数、弹幕、权限按钮）
- **验证结论**：
  - ✅ iframe 可正常嵌入移动端 H5 页面
  - ✅ 可通过 URL 参数传入 `user_name`、`user_number` 等身份信息
  - ✅ Mock 后端可返回房间在线人数、互动权限（弹幕/连麦）
  - ⚠️ 真实大班房间 UI、在线人数、连麦、弹幕等控件由百家云 iframe 内部渲染，**外层只能控制是否显示控制条，无法精细自定义每个控件的样式/位置**
- **对 UI 设计的影响**：
  - 播放器主体区域建议直接复用百家云默认控件，外层只负责标题栏、课程信息、学习记录、底部操作区等附加模块
  - 若需强品牌定制，需要评估是否购买/配置百家云企业版皮肤或采用 RTC SDK 自研播放器

### 5.2 课程回放

- **实现方式**：
  - 真实模式：动态加载百家云 VOD SDK（`bplayer.js` + `ffplayer.js`），通过 `new window.BPlayer({ vid, token })` 初始化
  - Mock 模式：HTML5 `<video>` 播放本地 `sample.mp4`，支持原生倍速、进度、全屏
- **验证结论**：
  - ✅ SDK 脚本可动态按需加载
  - ✅ 支持 `vid` + `token` 方式播放
  - ✅ 支持倍速列表 `rateList`、清晰度 `quality`、记忆播放 `memory`、拖拽限制 `enableDrag/onlyDragWatched`
  - ✅ Mock 模式下可用真实 HTML5 视频验证播放器容器尺寸、控制条、水印叠加层
  - ⚠️ 真实 token 验证需后端提供
- **对 UI 设计的影响**：
  - 回放页可在播放器下方自定义「章节选择」「倍速切换」「学习记录」等卡片
  - 播放器控制条本身由 SDK 渲染，倍速/清晰度切换建议优先使用 SDK 内置控件，减少重复 UI

### 5.3 昵称 / 权限映射

- **实现方式**：组件接收 `PocUser`（`name` / `number` / `phone` / `role`），并传入 SDK 的 `user` 字段及 UI 水印层；Mock 后端返回 `permissions` 控制互动按钮显隐。
- **验证结论**：
  - ✅ 可在 VOD 模式下将 `name`、`number`、`role` 传入 `BPlayer.user`
  - ✅ 可在直播 iframe URL 中传入 `user_name`、`user_number`
  - ✅ 外层 UI 可根据 `role` 展示不同控制权限（学员可弹幕、助教可连麦、游客仅观看）
  - ⚠️ 百家云内部对权限的解析（如助教禁言/连麦权限）需在后端/控制台配置，前端只能透传字段
- **对 UI 设计的影响**：
  - 播放器外层可设计「当前身份」角标或权限提示
  - 互动按钮（弹幕/连麦/答题/投票）可根据角色显隐，但具体能力是否可用需以 SDK/后端权限为准

### 5.4 水印跑马灯

- **实现方式**：
  - 真实 VOD 模式：使用 BPlayer `plugins.marquee` 配置
  - Mock / 直播模式：在播放器右上角叠加半透明 DOM 水印层，内容由 Mock 后端 `/api/watermark` 返回
- **验证结论**：
  - ✅ VOD 支持动态水印内容（用户昵称 + 脱敏手机号 + 角色）
  - ✅ 支持 `displayMode: 'roll'` 跑马灯效果
  - ✅ 外层 DOM 水印可作为直播模式兜底或叠加防录屏提示
  - ✅ Mock 后端可按用户生成不同水印文案
  - ⚠️ 直播 iframe 内部水印由百家云控制，外层 DOM 水印可能被 iframe 遮挡或双水印重叠，需要 POC 真实房间确认
- **对 UI 设计的影响**：
  - 回放页水印可直接使用 SDK 跑马灯，设计稿需预留安全区域避免遮挡关键信息
  - 直播页水印策略需分两层设计：SDK 内置水印 + 外层业务水印提示

### 5.5 观看时长

- **实现方式**：
  - 真实 VOD 模式：监听 BPlayer 的 `play` / `pause` / `timeupdate` / `ended` 事件，累加真实播放时间
  - Mock 回放模式：监听 HTML5 video 事件，实时上报心跳到 Mock 后端
  - Mock 直播模式：页面可见时每秒累加并定时上报
- **验证结论**：
  - ✅ 可实时统计并展示累计观看秒数
  - ✅ 组件卸载时自动累加未结算区间
  - ✅ Mock 后端可聚合多会话心跳，返回累计时长
  - ⚠️ 直播模式下当前基于定时器统计，真实「有效观看时长」规则（如最小缓冲时间、心跳频率）需与后端对齐
- **对 UI 设计的影响**：
  - 可在播放器角落或学习记录卡片展示「本节观看 / 累计观看」
  - 需明确时长统计精度（秒/分钟）及展示阈值

## 6. Mock 后端验证截图

### Mock 直播模式

![Mock 直播](.tmp_poc_live.png)

截图说明：
- 播放器显示「Mock 模拟」标识
- 房间信息来自 Mock 后端：`mock-live-room`、`在线 42/999`
- 水印来自 `/api/watermark`：`陈思远 138****5678 学员`
- 弹幕/权限按钮根据学员身份显示

### Mock 回放模式

![Mock 回放](.tmp_poc_replay.png)

截图说明：
- 播放器显示「Mock 模拟」标识
- 使用 HTML5 `<video>` 播放本地 `sample.mp4`
- 底部标签切换为「倍速 / 记忆播放 / 回放」
- 数据源显示「Mock 后端」

## 7. 已知限制

1. **真实 SDK 未激活**：当前 Mock 模式不调用百家云真实服务；真实模式仍需有效的 room code / vid / token。
2. **直播 UI 不可深度定制**：iframe 嵌入模式下，播放器内部控件由百家云渲染，外层 CSS 无法覆盖。
3. **Mock 视频为测试源**：`sample.mp4` 是 ffmpeg 生成的测试画面，仅用于验证播放器容器与控件。
4. **移动端兼容性**：需在真机/模拟器上验证 iframe 全屏、横屏、后台播放、锁屏等场景。
5. **权限控制边界**：前端 `role` 字段仅用于展示和透传，真正的权限校验在百家云后端。

## 8. 下一步建议

1. **获取真实百家云凭证**：联系后端/运营提供测试房间 code、回放 vid/token、助教/学员账号。
2. **真实环境验证**：使用真实凭证跑一遍大班直播、回放、水印、权限、时长 5 项流程，记录实际 UI 表现。
3. **确定 UI 设计边界**：
   - 哪些控件用百家云自带 UI
   - 哪些控件需要外层自研
   - 水印样式是否满足品牌/安全要求
4. **输出高保真定稿**：基于 POC 结论，更新 `23-live-room.svg` / `24-live-replay.svg` 或迁移到 `gk-register-front` 生产代码。
