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
        
        # 1. Capture in App Theme (Green)
        await page.goto(f"{html_path.as_uri()}?theme=green", wait_until="networkidle")
        await page.wait_for_timeout(1000)
        
        for i in range(1, 7):
            slide_locator = page.locator(f"#slide-{i}")
            screenshot_path = output_dir / f"slide_{i}.png"
            await slide_locator.screenshot(path=str(screenshot_path))
            print(f"Captured slide {i} (Green Theme) -> {screenshot_path}")
            
        # Capture dedicated green slides
        await page.locator("#slide-2").screenshot(path=str(output_dir / "slide_2_agritech_green.png"))
        await page.locator("#slide-3").screenshot(path=str(output_dir / "slide_3_agritech_green.png"))
        await page.locator("#slide-4").screenshot(path=str(output_dir / "slide_4_agritech_green.png"))
        print("Captured dedicated -> slide_2, 3, 4 agritech_green.png")
        
        # 2. Capture in Executive Blue Theme
        await page.goto(f"{html_path.as_uri()}?theme=blue", wait_until="networkidle")
        await page.wait_for_timeout(1000)
        await page.locator("#slide-2").screenshot(path=str(output_dir / "slide_2_executive_blue.png"))
        await page.locator("#slide-3").screenshot(path=str(output_dir / "slide_3_executive_blue.png"))
        await page.locator("#slide-4").screenshot(path=str(output_dir / "slide_4_executive_blue.png"))
        print("Captured dedicated -> slide_2, 3, 4 executive_blue.png")
            
        await browser.close()
        print("All slides and dual-theme variants captured successfully.")

if __name__ == "__main__":
    asyncio.run(capture_slides())
