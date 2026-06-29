import { Button, Tag } from 'antd-mobile'
import { RightOutline } from 'antd-mobile-icons'
import OrderCard from '@/components/OrderCard'
import { MiniMetric, SectionTitle } from '@/components/ui'
import { mockOrders } from '@/mock/data'
import type { AppTab, HomeRoute } from '@/types/app'

export function HomeScreen({
  setTab,
  setHomeRoute,
}: {
  setTab: (tab: AppTab) => void
  setHomeRoute: (route: HomeRoute) => void
}) {
  const todoItems = [
    {
      title: '试听确认',
      desc: '报名资料已提交，库存名额已锁定',
      action: '去处理',
      onClick: () => setTab('register'),
    },
    {
      title: '费用待支付',
      desc: '试听确认后进入支付',
      action: '支付',
      onClick: () => setTab('register'),
    },
    {
      title: '今晚直播课',
      desc: '19:30 结构化大班课',
      action: '进入',
      onClick: () => setTab('live'),
    },
    {
      title: 'AI 训练报告',
      desc: '人工点评正在处理中',
      action: '查看',
      onClick: () => setTab('ai'),
    },
    {
      title: '线下冲刺报名',
      desc: '杭州场次开放，选择地点和日期',
      action: '报名',
      onClick: () => setHomeRoute('sprint'),
    },
  ]

  return (
    <div>
      <div className="bg-[linear-gradient(180deg,#F3BF1C_0%,#F3BF1C_58%,var(--bg-color)_100%)] px-3 pb-5 pt-4">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-[22px] font-bold">上午好，陈思远</div>
            <div className="mt-1 text-[13px] text-[#666]">
              报名资料已填写，待完成试听确认
            </div>
          </div>
          <button className="rounded-full bg-white/80 px-3 py-1 text-[12px]">
            3 条消息
          </button>
        </div>
        <div className="mt-4 rounded-[8px] bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[15px] font-bold">
                2026 国考面试协议精讲班
              </div>
              <div className="mt-1 text-[12px] text-[#969696]">
                浙江 · 攻擂协议 · 杭州 A3
              </div>
            </div>
            <Tag color="warning">待支付</Tag>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2 text-center">
            <MiniMetric label="剩余名额" value="18" />
            <MiniMetric label="待办事项" value="5" />
            <MiniMetric label="AI次数" value="12" />
          </div>
          <Button
            block
            color="primary"
            shape="rounded"
            className="mt-4"
            onClick={() => setTab('register')}
          >
            继续报名流程
          </Button>
        </div>
      </div>

      <div className="space-y-3 px-3 pb-24">
        <SectionTitle title="待完成事项" right="5 项" />
        {todoItems.map(({ title, desc, action, onClick }) => (
          <button
            key={title}
            className="flex w-full items-center rounded-[8px] bg-white p-3 text-left shadow-sm"
            onClick={onClick}
          >
            <div className="flex-1">
              <div className="text-[15px] font-bold">{title}</div>
              <div className="mt-1 text-[12px] text-[#969696]">{desc}</div>
            </div>
            <span className="mr-2 text-[13px] text-[#1677ff]">{action}</span>
            <RightOutline className="text-[#c8c8c8]" />
          </button>
        ))}

        <SectionTitle title="我的订单" right="查看全部" />
        <OrderCard order={mockOrders[0]} onClick={() => setTab('register')} />
      </div>
    </div>
  )
}
