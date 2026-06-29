export enum AgreementType {
  ZHUANGYUAN = 'ZHUANGYUAN',
  NONZHUANGYUAN = 'NONZHUANGYUAN',
  NONAGREEMENT = 'NONAGREEMENT',
}

export enum OrderStatus {
  PENDING_PAYMENT = 'PENDING_PAYMENT',
  PENDING_ACCOMMODATION = 'PENDING_ACCOMMODATION',
  PENDING_CLASS_ALLOCATION = 'PENDING_CLASS_ALLOCATION',
  CLASS_ALLOCATED = 'CLASS_ALLOCATED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED',
}

export enum AccommodationType {
  single = 'single',
  double = 'double',
}

export interface Course {
  courseId: number
  courseName: string
  startTime: string
  endTime: string
  imageUrl: string
  courseDesc: string
  batchId: number
  region: regionType[]
}

export interface ProjectOption {
  readonly id: string
  readonly name: string
  readonly description: string
  readonly courseCount: number
}

export interface AreaOption {
  readonly id: string
  readonly name: string
  readonly projectIds: ReadonlyArray<ProjectOption['id']>
  readonly cityCount: number
}

export interface CampusOption {
  readonly id: string
  readonly areaId: AreaOption['id']
  readonly name: string
  readonly city: string
  readonly inventory: number
}

export interface CourseFilterState {
  readonly projectId: ProjectOption['id']
  readonly areaId: AreaOption['id']
  readonly campusId: CampusOption['id']
  readonly keyword: string
}

export type regionType = {
  id: number
  name: string
  singlePrice: number
  introduction: string
  hasInventory: 1 | 0
}

export interface PositionCode {
  id: number
  name: string
}

export interface Order {
  id: number
  user_id: number
  course_id: Course['courseId']
  position_code_id: PositionCode['id']
  user_name: string
  user_gender: string
  user_phone: string
  exam_score: string
  is_zhuangyuan: boolean
  region_id: regionType['id']
  order_status: OrderStatus
  class_id: number
  accommodationType: AccommodationType
  created_at: string
  updated_at: string
  agreement_type: AgreementType
  classQrCodeUrl: string
  courseName: string
  regionName: string
  positionCodeName: string
  expirationTime: string | null
}
