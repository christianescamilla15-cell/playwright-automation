"""SQLite persistence for scraped data with history tracking."""
import sqlite3
import json
import os
from datetime import datetime

DB_PATH = os.path.join(os.path.dirname(__file__), '..', 'data', 'scraper.db')

def get_connection():
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode=WAL")
    return conn

def init_db():
    """Create tables if not exist."""
    conn = get_connection()
    conn.executescript('''
        CREATE TABLE IF NOT EXISTS scrape_runs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            scraper TEXT NOT NULL,
            status TEXT NOT NULL DEFAULT 'running',
            items_count INTEGER DEFAULT 0,
            duration_ms INTEGER DEFAULT 0,
            error_message TEXT,
            created_at TEXT DEFAULT (datetime('now')),
            completed_at TEXT
        );
        CREATE TABLE IF NOT EXISTS github_snapshots (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            run_id INTEGER REFERENCES scrape_runs(id),
            username TEXT NOT NULL,
            repos INTEGER,
            followers INTEGER,
            following INTEGER,
            contributions TEXT,
            pinned_repos TEXT,
            raw_data TEXT,
            created_at TEXT DEFAULT (datetime('now'))
        );
        CREATE TABLE IF NOT EXISTS product_prices (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            run_id INTEGER REFERENCES scrape_runs(id),
            title TEXT NOT NULL,
            price TEXT,
            price_numeric REAL,
            rating TEXT,
            availability TEXT,
            source_url TEXT,
            created_at TEXT DEFAULT (datetime('now'))
        );
        CREATE TABLE IF NOT EXISTS form_results (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            run_id INTEGER REFERENCES scrape_runs(id),
            target_url TEXT,
            success INTEGER,
            steps_count INTEGER,
            steps_json TEXT,
            screenshot_before TEXT,
            screenshot_after TEXT,
            created_at TEXT DEFAULT (datetime('now'))
        );
        CREATE INDEX IF NOT EXISTS idx_runs_scraper ON scrape_runs(scraper);
        CREATE INDEX IF NOT EXISTS idx_runs_created ON scrape_runs(created_at);
        CREATE INDEX IF NOT EXISTS idx_prices_title ON product_prices(title);
    ''')
    conn.close()

def save_github_snapshot(run_id, data):
    conn = get_connection()
    conn.execute('''INSERT INTO github_snapshots
        (run_id, username, repos, followers, following, contributions, pinned_repos, raw_data)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)''',
        (run_id, data.get('username'), data.get('repos'), data.get('followers'),
         data.get('following'), data.get('contribution_text'),
         json.dumps(data.get('pinned_repos', [])), json.dumps(data)))
    conn.commit()
    conn.close()

def save_product_prices(run_id, products):
    conn = get_connection()
    for p in products:
        price_num = float(p['price'].replace('\u00a3','').replace('$','').replace(',','')) if p.get('price') else 0
        conn.execute('''INSERT INTO product_prices
            (run_id, title, price, price_numeric, rating, availability, source_url)
            VALUES (?, ?, ?, ?, ?, ?, ?)''',
            (run_id, p['title'], p['price'], price_num, p['rating'], p['availability'], p.get('detail_url','')))
    conn.commit()
    conn.close()

def save_form_result(run_id, data):
    conn = get_connection()
    conn.execute('''INSERT INTO form_results
        (run_id, target_url, success, steps_count, steps_json, screenshot_before, screenshot_after)
        VALUES (?, ?, ?, ?, ?, ?, ?)''',
        (run_id, data.get('url'), 1 if data.get('success') else 0, len(data.get('steps',[])),
         json.dumps(data.get('steps',[])), 'form_before_submit.png', 'form_after_login.png'))
    conn.commit()
    conn.close()

def start_run(scraper_name):
    conn = get_connection()
    cur = conn.execute('INSERT INTO scrape_runs (scraper) VALUES (?)', (scraper_name,))
    run_id = cur.lastrowid
    conn.commit()
    conn.close()
    return run_id

def complete_run(run_id, items_count, duration_ms, error=None):
    conn = get_connection()
    conn.execute('''UPDATE scrape_runs SET status=?, items_count=?, duration_ms=?,
        error_message=?, completed_at=datetime('now') WHERE id=?''',
        ('error' if error else 'completed', items_count, duration_ms, error, run_id))
    conn.commit()
    conn.close()

def get_run_history(scraper=None, limit=20):
    conn = get_connection()
    if scraper:
        rows = conn.execute('SELECT * FROM scrape_runs WHERE scraper=? ORDER BY created_at DESC LIMIT ?', (scraper, limit)).fetchall()
    else:
        rows = conn.execute('SELECT * FROM scrape_runs ORDER BY created_at DESC LIMIT ?', (limit,)).fetchall()
    conn.close()
    return [dict(r) for r in rows]

def get_price_history(title, limit=30):
    conn = get_connection()
    rows = conn.execute('SELECT * FROM product_prices WHERE title=? ORDER BY created_at DESC LIMIT ?', (title, limit)).fetchall()
    conn.close()
    return [dict(r) for r in rows]

# Initialize on import
init_db()
