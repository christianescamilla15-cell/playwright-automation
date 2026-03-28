"""Scheduled scraper runner with configurable intervals."""
import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

import time
import threading
from datetime import datetime
from scrapers.github_scraper import scrape_github_profile
from scrapers.product_monitor import scrape_products
from scrapers.form_automation import automate_form
from storage.database import start_run, complete_run, save_github_snapshot, save_product_prices, save_form_result

JOBS = {
    'github': {'fn': scrape_github_profile, 'interval_seconds': 3600, 'save': save_github_snapshot},
    'products': {'fn': scrape_products, 'interval_seconds': 1800, 'save': None},
    'forms': {'fn': automate_form, 'interval_seconds': 7200, 'save': None},
}

def run_scraper(name, save_fn=None):
    """Execute a single scraper with tracking."""
    start = time.time()
    run_id = start_run(name)
    try:
        result = JOBS[name]['fn']()
        duration = int((time.time() - start) * 1000)
        items = 0

        if name == 'github':
            items = result.get('repos', 0)
            save_github_snapshot(run_id, result)
        elif name == 'products':
            items = result.get('product_count', 0)
            save_product_prices(run_id, result.get('products', []))
        elif name == 'forms':
            items = len(result.get('steps', []))
            save_form_result(run_id, result)

        complete_run(run_id, items, duration)
        print(f"[{datetime.now().strftime('%H:%M:%S')}] {name}: OK ({items} items, {duration}ms)")
        return result
    except Exception as e:
        duration = int((time.time() - start) * 1000)
        complete_run(run_id, 0, duration, str(e))
        print(f"[{datetime.now().strftime('%H:%M:%S')}] {name}: ERROR - {e}")
        return None

def run_all():
    """Run all scrapers once."""
    results = {}
    for name in JOBS:
        results[name] = run_scraper(name)
    return results

def start_scheduler(jobs=None, run_once=False):
    """Start the scheduler loop."""
    jobs = jobs or list(JOBS.keys())
    print(f"Scheduler starting with jobs: {jobs}")

    # Run immediately
    for name in jobs:
        run_scraper(name)

    if run_once:
        return

    # Schedule recurring runs
    def schedule_job(name, interval):
        while True:
            time.sleep(interval)
            run_scraper(name)

    threads = []
    for name in jobs:
        interval = JOBS[name]['interval_seconds']
        t = threading.Thread(target=schedule_job, args=(name, interval), daemon=True)
        t.start()
        threads.append(t)
        print(f"  {name}: every {interval}s")

    print("Scheduler running. Press Ctrl+C to stop.")
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\nScheduler stopped.")

if __name__ == '__main__':
    import sys
    if '--once' in sys.argv:
        run_all()
    else:
        start_scheduler()
