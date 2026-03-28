"""Tests for scheduler runner."""
import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

import pytest
from scheduler.runner import run_scraper, run_all

def test_run_github_scraper():
    result = run_scraper('github')
    assert result is not None
    assert result['repos'] > 0

def test_run_products_scraper():
    result = run_scraper('products')
    assert result is not None
    assert result['product_count'] > 0

def test_run_form_automation():
    result = run_scraper('forms')
    assert result is not None
    assert result['success'] is True

def test_run_all():
    results = run_all()
    assert 'github' in results
    assert 'products' in results
    assert 'forms' in results
