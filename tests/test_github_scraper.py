"""Tests for GitHub scraper — verifies REAL data extraction."""
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

import pytest
from scrapers.github_scraper import scrape_github_profile

@pytest.fixture(scope='module')
def github_data():
    """Scrape once, reuse across tests."""
    return scrape_github_profile('christianescamilla15-cell')

def test_returns_dict(github_data):
    assert isinstance(github_data, dict)

def test_has_username(github_data):
    assert github_data['username'] == 'christianescamilla15-cell'

def test_has_repos_count(github_data):
    assert isinstance(github_data['repos'], int)
    assert github_data['repos'] > 0  # Christian has 20+ repos

def test_has_pinned_repos(github_data):
    assert isinstance(github_data['pinned_repos'], list)

def test_pinned_repos_have_names(github_data):
    if github_data['pinned_repos']:
        for repo in github_data['pinned_repos']:
            assert 'name' in repo
            assert len(repo['name']) > 0

def test_data_saved_to_file():
    import os
    data_path = os.path.join(os.path.dirname(__file__), '..', 'data', 'github_profile.json')
    assert os.path.exists(data_path)
