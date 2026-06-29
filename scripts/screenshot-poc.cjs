const { chromium } = require('/Users/zph/.nvm/versions/node/v24.16.0/lib/node_modules/playwright')
const { resolve } = require('path')

const baseUrl = process.env.POC_BASE_URL || 'http://127.0.0.1:3010'
const outLive = resolve(__dirname, '../.tmp_poc_live.png')
const outReplay = resolve(__dirname, '../.tmp_poc_replay.png')

;(async () => {
  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: 430, height: 932 } })

  await page.goto(baseUrl, { waitUntil: 'networkidle' })

  // 切换到直播 tab
  await page.locator('.adm-tab-bar-item', { hasText: '直播' }).click()
  await page.waitForTimeout(500)

  // 点击 SDK 能力 POC 入口
  await page.locator('text=SDK 能力 POC').click()
  await page.waitForTimeout(1500)

  // Mock live 截图
  await page.evaluate(() => window.scrollTo(0, 0))
  await page.waitForTimeout(300)
  await page.screenshot({ path: outLive, fullPage: false })

  // 滚动到模式选择器并切换到回放
  await page.evaluate(() => window.scrollTo(0, 900))
  await page.waitForTimeout(300)
  const replayItem = page.locator('.adm-segmented-item', { hasText: '回放' })
  await replayItem.click()
  await page.waitForTimeout(1500)

  // 回放截图
  await page.evaluate(() => window.scrollTo(0, 0))
  await page.waitForTimeout(300)
  await page.screenshot({ path: outReplay, fullPage: false })

  await browser.close()

  console.log(`Mock 直播截图: ${outLive}`)
  console.log(`Mock 回放截图: ${outReplay}`)
})()
