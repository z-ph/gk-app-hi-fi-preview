const express = require('express')
const cors = require('cors')
const path = require('path')
const {
  getUser,
  getLiveRoom,
  getReplay,
  buildWatermark,
  recordHeartbeat,
  getDuration,
} = require('./data')

const app = express()
const PORT = process.env.MOCK_SERVER_PORT || 3014

app.use(cors())
app.use(express.json())
app.use('/mock', express.static(path.join(__dirname, 'public')))

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'gk-live-mock-server', timestamp: new Date().toISOString() })
})

// Get live room info
app.get('/api/live/rooms/:code', (req, res) => {
  const { code } = req.params
  const room = getLiveRoom(code)
  if (!room) {
    return res.status(404).json({ error: 'Room not found' })
  }
  res.json({
    ...room,
    playerUrl: room.playerUrlTemplate
      ? room.playerUrlTemplate.replace('{code}', code)
      : null,
  })
})

// Build live player URL with user info
app.get('/api/live/rooms/:code/player-url', (req, res) => {
  const { code } = req.params
  const { userNumber, userName } = req.query
  const room = getLiveRoom(code)
  if (!room) {
    return res.status(404).json({ error: 'Room not found' })
  }
  const user = getUser(userNumber)
  const name = userName || user.name
  const url = room.playerUrlTemplate
    ? room.playerUrlTemplate
        .replace('{code}', code)
        .replace('{name}', encodeURIComponent(name))
        .replace('{number}', encodeURIComponent(userNumber || user.number))
    : null

  res.json({
    code,
    name,
    number: userNumber || user.number,
    role: user.role,
    playerUrl: url,
    isMock: !room.playerUrlTemplate,
  })
})

// Get replay info
app.get('/api/replay/:vid', (req, res) => {
  const { vid } = req.params
  const replay = getReplay(vid)
  if (!replay) {
    return res.status(404).json({ error: 'Replay not found' })
  }
  res.json(replay)
})

// Get user info
app.get('/api/users/:number', (req, res) => {
  const user = getUser(req.params.number)
  res.json({
    ...user,
    watermark: buildWatermark(user),
  })
})

// Get watermark config for user
app.get('/api/watermark', (req, res) => {
  const { userNumber } = req.query
  const user = getUser(userNumber)
  res.json({
    text: buildWatermark(user),
    style: {
      displayMode: 'roll',
      rollDuration: 10,
      color: '#ffffff',
      fontOpacity: 0.86,
      fontSize: 14,
      backgroundColor: '#1795ff',
      backgroundOpacity: 0.62,
      position: 'random',
    },
  })
})

// Heartbeat for watch duration
app.post('/api/watch/heartbeat', (req, res) => {
  const { userNumber, vid, roomCode, duration, event } = req.body
  if (!userNumber || (!vid && !roomCode)) {
    return res.status(400).json({ error: 'Missing userNumber and vid/roomCode' })
  }
  const record = recordHeartbeat({ userNumber, vid, roomCode, duration, event })
  res.json({
    userNumber,
    key: vid || roomCode,
    totalSeconds: record.totalSeconds,
    thisSessionDuration: Math.max(0, Math.floor(duration || 0)),
    event,
  })
})

// Get watch duration
app.get('/api/watch/duration', (req, res) => {
  const { userNumber, vid, roomCode } = req.query
  if (!userNumber || (!vid && !roomCode)) {
    return res.status(400).json({ error: 'Missing userNumber and vid/roomCode' })
  }
  const record = getDuration(userNumber, vid || roomCode)
  res.json({
    userNumber,
    key: vid || roomCode,
    totalSeconds: record.totalSeconds,
    sessions: record.sessions,
  })
})

app.listen(PORT, () => {
  console.log(`🎥 GK Live Mock Server running at http://127.0.0.1:${PORT}`)
  console.log(`   API docs:`)
  console.log(`   GET  /api/health`)
  console.log(`   GET  /api/live/rooms/:code`)
  console.log(`   GET  /api/live/rooms/:code/player-url?userNumber=9001`)
  console.log(`   GET  /api/replay/:vid`)
  console.log(`   GET  /api/users/:number`)
  console.log(`   GET  /api/watermark?userNumber=9001`)
  console.log(`   POST /api/watch/heartbeat`)
  console.log(`   GET  /api/watch/duration?userNumber=9001&vid=mock-vid`)
  console.log(`   GET  /mock/video.mp4`)
})
