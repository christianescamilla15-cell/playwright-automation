"""Product Price Monitor — scrapes real product prices from public listings."""
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from playwright.sync_api import sync_playwright
from utils.retry import retry
import json
from datetime import datetime

DATA_DIR = os.path.join(os.path.dirname(__file__), '..', 'data')
os.makedirs(DATA_DIR, exist_ok=True)

@retry(max_attempts=3, delay=2.0)
def scrape_products(url='https://books.toscrape.com/', max_products=10):
    """Scrape real product data from books.toscrape.com (legal scraping sandbox)."""
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            viewport={'width': 1280, 'height': 720},
            user_agent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        )
        page = context.new_page()
        page.goto(url, wait_until='networkidle', timeout=30000)

        products = []
        articles = page.query_selector_all('article.product_pod')

        for article in articles[:max_products]:
            title_el = article.query_selector('h3 a')
            price_el = article.query_selector('.price_color')
            rating_el = article.query_selector('.star-rating')
            availability_el = article.query_selector('.availability')

            title = title_el.get_attribute('title') if title_el else ''
            price = price_el.inner_text().strip() if price_el else ''
            rating_class = rating_el.get_attribute('class') if rating_el else ''
            rating = rating_class.replace('star-rating ', '') if rating_class else ''
            availability = availability_el.inner_text().strip() if availability_el else ''

            # Get detail page URL
            detail_url = ''
            if title_el:
                href = title_el.get_attribute('href')
                if href:
                    detail_url = url.rstrip('/') + '/' + href if not href.startswith('http') else href

            products.append({
                'title': title,
                'price': price,
                'rating': rating,
                'availability': availability,
                'detail_url': detail_url,
                'scraped_at': datetime.utcnow().isoformat(),
            })

        browser.close()

        result = {
            'source': url,
            'product_count': len(products),
            'scraped_at': datetime.utcnow().isoformat(),
            'products': products,
        }

        output_path = os.path.join(DATA_DIR, 'products.json')
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(result, f, indent=2, ensure_ascii=False)

        return result

if __name__ == '__main__':
    result = scrape_products()
    print(f"Scraped {result['product_count']} products")
    for p in result['products'][:3]:
        print(f"  {p['title']} — {p['price']}")
