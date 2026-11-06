// Downloads the public contribution calendar of a GitHub user and writes contributions.json
// for the landing page. Runs in a daily GitHub Action; no token needed (public profile page).
import { writeFile } from 'node:fs/promises';

const USER = process.env.GITHUB_USER || 'urtaav';
const OUT = new URL('../contributions.json', import.meta.url);

const res = await fetch(`https://github.com/users/${USER}/contributions`, {
  headers: { 'User-Agent': 'uriel-landing-updater' },
});
if (!res.ok) throw new Error(`GitHub answered ${res.status}`);
const html = await res.text();

// each day is a <td data-date="YYYY-MM-DD" id="..."> with a <tool-tip for="id">N contributions on ...</tool-tip>
const days = [...html.matchAll(/data-date="(\d{4}-\d{2}-\d{2})"[^>]*?id="([^"]+)"/g)].map((m) => ({ date: m[1], id: m[2] }));
const tips = Object.fromEntries([...html.matchAll(/<tool-tip[^>]*for="([^"]+)"[^>]*>([^<]*)<\/tool-tip>/g)].map((m) => [m[1], m[2]]));
if (days.length < 300) throw new Error(`Only ${days.length} days found; the page format may have changed`);

days.sort((a, b) => a.date.localeCompare(b.date));
const counts = days.map(({ id }) => {
  const tip = tips[id] || '';
  return /^No /.test(tip) ? 0 : parseInt(tip, 10) || 0;
});

const data = { user: USER, start: days[0].date, end: days[days.length - 1].date, counts };
await writeFile(OUT, JSON.stringify(data) + '\n');
console.log(`${days.length} days, ${counts.reduce((a, b) => a + b, 0)} contributions, ${data.start} → ${data.end}`);
