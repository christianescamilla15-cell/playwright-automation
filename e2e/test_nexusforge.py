"""E2E tests for NexusForge AI frontend."""
from playwright.sync_api import sync_playwright
import pytest

BASE_URL = 'https://frontend-silk-three-66.vercel.app'

@pytest.fixture(scope='module')
def page():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        ctx = browser.new_context(viewport={'width': 1280, 'height': 720})
        pg = ctx.new_page()
        yield pg
        browser.close()

def test_nexusforge_loads(page):
    response = page.goto(BASE_URL, wait_until='networkidle', timeout=30000)
    assert response.status == 200

def test_has_nexusforge_title(page):
    assert 'NexusForge' in page.title()

def test_sidebar_navigation(page):
    page.goto(BASE_URL, wait_until='networkidle', timeout=30000)
    content = page.content().lower()
    assert 'dashboard' in content or 'panel' in content

def test_agents_page(page):
    page.goto(BASE_URL, wait_until='networkidle', timeout=30000)
    content = page.content().lower()
    assert 'agent' in content

def test_no_api_errors(page):
    page.goto(BASE_URL, wait_until='networkidle', timeout=30000)
    # Should NOT show NetworkError
    content = page.content()
    assert 'NetworkError' not in content
