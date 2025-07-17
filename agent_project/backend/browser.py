from playwright.async_api import async_playwright
import os

class BrowserAgent:
    def __init__(self, screenshot_dir="screenshots"):
        self.browser = None
        self.page = None
        self.screenshot_dir = screenshot_dir
        os.makedirs(screenshot_dir, exist_ok=True)

    async def start(self):
        playwright = await async_playwright().start()
        self.browser = await playwright.chromium.launch(headless=True)
        self.page = await self.browser.new_page()

    async def goto(self, url: str):
        if not self.page:
            await self.start()
        await self.page.goto(url)
        return await self.page.title()

    async def screenshot(self, filename="latest.png"):
        if self.page:
            path = os.path.join(self.screenshot_dir, filename)
            await self.page.screenshot(path=path)
            return path
        return None

    async def close(self):
        if self.browser:
            await self.browser.close()
            self.browser = None
            self.page = None 