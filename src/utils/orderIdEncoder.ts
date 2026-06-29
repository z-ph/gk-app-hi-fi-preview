export function encodeOrderId(orderId: number) {
  return `PO${String(orderId).padStart(10, '0')}`
}
