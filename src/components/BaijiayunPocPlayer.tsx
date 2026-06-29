import { useEffect, useRef, useState } from 'react'
import { PlayOutline, VideoOutline } from 'antd-mobile-icons'
import type { BaijiayunMode } from '@/types/app'
import type { LiveRoomInfo } from '@/api/mockLive'
import { postHeartbeat } from '@/api/mockLive'

export type PocUser = {
  name: string
  number: string
  phone: string
  role: 'student' | 'assistant' | 'guest'
}

export type PocCredential = {
  liveCode: string
  vid: string
  token: string
}

type BPlayerInstance = {
  on?: (eventName: string, callback: (...args: unknown[]) => void) => void
  destroy?: () => void
}

declare global {
  interface Window {
    BPlayer?: new (options: Record<string, unknown>) => BPlayerInstance
  }
}

const VOD_SDK_URLS = [
  'https://www.baijiayun.com/bplayer/1.10.28/bplayer.js',
  'https://www.baijiayun.com/bplayer/1.10.28/dep/ffplayer.js',
]

interface BaijiayunPocPlayerProps {
  readonly title: string
  readonly subtitle: string
  readonly mode: BaijiayunMode
  readonly credential: PocCredential
  readonly user: PocUser
  readonly watermarkText?: string
  readonly useMock?: boolean
  readonly mockVideoUrl?: string
  readonly mockRoomInfo?: LiveRoomInfo | null
  readonly onDurationUpdate?: (seconds: number) => void
}

function isRealVodCredential(vid: string, token: string) {
  return Boolean(vid && token && !token.startsWith('bjy-') && !token.startsWith('mock'))
}

function isRealLiveCode(code: string) {
  return Boolean(code && !code.startsWith('mock') && code.length >= 4)
}

function buildLiveIframeSrc(code: string, user: PocUser) {
  const params = new URLSearchParams({
    code,
    user_name: user.name,
    user_number: user.number,
    width: '1280',
    height: '720',
    showControls: 'true',
  })
  return `https://gk-interview.at.baijiayun.com/web/room/codePlayer?${params.toString()}`
}

function formatDuration(totalSeconds: number) {
  const h = Math.floor(totalSeconds / 3600)
  const m = Math.floor((totalSeconds % 3600) / 60)
  const s = Math.floor(totalSeconds % 60)
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}

export function BaijiayunPocPlayer({
  title,
  subtitle,
  mode,
  credential,
  user,
  watermarkText,
  useMock,
  mockVideoUrl,
  mockRoomInfo,
  onDurationUpdate,
}: BaijiayunPocPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [sdkReady, setSdkReady] = useState(false)
  const [playerState, setPlayerState] = useState<'loading' | 'ready' | 'error'>('loading')
  const [duration, setDuration] = useState(0)
  const durationRef = useRef(0)
  const lastTickRef = useRef<number | null>(null)
  const isLive = mode === 'live'
  const hasRealLive = isRealLiveCode(credential.liveCode)
  const hasRealVod = !isLive && isRealVodCredential(credential.vid, credential.token)
  const defaultWatermark = `${user.name} ${user.phone.slice(0, 3)}****${user.phone.slice(-4)} ${user.role === 'assistant' ? '助教' : user.role === 'guest' ? '游客' : '学员'}`
  const finalWatermark = watermarkText || defaultWatermark

  // Send heartbeat to mock backend
  const sendHeartbeat = (event: 'play' | 'pause' | 'end' | 'tick', currentDuration: number) => {
    if (!useMock) return
    postHeartbeat({
      userNumber: user.number,
      vid: isLive ? undefined : credential.vid,
      roomCode: isLive ? credential.liveCode : undefined,
      duration: currentDuration,
      event,
    }).catch(() => {
      // ignore network errors in POC
    })
  }

  // Load VOD SDK when needed
  useEffect(() => {
    if (useMock || isLive || !hasRealVod) {
      setSdkReady(true)
      setPlayerState('ready')
      return
    }

    let mounted = true
    setSdkReady(false)
    setPlayerState('loading')

    const loadScript = (src: string) =>
      new Promise<void>((resolve, reject) => {
        const existing = document.querySelector<HTMLScriptElement>(`script[data-bjy-sdk="${src}"]`)
        if (existing) {
          resolve()
          return
        }
        const script = document.createElement('script')
        script.src = src
        script.async = true
        script.dataset.bjySdk = src
        script.onload = () => resolve()
        script.onerror = () => reject(new Error(`Failed to load ${src}`))
        document.body.appendChild(script)
      })

    Promise.all(VOD_SDK_URLS.map(loadScript))
      .then(() => {
        if (mounted) setSdkReady(true)
      })
      .catch(() => {
        if (mounted) {
          setSdkReady(false)
          setPlayerState('error')
        }
      })

    return () => {
      mounted = false
    }
  }, [useMock, hasRealVod, isLive])

  // Initialize real VOD player
  useEffect(() => {
    if (useMock || isLive || !hasRealVod || !sdkReady || !containerRef.current || !window.BPlayer) {
      return
    }

    const roleDisplay = user.role === 'assistant' ? '助教' : user.role === 'guest' ? '游客' : '学员'
    const bplayer = new window.BPlayer({
      container: containerRef.current,
      useFFplayerMSE: true,
      memory: true,
      enableDrag: true,
      onlyDragWatched: false,
      preload: 'meta',
      volume: 0.75,
      quality: 'superHD',
      rateList: [0.5, 0.75, 1, 1.25, 1.5, 2],
      vid: credential.vid,
      token: credential.token,
      env: '',
      user: {
        name: user.name,
        number: user.number,
        role: roleDisplay,
      },
      enableGestureControl: true,
      plugins: {
        marquee: {
          displayMode: 'roll',
          rollDuration: 10,
          type: 1,
          count: 2,
          color: '#ffffff',
          fontOpacity: 0.86,
          fontSize: 14,
          backgroundColor: '#1795ff',
          backgroundOpacity: 0.62,
          position: 'random',
          value: finalWatermark,
        },
        signConfig: {
          seconds: [600],
          title: '学习签到',
          content: '请点击签到，签到后可继续学习',
          okText: '签到',
        },
      },
    })

    const updateDuration = (delta: number) => {
      durationRef.current += delta
      setDuration(durationRef.current)
      onDurationUpdate?.(durationRef.current)
    }

    bplayer.on?.('ready', () => setPlayerState('ready'))
    bplayer.on?.('play', () => {
      lastTickRef.current = Date.now()
    })
    bplayer.on?.('pause', () => {
      if (lastTickRef.current) {
        updateDuration((Date.now() - lastTickRef.current) / 1000)
        lastTickRef.current = null
      }
    })
    bplayer.on?.('timeupdate', () => {
      if (lastTickRef.current) {
        const now = Date.now()
        const delta = (now - lastTickRef.current) / 1000
        if (delta >= 1) {
          updateDuration(delta)
          lastTickRef.current = now
        }
      }
    })
    bplayer.on?.('ended', () => {
      if (lastTickRef.current) {
        updateDuration((Date.now() - lastTickRef.current) / 1000)
        lastTickRef.current = null
      }
    })

    setPlayerState('ready')

    return () => {
      if (lastTickRef.current) {
        updateDuration((Date.now() - lastTickRef.current) / 1000)
      }
      bplayer.destroy?.()
    }
  }, [useMock, hasRealVod, isLive, sdkReady, credential, user, finalWatermark, onDurationUpdate])

  // Mock replay: HTML5 video duration tracking
  useEffect(() => {
    if (!useMock || isLive || !videoRef.current) return

    const video = videoRef.current
    let rafId: number | null = null

    const update = () => {
      if (!video.paused && !video.ended) {
        const current = video.currentTime
        durationRef.current = current
        setDuration(current)
        onDurationUpdate?.(current)
        sendHeartbeat('tick', current)
      }
      rafId = requestAnimationFrame(update)
    }

    const onPlay = () => {
      sendHeartbeat('play', video.currentTime)
      rafId = requestAnimationFrame(update)
    }
    const onPause = () => {
      sendHeartbeat('pause', video.currentTime)
      if (rafId) cancelAnimationFrame(rafId)
    }
    const onEnded = () => {
      sendHeartbeat('end', video.currentTime)
      if (rafId) cancelAnimationFrame(rafId)
    }

    video.addEventListener('play', onPlay)
    video.addEventListener('pause', onPause)
    video.addEventListener('ended', onEnded)
    rafId = requestAnimationFrame(update)

    return () => {
      video.removeEventListener('play', onPlay)
      video.removeEventListener('pause', onPause)
      video.removeEventListener('ended', onEnded)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [useMock, isLive, onDurationUpdate])

  // Mock live: simulated duration tracking
  useEffect(() => {
    if (!useMock || !isLive) return
    const interval = setInterval(() => {
      durationRef.current += 1
      setDuration(durationRef.current)
      onDurationUpdate?.(durationRef.current)
      if (durationRef.current % 5 === 0) {
        sendHeartbeat('tick', durationRef.current)
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [useMock, isLive, onDurationUpdate])

  // Non-mock live fallback duration tracking
  useEffect(() => {
    if (useMock || !isLive) return
    const interval = setInterval(() => {
      durationRef.current += 1
      setDuration(durationRef.current)
      onDurationUpdate?.(durationRef.current)
    }, 1000)
    return () => clearInterval(interval)
  }, [useMock, isLive, onDurationUpdate])

  const placeholderLines = isLive
    ? ['大班直播', 'iframe 嵌入', '未配置真实房间']
    : mode === 'trial'
      ? ['试看中', 'BPlayer VOD', '未配置真实 vid/token']
      : ['回放', 'BPlayer VOD', '未配置真实 vid/token']

  const showRealPlayer = !useMock && ((isLive && hasRealLive) || (!isLive && hasRealVod))
  const showMockPlayer = useMock

  return (
    <div className="overflow-hidden rounded-[8px] bg-[#111827] text-white shadow-sm">
      <div className="flex items-center justify-between border-b border-white/10 px-3 py-2 text-[12px]">
        <div className="flex min-w-0 items-center gap-2">
          <span
            className={
              isLive
                ? 'rounded bg-[#ff3141] px-2 py-1 font-bold'
                : 'rounded bg-white/16 px-2 py-1 font-bold'
            }
          >
            {useMock ? 'Mock 模拟' : isLive ? '百家云直播' : 'BPlayer 回放'}
          </span>
          <span className="truncate text-white/72">
            {isLive ? `room:${credential.liveCode}` : `vid:${credential.vid || '-'}`}
          </span>
        </div>
        <span className="text-white/60">
          {playerState === 'error'
            ? '加载失败'
            : playerState === 'ready'
              ? '已就绪'
              : '加载中'}
        </span>
      </div>

      <div className="relative aspect-video bg-black">
        {showMockPlayer ? (
          isLive ? (
            <MockLivePlayer
              title={title}
              subtitle={subtitle}
              roomInfo={mockRoomInfo}
              user={user}
              duration={duration}
            />
          ) : (
            <video
              ref={videoRef}
              src={mockVideoUrl}
              controls
              className="h-full w-full"
              poster=""
            />
          )
        ) : isLive ? (
          hasRealLive ? (
            <iframe
              title="百家云直播播放器"
              src={buildLiveIframeSrc(credential.liveCode, user)}
              className="h-full w-full border-0"
              allow="autoplay; fullscreen; microphone; camera"
            />
          ) : (
            <PlaceholderPlayer title={title} subtitle={subtitle} lines={placeholderLines} isLive />
          )
        ) : (
          <div ref={containerRef} className="h-full w-full">
            {!hasRealVod && (
              <PlaceholderPlayer title={title} subtitle={subtitle} lines={placeholderLines} />
            )}
          </div>
        )}

        {showRealPlayer && !isLive && (!sdkReady || playerState !== 'ready') && (
          <SdkLoadingOverlay title={title} subtitle={subtitle} playerState={playerState} />
        )}

        <div className="pointer-events-none absolute right-3 top-3 rounded bg-black/45 px-2 py-1 text-[11px]">
          水印：{finalWatermark}
        </div>

        <div className="pointer-events-none absolute left-3 top-3 rounded bg-black/45 px-2 py-1 text-[11px]">
          已观看 {formatDuration(duration)}
        </div>
      </div>

      <div className="grid grid-cols-3 border-t border-white/10 text-center text-[12px] text-white/72">
        <div className="py-2">{isLive ? '线路一' : '倍速'}</div>
        <div className="py-2">{isLive ? '高清' : '记忆播放'}</div>
        <div className="flex items-center justify-center gap-1 py-2">
          <VideoOutline />
          {isLive ? '大班直播' : mode === 'trial' ? '试听' : '回放'}
        </div>
      </div>
    </div>
  )
}

function PlaceholderPlayer({
  title,
  subtitle,
  lines,
  isLive,
}: {
  title: string
  subtitle: string
  lines: string[]
  isLive?: boolean
}) {
  return (
    <div className="grid h-full place-items-center bg-[radial-gradient(circle_at_25%_20%,rgba(23,149,255,.28),transparent_30%),linear-gradient(135deg,#111827_0%,#182033_55%,#050816_100%)] text-center">
      <div>
        <div className="mb-3 flex justify-center gap-2 text-[11px]">
          {lines.map((item, index) => (
            <span
              key={item}
              className={`rounded px-2 py-1 ${
                index === 0 ? (isLive ? 'bg-[#ff3141]' : 'bg-[#1795ff]') + ' font-bold' : 'bg-white/16'
              }`}
            >
              {item}
            </span>
          ))}
        </div>
        <button className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-white/18 text-[26px] backdrop-blur">
          <PlayOutline />
        </button>
        <div className="mt-3 text-[17px] font-bold">{title}</div>
        <div className="mt-1 text-[12px] text-white/65">{subtitle}</div>
        <div className="mx-auto mt-4 h-1.5 w-64 max-w-[80%] overflow-hidden rounded-full bg-white/24">
          <div
            className={`h-full rounded-full ${isLive ? 'bg-[#ff3141]' : 'bg-[#1795ff]'}`}
            style={{ width: isLive ? '38%' : '63%' }}
          />
        </div>
        <div className="mt-2 flex justify-center gap-8 text-[11px] text-white/65">
          <span>{isLive ? '大班直播占位' : '56:42 / 01:30:00'}</span>
          <span>线路一 · 高清 · 全屏</span>
        </div>
      </div>
    </div>
  )
}

function SdkLoadingOverlay({
  title,
  subtitle,
  playerState,
}: {
  title: string
  subtitle: string
  playerState: string
}) {
  return (
    <div className="absolute inset-0 grid place-items-center bg-[radial-gradient(circle_at_25%_20%,rgba(23,149,255,.28),transparent_30%),linear-gradient(135deg,#111827_0%,#182033_55%,#050816_100%)] text-center">
      <div>
        <button className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-white/18 text-[26px] backdrop-blur">
          <PlayOutline />
        </button>
        <div className="mt-3 text-[17px] font-bold">{title}</div>
        <div className="mt-1 text-[12px] text-white/65">{subtitle}</div>
        <div className="mt-3 text-[11px] text-white/48">
          {playerState === 'error' ? 'SDK 加载失败，请检查网络或凭证' : '正在加载百家云播放器 SDK'}
        </div>
      </div>
    </div>
  )
}

function MockLivePlayer({
  title,
  subtitle,
  roomInfo,
  user,
  duration,
}: {
  title: string
  subtitle: string
  roomInfo: LiveRoomInfo | null | undefined
  user: PocUser
  duration: number
}) {
  const [chatMessages] = useState([
    { name: '学员A', text: '老师好！' },
    { name: '学员B', text: '能听到' },
    { name: '周助教', text: '请大家签到' },
  ])

  const roleText = user.role === 'assistant' ? '助教' : user.role === 'guest' ? '游客' : '学员'
  const canChat = roomInfo?.allowChat && user.role !== 'guest'
  const canMic = roomInfo?.allowMic && user.role === 'assistant'

  return (
    <div className="relative flex h-full w-full flex-col bg-gradient-to-br from-[#111827] via-[#1b2438] to-[#050816]">
      <div className="absolute left-3 top-3 flex gap-2 text-[11px]">
        <span className="rounded bg-[#ff3141] px-2 py-1 font-bold">直播中</span>
        <span className="rounded bg-white/16 px-2 py-1">Mock 大班</span>
        {roomInfo && (
          <span className="rounded bg-white/16 px-2 py-1">
            在线 {roomInfo.onlineCount}/{roomInfo.maxOnline}
          </span>
        )}
      </div>

      <div className="absolute right-3 top-3 text-[11px]">
        <span className="rounded bg-white/16 px-2 py-1">{user.name} · {roleText}</span>
      </div>

      <div className="flex flex-1 items-center justify-center px-6 text-center">
        <div>
          <div className="mx-auto mb-4 h-16 w-16 animate-pulse rounded-full bg-[#ff3141]/20">
            <div className="flex h-full w-full items-center justify-center">
              <div className="h-4 w-4 rounded-full bg-[#ff3141]" />
            </div>
          </div>
          <div className="text-[17px] font-bold">{title}</div>
          <div className="mt-1 text-[12px] text-white/65">{subtitle}</div>
          <div className="mt-4 text-[11px] text-white/50">
            已观看 {formatDuration(duration)} · Mock 模拟直播画面
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
        <div className="mb-2 flex items-center justify-between text-[11px] text-white/70">
          <span>线路一 · 高清</span>
          <span>{roomInfo?.teacher || 'Mock 老师'}</span>
        </div>
        <div className="flex gap-2">
          {canChat && (
            <button className="flex-1 rounded bg-white/16 py-2 text-[12px]">发弹幕</button>
          )}
          {canMic && (
            <button className="flex-1 rounded bg-[#1795ff] py-2 text-[12px]">连麦</button>
          )}
          {!canChat && !canMic && (
            <span className="text-[11px] text-white/50">当前身份无互动权限</span>
          )}
        </div>
      </div>

      <div className="absolute bottom-24 right-3 max-w-[45%] space-y-2 text-[11px]">
        {chatMessages.map((msg, i) => (
          <div key={i} className="rounded bg-black/40 px-2 py-1">
            <span className="text-white/70">{msg.name}:</span> {msg.text}
          </div>
        ))}
      </div>
    </div>
  )
}
