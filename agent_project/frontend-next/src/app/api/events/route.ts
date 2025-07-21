import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs'; // Playwright requires Node.js runtime

export async function GET(req: NextRequest) {
  const { chromium } = await import('playwright');

  const stream = new ReadableStream({
    async start(controller) {
      let browser;
      try {
        browser = await chromium.launch({ headless: true });
        const page = await browser.newPage();

        // Step 1: Go to Gmail
        await page.goto('https://gmail.com');
        const shot1 = await page.screenshot({ type: 'png' });
        controller.enqueue(
          `data: ${JSON.stringify({
            message: 'Opened Gmail',
            screenshot: `data:image/png;base64,${Buffer.from(shot1).toString('base64')}`,
          })}\n\n`
        );
        await new Promise((r) => setTimeout(r, 1500));

        // Step 2: (Optional) Click Sign In if visible (Gmail auto-redirects, but demo step)
        // const signInBtn = await page.$('text=Sign in');
        // if (signInBtn) {
        //   await signInBtn.click();
        //   await page.waitForTimeout(1000);
        //   const shot2 = await page.screenshot({ type: 'png' });
        //   controller.enqueue(
        //     `data: ${JSON.stringify({
        //       message: 'Clicked Sign In',
        //       screenshot: `data:image/png;base64,${Buffer.from(shot2).toString('base64')}`,
        //     })}\n\n`
        //   );
        //   await new Promise((r) => setTimeout(r, 1500));
        // }

        // Step 3: (Demo) Send a final message
        controller.enqueue(
          `data: ${JSON.stringify({ message: 'Automation complete!' })}\n\n`
        );
      } catch (err) {
        controller.enqueue(
          `data: ${JSON.stringify({ message: 'Error: ' + (err as Error).message })}\n\n`
        );
      } finally {
        if (browser) await browser.close();
        controller.close();
      }
    },
  });

  return new NextResponse(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  });
} 