import { useEffect, useRef, useState } from 'react'
import { PlayOutline, VideoOutline } from 'antd-mobile-icons'
import type { BaijiayunMode } from '@/types/app'

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

interface BaijiayunPlayerProps {
  readonly title: string
  readonly subtitle: string
  readonly mode: BaijiayunMode
  readonly classId: string
  readonly vid?: string
  readonly token?: string
}

export function BaijiayunPlayer({
  title,
  subtitle,
  mode,
  classId,
  vid,
  token,
}: BaijiayunPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [sdkReady, setSdkReady] = useState(false)
  const [playerState, setPlayerState] = useState<'loading' | 'ready'>('loading')
  const isLive = mode === 'live'
  const playerId = isLive ? `BJYPlayer-${classId}` : `BPlayer-${vid || classId}`
  const hasRealVodCredentials = Boolean(vid && token && !token.startsWith('bjy-'))

  useEffect(() => {
    if (isLive || !hasRealVodCredentials) {
      setSdkReady(true)
      setPlayerState('ready')
      return
    }

    let mounted = true
    const loadScript = (src: string) =>
      new Promise<void>((resolve, reject) => {
        const existing = document.querySelector<HTMLScriptElement>(
          `script[data-bjy-sdk="${src}"]`,
        )

        if (existing) {
          resolve()
          return
        }

        const script = document.createElement('script')
        script.src = src
        script.async = true
        script.dataset.bjySdk = src
        script.onload = () => resolve()
        script.onerror = () => reject(new Error(src))
        document.body.appendChild(script)
      })

    Promise.all(VOD_SDK_URLS.map(loadScript))
      .then(() => {
        if (mounted) setSdkReady(true)
      })
      .catch(() => {
        if (mounted) setSdkReady(false)
      })

    return () => {
      mounted = false
    }
  }, [hasRealVodCredentials, isLive])

  useEffect(() => {
    if (
      isLive ||
      !hasRealVodCredentials ||
      !sdkReady ||
      !containerRef.current ||
      !window.BPlayer ||
      !vid ||
      !token
    ) {
      return
    }

    const bplayer = new window.BPlayer({
      container: containerRef.current,
      useFFplayerMSE: true,
      memory: true,
      enableDrag: mode !== 'trial',
      onlyDragWatched: mode === 'trial',
      trialDuration: mode === 'trial' ? 1080 : -1,
      preload: 'meta',
      volume: 0.75,
      quality: 'superHD',
      rateList: [0.5, 0.75, 1, 1.25, 1.5, 2],
      vid,
      token,
      env: '',
      user: {
        name: '陈思远',
        number: '9001',
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
          value: '陈思远 138****5678 正在观看',
        },
        signConfig: {
          seconds: [600],
          title: '学习签到',
          content: '请点击签到，签到后可继续学习',
          okText: '签到',
        },
        trialConfig: {
          show: mode === 'trial',
          title: '试听提醒',
          content: '试听部分结束后，可确认老师并继续报名流程。',
          okText: '继续报名',
          cancelText: '再看看',
        },
      },
    })

    bplayer.on?.('ready', () => setPlayerState('ready'))
    setPlayerState('ready')

    return () => {
      bplayer.destroy?.()
    }
  }, [hasRealVodCredentials, isLive, mode, sdkReady, token, vid])

  const iframeSrc =
    'https://gk-interview.at.baijiayun.com/web/room/codePlayer?code=gk2026&user_name=%E9%99%88%E6%80%9D%E8%BF%9C&user_number=9001&width=1280&height=720&showControls=true'
  const liveFrameDocument = `
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8" />
    <style>
      * { box-sizing: border-box; }
      body { margin: 0; width: 100vw; height: 100vh; overflow: hidden; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; color: #fff; background: #050816; }
      .stage { position: relative; width: 100%; height: 100%; background: radial-gradient(circle at 24% 20%, rgba(23,149,255,.32), transparent 30%), linear-gradient(135deg, #111827 0%, #1b2438 52%, #050816 100%); }
      .tag { position: absolute; left: 12px; top: 12px; display: flex; gap: 8px; font-size: 11px; }
      .tag span { border-radius: 4px; padding: 5px 8px; background: rgba(255,255,255,.16); }
      .tag .live { background: #ff3141; font-weight: 700; }
      .watermark { position: absolute; right: 12px; top: 12px; border-radius: 4px; padding: 5px 8px; background: rgba(0,0,0,.42); font-size: 11px; }
      .center { position: absolute; inset: 0; display: grid; place-items: center; text-align: center; }
      .play { width: 54px; height: 54px; margin: 0 auto 12px; border-radius: 50%; display: grid; place-items: center; background: rgba(255,255,255,.18); font-size: 24px; }
      .title { font-size: 17px; font-weight: 700; }
      .sub { margin-top: 6px; font-size: 12px; color: rgba(255,255,255,.66); }
      .controls { position: absolute; left: 0; right: 0; bottom: 0; padding: 42px 12px 10px; background: linear-gradient(to top, rgba(0,0,0,.78), transparent); font-size: 11px; }
      .bar { height: 4px; border-radius: 999px; background: rgba(255,255,255,.24); overflow: hidden; }
      .bar div { width: 72%; height: 100%; background: #1795ff; }
      .row { display: flex; align-items: center; justify-content: space-between; margin-top: 8px; color: rgba(255,255,255,.76); }
    </style>
  </head>
  <body>
    <div class="stage">
      <div class="tag"><span class="live">直播中</span><span>百家云</span><span>低延迟</span></div>
      <div class="watermark">水印：陈思远 138****5678</div>
      <div class="center"><div><div class="play">▶</div><div class="title">${title}</div><div class="sub">${subtitle}</div></div></div>
      <div class="controls"><div class="bar"><div></div></div><div class="row"><span>01:24:18</span><span>线路一 · 高清 · 全屏</span></div></div>
    </div>
  </body>
</html>`
  const placeholderLines =
    mode === 'trial'
      ? ['试看中', '百家云 BPlayer', '试听']
      : ['回放', '百家云 BPlayer', '1080P']

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
            {isLive ? '百家云直播' : 'BPlayer'}
          </span>
          <span className="truncate text-white/72">{playerId}</span>
        </div>
        <span className="text-white/60">
          {playerState === 'ready' ? '已就绪' : '加载中'}
        </span>
      </div>

      <div className="relative aspect-video bg-black">
        {isLive ? (
          <iframe
            title="百家云直播播放器"
            srcDoc={liveFrameDocument}
            data-bjy-src={iframeSrc}
            className="h-full w-full border-0"
            allow="autoplay; fullscreen; microphone; camera"
          />
        ) : (
          <div ref={containerRef} className="h-full w-full">
            {!hasRealVodCredentials && (
              <div className="grid h-full place-items-center bg-[radial-gradient(circle_at_25%_20%,rgba(23,149,255,.28),transparent_30%),linear-gradient(135deg,#111827_0%,#182033_55%,#050816_100%)] text-center">
                <div>
                  <div className="mb-3 flex justify-center gap-2 text-[11px]">
                    {placeholderLines.map((item, index) => (
                      <span
                        key={item}
                        className={`rounded px-2 py-1 ${
                          index === 0 ? 'bg-[#1795ff] font-bold' : 'bg-white/16'
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
                      className="h-full rounded-full bg-[#1795ff]"
                      style={{ width: mode === 'trial' ? '42%' : '63%' }}
                    />
                  </div>
                  <div className="mt-2 flex justify-center gap-8 text-[11px] text-white/65">
                    <span>
                      {mode === 'trial' ? '07:38 / 18:00' : '56:42 / 01:30:00'}
                    </span>
                    <span>1.0x · 高清 · 全屏</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {hasRealVodCredentials && !isLive && (!sdkReady || playerState !== 'ready') && (
          <div className="absolute inset-0 grid place-items-center bg-[radial-gradient(circle_at_25%_20%,rgba(23,149,255,.28),transparent_30%),linear-gradient(135deg,#111827_0%,#182033_55%,#050816_100%)] text-center">
            <div>
              <button className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-white/18 text-[26px] backdrop-blur">
                <PlayOutline />
              </button>
              <div className="mt-3 text-[17px] font-bold">{title}</div>
              <div className="mt-1 text-[12px] text-white/65">{subtitle}</div>
              <div className="mt-3 text-[11px] text-white/48">
                正在加载百家云播放器 SDK
              </div>
            </div>
          </div>
        )}

        <div className="pointer-events-none absolute right-3 top-3 rounded bg-black/45 px-2 py-1 text-[11px]">
          水印：陈思远 138****5678
        </div>
      </div>

      <div className="grid grid-cols-3 border-t border-white/10 text-center text-[12px] text-white/72">
        <div className="py-2">{isLive ? '线路一' : '倍速'}</div>
        <div className="py-2">{isLive ? '高清' : '记忆播放'}</div>
        <div className="flex items-center justify-center gap-1 py-2">
          <VideoOutline />
          {isLive ? '直播间' : mode === 'trial' ? '试听' : '回放'}
        </div>
      </div>
    </div>
  )
}
