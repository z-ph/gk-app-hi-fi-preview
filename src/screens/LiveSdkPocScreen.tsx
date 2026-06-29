import { useEffect, useState } from 'react'
import { Button, Card, Input, Segmented, Selector, Switch, Tag, Toast } from 'antd-mobile'
import { BaijiayunPocPlayer, type PocCredential, type PocUser } from '@/components/BaijiayunPocPlayer'
import {
  getDuration,
  getLiveRoom,
  getReplay,
  getUser,
  getWatermark,
  type LiveRoomInfo,
  type ReplayInfo,
} from '@/api/mockLive'
import { PageTitle, StatusPill, SummaryRow } from '@/components/ui'
import type { BaijiayunMode } from '@/types/app'

const DEFAULT_USER: PocUser = {
  name: '陈思远',
  number: '9001',
  phone: '13800135678',
  role: 'student',
}

const ASSISTANT_USER: PocUser = {
  name: '周助教',
  number: '8001',
  phone: '13900135679',
  role: 'assistant',
}

const GUEST_USER: PocUser = {
  name: '游客用户',
  number: '0000',
  phone: '13700135677',
  role: 'guest',
}

const EMPTY_CREDENTIAL: PocCredential = {
  liveCode: '',
  vid: '',
  token: '',
}

const MOCK_CREDENTIAL: PocCredential = {
  liveCode: 'mock-live-room',
  vid: 'mock-vid',
  token: 'mock-replay-token-mock-vid',
}

function formatDuration(totalSeconds: number) {
  const h = Math.floor(totalSeconds / 3600)
  const m = Math.floor((totalSeconds % 3600) / 60)
  const s = Math.floor(totalSeconds % 60)
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}

export function LiveSdkPocScreen({ onBack }: { onBack: () => void }) {
  const [mode, setMode] = useState<BaijiayunMode>('live')
  const [credential, setCredential] = useState<PocCredential>(EMPTY_CREDENTIAL)
  const [user, setUser] = useState<PocUser>(DEFAULT_USER)
  const [useMock, setUseMock] = useState(false)
  const [duration, setDuration] = useState(0)
  const [key, setKey] = useState(0)

  const [roomInfo, setRoomInfo] = useState<LiveRoomInfo | null>(null)
  const [replayInfo, setReplayInfo] = useState<ReplayInfo | null>(null)
  const [watermarkText, setWatermarkText] = useState('')
  const [serverDuration, setServerDuration] = useState(0)
  const [loading, setLoading] = useState(false)

  const isLive = mode === 'live'
  const hasRealCredential = isLive
    ? Boolean(credential.liveCode && credential.liveCode.length >= 3)
    : Boolean(credential.vid && credential.token)

  // Fetch mock data when credentials or user change
  useEffect(() => {
    if (!useMock) {
      setRoomInfo(null)
      setReplayInfo(null)
      setWatermarkText('')
      setServerDuration(0)
      return
    }

    let cancelled = false
    setLoading(true)

    Promise.all([
      isLive ? getLiveRoom(credential.liveCode).catch(() => null) : Promise.resolve(null),
      !isLive ? getReplay(credential.vid).catch(() => null) : Promise.resolve(null),
      getWatermark(user.number).catch(() => ({ text: '' })),
      getDuration(user.number, isLive ? { roomCode: credential.liveCode } : { vid: credential.vid }).catch(
        () => ({ totalSeconds: 0 }),
      ),
    ])
      .then(([room, replay, watermark, dur]) => {
        if (cancelled) return
        setRoomInfo(room)
        setReplayInfo(replay)
        setWatermarkText(watermark.text)
        setServerDuration(dur.totalSeconds)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [useMock, mode, credential.liveCode, credential.vid, user.number])

  // Poll server duration every 5s in mock mode
  useEffect(() => {
    if (!useMock) return
    const poll = () => {
      getDuration(user.number, isLive ? { roomCode: credential.liveCode } : { vid: credential.vid })
        .then((d) => setServerDuration(d.totalSeconds))
        .catch(() => {})
    }
    poll()
    const id = setInterval(poll, 5000)
    return () => clearInterval(id)
  }, [useMock, mode, credential.liveCode, credential.vid, user.number])

  const applyPreset = (preset: 'mock' | 'real-live' | 'real-replay' | 'trial') => {
    if (preset === 'mock') {
      setUseMock(true)
      setMode('live')
      setCredential(MOCK_CREDENTIAL)
    } else if (preset === 'real-live') {
      setUseMock(false)
      setMode('live')
      setCredential(EMPTY_CREDENTIAL)
      Toast.show({ content: '请输入真实房间 code 后点击「重新加载播放器」' })
    } else if (preset === 'real-replay') {
      setUseMock(false)
      setMode('replay')
      setCredential(EMPTY_CREDENTIAL)
      Toast.show({ content: '请输入真实 vid + token 后点击「重新加载播放器」' })
    } else {
      setUseMock(false)
      setMode('trial')
      setCredential(EMPTY_CREDENTIAL)
      Toast.show({ content: '请输入真实试听课 vid + token' })
    }
    setKey((k) => k + 1)
    setDuration(0)
  }

  const resetDuration = () => {
    setDuration(0)
    setKey((k) => k + 1)
  }

  const switchUserRole = (role: PocUser['role']) => {
    if (role === 'student') setUser(DEFAULT_USER)
    if (role === 'assistant') setUser(ASSISTANT_USER)
    if (role === 'guest') setUser(GUEST_USER)
    setKey((k) => k + 1)
  }

  const handleMockToggle = (checked: boolean) => {
    setUseMock(checked)
    if (checked) {
      setCredential(MOCK_CREDENTIAL)
      Toast.show({ content: '已切换为 Mock 模拟模式（无真实 SDK）' })
    } else {
      setCredential(EMPTY_CREDENTIAL)
      Toast.show({ content: '已切换为真实 SDK 模式，请输入真实凭证' })
    }
    setKey((k) => k + 1)
    setDuration(0)
  }

  return (
    <div className="space-y-3 p-3 pb-28">
      <PageTitle title="直播 SDK POC" desc="验证真实百家云 SDK：大班进房、回放、水印、权限映射、观看时长" />

      <BaijiayunPocPlayer
        key={key}
        title={
          replayInfo?.title || roomInfo?.title || (isLive ? '大班直播课' : mode === 'trial' ? '试听课程' : '课程回放')
        }
        subtitle={
          replayInfo?.subtitle ||
          roomInfo?.subtitle ||
          (isLive ? '真实百家云 iframe 嵌入' : '真实 BPlayer VOD SDK')
        }
        mode={mode}
        credential={credential}
        user={user}
        watermarkText={watermarkText}
        useMock={useMock}
        mockVideoUrl={replayInfo?.videoUrl}
        mockRoomInfo={roomInfo}
        onDurationUpdate={setDuration}
      />

      {!useMock && !hasRealCredential && (
        <Card bodyStyle={{ padding: 14 }}>
          <div className="text-[14px] leading-6 text-[#d93026]">
            <strong>当前为真实 SDK 模式，但缺少凭证。</strong>
            <br />
            请输入百家云提供的真实{isLive ? '房间 code' : 'vid + token'}，或切换到下方「Mock 模拟」查看占位 UI。
          </div>
        </Card>
      )}

      <Card title="运行状态" bodyStyle={{ padding: 14 }}>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[14px] text-[#666]">当前模式</span>
            <Tag color={isLive ? 'success' : 'primary'}>
              {isLive ? '大班直播' : mode === 'trial' ? '试听' : '回放'}
            </Tag>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[14px] text-[#666]">SDK 接入状态</span>
            <StatusPill
              label={
                useMock
                  ? 'Mock 模拟（非真实 SDK）'
                  : hasRealCredential
                    ? '将使用真实百家云 SDK'
                    : '等待真实凭证'
              }
              tone={useMock ? 'blue' : hasRealCredential ? 'green' : 'orange'}
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[14px] text-[#666]">当前用户</span>
            <span className="text-[14px] font-medium">
              {user.name} · {user.role === 'assistant' ? '助教' : user.role === 'guest' ? '游客' : '学员'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[14px] text-[#666]">累计观看时长</span>
            <span className="text-[18px] font-bold text-[#1677ff]">{formatDuration(duration)}</span>
          </div>
          {useMock && (
            <div className="flex items-center justify-between">
              <span className="text-[14px] text-[#666]">Mock 后端累计时长</span>
              <span className="text-[14px] font-medium">{formatDuration(serverDuration)}</span>
            </div>
          )}
        </div>
      </Card>

      <Card title="快速预设" bodyStyle={{ padding: 14 }}>
        <div className="grid grid-cols-2 gap-2">
          <Button size="small" color="primary" fill="outline" onClick={() => applyPreset('real-live')}>
            真实大班直播
          </Button>
          <Button size="small" fill="outline" onClick={() => applyPreset('real-replay')}>
            真实回放
          </Button>
          <Button size="small" fill="outline" onClick={() => applyPreset('trial')}>
            真实试听
          </Button>
          <Button size="small" fill="outline" onClick={() => applyPreset('mock')}>
            Mock 占位（无凭证）
          </Button>
        </div>
        <div className="mt-2 text-[11px] text-[#969696]">
          提示：真实模式需填入百家云真实凭证才能看到 SDK 实际效果；Mock 占位仅用于无凭证时验证 UI 布局。
        </div>
      </Card>

      <Card title="模式与凭证" bodyStyle={{ padding: 14 }}>
        <div className="space-y-3">
          <div>
            <div className="mb-1 text-[13px] text-[#666]">播放模式</div>
            <Segmented
              block
              value={mode}
              onChange={(v) => {
                setMode(v as BaijiayunMode)
                setKey((k) => k + 1)
                setDuration(0)
              }}
              options={[
                { label: '大班直播', value: 'live' },
                { label: '回放', value: 'replay' },
                { label: '试听', value: 'trial' },
              ]}
            />
          </div>

          {isLive ? (
            <>
              <SummaryRow label="大班房间 code" value={credential.liveCode || '未填写'} />
              <Input
                placeholder="请输入百家云真实房间 code"
                value={credential.liveCode}
                onChange={(v) => setCredential((prev) => ({ ...prev, liveCode: v }))}
              />
            </>
          ) : (
            <>
              <SummaryRow label="回放 vid" value={credential.vid || '未填写'} />
              <Input
                placeholder="请输入百家云真实 vid"
                value={credential.vid}
                onChange={(v) => setCredential((prev) => ({ ...prev, vid: v }))}
              />
              <div className="mt-2">
                <SummaryRow label="回放 token" value={credential.token || '未填写'} />
                <Input
                  placeholder="请输入百家云真实 token"
                  value={credential.token}
                  onChange={(v) => setCredential((prev) => ({ ...prev, token: v }))}
                />
              </div>
            </>
          )}
        </div>
      </Card>

      <Card title="Mock 模拟（无真实凭证时使用）" bodyStyle={{ padding: 14 }}>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[15px] font-bold">使用 Mock 占位</div>
            <div className="text-[12px] text-[#969696]">
              开启后：直播用模拟画面、回放用本地 sample.mp4、不调用百家云 SDK
            </div>
          </div>
          <Switch checked={useMock} onChange={handleMockToggle} />
        </div>
      </Card>

      <Card title="用户 / 权限 / 水印" bodyStyle={{ padding: 14 }}>
        <div className="space-y-3">
          <div>
            <div className="mb-1 text-[13px] text-[#666]">快速切换身份</div>
            <Selector
              value={[user.role]}
              onChange={(v) => switchUserRole(v[0] as PocUser['role'])}
              options={[
                { label: '学员', value: 'student' },
                { label: '助教', value: 'assistant' },
                { label: '游客', value: 'guest' },
              ]}
            />
          </div>

          <div>
            <div className="mb-1 text-[13px] text-[#666]">昵称（传给百家云 user_name）</div>
            <Input
              placeholder="观看者昵称"
              value={user.name}
              onChange={(v) => setUser((prev) => ({ ...prev, name: v }))}
            />
          </div>

          <div>
            <div className="mb-1 text-[13px] text-[#666]">学号 / 用户编号（传给百家云 user_number）</div>
            <Input
              placeholder="用户编号"
              value={user.number}
              onChange={(v) => setUser((prev) => ({ ...prev, number: v }))}
            />
          </div>

          <div>
            <div className="mb-1 text-[13px] text-[#666]">手机号（用于水印）</div>
            <Input
              placeholder="手机号"
              value={user.phone}
              onChange={(v) => setUser((prev) => ({ ...prev, phone: v }))}
            />
          </div>

          <div className="rounded-[8px] bg-[#f7f8fa] p-3">
            <div className="text-[12px] text-[#969696]">预计水印内容</div>
            <div className="mt-1 text-[14px] font-medium">
              {watermarkText || `${user.name} ${user.phone.slice(0, 3)}****${user.phone.slice(-4)} ${user.role === 'assistant' ? '助教' : user.role === 'guest' ? '游客' : '学员'}`}
            </div>
          </div>

          {useMock && roomInfo && (
            <div className="rounded-[8px] bg-[#f7f8fa] p-3">
              <div className="text-[12px] text-[#969696]">Mock 后端权限</div>
              <div className="mt-1 text-[14px]">
                弹幕：{roomInfo.allowChat ? '允许' : '禁止'} / 连麦：{roomInfo.allowMic ? '允许' : '禁止'}
              </div>
            </div>
          )}
        </div>
      </Card>

      <Card title="观看时长验证" bodyStyle={{ padding: 14 }}>
        <div className="space-y-3">
          <SummaryRow label="当前累计时长" value={formatDuration(duration)} strong />
          {useMock && <SummaryRow label="Mock 后端累计时长" value={formatDuration(serverDuration)} />}
          <SummaryRow
            label="统计方式"
            value={
              useMock
                ? 'Mock 模拟：本地定时器 / HTML5 video 事件'
                : '真实 SDK：BPlayer play/pause/timeupdate 事件；直播为页面定时器'
            }
            muted
          />
          <Button block fill="outline" onClick={resetDuration}>
            重置时长并重新加载播放器
          </Button>
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-2">
        <Button fill="outline" shape="rounded" onClick={onBack}>
          返回直播课表
        </Button>
        <Button
          color="primary"
          shape="rounded"
          loading={loading}
          onClick={() => {
            setKey((k) => k + 1)
            setDuration(0)
          }}
        >
          重新加载播放器
        </Button>
      </div>
    </div>
  )
}
