import { useState } from 'react'
import { Card, Tag } from 'antd-mobile'
import { LeftOutline, RightOutline } from 'antd-mobile-icons'
import OrderCard from '@/components/OrderCard'
import {
  FeatureCard,
  MiniMetric,
  StatusPill,
  SummaryRow,
} from '@/components/ui'
import { mockOrders } from '@/mock/data'
import type { MineView } from '@/types/app'

export function MineScreen() {
  const [view, setView] = useState<MineView>('home')

  if (view !== 'home') {
    return <MineDetail view={view} setView={setView} />
  }

  const entries: Array<{ title: string; view: MineView; desc: string }> = [
    { title: '我的报名', view: 'registration', desc: '班级与岗位信息' },
    { title: '我的订单', view: 'orders', desc: '支付与状态流转' },
    { title: '我的合同', view: 'contracts', desc: '电子签与水印合同' },
    { title: 'AI训练', view: 'account', desc: '权益与次数' },
    { title: '直播学习', view: 'account', desc: '观看权益' },
    { title: '线下冲刺', view: 'registration', desc: '场次与二维码' },
    { title: '站内信', view: 'messages', desc: '3条未读' },
    { title: '账号注销', view: 'account', desc: '实名与注销' },
  ]

  return (
    <div className="space-y-3 p-3 pb-24">
      <Card bodyStyle={{ padding: 16 }}>
        <div className="flex items-center gap-3">
          <div className="grid h-14 w-14 place-items-center rounded-full bg-[#1677ff] text-[20px] font-bold text-white">
            陈
          </div>
          <div className="flex-1">
            <div className="text-[17px] font-bold">面试上岸同学</div>
            <div className="mt-1 text-[12px] text-[#969696]">浙江 · 国考面试班</div>
          </div>
          <Tag color="success">实名已核验</Tag>
        </div>
      </Card>
      <div className="grid grid-cols-2 gap-3">
        {entries.map((item) => (
          <button
            key={item.title}
            className="rounded-[8px] bg-white p-4 text-left shadow-sm"
            onClick={() => setView(item.view)}
          >
            <div className="flex items-center justify-between gap-2">
              <div className="text-[15px] font-bold">{item.title}</div>
              <RightOutline className="shrink-0 text-[#c8c8c8]" />
            </div>
            <div className="mt-2 text-[12px] text-[#969696]">{item.desc}</div>
          </button>
        ))}
      </div>
      <Card title="服务记录" bodyStyle={{ padding: 14 }}>
        <div className="space-y-3 text-[13px] text-[#666]">
          <SummaryRow label="当前班级" value="杭州 A3 面试班" />
          <SummaryRow label="账号状态" value="实名已核验" />
          <SummaryRow label="最近登录" value="今天 08:12" />
        </div>
      </Card>
    </div>
  )
}

function MineDetail({
  view,
  setView,
}: {
  view: MineView
  setView: (view: MineView) => void
}) {
  const title = {
    registration: '我的报名',
    orders: '我的订单',
    contracts: '我的合同',
    messages: '站内信',
    messageDetail: '消息详情',
    account: '账号权益',
    home: '我的',
  }[view]

  return (
    <div className="space-y-3 p-3 pb-24">
      <button
        className="flex items-center gap-2 text-[14px] font-medium text-[#1677ff]"
        onClick={() => setView(view === 'messageDetail' ? 'messages' : 'home')}
      >
        <LeftOutline />
        {title}
      </button>
      {view === 'registration' && <RegistrationDetail />}
      {view === 'orders' && <OrdersDetail />}
      {view === 'contracts' && <ContractsDetail />}
      {view === 'messages' && <MessagesDetail setView={setView} />}
      {view === 'messageDetail' && <MessageContent />}
      {view === 'account' && <AccountDetail />}
    </div>
  )
}

function RegistrationDetail() {
  return (
    <>
      <FeatureCard
        title="2026 国考面试协议精讲班"
        desc="浙江 · 杭州 A3 · 小白集中班"
        right={<StatusPill label="已入班" tone="green" />}
      >
        <div className="space-y-3">
          <SummaryRow label="岗位代码" value="300110012004" />
          <SummaryRow label="试听老师" value="周老师" />
          <SummaryRow label="住宿状态" value="双人间已确认" strong />
        </div>
      </FeatureCard>
      <FeatureCard title="班级二维码" desc="签约并确认住宿后展示">
        <div className="mx-auto grid h-32 w-32 place-items-center rounded-[8px] border border-[#e5e6eb] bg-[#f7f8fa] text-[12px] text-[#969696]">
          班级二维码
        </div>
      </FeatureCard>
    </>
  )
}

function OrdersDetail() {
  return (
    <>
      {mockOrders.map((order) => (
        <OrderCard key={order.id} order={order} onClick={() => undefined} />
      ))}
      <Card title="订单状态流转" bodyStyle={{ padding: 14 }}>
        <div className="space-y-3">
          <SummaryRow label="待试听" value="已完成" />
          <SummaryRow label="待支付" value="当前节点" strong />
          <SummaryRow label="待签约" value="支付后生成" />
          <SummaryRow label="待住宿" value="签约后选择" />
        </div>
      </Card>
    </>
  )
}

function ContractsDetail() {
  return (
    <>
      <FeatureCard
        title="面试协议合同"
        desc="腾讯电子签 · 杭州启明教育科技有限公司"
        right={<StatusPill label="待签署" tone="orange" />}
      >
        <div className="space-y-3">
          <SummaryRow label="合同水印" value="陈思远 138****5678" />
          <SummaryRow label="协议类型" value="攻擂协议" />
          <SummaryRow label="失败处理" value="进入后台人工处理" />
        </div>
      </FeatureCard>
      <FeatureCard title="合同记录" desc="签署后可在线查看，不展示后台配置入口">
        <div className="rounded-[8px] bg-[#f7f8fa] p-3 text-[12px] leading-5 text-[#666]">
          已生成合同草稿，等待本人完成电子签署。
        </div>
      </FeatureCard>
    </>
  )
}

function MessagesDetail({ setView }: { setView: (view: MineView) => void }) {
  const messages = [
    ['人工点评完成', '周老师已完成语音点评，点击查看报告。', '未读'],
    ['直播课提醒', '今晚 19:30 结构化面试大班课开始。', '未读'],
    ['线下冲刺场次确认', '杭州 6月29日 上午场已确认。', '已读'],
  ]

  return (
    <>
      {messages.map(([title, desc, status]) => (
        <FeatureCard
          key={title}
          title={title}
          desc={desc}
          right={
            <StatusPill
              label={status}
              tone={status === '未读' ? 'orange' : 'gray'}
            />
          }
          onClick={() => setView('messageDetail')}
        />
      ))}
    </>
  )
}

function MessageContent() {
  return (
    <Card bodyStyle={{ padding: 16 }}>
      <div className="text-[17px] font-bold">人工点评完成</div>
      <div className="mt-2 text-[12px] text-[#969696]">今天 18:42</div>
      <div className="mt-4 text-[14px] leading-7 text-[#333]">
        你提交的组织管理专项训练已完成人工点评。工作人员补充了语音反馈和改进建议，可跳转至 AI 训练报告查看。
      </div>
      <button className="mt-4 w-full rounded-full bg-[#1677ff] py-2 text-[14px] font-medium text-white">
        查看训练报告
      </button>
    </Card>
  )
}

function AccountDetail() {
  return (
    <>
      <FeatureCard
        title="账号实名与权益"
        desc="真实姓名不对外展示，昵称和头像用于公开场景"
        right={<StatusPill label="实名已核验" tone="green" />}
      >
        <div className="grid grid-cols-3 gap-2 text-center">
          <MiniMetric label="设备" value="1/2" />
          <MiniMetric label="AI答题" value="可用" />
          <MiniMetric label="直播" value="可看" />
        </div>
      </FeatureCard>
      <Card title="安全限制" bodyStyle={{ padding: 14 }}>
        <div className="space-y-3">
          <SummaryRow label="在线答题" value="仅允许一台设备" strong />
          <SummaryRow label="直播观看" value="不支持同时在线" />
          <SummaryRow label="异常登录" value="需要重新实名核验" />
          <SummaryRow label="账号注销" value="申请后人工审核" />
        </div>
      </Card>
    </>
  )
}
