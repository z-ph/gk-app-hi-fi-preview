import type { PocUser } from '@/components/BaijiayunPocPlayer'

const MOCK_API_BASE = import.meta.env.VITE_MOCK_API_URL || 'http://127.0.0.1:3014'

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${MOCK_API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || `Request failed: ${res.status}`)
  }
  return res.json() as Promise<T>
}

export type LiveRoomInfo = {
  code: string
  title: string
  subtitle: string
  status: 'living' | 'not_started' | 'ended'
  teacher: string
  startTime: string
  endTime: string
  onlineCount: number
  maxOnline: number
  allowChat: boolean
  allowMic: boolean
  playerUrl: string | null
}

export type ReplayInfo = {
  vid: string
  title: string
  subtitle: string
  teacher: string
  duration: number
  coverUrl: string
  token: string
  allowDownload: boolean
  videoUrl: string
  chapters: Array<{ title: string; start: number; end: number }>
}

export type UserInfo = PocUser & {
  permissions: string[]
  watermark: string
}

export type WatchRecord = {
  userNumber: string
  key: string
  totalSeconds: number
  thisSessionDuration?: number
  sessions?: Array<{ from: string; to: string; delta: number }>
}

export function getLiveRoom(code: string) {
  return request<LiveRoomInfo>(`/api/live/rooms/${code}`)
}

export function getLivePlayerUrl(code: string, userNumber: string, userName?: string) {
  const qs = new URLSearchParams({ userNumber })
  if (userName) qs.set('userName', userName)
  return request<{
    code: string
    name: string
    number: string
    role: string
    playerUrl: string | null
    isMock: boolean
  }>(`/api/live/rooms/${code}/player-url?${qs.toString()}`)
}

export function getReplay(vid: string) {
  return request<ReplayInfo>(`/api/replay/${vid}`)
}

export function getUser(number: string) {
  return request<UserInfo>(`/api/users/${number}`)
}

export function getWatermark(userNumber: string) {
  return request<{ text: string; style: Record<string, unknown> }>(
    `/api/watermark?userNumber=${userNumber}`,
  )
}

export function postHeartbeat(body: {
  userNumber: string
  vid?: string
  roomCode?: string
  duration: number
  event: 'play' | 'pause' | 'end' | 'tick'
}) {
  return request<WatchRecord>('/api/watch/heartbeat', {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

export function getDuration(userNumber: string, key: { vid?: string; roomCode?: string }) {
  const qs = new URLSearchParams({ userNumber })
  if (key.vid) qs.set('vid', key.vid)
  if (key.roomCode) qs.set('roomCode', key.roomCode)
  return request<WatchRecord>(`/api/watch/duration?${qs.toString()}`)
}
