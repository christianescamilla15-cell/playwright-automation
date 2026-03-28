"""Browser setup helper with retry and screenshot-on-failure."""
from playwright.sync_api import sync_playwright
from playwright.async_api import async_playwright
import os

SCREENSHOTS_DIR = os.path.join(os.path.dirname(__file__), '..', 'screenshots')
os.makedirs(SCREENSHOTS_DIR, exist_ok=True)

def get_browser_sync(headless=True):
    """Get a sync browser instance."""
    pw = sync_playwright().start()
    browser = pw.chromium.launch(headless=headless)
    return pw, browser

def get_context(browser, **kwargs):
    """Create a browser context with sensible defaults."""
    return browser.new_context(
        viewport={'width': 1280, 'height': 720},
        user_agent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        **kwargs,
    )

def screenshot_on_error(page, name):
    """Take a screenshot for debugging."""
    path = os.path.join(SCREENSHOTS_DIR, f'{name}.png')
    page.screenshot(path=path)
    return path
