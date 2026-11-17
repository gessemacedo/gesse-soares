const { test, expect } = require('@playwright/test');

const PT = {
  title: 'Olá, eu sou o Gessé 👋',
  button: 'Baixar currículo',
  href: 'https://gessemacedo.github.io/assets/cv.pdf',
  download: 'Curriculo-Gesse-Soares-PT.pdf',
  lang: 'pt-BR',
  buttonCode: 'pt',
};

const EN = {
  title: "Hi, I'm Gessé 👋",
  button: 'Download resume',
  href: 'https://gessemacedo.github.io/assets/cv-en.pdf',
  download: 'Resume-Gesse-Soares-EN.pdf',
  lang: 'en',
  buttonCode: 'en',
};

async function expectLang(page, lang) {
  const heading = page.locator('#t');
  const cv = page.locator('#cv');
  await expect(heading).toBeVisible();
  await expect(heading).toHaveText(lang.title);
  await expect(cv).toBeVisible();
  await expect(cv).toHaveText(lang.button);
  await expect(cv).toHaveAttribute('href', lang.href);
  await expect(cv).toHaveAttribute('download', lang.download);
  await expect(page.locator('html')).toHaveAttribute('lang', lang.lang);
  await expect(page.locator('.lang')).toBeVisible();

  const selected = page.locator(`.lang button[data-l="${lang.buttonCode}"]`);
  const otherCode = lang.buttonCode === 'pt' ? 'en' : 'pt';
  const other = page.locator(`.lang button[data-l="${otherCode}"]`);
  await expect(selected).toBeVisible();
  await expect(other).toBeVisible();
  await expect(selected).toHaveAttribute('aria-pressed', 'true');
  await expect(selected).toHaveClass('on');
  await expect(other).toHaveAttribute('aria-pressed', 'false');
  await expect(other).not.toHaveClass(/on/);
}

async function headPdf(request, url) {
  const res = await request.fetch(url, { method: 'HEAD', timeout: 15000 });
  expect(res.status(), url).toBe(200);
  const type = (res.headers()['content-type'] || '').toLowerCase();
  expect(type, url).toContain('application/pdf');
}

test('idioma, preferência salva e currículo', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (err) => errors.push(String(err)));
  page.on('console', (msg) => {
    if (msg.type() !== 'error') return;
    const where = `${msg.location().url || ''} ${msg.text()}`;
    if (where.includes('favicon.ico')) return;
    errors.push(where.trim());
  });

  expect(PT.title).not.toBe('');
  expect(EN.title).not.toBe('');
  expect(PT.button).not.toBe('');
  expect(EN.button).not.toBe('');
  expect(PT.title).not.toBe(EN.title);
  expect(PT.button).not.toBe(EN.button);

  await page.goto('/');
  await expectLang(page, PT);

  await page.locator('.lang button[data-l="en"]').click();
  await expectLang(page, EN);
  await headPdf(page.request, await page.locator('#cv').getAttribute('href'));

  await page.locator('.lang button[data-l="pt"]').click();
  await expectLang(page, PT);
  await headPdf(page.request, await page.locator('#cv').getAttribute('href'));

  await page.locator('.lang button[data-l="en"]').click();
  await expectLang(page, EN);
  await page.reload();
  await expectLang(page, EN);

  await page.evaluate(() => localStorage.setItem('gesse-soares.lang', 'fr'));
  await page.reload();
  await expectLang(page, PT);

  expect(errors, errors.join('\n')).toEqual([]);
});
