from playwright.async_api import async_playwright
import os
import datetime
import logging

logging.basicConfig(level=logging.INFO)

def timestamped_filename(prefix, ext="png"):
    ts = datetime.datetime.now().strftime("%Y%m%d_%H%M%S_%f")
    return f"{prefix}_{ts}.{ext}"

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

    async def screenshot(self, filename=None):
        if self.page:
            if not filename:
                filename = timestamped_filename("browser")
            path = os.path.join(self.screenshot_dir, filename)
            await self.page.screenshot(path=path)
            return path
        return None

    async def close(self):
        if self.browser:
            await self.browser.close()
            self.browser = None
            self.page = None

class GmailAgent:
    def __init__(self, screenshot_dir="screenshots"):
        self.screenshot_dir = screenshot_dir
        os.makedirs(screenshot_dir, exist_ok=True)
        self.browser = None
        self.page = None
        self.context = None
        self.logs = []
        self.error_screenshots = []

    async def start(self):
        playwright = await async_playwright().start()
        self.browser = await playwright.chromium.launch(headless=False, slow_mo=100)
        self.context = await self.browser.new_context()
        self.page = await self.context.new_page()
        self.logs.append("Browser started.")

    async def login(self, email: str, password: str):
        try:
            self.logs.append("Navigating to Gmail login page...")
            await self.page.goto("https://mail.google.com/")
            await self.page.wait_for_selector('input[type="email"]', timeout=20000)
            self.logs.append("Filling email...")
            await self.page.fill('input[type="email"]', email)
            await self.page.click('button:has-text("Next")')
            await self.page.wait_for_selector('input[type="password"]', timeout=20000)
            self.logs.append("Filling password...")
            await self.page.fill('input[type="password"]', password)
            await self.page.click('button:has-text("Next")')
            # Wait for main inbox or handle 2FA
            try:
                await self.page.wait_for_selector('div[role="main"]', timeout=35000)
                self.logs.append("Login successful, inbox loaded.")
            except Exception:
                # 2FA or other prompt
                self.logs.append("2FA or additional prompt detected. Capturing screenshot.")
                error_path = await self.screenshot(prefix="gmail_2fa_or_prompt")
                self.error_screenshots.append(error_path)
                raise Exception("2FA or additional prompt detected. Manual intervention required.")
            screenshot_path = await self.screenshot(prefix="gmail_login")
            return screenshot_path
        except Exception as e:
            self.logs.append(f"Login failed: {str(e)}")
            error_path = await self.screenshot(prefix="gmail_login_error")
            self.error_screenshots.append(error_path)
            raise

    async def compose_and_send(self, recipient: str, subject: str, body: str):
        try:
            self.logs.append("Clicking compose...")
            await self.page.click('div[gh="cm"]')  # Compose button
            await self.page.wait_for_selector('textarea[name="to"]', timeout=15000)
            compose_path = await self.screenshot(prefix="gmail_compose_opened")
            self.logs.append("Filling recipient, subject, and body...")
            await self.page.fill('textarea[name="to"]', recipient)
            await self.page.fill('input[name="subjectbox"]', subject)
            await self.page.fill('div[aria-label="Message Body"]', body)
            filled_path = await self.screenshot(prefix="gmail_filled_form")
            self.logs.append("Sending email...")
            await self.page.click('div[aria-label*="Send"]')
            try:
                await self.page.wait_for_selector('span.bAq', timeout=15000)  # Sent notification
                self.logs.append("Email sent successfully.")
            except Exception:
                self.logs.append("Send confirmation not detected. Capturing screenshot.")
                error_path = await self.screenshot(prefix="gmail_send_error")
                self.error_screenshots.append(error_path)
                raise Exception("Email send confirmation not detected.")
            sent_path = await self.screenshot(prefix="gmail_sent")
            return compose_path, filled_path, sent_path
        except Exception as e:
            self.logs.append(f"Compose/send failed: {str(e)}")
            error_path = await self.screenshot(prefix="gmail_compose_error")
            self.error_screenshots.append(error_path)
            raise

    async def screenshot(self, prefix="gmail_step"):
        if self.page:
            filename = timestamped_filename(prefix)
            path = os.path.join(self.screenshot_dir, filename)
            await self.page.screenshot(path=path)
            return path
        return None

    async def close(self):
        if self.browser:
            await self.browser.close()
            self.browser = None
            self.page = None
            self.context = None 