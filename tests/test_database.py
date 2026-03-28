"""Tests for SQLite persistence layer."""
import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

import pytest
from storage.database import init_db, start_run, complete_run, get_run_history, save_product_prices, get_price_history

def test_init_db():
    init_db()  # Should not raise

def test_start_and_complete_run():
    run_id = start_run('test_scraper')
    assert run_id > 0
    complete_run(run_id, 5, 1234)
    history = get_run_history('test_scraper', 1)
    assert len(history) >= 1
    assert history[0]['status'] == 'completed'
    assert history[0]['items_count'] == 5

def test_error_run():
    run_id = start_run('test_error')
    complete_run(run_id, 0, 500, 'Test error')
    history = get_run_history('test_error', 1)
    assert history[0]['status'] == 'error'
    assert history[0]['error_message'] == 'Test error'

def test_save_product_prices():
    run_id = start_run('products_test')
    save_product_prices(run_id, [
        {'title': 'Test Book', 'price': '\u00a39.99', 'rating': 'Three', 'availability': 'In stock', 'detail_url': ''},
    ])
    complete_run(run_id, 1, 100)
    prices = get_price_history('Test Book')
    assert len(prices) >= 1
    assert prices[0]['price_numeric'] == 9.99

def test_run_history_all():
    history = get_run_history(limit=5)
    assert isinstance(history, list)
