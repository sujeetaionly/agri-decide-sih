import os, time
from playwright.sync_api import sync_playwright

os.makedirs('app_walkthrough_screens', exist_ok=True)

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={'width': 412, 'height': 915})
    
    # 1. Reset / Language Select
    page.goto('http://127.0.0.1:5173/#reset')
    time.sleep(2)
    page.screenshot(path='app_walkthrough_screens/01_language_select.png')
    print('1. Captured Language Select')
    
    # Click Proceed on Language Select
    page.click('button')
    time.sleep(1.5)
    page.screenshot(path='app_walkthrough_screens/02_language_confirm.png')
    print('2. Captured Language Confirm')
    
    # Click Confirm on Language Confirm Page
    buttons = page.query_selector_all('button')
    for b in buttons:
        txt = b.inner_text()
        if 'आगे' in txt or 'हाँ' in txt or 'Confirm' in txt or 'Yes' in txt:
            b.click()
            break
    time.sleep(1.5)
    page.screenshot(path='app_walkthrough_screens/03_audio_guide.png')
    print('3. Captured Audio Guide')
    
    # Click Proceed on Audio Guide
    buttons = page.query_selector_all('button')
    for b in buttons:
        txt = b.inner_text()
        if 'शुरू' in txt or 'आगे' in txt or 'Start' in txt or 'Proceed' in txt:
            b.click()
            break
    time.sleep(1.5)
    page.screenshot(path='app_walkthrough_screens/04_login_page.png')
    print('4. Captured Login Page')
    
    # Click Guest Skip
    buttons = page.query_selector_all('button')
    for b in buttons:
        txt = b.inner_text()
        if 'अतिथि' in txt or 'Skip' in txt or 'Guest' in txt:
            b.click()
            break
    time.sleep(2)
    page.screenshot(path='app_walkthrough_screens/05_home_page.png')
    print('5. Captured Home Page')
    
    # Click Start New Crop Plan / Wizard
    buttons = page.query_selector_all('button')
    for b in buttons:
        txt = b.inner_text()
        if 'नयी फसल' in txt or 'नई फसल' in txt or 'योजना' in txt or 'New Plan' in txt:
            b.click()
            break
    time.sleep(1.5)
    page.screenshot(path='app_walkthrough_screens/06_wizard_card1_land.png')
    print('6. Captured Wizard Card 1 (Land)')
    
    # Iterate through 7 Wizard Cards
    for card_idx in range(2, 8):
        buttons = page.query_selector_all('button')
        for b in buttons:
            txt = b.inner_text()
            if 'आगे' in txt or 'अगला' in txt or 'Next' in txt:
                b.click()
                break
        time.sleep(1.2)
        page.screenshot(path=f'app_walkthrough_screens/0{card_idx+5}_wizard_card{card_idx}.png')
        print(f'Captured Wizard Card {card_idx}')
        
    # Click Submit for Recommendations
    buttons = page.query_selector_all('button')
    for b in buttons:
        txt = b.inner_text()
        if 'सिफारिशें' in txt or 'विश्लेषण' in txt or 'Get' in txt or 'View' in txt or 'आगे' in txt:
            b.click()
            break
    time.sleep(4)
    page.screenshot(path='app_walkthrough_screens/13_recommendations_step.png')
    print('13. Captured Recommendations Step')
    
    # Check What-If, Comparison, Milestone, etc.
    # What-If
    buttons = page.query_selector_all('button')
    for b in buttons:
        txt = b.inner_text()
        if 'क्या-अगर' in txt or 'What-If' in txt or 'सेंसिटिविटी' in txt:
            b.click()
            time.sleep(1.5)
            page.screenshot(path='app_walkthrough_screens/14_whatif_sandbox.png')
            print('14. Captured What-If Sandbox')
            break
            
    # Milestone / Calendar
    buttons = page.query_selector_all('button')
    for b in buttons:
        txt = b.inner_text()
        if 'समय-सारणी' in txt or 'कैलेंडर' in txt or 'Timeline' in txt or 'Milestone' in txt:
            b.click()
            time.sleep(1.5)
            page.screenshot(path='app_walkthrough_screens/15_milestone_calendar.png')
            print('15. Captured Milestone Calendar')
            break

    # Direct Routes
    page.goto('http://127.0.0.1:5173/#my-crop')
    time.sleep(2)
    page.screenshot(path='app_walkthrough_screens/16_my_crop_page.png')
    print('16. Captured My Crop Page')
    
    page.goto('http://127.0.0.1:5173/#history')
    time.sleep(2)
    page.screenshot(path='app_walkthrough_screens/17_history_page.png')
    print('17. Captured History Page')
    
    page.goto('http://127.0.0.1:5173/#settings')
    time.sleep(2)
    page.screenshot(path='app_walkthrough_screens/18_settings_page.png')
    print('18. Captured Settings Page')
    
    browser.close()
    print('All app screens recorded successfully!')
