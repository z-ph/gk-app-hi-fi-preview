import { useState } from 'react'
import { Button, Card, ProgressCircle, Selector, Tabs, Tag } from 'antd-mobile'
import {
  FeatureCard,
  MiniMetric,
  PageTitle,
  SectionTitle,
  StatusPill,
  StickyAction,
  SummaryRow,
} from '@/components/ui'
import { aiReports } from '@/mock/data'

export function AiScreen() {
  const [view, setView] = useState<'home' | 'answer' | 'report' | 'battle' | 'room' | 'mock'>(
    'home',
  )

  return (
    <div className="space-y-3 p-3 pb-24">
      <PageTitle title="AI 面试" desc="专项训练、AI报告、人工点评" />
      {view === 'home' && (
        <>
          <Tabs
            onChange={(key) => {
              if (key === 'battle' || key === 'room' || key === 'mock') {
                setView(key)
              }
            }}
          >
            <Tabs.Tab title="训练" key="practice" />
            <Tabs.Tab title="对战" key="battle" />
            <Tabs.Tab title="房间" key="room" />
            <Tabs.Tab title="模考" key="mock" />
          </Tabs>
          <Card bodyStyle={{ padding: 14 }}>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[15px] font-bold">今日推荐训练</div>
                <div className="mt-1 text-[12px] text-[#969696]">
                  组织管理题 · 思考 30 秒 · 答题 3 分钟
                </div>
              </div>
              <ProgressCircle percent={68} style={{ '--size': '58px' }}>
                68%
              </ProgressCircle>
            </div>
            <Button
              block
              color="primary"
              shape="rounded"
              className="mt-4"
              onClick={() => setView('answer')}
            >
              开始答题
            </Button>
          </Card>
          <Card title="题库选择" bodyStyle={{ padding: 14 }}>
            <Selector
              defaultValue={['special']}
              columns={2}
              options={[
                { label: '专项题', value: 'special' },
                { label: '结构化套题', value: 'set' },
                { label: '结构化小组', value: 'group' },
                { label: '岗位匹配', value: 'position' },
              ]}
            />
            <div className="mt-3 grid grid-cols-3 gap-2 text-center">
              <MiniMetric label="今日次数" value="2/5" />
              <MiniMetric label="人工点评" value="1次" />
              <MiniMetric label="薄弱题型" value="组织" />
            </div>
          </Card>
          <div className="grid grid-cols-3 gap-2">
            {[
              ['1v1匹配', 'battle'],
              ['创建房间', 'room'],
              ['全真模考', 'mock'],
            ].map(([label, target]) => (
              <Button
                key={label}
                block
                fill="outline"
                shape="rounded"
                onClick={() => setView(target as 'battle' | 'room' | 'mock')}
              >
                {label}
              </Button>
            ))}
          </div>
          <SectionTitle title="历史报告" right="排行榜 Top 100" />
          {aiReports.map((report) => (
            <button
              key={report.title}
              className="flex w-full items-center rounded-[8px] bg-white p-4 text-left shadow-sm"
              onClick={() => setView('report')}
            >
              <div className="flex-1">
                <div className="text-[15px] font-bold">{report.title}</div>
                <div className="mt-1 text-[12px] text-[#969696]">{report.desc}</div>
              </div>
              <div className="text-right">
                <div className="text-[24px] font-bold text-[#1677ff]">
                  {report.score}
                </div>
                <div className="text-[12px] text-[#969696]">{report.status}</div>
              </div>
            </button>
          ))}
        </>
      )}
      {view === 'answer' && <AiAnswer onDone={() => setView('report')} />}
      {view === 'report' && <AiReport onBack={() => setView('home')} />}
      {view === 'battle' && <AiBattle onBack={() => setView('home')} />}
      {view === 'room' && <AiRoom onBack={() => setView('home')} />}
      {view === 'mock' && <AiMock onBack={() => setView('home')} />}
    </div>
  )
}

function AiAnswer({ onDone }: { onDone: () => void }) {
  return (
    <>
      <Card bodyStyle={{ padding: 14 }}>
        <div className="flex items-center justify-between">
          <Tag color="primary">应急应变</Tag>
          <div className="text-[15px] font-bold text-[#FF5733]">02:48</div>
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2 text-center">
          <MiniMetric label="思考" value="00:30" />
          <MiniMetric label="答题" value="03:00" />
          <MiniMetric label="剩余次数" value="3" />
        </div>
        <div className="mt-4 text-[16px] font-bold leading-7">
          群众反映窗口排队时间过长，现场情绪激动。作为现场负责人，你会如何处理？
        </div>
        <textarea
          className="mt-4 h-36 w-full resize-none rounded-[8px] border border-[#eee] bg-[#f7f8fa] p-3 text-[14px] outline-none"
          placeholder="输入答题要点，或使用录音/录像提交。"
        />
        <div className="mt-3 grid grid-cols-2 gap-2">
          <Button block fill="outline" shape="rounded">
            开始录音
          </Button>
          <Button block fill="outline" shape="rounded">
            开启录像
          </Button>
        </div>
        <div className="mt-3 rounded-[8px] bg-[#fff7e6] p-3 text-[12px] leading-5 text-[#8a5a00]">
          录像提交后会检测东张西望、明显卡顿和多余动作。
        </div>
      </Card>
      <StickyAction>
        <Button block color="primary" shape="rounded" onClick={onDone}>
          提交答题并生成报告
        </Button>
      </StickyAction>
    </>
  )
}

function AiReport({ onBack }: { onBack: () => void }) {
  return (
    <>
      <Card bodyStyle={{ padding: 16 }}>
        <div className="flex items-end justify-between">
          <div>
            <div className="text-[13px] text-[#969696]">AI 点评总分</div>
            <div className="mt-1 text-[42px] font-bold text-[#1677ff]">82</div>
          </div>
          <Tag color="warning">人工点评中</Tag>
        </div>
        {[
          ['逻辑结构', 86],
          ['内容完整', 80],
          ['表达流畅', 78],
          ['岗位匹配', 84],
        ].map(([label, value]) => (
          <div key={label} className="mt-3">
            <div className="mb-1 flex justify-between text-[12px] text-[#969696]">
              <span>{label}</span>
              <span>{value}</span>
            </div>
            <div className="h-2 rounded-full bg-[#f2f3f5]">
              <div
                className="h-2 rounded-full bg-[#1677ff]"
                style={{ width: `${value}%` }}
              />
            </div>
          </div>
        ))}
      </Card>
      <Card title="AI 点评建议" bodyStyle={{ padding: 14 }}>
        <div className="text-[14px] leading-6 text-[#666]">
          开头能快速稳定现场，但中段措施偏笼统，需要明确“分流、解释、增开窗口、复盘排班”四步。建议补充现场沟通话术。
        </div>
      </Card>
      <Card title="人工点评申请" bodyStyle={{ padding: 14 }}>
        <div className="space-y-3">
          <SummaryRow label="申请状态" value="工作人员已接单" strong />
          <SummaryRow label="点评形式" value="文字 + 语音" />
          <SummaryRow label="预计反馈" value="今晚 22:00 前" />
        </div>
      </Card>
      <StickyAction>
        <div className="grid grid-cols-2 gap-2">
          <Button block fill="outline" shape="rounded" onClick={onBack}>
            返回训练
          </Button>
          <Button block color="primary" shape="rounded">
            下载报告
          </Button>
        </div>
      </StickyAction>
    </>
  )
}

function AiBattle({ onBack }: { onBack: () => void }) {
  return (
    <>
      <FeatureCard
        title="随机 1v1 对战"
        desc="同一套题答完后由 AI 对比胜负"
        right={<StatusPill label="匹配中" tone="orange" />}
      >
        <div className="grid grid-cols-2 gap-3">
          <MiniMetric label="等待人数" value="12" />
          <MiniMetric label="超时退出" value="01:20" />
        </div>
      </FeatureCard>
      <FeatureCard title="胜负规则" desc="总分、内容完整性、表达流畅度综合比较">
        <div className="space-y-3">
          <SummaryRow label="题型" value="综合分析" />
          <SummaryRow label="题目来源" value="AI 随机出题" />
          <SummaryRow label="展示结果" value="得分对比 + 维度雷达" />
        </div>
      </FeatureCard>
      <StickyAction>
        <div className="grid grid-cols-2 gap-2">
          <Button block fill="outline" shape="rounded" onClick={onBack}>
            取消匹配
          </Button>
          <Button block color="primary" shape="rounded">
            继续等待
          </Button>
        </div>
      </StickyAction>
    </>
  )
}

function AiRoom({ onBack }: { onBack: () => void }) {
  return (
    <>
      <Card title="创建房间" bodyStyle={{ padding: 14 }}>
        <div className="space-y-3">
          <SummaryRow label="房间人数" value="4人" />
          <SummaryRow label="思考时间" value="30秒" />
          <SummaryRow label="答题时间" value="3分钟" />
          <SummaryRow label="题目方式" value="房主选择套题" />
        </div>
      </Card>
      <FeatureCard
        title="邀请好友 PK"
        desc="结束后公布房间排行榜"
        right={<StatusPill label="房主" tone="blue" />}
      >
        <div className="rounded-[8px] bg-[#f7f8fa] p-3 text-[12px] leading-5 text-[#666]">
          房间码 GK8264，好友输入后加入本场训练。
        </div>
      </FeatureCard>
      <StickyAction>
        <div className="grid grid-cols-2 gap-2">
          <Button block fill="outline" shape="rounded" onClick={onBack}>
            返回
          </Button>
          <Button block color="primary" shape="rounded">
            开始房间训练
          </Button>
        </div>
      </StickyAction>
    </>
  )
}

function AiMock({ onBack }: { onBack: () => void }) {
  return (
    <>
      <FeatureCard
        title="全真模拟"
        desc="定时开放，完成后生成可下载报告"
        right={<StatusPill label="今晚开放" tone="orange" />}
      >
        <div className="grid grid-cols-3 gap-2 text-center">
          <MiniMetric label="开始" value="19:30" />
          <MiniMetric label="套题" value="3题" />
          <MiniMetric label="榜单" value="前100" />
        </div>
      </FeatureCard>
      <Card title="排行榜展示" bodyStyle={{ padding: 14 }}>
        <div className="space-y-3">
          <SummaryRow label="总榜" value="开放" />
          <SummaryRow label="岗位榜" value="只展示本人和前100" />
          <SummaryRow label="模考榜" value="每日 22:30 更新" />
        </div>
      </Card>
      <StickyAction>
        <div className="grid grid-cols-2 gap-2">
          <Button block fill="outline" shape="rounded" onClick={onBack}>
            返回
          </Button>
          <Button block color="primary" shape="rounded">
            预约模考
          </Button>
        </div>
      </StickyAction>
    </>
  )
}
