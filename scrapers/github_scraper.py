"""GitHub Profile Scraper — extracts real data from github.com."""
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from playwright.sync_api import sync_playwright
from utils.retry import retry
import json

DATA_DIR = os.path.join(os.path.dirname(__file__), '..', 'data')
os.makedirs(DATA_DIR, exist_ok=True)

@retry(max_attempts=3, delay=2.0)
def scrape_github_profile(username='christianescamilla15-cell'):
    """Scrape real GitHub profile data."""
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            viewport={'width': 1280, 'height': 720},
            user_agent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        )
        page = context.new_page()
        page.goto(f'https://github.com/{username}', wait_until='networkidle', timeout=30000)

        # Extract profile data
        data = {
            'username': username,
            'name': '',
            'bio': '',
            'repos': 0,
            'followers': 0,
            'following': 0,
            'pinned_repos': [],
            'contribution_text': '',
        }

        # Name
        name_el = page.query_selector('.p-name.vcard-fullname')
        if name_el:
            data['name'] = name_el.inner_text().strip()

        # Bio
        bio_el = page.query_selector('.p-note.user-profile-bio div')
        if bio_el:
            data['bio'] = bio_el.inner_text().strip()

        # Stats (repos, followers, following)
        nav_items = page.query_selector_all('.UnderlineNav-item')
        for item in nav_items:
            text = item.inner_text().strip().lower()
            count_el = item.query_selector('.Counter')
            if count_el:
                count = count_el.inner_text().strip()
                try:
                    count_num = int(count.replace(',', ''))
                except ValueError:
                    count_num = 0
                if 'repositories' in text or 'repositorios' in text:
                    data['repos'] = count_num

        # Followers/following from profile sidebar
        follower_links = page.query_selector_all('a[href$="followers"], a[href$="following"]')
        for link in follower_links:
            text = link.inner_text().strip().lower()
            try:
                num = int(''.join(filter(str.isdigit, text)))
            except ValueError:
                num = 0
            if 'follower' in text:
                data['followers'] = num
            elif 'following' in text:
                data['following'] = num

        # Pinned repos
        pinned = page.query_selector_all('.pinned-item-list-item-content')
        for pin in pinned[:6]:
            repo_link = pin.query_selector('a.mr-1')
            desc_el = pin.query_selector('.pinned-item-desc')
            lang_el = pin.query_selector('[itemprop="programmingLanguage"]')
            if repo_link:
                data['pinned_repos'].append({
                    'name': repo_link.inner_text().strip(),
                    'description': desc_el.inner_text().strip() if desc_el else '',
                    'language': lang_el.inner_text().strip() if lang_el else '',
                })

        # Contribution graph text
        contrib_el = page.query_selector('.js-yearly-contributions h2')
        if contrib_el:
            data['contribution_text'] = contrib_el.inner_text().strip()

        browser.close()

        # Save to file
        output_path = os.path.join(DATA_DIR, 'github_profile.json')
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)

        return data

if __name__ == '__main__':
    result = scrape_github_profile()
    print(json.dumps(result, indent=2, ensure_ascii=False))
