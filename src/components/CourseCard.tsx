import { Card, Image } from 'antd-mobile'
import { ClockCircleOutline } from 'antd-mobile-icons'
import { OrderStatus, type Course, type Order } from '@/types/info'
import { cardHeight } from './DetailPageCourseCard'
import { Loading } from 'antd-mobile'
import dayjs from 'dayjs'
import { useOrderList } from '@/hook/useOrderList'
import { CourseStatus } from '@/routes/course.detail.$id'

/**
 * 课程卡片属性接口
 */
export interface CourseCardProps {
  course: Omit<Course, 'region' | 'inventory'>
  onClick?: () => void
  orderList?: Order[]
  /** 课程状态 */
  courseStatus?: CourseStatus
  /** 课程库存 */
  inventory?: number
}

const cardWidth = 350
// 提取样式为常量，提高可维护性
const CARD_STYLE: React.CSSProperties = {
  padding: '0',
  maxWidth: cardWidth,
  width: 'calc(100% - 12px)',
  margin: '0 auto',
}

const BODY_STYLE: React.CSSProperties = {
  borderBottomLeftRadius: '8px',
  borderBottomRightRadius: '8px',
  padding: '12px 14px',
}

const HEADER_STYLE: React.CSSProperties = {
  borderTopLeftRadius: '8px',
  borderTopRightRadius: '8px',
  overflow: 'hidden',
  padding: '0',
  height: '160px',
}

const ICON_STYLE: React.CSSProperties = {
  display: 'inline-block',
  transform: 'scale(1.5)',
  marginRight: '6px',
  color: '#969696',
}

/**
 * 课程卡片组件，展示课程基本信息，点击可跳转到课程详情页
 * @param props - 课程卡片组件属性
 * @returns 课程卡片组件 JSX 元素
 */
export default function CourseCard({
  course,
  inventory,
  onClick,
}: CourseCardProps) {
  const { data: orderList } = useOrderList()
  if (!course) return null
  let timeInfo
  const now = Date.now()
  let text
  if (dayjs(course.endTime).unix() < now / 1000) {
    text = '报名已结束'
    //只显示报名结束时间
    timeInfo = `报名结束时间：${dayjs(course.endTime).format('YYYY-MM-DD HH:mm:ss')}`
  } else if (dayjs(course.startTime).unix() > now / 1000) {
    text = '报名未开始'
    //只显示报名开始时间
    timeInfo = `报名开始时间：${dayjs(course.startTime).format('YYYY-MM-DD HH:mm:ss')}`
  } else {
    text = '报名进行中'
    //只显示报名结束时间
    // 课程状态
    const isEnrolled = orderList
      ?.filter((order) => order.order_status !== OrderStatus.CANCELLED)
      .some(
        (order) => order['course_id'].toString() === course.courseId.toString(),
      )
    const courseStatus: CourseStatus = isEnrolled
      ? CourseStatus.Enrolled
      : !inventory || inventory <= 0
        ? CourseStatus.SoldOut
        : CourseStatus.Hot
    text = courseStatus !== CourseStatus.Hot ? courseStatus : text
    timeInfo = `报名结束时间：${dayjs(course.endTime).format('YYYY-MM-DD HH:mm:ss')}`
  }
  return (
    <Card
      style={CARD_STYLE}
      title={
        <Image
          src={course?.imageUrl}
          alt={course?.courseName}
          placeholder={
            <Loading
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%,-50%)',
              }}
            />
          }
          width={cardWidth}
          height={cardHeight}
          fit="cover"
        />
      }
      bodyStyle={BODY_STYLE}
      headerStyle={HEADER_STYLE}
      onClick={onClick}
    >
      <h3 className="text-base font-bold text-left leading-[23px] mb-[6px]">
        {course?.courseName}
      </h3>
      <p className="text-[11px] text-[#969696] text-left flex items-center">
        <ClockCircleOutline style={ICON_STYLE} />
        {timeInfo}
        <span
          style={{
            marginLeft: 'auto',
            fontSize: '11px',
          }}
        >
          {text}
        </span>
      </p>
    </Card>
  )
}
