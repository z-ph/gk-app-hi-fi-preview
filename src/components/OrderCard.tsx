import { Card } from 'antd-mobile'
import { RightOutline } from 'antd-mobile-icons'
import { OrderStatus, type Order } from '@/types/info'
import { encodeOrderId } from '@/utils/orderIdEncoder'
// 提取样式对象，提高代码可读性和可维护性
const cardStyle: React.CSSProperties = {
  borderRadius: '0px',
  border: '1px solid #eee',
  boxSizing: 'border-box',
  width: '100%',
  position: 'relative',
  paddingRight: '34px',
  paddingLeft: '15px',
  paddingTop: '12px',
  paddingBottom: '32px',
  overflow: 'hidden',
}

const headerStyle: React.CSSProperties = {
  borderBottom: 'none',
  padding: '0',
}

const bodyStyle: React.CSSProperties = {
  padding: '0',
  paddingTop: '0.5rem',
}

const titleStyle: React.CSSProperties = {
  display: 'flex',
  minWidth: 0,
  alignItems: 'center',
  paddingRight: '72px',
}

const encodedOrderIdStyle: React.CSSProperties = {
  minWidth: 0,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
}

interface OrderCardProps {
  order: Order
  onClick: (order: Order) => void
}
const orderStatusToColor: Record<Order['order_status'], string> = {
  [OrderStatus.PENDING_PAYMENT]: '#FF5733',
  [OrderStatus.PENDING_ACCOMMODATION]: '#007CBA',
  [OrderStatus.PENDING_CLASS_ALLOCATION]: '#007CBA',
  [OrderStatus.CLASS_ALLOCATED]: '#03BAAE',
  [OrderStatus.REFUNDED]: '#03BAAE',
  [OrderStatus.CANCELLED]: '#EEE',
}
const orderStatusStyle = (
  status: Order['order_status'],
): React.CSSProperties => ({
  color: orderStatusToColor[status],
  position: 'absolute',
  right: '34px',
  top: 0,
  fontWeight: 700,
  fontSize: '15px',
  lineHeight: '24px',
  whiteSpace: 'nowrap',
})

const rightIconStyle: React.CSSProperties = {
  position: 'absolute',
  right: '11px',
  top: 0,
  bottom: 0,
  margin: 'auto',
  fontSize: '24px',
}
export const orderStatusText = (status: Order['order_status']) => {
  switch (status) {
    case OrderStatus.PENDING_PAYMENT:
      return '待支付费用'
    case OrderStatus.PENDING_ACCOMMODATION:
      return '待电子签约'
    case OrderStatus.PENDING_CLASS_ALLOCATION:
      return '待分配班级'
    case OrderStatus.CLASS_ALLOCATED:
      return '已分配班级'
    case OrderStatus.CANCELLED:
      return '已取消'
    case OrderStatus.REFUNDED:
      return '已退款'
    default:
      return '未知状态'
  }
}
export default function OrderCard(props: OrderCardProps) {
  const { order } = props
  const encodedOrderId = encodeOrderId(order.id)
  return (
    <Card
      style={cardStyle}
      key={encodedOrderId}
      headerStyle={headerStyle}
      bodyStyle={bodyStyle}
      onClick={() => props.onClick(order)}
      title={
        <div style={titleStyle}>
          <span className="shrink-0 text-[15px] font-[400] text-[#666]">
            订单号:
          </span>
          <span
            className="ml-1 text-[17px] font-[400] text-[#333] opacity-40"
            style={encodedOrderIdStyle}
          >
            {encodedOrderId}
          </span>
          <span style={orderStatusStyle(order.order_status)}>
            {orderStatusText(order.order_status)}
          </span>
        </div>
      }
    >
      <div className="truncate text-[16px] font-[700] text-[#000]">
        {order.courseName}
      </div>
      <RightOutline style={rightIconStyle} />
    </Card>
  )
}
