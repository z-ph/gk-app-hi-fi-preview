import { useState } from 'react'
import type { ReactNode } from 'react'
import { Button, Card, Selector, Tabs, Tag } from 'antd-mobile'
import {
  CalendarOutline,
  EnvironmentOutline,
  ExclamationCircleOutline,
  HistogramOutline,
} from 'antd-mobile-icons'
import {
  FeatureCard,
  MiniMetric,
  PageTitle,
  StatusPill,
  StickyAction,
  SummaryRow,
} from '@/components/ui'
import type { SprintView } from '@/types/app'

const sprintSlots = [
  {
    id: 'hz-0629-am',
    city: '杭州',
    date: '6月29日',
    time: '上午场',
    group: 'A组',
    status: '可报名',
  },
  {
    id: 'hz-0630-pm',
    city: '杭州',
    date: '6月30日',
    time: '下午场',
    group: 'B组',
    status: '名额紧张',
  },
]

export function SprintScreen({ onBack }: { onBack: () => void }) {
  const [view, setView] = useState<SprintView>('schedule')

  return (
    <div className="space-y-3 p-3 pb-24">
      <PageTitle title="线下冲刺" desc="选择场次、身份二维码、交换与成绩" />
      <Tabs activeKey={view} onChange={(key) => setView(key as SprintView)}>
        <Tabs.Tab title="场次" key="schedule" />
        <Tabs.Tab title="交换" key="exchange" />
        <Tabs.Tab title="成绩" key="score" />
      </Tabs>

      {view === 'schedule' && <SprintSchedule />}
      {view === 'exchange' && <SprintExchange />}
      {view === 'score' && <SprintScore />}

      <StickyAction>
        <div className="grid grid-cols-2 gap-2">
          <Button block fill="outline" shape="rounded" onClick={onBack}>
            返回首页
          </Button>
          <Button block color="primary" shape="rounded">
            确认当前场次
          </Button>
        </div>
      </StickyAction>
    </div>
  )
}

function SprintSchedule() {
  return (
    <>
      <FeatureCard
        title="身份信息"
        desc="现场核验仅展示编号和场次"
        right={<StatusPill label="已生成" tone="green" />}
      >
        <div className="grid grid-cols-[96px_1fr] gap-3">
          <div className="grid h-24 w-24 place-items-center rounded-[8px] border border-[#e5e6eb] bg-[#f7f8fa] text-[12px] text-[#969696]">
            身份二维码
          </div>
          <div className="space-y-2">
            <SummaryRow label="编号" value="DYS546149" strong />
            <SummaryRow label="真实姓名" value="后台可见" muted />
            <SummaryRow label="当前场次" value="杭州 6月29日 上午场" />
          </div>
        </div>
      </FeatureCard>

      {sprintSlots.map((slot) => (
        <FeatureCard
          key={slot.id}
          title={`${slot.city} ${slot.date} ${slot.time}`}
          desc={`${slot.group} · 现场结构化小组训练`}
          right={
            <StatusPill
              label={slot.status}
              tone={slot.status === '可报名' ? 'green' : 'orange'}
            />
          }
        >
          <div className="grid grid-cols-3 gap-2 text-center">
            <MiniSlot icon={<EnvironmentOutline />} label="地点" value="西湖校区" />
            <MiniSlot icon={<CalendarOutline />} label="签到" value="08:30" />
            <MiniSlot icon={<ExclamationCircleOutline />} label="人数" value="18/24" />
          </div>
        </FeatureCard>
      ))}
    </>
  )
}

function SprintExchange() {
  return (
    <>
      <Card title="交换需求" bodyStyle={{ padding: 14 }}>
        <div className="space-y-3">
          <SummaryRow label="当前场次" value="杭州 6月29日 上午场" />
          <SummaryRow label="期望场次" value="杭州 6月30日 下午场" strong />
          <SummaryRow label="身份编号" value="DYS546149 不变" />
        </div>
      </Card>
      <Card title="可交换场次" bodyStyle={{ padding: 14 }}>
        <Selector
          defaultValue={['hz-0630-pm']}
          options={[
            { label: '6月30日 下午场', value: 'hz-0630-pm' },
            { label: '7月1日 上午场', value: 'hz-0701-am' },
          ]}
        />
        <div className="mt-3 rounded-[8px] bg-[#fff7e6] p-3 text-[12px] leading-5 text-[#8a5a00]">
          交换成功后仅更新场次，现场核验编号不变。
        </div>
      </Card>
    </>
  )
}

function SprintScore() {
  return (
    <>
      <FeatureCard
        title="今日成绩"
        desc="每日扫码录入后定时公布"
        right={<Tag color="success">已公布</Tag>}
      >
        <div className="grid grid-cols-3 gap-2 text-center">
          <MiniMetric label="表达" value="84" />
          <MiniMetric label="内容" value="81" />
          <MiniMetric label="稳定性" value="88" />
        </div>
      </FeatureCard>
      <FeatureCard title="训练趋势" desc="近 3 次线下冲刺成绩">
        <div className="space-y-3">
          {[
            ['6月21日', '78'],
            ['6月25日', '82'],
            ['6月29日', '84'],
          ].map(([date, score]) => (
            <div key={date} className="flex items-center gap-3">
              <HistogramOutline className="text-[18px] text-[#1677ff]" />
              <div className="w-14 shrink-0 text-[12px] text-[#666]">{date}</div>
              <div className="h-2 flex-1 rounded-full bg-[#f2f3f5]">
                <div
                  className="h-2 rounded-full bg-[#1677ff]"
                  style={{ width: `${score}%` }}
                />
              </div>
              <div className="w-8 text-right text-[13px] font-bold">{score}</div>
            </div>
          ))}
        </div>
      </FeatureCard>
    </>
  )
}

function MiniSlot({
  icon,
  label,
  value,
}: {
  icon: ReactNode
  label: string
  value: string
}) {
  return (
    <div className="rounded-[8px] bg-[#f7f8fa] p-2">
      <div className="mx-auto grid h-6 w-6 place-items-center text-[#1677ff]">{icon}</div>
      <div className="mt-1 text-[13px] font-bold">{value}</div>
      <div className="mt-1 text-[11px] text-[#969696]">{label}</div>
    </div>
  )
}
