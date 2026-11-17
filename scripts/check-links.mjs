import fs from 'node:fs';

const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const base = 'https://gessemacedo.github.io/assets/';

if (!html.includes(base)) {
  console.error(`A base ${base} não está em index.html`);
  process.exit(1);
}

const urls = ['cv.pdf', 'cv-en.pdf'].map((name) => {
  if (!html.includes(`"${name}"`)) {
    console.error(`"${name}" não está em index.html`);
    process.exit(1);
  }
  return base + name;
});

let failed = false;

for (const url of urls) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 15000);
  try {
    const res = await fetch(url, { method: 'HEAD', redirect: 'follow', signal: ctrl.signal });
    const type = (res.headers.get('content-type') || '').toLowerCase();
    if (res.status !== 200 || !type.includes('application/pdf')) {
      console.error(`${url} respondeu ${res.status} (${type || 'sem tipo'})`);
      failed = true;
      continue;
    }
    console.log(`${url} ok`);
  } catch (err) {
    console.error(`${url} falhou: ${err instanceof Error ? err.message : err}`);
    failed = true;
  } finally {
    clearTimeout(timer);
  }
}

if (failed) process.exit(1);
