import asyncio
from pathlib import Path
from playwright.async_api import async_playwright

async def capture_slides():
    project_root = Path(__file__).parent.resolve()
    html_path = project_root / "web_deck" / "index.html"
    output_dir = project_root / "web_deck" / "screenshots"
    output_dir.mkdir(exist_ok=True)
    
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page(viewport={"width": 1920, "height": 1080, "device_scale_factor": 1})
        await page.goto(html_path.as_uri(), wait_until="networkidle")
        await page.wait_for_timeout(1000)
        
        for i in range(1, 7):
            slide_locator = page.locator(f"#slide-{i}")
            screenshot_path = output_dir / f"slide_{i}.png"
            await slide_locator.screenshot(path=str(screenshot_path))
            print(f"Captured slide {i} -> {screenshot_path}")
            
        await browser.close()
        print("All 6 slides captured successfully.")

if __name__ == "__main__":
    asyncio.run(capture_slides())
