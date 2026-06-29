// Mock data store for live / replay / user / watch duration

const users = {
  '9001': {
    name: '陈思远',
    number: '9001',
    phone: '13800135678',
    role: 'student',
    permissions: ['watch', 'chat'],
  },
  '8001': {
    name: '周助教',
    number: '8001',
    phone: '13900135679',
    role: 'assistant',
    permissions: ['watch', 'chat', 'mute', 'kick'],
  },
  '0000': {
    name: '游客用户',
    number: '0000',
    phone: '13700135677',
    role: 'guest',
    permissions: ['watch'],
  },
}

const liveRooms = {
  gk2026: {
    code: 'gk2026',
    title: '结构化面试大班课',
    subtitle: '2026 国考面试协议精讲班',
    status: 'living',
    teacher: '周老师',
    startTime: '2026-06-29T19:30:00+08:00',
    endTime: '2026-06-29T21:30:00+08:00',
    onlineCount: 128,
    maxOnline: 500,
    allowChat: true,
    allowMic: false,
    playerUrlTemplate:
      'https://gk-interview.at.baijiayun.com/web/room/codePlayer?code={code}&user_name={name}&user_number={number}&width=1280&height=720&showControls=true',
  },
  'mock-live-room': {
    code: 'mock-live-room',
    title: 'Mock 大班直播课',
    subtitle: '用于本地 UI 验证',
    status: 'living',
    teacher: 'Mock 老师',
    startTime: '2026-06-29T19:30:00+08:00',
    endTime: '2026-06-29T21:30:00+08:00',
    onlineCount: 42,
    maxOnline: 999,
    allowChat: true,
    allowMic: false,
    playerUrlTemplate: null,
  },
}

const replays = {
  '156406197': {
    vid: '156406197',
    title: '岗位匹配专题复盘',
    subtitle: '林老师 · 昨日 20:00-21:30',
    teacher: '林老师',
    duration: 5400,
    coverUrl: '/mock/cover.png',
    token: 'mock-replay-token-156406197',
    allowDownload: false,
    videoUrl: '/mock/video.mp4',
    chapters: [
      { title: '岗位匹配', start: 0, end: 1800 },
      { title: '素材组织', start: 1800, end: 3600 },
      { title: '追问复盘', start: 3600, end: 5400 },
    ],
  },
  'mock-vid': {
    vid: 'mock-vid',
    title: 'Mock 回放课程',
    subtitle: '本地测试用',
    teacher: 'Mock 老师',
    duration: 300,
    coverUrl: '/mock/cover.png',
    token: 'mock-replay-token-mock-vid',
    allowDownload: false,
    videoUrl: '/mock/video.mp4',
    chapters: [
      { title: '开场', start: 0, end: 60 },
      { title: '正文', start: 60, end: 240 },
      { title: '总结', start: 240, end: 300 },
    ],
  },
}

// In-memory watch records: { userNumber: { vid/roomCode: totalSeconds, lastEventAt, sessions: [] } }
const watchRecords = new Map()

function getUser(number) {
  return users[number] || {
    name: '未知用户',
    number,
    phone: '138****0000',
    role: 'guest',
    permissions: [],
  }
}

function getLiveRoom(code) {
  return liveRooms[code]
}

function getReplay(vid) {
  return replays[vid]
}

function maskPhone(phone) {
  return `${phone.slice(0, 3)}****${phone.slice(-4)}`
}

function buildWatermark(user) {
  const roleText = user.role === 'assistant' ? '助教' : user.role === 'guest' ? '游客' : '学员'
  return `${user.name} ${maskPhone(user.phone)} ${roleText}`
}

function recordHeartbeat({ userNumber, vid, roomCode, duration, event }) {
  if (!userNumber) return null
  const key = vid || roomCode || 'unknown'
  const userRecord = watchRecords.get(userNumber) || {}
  const record = userRecord[key] || { totalSeconds: 0, sessions: [], lastEvent: null, lastEventAt: null }

  const now = new Date().toISOString()

  if (event === 'play') {
    record.lastEvent = 'play'
    record.lastEventAt = now
  } else if ((event === 'pause' || event === 'end') && record.lastEvent === 'play' && record.lastEventAt) {
    const delta = Math.max(0, Math.floor(duration || 0))
    record.totalSeconds += delta
    record.sessions.push({ from: record.lastEventAt, to: now, delta })
    record.lastEvent = event
    record.lastEventAt = now
  } else if (event === 'tick' && record.lastEvent === 'play') {
    // 心跳累加，前端每秒上报一次当前会话累计时长
    const delta = Math.max(0, Math.floor(duration || 0))
    record.totalSeconds = Math.max(record.totalSeconds, delta)
  }

  userRecord[key] = record
  watchRecords.set(userNumber, userRecord)
  return record
}

function getDuration(userNumber, key) {
  const userRecord = watchRecords.get(userNumber) || {}
  return userRecord[key] || { totalSeconds: 0, sessions: [] }
}

module.exports = {
  getUser,
  getLiveRoom,
  getReplay,
  maskPhone,
  buildWatermark,
  recordHeartbeat,
  getDuration,
}
