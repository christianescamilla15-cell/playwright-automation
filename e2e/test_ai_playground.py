"""E2E tests for AI Playground."""
from playwright.sync_api import sync_playwright
import pytest

BASE_URL = 'https://ai-playground-phi-three.vercel.app'

@pytest.fixture(scope='module')
def page():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        ctx = browser.new_context(viewport={'width': 1280, 'height': 720})
        pg = ctx.new_page()
        yield pg
        browser.close()

def test_playground_loads(page):
    response = page.goto(BASE_URL, wait_until='networkidle', timeout=30000)
    assert response.status == 200

def test_has_tabs(page):
    page.goto(BASE_URL, wait_until='networkidle', timeout=30000)
    content = page.content().lower()
    assert 'chat' in content

def test_no_blank_page(page):
    page.goto(BASE_URL, wait_until='networkidle', timeout=30000)
    body = page.query_selector('body')
    text = body.inner_text() if body else ''
    assert len(text.strip()) > 50  # Not a blank page
