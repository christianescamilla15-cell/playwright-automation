"""Tests for product monitor — verifies REAL price scraping."""
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

import pytest
from scrapers.product_monitor import scrape_products

@pytest.fixture(scope='module')
def product_data():
    return scrape_products(max_products=5)

def test_returns_dict(product_data):
    assert isinstance(product_data, dict)

def test_has_products(product_data):
    assert product_data['product_count'] > 0

def test_products_have_titles(product_data):
    for p in product_data['products']:
        assert len(p['title']) > 0

def test_products_have_prices(product_data):
    for p in product_data['products']:
        assert p['price'].startswith('£') or p['price'].startswith('$')

def test_products_have_ratings(product_data):
    valid_ratings = ['One', 'Two', 'Three', 'Four', 'Five']
    for p in product_data['products']:
        assert p['rating'] in valid_ratings

def test_products_have_timestamps(product_data):
    for p in product_data['products']:
        assert 'scraped_at' in p

def test_data_saved_to_file():
    import os
    data_path = os.path.join(os.path.dirname(__file__), '..', 'data', 'products.json')
    assert os.path.exists(data_path)
