"""CLI for running scrapers and checking status."""
import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

import argparse
from scheduler.runner import run_scraper, run_all, start_scheduler
from storage.database import get_run_history, get_price_history

def main():
    parser = argparse.ArgumentParser(description='Playwright Automation CLI')
    sub = parser.add_subparsers(dest='command')

    # Run commands
    run_p = sub.add_parser('run', help='Run a scraper')
    run_p.add_argument('scraper', choices=['github', 'products', 'forms', 'all'])

    # Schedule command
    sub.add_parser('schedule', help='Start scheduler')

    # History command
    hist_p = sub.add_parser('history', help='Show run history')
    hist_p.add_argument('--scraper', choices=['github', 'products', 'forms'])
    hist_p.add_argument('--limit', type=int, default=10)

    # Price history
    price_p = sub.add_parser('prices', help='Show price history for a product')
    price_p.add_argument('title', help='Product title')

    args = parser.parse_args()

    if args.command == 'run':
        if args.scraper == 'all':
            run_all()
        else:
            run_scraper(args.scraper)
    elif args.command == 'schedule':
        start_scheduler()
    elif args.command == 'history':
        runs = get_run_history(args.scraper, args.limit)
        for r in runs:
            print(f"[{r['created_at']}] {r['scraper']}: {r['status']} ({r['items_count']} items, {r['duration_ms']}ms)")
    elif args.command == 'prices':
        prices = get_price_history(args.title)
        for p in prices:
            print(f"[{p['created_at']}] {p['title']}: {p['price']}")
    else:
        parser.print_help()

if __name__ == '__main__':
    main()
