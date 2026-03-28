"""Tests for form automation — verifies REAL form interaction."""
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

import pytest
from scrapers.form_automation import automate_form

@pytest.fixture(scope='module')
def form_result():
    return automate_form()

def test_returns_dict(form_result):
    assert isinstance(form_result, dict)

def test_login_successful(form_result):
    assert form_result['success'] is True

def test_has_steps(form_result):
    assert len(form_result['steps']) >= 7

def test_all_steps_completed(form_result):
    for step in form_result['steps']:
        status = step.get('status', step.get('success', None))
        assert status in ['ok', True], f"Step {step['action']} failed"

def test_secure_page_extracted(form_result):
    assert 'secure_page' in form_result
    assert len(form_result['secure_page']['heading']) > 0

def test_screenshots_taken():
    import os
    screenshots_dir = os.path.join(os.path.dirname(__file__), '..', 'screenshots')
    assert os.path.exists(os.path.join(screenshots_dir, 'form_before_submit.png'))
    assert os.path.exists(os.path.join(screenshots_dir, 'form_after_login.png'))

def test_data_saved_to_file():
    import os
    data_path = os.path.join(os.path.dirname(__file__), '..', 'data', 'form_automation.json')
    assert os.path.exists(data_path)
