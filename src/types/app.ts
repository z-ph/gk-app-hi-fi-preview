export type AppTab = 'home' | 'register' | 'ai' | 'live' | 'mine'

export type HomeRoute = 'home' | 'sprint'

export type RegisterStep =
  | 'course'
  | 'form'
  | 'lock'
  | 'trial'
  | 'pay'
  | 'sign'
  | 'room'
  | 'done'

export type BaijiayunMode = 'trial' | 'live' | 'replay'

export type SprintView = 'schedule' | 'exchange' | 'score'

export type MineView =
  | 'home'
  | 'registration'
  | 'orders'
  | 'contracts'
  | 'messages'
  | 'messageDetail'
  | 'account'
