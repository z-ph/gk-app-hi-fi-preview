import { useState } from 'react'
import { TabBar } from 'antd-mobile'
import {
  ClockCircleOutline,
  ContentOutline,
  FileOutline,
  HeartOutline,
  SetOutline,
} from 'antd-mobile-icons'
import { AiScreen } from '@/screens/AiScreen'
import { HomeScreen } from '@/screens/HomeScreen'
import { LiveScreen } from '@/screens/LiveScreen'
import { MineScreen } from '@/screens/MineScreen'
import { RegisterScreen } from '@/screens/RegisterScreen'
import { SprintScreen } from '@/screens/SprintScreen'
import type { AppTab, HomeRoute } from '@/types/app'

export default function App() {
  return (
    <div className="min-h-screen bg-[var(--bg-color)] text-[#333]">
      <div className="sticky top-0 z-40 border-b border-[#f2f3f5] bg-white px-3 py-3">
        <div className="mx-auto max-w-[430px]">
          <div>
            <div className="text-[17px] font-bold">公考面试</div>
            <div className="mt-1 text-[12px] text-[#969696]">
              报名、训练、直播与学习服务
            </div>
          </div>
        </div>
      </div>
      <AppPreview />
    </div>
  )
}

function AppPreview() {
  const [tab, setTab] = useState<AppTab>('home')
  const [homeRoute, setHomeRoute] = useState<HomeRoute>('home')

  const changeTab = (nextTab: AppTab) => {
    setTab(nextTab)
    if (nextTab !== 'home') {
      setHomeRoute('home')
    }
  }

  return (
    <div className="relative mx-auto min-h-[calc(100vh-62px)] max-w-[430px] bg-[var(--bg-color)]">
      {tab === 'home' &&
        (homeRoute === 'sprint' ? (
          <SprintScreen onBack={() => setHomeRoute('home')} />
        ) : (
          <HomeScreen setTab={changeTab} setHomeRoute={setHomeRoute} />
        ))}
      {tab === 'register' && <RegisterScreen />}
      {tab === 'ai' && <AiScreen />}
      {tab === 'live' && <LiveScreen />}
      {tab === 'mine' && <MineScreen />}
      <div className="fixed bottom-0 left-0 right-0 z-40 mx-auto max-w-[430px] border-t border-[#f2f3f5] bg-white">
        <TabBar activeKey={tab} onChange={(key) => changeTab(key as AppTab)}>
          <TabBar.Item key="home" icon={<ContentOutline />} title="首页" />
          <TabBar.Item key="register" icon={<FileOutline />} title="报名" />
          <TabBar.Item key="ai" icon={<HeartOutline />} title="AI面试" />
          <TabBar.Item key="live" icon={<ClockCircleOutline />} title="直播" />
          <TabBar.Item key="mine" icon={<SetOutline />} title="我的" />
        </TabBar>
      </div>
    </div>
  )
}
