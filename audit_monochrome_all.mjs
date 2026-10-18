import { chromium } from 'playwright-core';
import fs from 'fs';
import path from 'path';

const outDir = '/home/ratul/Github/mikrotik-billing/screenshots';
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

(async () => {
  const browser = await chromium.launch({
    executablePath: '/usr/bin/google-chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  console.log('--- Logging in ---');
  await page.goto('http://127.0.0.1:8000/login');
  await page.fill('input[type="email"]', 'rezwanahmedratul007@gmail.com');
  await page.fill('input[type="password"]', 'rezwanahmedratul007@gmail.com');
  await Promise.all([page.waitForNavigation(), page.click('button[type="submit"]')]);
  if (!page.url().includes('billing/dashboard')) {
    await page.goto('http://127.0.0.1:8000/billing/dashboard');
  }
  await page.waitForTimeout(2000);

  const pagesToAudit = [
    { name: '01_dashboard_overview', url: 'http://127.0.0.1:8000/billing/dashboard' },
    { name: '02_customers_billing', url: 'http://127.0.0.1:8000/billing/customers' },
    { name: '03_collection_report', url: 'http://127.0.0.1:8000/billing/collection-report' },
    { name: '04_profit_summary', url: 'http://127.0.0.1:8000/billing/admin/profit-summary' },
    { name: '05_expenses_manager', url: 'http://127.0.0.1:8000/billing/admin/expenses' },
    { name: '06_manage_users', url: 'http://127.0.0.1:8000/billing/admin-users' },
    { name: '07_manage_roles', url: 'http://127.0.0.1:8000/billing/admin-roles' },
    { name: '08_resellers_management', url: 'http://127.0.0.1:8000/resellers' }
  ];

  for (const item of pagesToAudit) {
    console.log(`Navigating to ${item.name} (${item.url})`);
    try {
      await page.goto(item.url, { waitUntil: 'networkidle' });
    } catch (e) {
      console.log(`Navigation standard wait timed out, continuing...`);
    }
    await page.waitForTimeout(1500);

    // Dark Mode
    await page.evaluate(() => {
      if (typeof window.applyGlobalTheme === 'function') {
        window.applyGlobalTheme('dark');
      } else {
        document.documentElement.setAttribute('data-bs-theme', 'dark');
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
      }
      localStorage.setItem('theme', 'dark');
    });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(outDir, `${item.name}_dark.png`) });
    console.log(`Saved ${item.name}_dark.png`);

    // Light Mode
    await page.evaluate(() => {
      if (typeof window.applyGlobalTheme === 'function') {
        window.applyGlobalTheme('light');
      } else {
        document.documentElement.setAttribute('data-bs-theme', 'light');
        document.documentElement.classList.add('light');
        document.documentElement.classList.remove('dark');
      }
      localStorage.setItem('theme', 'light');
    });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(outDir, `${item.name}_light.png`) });
    console.log(`Saved ${item.name}_light.png`);
  }

  await browser.close();
  console.log('--- Finished capturing all audit screenshots ---');
})();
