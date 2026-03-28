"""Mobile responsive tests across all sites."""
from playwright.sync_api import sync_playwright
import pytest

SITES = [
    'https://ch65-portfolio.vercel.app',
    'https://frontend-silk-three-66.vercel.app',
    'https://impulso-ia-navy.vercel.app',
]

@pytest.fixture(scope='module')
def mobile_page():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        ctx = browser.new_context(
            viewport={'width': 375, 'height': 812},  # iPhone SE
            is_mobile=True,
        )
        pg = ctx.new_page()
        yield pg
        browser.close()

@pytest.mark.parametrize('url', SITES)
def test_mobile_loads(mobile_page, url):
    response = mobile_page.goto(url, wait_until='networkidle', timeout=30000)
    assert response.status == 200

@pytest.mark.parametrize('url', SITES)
def test_no_horizontal_overflow(mobile_page, url):
    mobile_page.goto(url, wait_until='networkidle', timeout=30000)
    overflow = mobile_page.evaluate('document.documentElement.scrollWidth > document.documentElement.clientWidth')
    # Allow small overflow (scrollbar width)
    scroll_width = mobile_page.evaluate('document.documentElement.scrollWidth')
    client_width = mobile_page.evaluate('document.documentElement.clientWidth')
    assert scroll_width <= client_width + 20  # 20px tolerance
