"""Form Automation — demonstrates login flow + form submission + data extraction."""
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from playwright.sync_api import sync_playwright
from utils.retry import retry
import json
from datetime import datetime

DATA_DIR = os.path.join(os.path.dirname(__file__), '..', 'data')
os.makedirs(DATA_DIR, exist_ok=True)

SCREENSHOTS_DIR = os.path.join(os.path.dirname(__file__), '..', 'screenshots')
os.makedirs(SCREENSHOTS_DIR, exist_ok=True)

@retry(max_attempts=3, delay=2.0)
def automate_form(url='https://the-internet.herokuapp.com/login'):
    """Automate login form on a public test site."""
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            viewport={'width': 1280, 'height': 720},
            user_agent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        )
        page = context.new_page()

        result = {
            'url': url,
            'steps': [],
            'success': False,
            'timestamp': datetime.utcnow().isoformat(),
        }

        # Step 1: Navigate to login page
        page.goto(url, wait_until='networkidle', timeout=30000)
        result['steps'].append({'action': 'navigate', 'url': url, 'status': 'ok'})

        # Step 2: Fill username
        page.fill('#username', 'tomsmith')
        result['steps'].append({'action': 'fill_username', 'value': 'tomsmith', 'status': 'ok'})

        # Step 3: Fill password
        page.fill('#password', 'SuperSecretPassword!')
        result['steps'].append({'action': 'fill_password', 'value': '***', 'status': 'ok'})

        # Step 4: Screenshot before submit
        page.screenshot(path=os.path.join(SCREENSHOTS_DIR, 'form_before_submit.png'))
        result['steps'].append({'action': 'screenshot_before', 'status': 'ok'})

        # Step 5: Click login
        page.click('button[type="submit"]')
        page.wait_for_load_state('networkidle')
        result['steps'].append({'action': 'click_submit', 'status': 'ok'})

        # Step 6: Verify login success
        flash = page.query_selector('#flash')
        if flash:
            message = flash.inner_text().strip()
            is_success = 'secure area' in message.lower() or 'logged in' in message.lower()
            result['steps'].append({
                'action': 'verify_login',
                'message': message,
                'success': is_success,
            })
            result['success'] = is_success

        # Step 7: Screenshot after login
        page.screenshot(path=os.path.join(SCREENSHOTS_DIR, 'form_after_login.png'))
        result['steps'].append({'action': 'screenshot_after', 'status': 'ok'})

        # Step 8: Extract secure page data
        if result['success']:
            heading = page.query_selector('h2')
            subheading = page.query_selector('.subheader')
            result['secure_page'] = {
                'heading': heading.inner_text().strip() if heading else '',
                'subheading': subheading.inner_text().strip() if subheading else '',
            }
            result['steps'].append({'action': 'extract_data', 'status': 'ok'})

            # Step 9: Logout
            page.click('a[href="/logout"]')
            page.wait_for_load_state('networkidle')
            result['steps'].append({'action': 'logout', 'status': 'ok'})

        browser.close()

        # Save result
        output_path = os.path.join(DATA_DIR, 'form_automation.json')
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(result, f, indent=2, ensure_ascii=False)

        return result

if __name__ == '__main__':
    result = automate_form()
    print(f"Login {'SUCCESS' if result['success'] else 'FAILED'}")
    for step in result['steps']:
        print(f"  {step['action']}: {step.get('status', step.get('success', ''))}")
