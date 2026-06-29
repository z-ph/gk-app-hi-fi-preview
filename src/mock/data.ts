import {
  AccommodationType,
  AgreementType,
  OrderStatus,
  type Course,
  type AreaOption,
  type CampusOption,
  type Order,
  type ProjectOption,
} from '@/types/info'

export const projectOptions: ProjectOption[] = [
  {
    id: 'national',
    name: '国考',
    description: '国家公务员面试项目',
    courseCount: 8,
  },
  {
    id: 'province',
    name: '省考',
    description: '各省公务员面试项目',
    courseCount: 12,
  },
  {
    id: 'public-institution',
    name: '事业单位',
    description: '事业编结构化面试项目',
    courseCount: 5,
  },
]

export const areaOptions: AreaOption[] = [
  { id: 'zhejiang', name: '浙江', projectIds: ['national', 'province'], cityCount: 6 },
  { id: 'jiangsu', name: '江苏', projectIds: ['national', 'province'], cityCount: 5 },
  { id: 'shanghai', name: '上海', projectIds: ['national', 'public-institution'], cityCount: 3 },
  { id: 'anhui', name: '安徽', projectIds: ['province', 'public-institution'], cityCount: 4 },
  { id: 'guangdong', name: '广东', projectIds: ['national', 'province'], cityCount: 7 },
  { id: 'sichuan', name: '四川', projectIds: ['province'], cityCount: 4 },
]

export const campusOptions: CampusOption[] = [
  { id: 'hz-westlake', areaId: 'zhejiang', name: '杭州西湖校区', city: '杭州', inventory: 18 },
  { id: 'hz-binjiang', areaId: 'zhejiang', name: '杭州滨江校区', city: '杭州', inventory: 6 },
  { id: 'nb-yinzhou', areaId: 'zhejiang', name: '宁波鄞州校区', city: '宁波', inventory: 0 },
  { id: 'nj-xinjiekou', areaId: 'jiangsu', name: '南京新街口校区', city: '南京', inventory: 11 },
  { id: 'sz-park', areaId: 'jiangsu', name: '苏州园区校区', city: '苏州', inventory: 3 },
  { id: 'sh-xuhui', areaId: 'shanghai', name: '上海徐汇校区', city: '上海', inventory: 9 },
  { id: 'hf-shushan', areaId: 'anhui', name: '合肥蜀山校区', city: '合肥', inventory: 4 },
  { id: 'gz-tianhe', areaId: 'guangdong', name: '广州天河校区', city: '广州', inventory: 13 },
  { id: 'cd-gaoxin', areaId: 'sichuan', name: '成都高新校区', city: '成都', inventory: 8 },
]

export const mockCourses: Course[] = [
  {
    courseId: 101,
    courseName: '2026 国考面试协议精讲班',
    startTime: '2026-06-01 09:00:00',
    endTime: '2026-07-08 23:59:59',
    imageUrl:
      'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=900&q=80',
    courseDesc: '',
    batchId: 1,
    region: [
      {
        id: 1,
        name: '杭州校区',
        singlePrice: 280,
        introduction: '杭州线下面试集训点',
        hasInventory: 1,
      },
    ],
  },
  {
    courseId: 102,
    courseName: '江苏省考结构化面试专项课',
    startTime: '2026-06-10 09:00:00',
    endTime: '2026-07-12 18:00:00',
    imageUrl:
      'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=900&q=80',
    courseDesc: '',
    batchId: 1,
    region: [
      {
        id: 2,
        name: '南京校区',
        singlePrice: 260,
        introduction: '南京结构化专项训练',
        hasInventory: 1,
      },
    ],
  },
]

export const mockOrders: Order[] = [
  {
    id: 2026062401,
    user_id: 9001,
    course_id: 101,
    position_code_id: 1,
    user_name: '陈思远',
    user_gender: '男',
    user_phone: '13892015678',
    exam_score: '137.5',
    is_zhuangyuan: false,
    region_id: 1,
    order_status: OrderStatus.PENDING_PAYMENT,
    class_id: 0,
    accommodationType: AccommodationType.double,
    created_at: '2026-06-28 09:20:00',
    updated_at: '2026-06-28 09:32:00',
    agreement_type: AgreementType.NONZHUANGYUAN,
    classQrCodeUrl: '',
    courseName: '2026 国考面试协议精讲班',
    regionName: '杭州校区',
    positionCodeName: '300110012004 国家税务总局杭州市税务局 一级行政执法员',
    expirationTime: '2026-06-28 21:50:00',
  },
  {
    id: 2026061802,
    user_id: 9001,
    course_id: 102,
    position_code_id: 2,
    user_name: '陈思远',
    user_gender: '男',
    user_phone: '13892015678',
    exam_score: '137.5',
    is_zhuangyuan: true,
    region_id: 2,
    order_status: OrderStatus.CLASS_ALLOCATED,
    class_id: 8,
    accommodationType: AccommodationType.single,
    created_at: '2026-06-18 13:20:00',
    updated_at: '2026-06-19 19:10:00',
    agreement_type: AgreementType.ZHUANGYUAN,
    classQrCodeUrl: '',
    courseName: '江苏省考结构化面试专项课',
    regionName: '南京校区',
    positionCodeName: '100210045001 南京市市场监督管理局 综合管理岗',
    expirationTime: null,
  },
]

export const trialTeachers = [
  {
    name: '周老师',
    type: '小白试听',
    title: '面试流程拆解与答题框架',
    desc: '适合首次进面，先建立完整认知。',
  },
  {
    name: '许老师',
    type: '非小白试听',
    title: '综合分析题追问训练',
    desc: '适合已有基础，重点纠偏表达。',
  },
  {
    name: '林老师',
    type: '小白试听',
    title: '岗位匹配题素材整理',
    desc: '结合岗位代码和单位职责做示范。',
  },
]

export const liveLessons = [
  {
    title: '结构化面试大班课：计划组织题',
    time: '今天 19:30-21:30',
    teacher: '周老师',
    type: '大班课',
    status: '直播中',
    right: '权益已开通',
  },
  {
    title: '浙江税务专项直播课',
    time: '明天 09:00-11:00',
    teacher: '许老师',
    type: '小班课',
    status: '未开始',
    right: '名单待校验',
  },
  {
    title: '岗位匹配专题复盘',
    time: '昨日 20:00-21:30',
    teacher: '林老师',
    type: '大班课',
    status: '可看回放',
    right: '回放已生成',
  },
]

export const aiReports = [
  {
    title: '人际沟通专项',
    score: 82,
    status: '人工点评中',
    desc: '答题层次需要更清楚',
  },
  {
    title: '组织管理专项训练',
    score: 76,
    status: '已完成',
    desc: '案例支撑偏少',
  },
]
