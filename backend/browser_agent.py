from playwright.async_api import async_playwright

class BrowserAgent:
    def __init__(self):
        self.browser = None
        self.page = None

    async def start(self):
        playwright = await async_playwright().start()
        self.browser = await playwright.chromium.launch(headless=True)
        self.page = await self.browser.new_page()

    async def goto(self, url: str):
        if not self.page:
            await self.start()
        await self.page.goto(url)
        return await self.page.title()

    async def close(self):
        if self.browser:
            await self.browser.close()
            self.browser = None
            self.page = None 