import asyncio
import os
from pathlib import Path
from playwright.async_api import async_playwright

async def export_presentation():
    project_root = Path(__file__).parent.resolve()
    html_path = project_root / "web_deck" / "index.html"
    pdf_path = project_root / "Fasal_Disha_SIH2026_Presentation.pdf"
    
    if not html_path.exists():
        print(f"Error: {html_path} does not exist!")
        return

    print(f"Loading presentation from: {html_path}")
    
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page(viewport={"width": 1920, "height": 1080})
        
        # Navigate to local file URL
        file_url = html_path.as_uri()
        await page.goto(file_url, wait_until="networkidle")
        
        # Wait extra second for fonts & high-res images to render cleanly
        await page.wait_for_timeout(2000)
        
        # Generate 16:9 PDF
        await page.pdf(
            path=str(pdf_path),
            width="1920px",
            height="1080px",
            print_background=True,
            margin={"top": "0px", "right": "0px", "bottom": "0px", "left": "0px"},
            prefer_css_page_size=True
        )
        
        await browser.close()
        print(f"[SUCCESS] Presentation PDF generated at: {pdf_path}")

if __name__ == "__main__":
    asyncio.run(export_presentation())
