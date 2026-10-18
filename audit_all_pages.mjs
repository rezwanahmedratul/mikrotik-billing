import { chromium } from 'playwright-core';

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
  if (!page.url().includes('billing/dashboard')) await page.goto('http://127.0.0.1:8000/billing/dashboard');
  await page.waitForTimeout(2000);

  // Set dark theme
  await page.evaluate(() => {
    window.applyGlobalTheme('dark');
    localStorage.setItem('theme', 'dark');
  });
  await page.waitForTimeout(1000);

  console.log('1. Capturing Dashboard Overview (Dark)');
  await page.screenshot({ path: '/home/ratul/Github/mikrotik-billing/audit_1_dash_overview_dark.png' });

  console.log('2. Capturing Dashboard Mikrotik NOC tab');
  const mikrotikTab = await page.locator('button:has-text("MikroTik Control NOC")');
  if (await mikrotikTab.count() > 0) {
    await mikrotikTab.click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: '/home/ratul/Github/mikrotik-billing/audit_2_dash_mikrotik_dark.png' });
  }

  console.log('3. Capturing Dashboard Subscribers tab');
  const subsTab = await page.locator('button:has-text("Subscribers & Resellers")');
  if (await subsTab.count() > 0) {
    await subsTab.click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: '/home/ratul/Github/mikrotik-billing/audit_3_dash_subs_dark.png' });
  }

  console.log('4. Capturing Dashboard Collections tab');
  const colTab = await page.locator('button:has-text("Live Payment Stream")');
  if (await colTab.count() > 0) {
    await colTab.click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: '/home/ratul/Github/mikrotik-billing/audit_4_dash_col_dark.png' });
  }

  console.log('5. Capturing Light Mode Dashboard');
  await page.evaluate(() => {
    window.applyGlobalTheme('light');
    localStorage.setItem('theme', 'light');
  });
  await page.waitForTimeout(1000);
  const overviewTab = await page.locator('button:has-text("Overview & Financials")');
  if (await overviewTab.count() > 0) await overviewTab.click();
  await page.waitForTimeout(500);
  await page.screenshot({ path: '/home/ratul/Github/mikrotik-billing/audit_5_dash_overview_light.png' });

  console.log('6. Capturing Customers Index');
  await page.goto('http://127.0.0.1:8000/billing/customers');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: '/home/ratul/Github/mikrotik-billing/audit_6_customers_light.png' });

  console.log('7. Capturing Create Customer Page');
  await page.goto('http://127.0.0.1:8000/billing/create-customer');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: '/home/ratul/Github/mikrotik-billing/audit_7_create_customer_light.png' });

  await browser.close();
  console.log('--- All Audit Screenshots Captured ---');
})();
