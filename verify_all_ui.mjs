import { chromium } from 'playwright-core';

(async () => {
  const browser = await chromium.launch({
    executablePath: '/usr/bin/google-chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  const errors = [];
  page.on('pageerror', err => errors.push(err.toString()));
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push(msg.text());
  });

  console.log('1. Checking Landing Page...');
  await page.goto('http://127.0.0.1:8000/');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: '/home/ratul/Github/mikrotik-billing/final_home_top.png' });

  // Scroll to FAQ and click first accordion item
  console.log('2. Testing FAQ Accordion...');
  await page.evaluate(() => {
    document.getElementById('faq')?.scrollIntoView({ behavior: 'instant' });
  });
  await page.waitForTimeout(800);
  // Click first accordion trigger
  const faqBtn = page.locator('#faq button').first();
  if (await faqBtn.count() > 0) {
    await faqBtn.click();
    await page.waitForTimeout(600);
  }
  await page.screenshot({ path: '/home/ratul/Github/mikrotik-billing/final_home_faq.png' });

  // Scroll to Contact Section
  console.log('3. Checking Contact Section...');
  await page.evaluate(() => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'instant' });
  });
  await page.waitForTimeout(800);
  await page.screenshot({ path: '/home/ratul/Github/mikrotik-billing/final_home_contact.png' });

  // Test Speed Test modal
  console.log('4. Testing Speed Test Modal...');
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(500);
  const speedBtn = page.locator('#nav-speedtest-btn');
  if (await speedBtn.count() > 0) {
    await speedBtn.click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: '/home/ratul/Github/mikrotik-billing/final_modal_speedtest.png' });
    // Close modal by clicking backdrop or close button
    await page.locator('button[aria-label="Close modal"]').first().click();
    await page.waitForTimeout(600);
  }

  // Test Voucher Recharge modal
  console.log('5. Testing Voucher Recharge Modal...');
  const rechargeBtn = page.locator('#nav-recharge-btn');
  if (await rechargeBtn.count() > 0) {
    await rechargeBtn.click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: '/home/ratul/Github/mikrotik-billing/final_modal_recharge.png' });
    await page.locator('button[aria-label="Close modal"]').first().click();
    await page.waitForTimeout(600);
  }

  // Check /all-packages
  console.log('6. Checking /all-packages...');
  await page.goto('http://127.0.0.1:8000/all-packages');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: '/home/ratul/Github/mikrotik-billing/final_all_packages.png' });

  // Check /warning
  console.log('7. Checking /warning...');
  await page.goto('http://127.0.0.1:8000/warning');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: '/home/ratul/Github/mikrotik-billing/final_warning.png' });

  // Login and check Billing Dashboard
  console.log('8. Logging in to Dashboard...');
  await page.goto('http://127.0.0.1:8000/login');
  await page.fill('input[type="email"]', 'rezwanahmedratul007@gmail.com');
  await page.fill('input[type="password"]', 'rezwanahmedratul007@gmail.com');
  await Promise.all([page.waitForNavigation(), page.click('button[type="submit"]')]);
  if (!page.url().includes('billing/dashboard')) await page.goto('http://127.0.0.1:8000/billing/dashboard');
  await page.waitForTimeout(2500);

  // Set dark theme
  await page.evaluate(() => {
    if (window.applyGlobalTheme) window.applyGlobalTheme('dark');
  });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: '/home/ratul/Github/mikrotik-billing/final_dashboard_dark.png' });

  // MikroTik NOC tab
  console.log('9. Checking MikroTik Control NOC tab...');
  const mikrotikTab = page.locator('button:has-text("MikroTik Control NOC")');
  if (await mikrotikTab.count() > 0) {
    await mikrotikTab.click();
    await page.waitForTimeout(1200);
    await page.screenshot({ path: '/home/ratul/Github/mikrotik-billing/final_dash_tab_mikrotik.png' });
  }

  // Subscribers & Resellers tab
  console.log('10. Checking Subscribers & Resellers tab...');
  const subTab = page.locator('button:has-text("Subscribers & Resellers")');
  if (await subTab.count() > 0) {
    await subTab.click();
    await page.waitForTimeout(1200);
    await page.screenshot({ path: '/home/ratul/Github/mikrotik-billing/final_dash_tab_subscribers.png' });
  }

  // Live Payment Stream tab
  console.log('11. Checking Live Payment Stream tab...');
  const payTab = page.locator('button:has-text("Live Payment Stream")');
  if (await payTab.count() > 0) {
    await payTab.click();
    await page.waitForTimeout(1200);
    await page.screenshot({ path: '/home/ratul/Github/mikrotik-billing/final_dash_tab_collections.png' });
  }

  // Command Palette test
  console.log('12. Testing Command Palette (Cmd+K)...');
  await page.keyboard.press('Control+KeyK');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: '/home/ratul/Github/mikrotik-billing/final_command_palette.png' });
  await page.keyboard.press('Escape');
  await page.waitForTimeout(500);

  console.log('Verification finished! Total logged errors:', errors.length);
  if (errors.length > 0) {
    console.log('Errors:', errors);
  }

  await browser.close();
})();
