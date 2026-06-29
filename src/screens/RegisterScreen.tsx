import { useState } from 'react'
import { Button, Card, Dialog, Form, Input, Selector, Steps, Tag } from 'antd-mobile'
import { BaijiayunPlayer } from '@/components/BaijiayunPlayer'
import CourseCard from '@/components/CourseCard'
import { CourseFilterBar } from '@/components/CourseFilterBar'
import OrderCard from '@/components/OrderCard'
import {
  FeatureCard,
  SectionTitle,
  StatusPill,
  StickyAction,
  SummaryRow,
} from '@/components/ui'
import {
  areaOptions,
  mockCourses,
  mockOrders,
  projectOptions,
  trialTeachers,
} from '@/mock/data'
import { CourseStatus } from '@/routes/course.detail.$id'
import type { RegisterStep } from '@/types/app'
import type { CourseFilterState } from '@/types/info'

const REGISTER_STEPS: RegisterStep[] = [
  'course',
  'form',
  'lock',
  'trial',
  'pay',
  'sign',
  'room',
  'done',
]

export function RegisterScreen() {
  const [step, setStep] = useState<RegisterStep>('course')
  const stepIndex = REGISTER_STEPS.indexOf(step)

  return (
    <div className="pb-24">
      <div className="bg-white px-3 py-3">
        <div className="text-[18px] font-bold">报名流程</div>
        <div className="mt-1 text-[12px] text-[#969696]">
          先提交报名资料，再完成试听确认
        </div>
      </div>
      <div className="bg-white px-3 pb-3">
        <Steps current={stepIndex}>
          {['课程', '资料', '锁定', '试听', '支付', '签约', '住宿', '入班'].map(
            (title) => (
              <Steps.Step key={title} title={title} />
            ),
          )}
        </Steps>
      </div>
      <div className="space-y-3 p-3">
        {step === 'course' && <CoursePreview onNext={() => setStep('form')} />}
        {step === 'form' && <FormPreview onNext={() => setStep('lock')} />}
        {step === 'lock' && <LockPreview onNext={() => setStep('trial')} />}
        {step === 'trial' && <TrialPreview onNext={() => setStep('pay')} />}
        {step === 'pay' && <PayPreview onNext={() => setStep('sign')} />}
        {step === 'sign' && <SignPreview onNext={() => setStep('room')} />}
        {step === 'room' && <RoomPreview onNext={() => setStep('done')} />}
        {step === 'done' && <DonePreview />}
      </div>
    </div>
  )
}

function CoursePreview({ onNext }: { onNext: () => void }) {
  const [filter, setFilter] = useState<CourseFilterState>({
    projectId: 'national',
    areaId: 'zhejiang',
    campusId: 'hz-westlake',
    keyword: '',
  })
  const selectedProject = projectOptions.find((item) => item.id === filter.projectId)
  const selectedArea = areaOptions.find((item) => item.id === filter.areaId)

  return (
    <>
      <CourseFilterBar
        projects={projectOptions}
        areas={areaOptions}
        value={filter}
        onChange={setFilter}
      />
      <Card bodyStyle={{ padding: 14 }}>
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="text-[14px] font-bold">
              {selectedProject?.name ?? '全部项目'}课程
            </div>
            <div className="mt-1 truncate text-[12px] text-[#969696]">
              {selectedArea?.name ?? '全部地区'} · 按地区展示可报名班型
            </div>
          </div>
          <StatusPill
            label={`${mockCourses.length} 个班型`}
            tone="green"
          />
        </div>
      </Card>
      <SectionTitle title="可报名课程" right="按筛选结果展示" />
      {mockCourses.map((course) => (
        <CourseCard
          key={course.courseId}
          course={course}
          inventory={course.region.reduce((sum, item) => sum + item.hasInventory, 0)}
          courseStatus={CourseStatus.Hot}
          onClick={onNext}
        />
      ))}
      <StickyAction>
        <Button block color="primary" shape="rounded" onClick={onNext}>
          去填写报名信息
        </Button>
      </StickyAction>
    </>
  )
}

function FormPreview({ onNext }: { onNext: () => void }) {
  return (
    <>
      <FeatureCard
        title="报名校验"
        desc="手机号、岗位代码和成绩会在提交前校验"
        right={<StatusPill label="可报名" tone="green" />}
      >
        <div className="grid grid-cols-3 gap-2 text-center">
          {[
            ['手机号', '已校验'],
            ['岗位互斥', '未冲突'],
            ['分数格式', '小数有效'],
          ].map(([label, value]) => (
            <div key={label} className="rounded-[8px] bg-[#f7f8fa] p-2">
              <div className="text-[13px] font-bold">{value}</div>
              <div className="mt-1 text-[11px] text-[#969696]">{label}</div>
            </div>
          ))}
        </div>
      </FeatureCard>
      <Form
        layout="horizontal"
        initialValues={{
          course: '2026 国考面试协议精讲班',
          name: '陈思远',
          phone: '13892015678',
          score: '137.5',
        }}
      >
        <Form.Header>课程信息</Form.Header>
        <Form.Item label="课程名称" name="course">
          <Input readOnly />
        </Form.Item>
        <Form.Item label="地区/项目">
          <div className="text-right text-[13px] text-[#333]">浙江 · 国考</div>
        </Form.Item>
        <Form.Item label="试听老师">
          <div className="text-right text-[13px] text-[#969696]">提交后选择</div>
        </Form.Item>
        <Form.Item label="职位代码二次确认">
          <div className="text-right text-[13px] leading-5">
            <div>300110012004</div>
            <div className="text-[#969696]">国家税务总局杭州市税务局</div>
            <div className="text-[#969696]">一级行政执法员</div>
          </div>
        </Form.Item>
        <Form.Header>个人信息</Form.Header>
        <Form.Item label="姓名" name="name">
          <Input />
        </Form.Item>
        <Form.Item label="手机号" name="phone">
          <Input />
        </Form.Item>
        <Form.Item label="笔试分数" name="score">
          <Input />
        </Form.Item>
        <Form.Item label="基础类型">
          <Selector
            defaultValue={['beginner']}
            columns={2}
            options={[
              { label: '小白', value: 'beginner' },
              { label: '非小白', value: 'advanced' },
            ]}
          />
        </Form.Item>
        <Form.Item label="优惠码">
          <Input placeholder="请输入优惠码" />
        </Form.Item>
      </Form>
      <StickyAction>
        <Button block color="primary" shape="rounded" onClick={onNext}>
          提交资料，创建待试听订单
        </Button>
      </StickyAction>
    </>
  )
}

function LockPreview({ onNext }: { onNext: () => void }) {
  return (
    <>
      <Card title="待试听订单" bodyStyle={{ padding: 14 }}>
        <div className="space-y-3">
          <SummaryRow label="订单状态" value="待试听" strong />
          <SummaryRow label="锁定课程" value="2026 国考面试协议精讲班" />
          <SummaryRow label="预计分班" value="小白集中班 · 杭州 A3" />
          <SummaryRow label="岗位互斥" value="当前班级无同岗位代码" />
          <SummaryRow label="优惠码" value="MS2026 已生效" />
          <SummaryRow label="库存保留" value="29:58" />
        </div>
        <div className="mt-4 rounded-[8px] bg-[#f7f8fa] p-3 text-[12px] leading-5 text-[#666]">
          名额已为当前报名订单保留。试听后确认老师进入支付；全部不满意则取消订单并释放库存。
        </div>
      </Card>
      <StickyAction>
        <Button block color="primary" shape="rounded" onClick={onNext}>
          继续试听老师
        </Button>
      </StickyAction>
    </>
  )
}

function TrialPreview({ onNext }: { onNext: () => void }) {
  return (
    <>
      <SectionTitle title="选择试听老师" right="已锁定名额" />
      <BaijiayunPlayer
        title="周老师试听课"
        subtitle="面试流程拆解与答题框架"
        mode="trial"
        classId="trial-room-202606"
        vid="156406197"
        token="bjy-trial-token"
      />
      <div className="grid grid-cols-3 gap-2">
        {['1/3 试听中', '小白专区', '不满意可换'].map((item) => (
          <div
            key={item}
            className="rounded-[8px] bg-white p-2 text-center text-[12px] font-medium shadow-sm"
          >
            {item}
          </div>
        ))}
      </div>
      <div className="flex snap-x gap-3 overflow-x-auto pb-1">
        {trialTeachers.map((teacher, index) => (
          <button
            key={teacher.name}
            className={`w-[268px] shrink-0 snap-center rounded-[8px] border bg-white p-4 text-left shadow-sm ${
              index === 0 ? 'border-[#1677ff]' : 'border-[#eee]'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="text-[16px] font-bold">{teacher.name}</div>
              <Tag color={teacher.type === '小白试听' ? 'primary' : 'success'}>
                {teacher.type}
              </Tag>
            </div>
            <div className="mt-3 text-[14px] font-bold">{teacher.title}</div>
            <div className="mt-2 text-[12px] leading-5 text-[#969696]">
              {teacher.desc}
            </div>
            <div className="mt-4 rounded-[8px] bg-[#f2f3f5] p-3 text-[12px] text-[#666]">
              音频/视频试听 · 选中后绑定老师和班级
            </div>
          </button>
        ))}
      </div>
      <StickyAction>
        <div className="grid grid-cols-2 gap-2">
          <Button
            block
            fill="outline"
            shape="rounded"
            onClick={() =>
              Dialog.confirm({
                title: '确认取消本次报名？',
                content: '3 位老师都不满意后，系统将取消当前报名订单并释放库存锁。',
                confirmText: '确认取消',
                cancelText: '再想想',
              })
            }
          >
            都不满意
          </Button>
          <Button block color="primary" shape="rounded" onClick={onNext}>
            确认周老师，去支付
          </Button>
        </div>
      </StickyAction>
    </>
  )
}

function PayPreview({ onNext }: { onNext: () => void }) {
  return (
    <>
      <OrderCard order={mockOrders[0]} onClick={onNext} />
      <Card bodyStyle={{ padding: 14 }}>
        <SummaryRow label="试听老师" value="周老师" />
        <SummaryRow label="优惠码" value="MS2026 -¥300" />
        <SummaryRow label="剩余支付时间" value="14:58" strong />
      </Card>
      <Card title="支付方式" bodyStyle={{ padding: 14 }}>
        <div className="space-y-3">
          <SummaryRow label="微信支付" value="浙江分公司收款" strong />
          <SummaryRow label="支付宝" value="同主体可用" />
          <SummaryRow label="费用主体" value="杭州启明教育科技有限公司" />
        </div>
      </Card>
      <StickyAction>
        <Button block color="primary" shape="rounded" onClick={onNext}>
          支付费用
        </Button>
      </StickyAction>
    </>
  )
}

function SignPreview({ onNext }: { onNext: () => void }) {
  return (
    <>
      <Card title="电子签引导" bodyStyle={{ padding: 14 }}>
        <div className="space-y-3">
          <SummaryRow label="支付状态" value="支付成功" strong />
          <SummaryRow label="合同状态" value="腾讯电子签待签署" />
          <SummaryRow label="签约主体" value="杭州启明教育科技有限公司" />
          <SummaryRow label="合同水印" value="陈思远 138****5678" />
          <SummaryRow label="异常处理" value="失败后联系客服" />
        </div>
        <div className="mt-4 rounded-[8px] bg-[#f7f8fa] p-3 text-[12px] leading-5 text-[#666]">
          合同生成后跳转腾讯电子签。签约失败不会自动退款或取消订单，进入后台处理。
        </div>
      </Card>
      <StickyAction>
        <Button block color="primary" shape="rounded" onClick={onNext}>
          完成签约，选择住宿
        </Button>
      </StickyAction>
    </>
  )
}

function RoomPreview({ onNext }: { onNext: () => void }) {
  return (
    <>
      <Form layout="horizontal">
        <Form.Header>住宿选择</Form.Header>
        <Form.Item label="支付状态">
          <Tag color="success">支付成功</Tag>
        </Form.Item>
        <Form.Item label="电子签约">
          <Tag color="success">已签约</Tag>
        </Form.Item>
        <Form.Item label="校区">
          <div className="text-right text-[13px] text-[#333]">杭州校区</div>
        </Form.Item>
        <Form.Item label="分班结果">
          <div className="text-right text-[13px] text-[#333]">小白集中班 · A3</div>
        </Form.Item>
        <Form.Item label="宿舍类型">
          <Selector
            defaultValue={['double']}
            columns={2}
            options={[
              { label: '双人间', value: 'double' },
              { label: '单人间', value: 'single' },
            ]}
          />
        </Form.Item>
      </Form>
      <StickyAction>
        <Button block color="primary" shape="rounded" onClick={onNext}>
          确认住宿，查看班级
        </Button>
      </StickyAction>
    </>
  )
}

function DonePreview() {
  return (
    <Card>
      <div className="p-5 text-center">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#e8f8f2] text-[28px] text-[#00b578]">
          ✓
        </div>
        <div className="mt-4 text-[19px] font-bold">已加入班级</div>
        <div className="mt-2 text-[13px] text-[#969696]">
          杭州 A3 面试班 · 请扫码加入班级群
        </div>
        <div className="mx-auto mt-3 max-w-[260px] space-y-2 text-left">
          <SummaryRow label="订单号" value="2026062401" />
          <SummaryRow label="住宿" value="双人间" />
          <SummaryRow label="岗位代码" value="300110012004" />
        </div>
        <div className="mx-auto mt-4 grid h-28 w-28 place-items-center rounded-[8px] border border-[#eee] bg-[#f7f8fa] text-[12px] text-[#969696]">
          班级二维码
        </div>
      </div>
    </Card>
  )
}
