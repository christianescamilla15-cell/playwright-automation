"""E2E tests for ImpulsoIA business site."""
from playwright.sync_api import sync_playwright
import pytest

BASE_URL = 'https://impulso-ia-navy.vercel.app'

@pytest.fixture(scope='module')
def page():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        ctx = browser.new_context(viewport={'width': 1280, 'height': 720})
        pg = ctx.new_page()
        yield pg
        browser.close()

def test_impulso_loads(page):
    response = page.goto(BASE_URL, wait_until='networkidle', timeout=30000)
    assert response.status == 200

def test_has_services(page):
    page.goto(BASE_URL, wait_until='networkidle', timeout=30000)
    content = page.content().lower()
    assert 'servicio' in content or 'service' in content

def test_has_contact(page):
    page.goto(BASE_URL, wait_until='networkidle', timeout=30000)
    content = page.content().lower()
    assert 'contacto' in content or 'contact' in content
