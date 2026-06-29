import { useState } from 'react'
import { Button, Card, Segmented, Tag } from 'antd-mobile'
import { BaijiayunPlayer } from '@/components/BaijiayunPlayer'
import { LiveSdkPocScreen } from '@/screens/LiveSdkPocScreen'
import {
  FeatureCard,
  MiniMetric,
  PageTitle,
  StatusPill,
  SummaryRow,
} from '@/components/ui'
import { liveLessons } from '@/mock/data'

export function LiveScreen() {
  const [room, setRoom] = useState<'live' | 'replay' | null>(null)
  const [showPoc, setShowPoc] = useState(false)

  if (showPoc) {
    return <LiveSdkPocScreen onBack={() => setShowPoc(false)} />
  }

  if (room) {
    const isReplay = room === 'replay'

    return (
      <div className="space-y-3 p-3 pb-24">
        <PageTitle
          title={isReplay ? '课程回放' : '直播间'}
          desc={isReplay ? '岗位匹配专题复盘' : '结构化面试大班课'}
        />
        <BaijiayunPlayer
          title={isReplay ? '岗位匹配专题复盘' : '周老师正在直播'}
          subtitle={isReplay ? '林老师 · 昨日 20:00-21:30' : '结构化面试大班课'}
          mode={isReplay ? 'replay' : 'live'}
          classId={isReplay ? 'replay-room-202606' : '18060537167627'}
          vid={isReplay ? '156406197' : undefined}
          token={isReplay ? 'bjy-replay-token' : undefined}
        />
        <Card title="学习记录" bodyStyle={{ padding: 14 }}>
          <div className="grid grid-cols-2 gap-3">
            <MiniMetric label="本节观看" value={isReplay ? '56m' : '84m'} />
            <MiniMetric label="累计观看" value="18.6h" />
          </div>
        </Card>
        <Card title={isReplay ? '回放控制' : '直播互动'} bodyStyle={{ padding: 14 }}>
          {isReplay ? (
            <div className="space-y-3">
              <Segmented
                block
                options={[
                  { label: '1.0x', value: '1' },
                  { label: '1.25x', value: '1.25' },
                  { label: '1.5x', value: '1.5' },
                ]}
                defaultValue="1"
              />
              <SummaryRow label="章节" value="岗位匹配、素材组织、追问复盘" />
              <SummaryRow label="下载" value="仅支持在线观看" strong />
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-2 text-center">
              {['弹幕', '连麦', '答题', '投票'].map((item) => (
                <button
                  key={item}
                  className="rounded-[8px] bg-[#f7f8fa] px-2 py-3 text-[12px] font-medium"
                >
                  {item}
                </button>
              ))}
            </div>
          )}
        </Card>
        <FeatureCard
          title="知识产权保护"
          desc="明显水印、动态跑马灯、禁止下载"
          right={<StatusPill label="已开启" tone="green" />}
        >
          <div className="space-y-2">
            <SummaryRow label="水印" value="陈思远 138****5678" />
            <SummaryRow label="在线限制" value="不支持同时在线观看" />
          </div>
        </FeatureCard>
        <div className="grid grid-cols-2 gap-2">
          <Button fill="outline" shape="rounded">
            观看记录
          </Button>
          <Button fill="outline" shape="rounded" onClick={() => setRoom(null)}>
            退出
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3 p-3 pb-24">
      <PageTitle title="直播课" desc="课表、回放、观看时长" />
      <FeatureCard
        title="SDK 能力 POC"
        desc="验证大班进房、回放、水印、权限映射、观看时长"
        right={<StatusPill label="可测试" tone="blue" />}
        onClick={() => setShowPoc(true)}
      />
      <FeatureCard
        title="观看权益"
        desc="真实姓名、手机号与导入名单匹配后开通"
        right={<StatusPill label="已开通" tone="green" />}
      >
        <div className="grid grid-cols-2 gap-3">
          <MiniMetric label="绑定设备" value="1/2" />
          <MiniMetric label="在线状态" value="未占用" />
        </div>
      </FeatureCard>
      {liveLessons.map((lesson) => (
        <Card key={lesson.title} bodyStyle={{ padding: 14 }}>
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="text-[15px] font-bold">{lesson.title}</div>
              <div className="mt-1 text-[12px] text-[#969696]">
                {lesson.time} · {lesson.teacher}
              </div>
              <div className="mt-2 flex gap-2">
                <Tag color={lesson.type === '小班课' ? 'warning' : 'primary'}>
                  {lesson.type}
                </Tag>
                <Tag color={lesson.status === '直播中' ? 'success' : 'default'}>
                  {lesson.status}
                </Tag>
                <Tag color={lesson.right === '名单待校验' ? 'warning' : 'primary'}>
                  {lesson.right}
                </Tag>
              </div>
            </div>
            <Button
              size="small"
              color={lesson.status === '直播中' ? 'primary' : 'default'}
              onClick={() => setRoom(lesson.status === '可看回放' ? 'replay' : 'live')}
            >
              {lesson.status === '直播中'
                ? '进入'
                : lesson.status === '可看回放'
                  ? '看回放'
                  : '详情'}
            </Button>
          </div>
        </Card>
      ))}
      <Card title="学习进度" bodyStyle={{ padding: 14 }}>
        <div className="grid grid-cols-2 gap-3">
          <MiniMetric label="观看时长" value="18.6h" />
          <MiniMetric label="互动次数" value="42" />
        </div>
      </Card>
      <Card title="课件资料" bodyStyle={{ padding: 14 }}>
        <div className="space-y-3">
          <SummaryRow label="PPT/PDF" value="3份可在线查看" />
          <SummaryRow label="视频/白板" value="随课程开放" />
          <SummaryRow label="回放日志" value="已同步学习记录" />
        </div>
      </Card>
    </div>
  )
}
