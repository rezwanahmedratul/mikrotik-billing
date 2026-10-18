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

  console.log('--- 1. Login and navigate to dashboard ---');
  await page.goto('http://127.0.0.1:8000/login');
  await page.fill('input[type="email"]', 'rezwanahmedratul007@gmail.com');
  await page.fill('input[type="password"]', 'rezwanahmedratul007@gmail.com');
  await Promise.all([page.waitForNavigation(), page.click('button[type="submit"]')]);
  if (!page.url().includes('billing/dashboard')) await page.goto('http://127.0.0.1:8000/billing/dashboard');
  await page.waitForTimeout(2500);

  // Clear localStorage theme to test clean default
  await page.evaluate(() => {
    localStorage.removeItem('theme');
  });
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  const defaultState = await page.evaluate(() => {
    const navVertical = document.querySelector('.navbar-vertical');
    const collapse = document.querySelector('.navbar-collapse');
    const clock = document.querySelector('.text-xl.font-mono');
    return {
      themeAttr: document.documentElement.getAttribute('data-bs-theme'),
      localTheme: localStorage.getItem('theme'),
      bodyBg: window.getComputedStyle(document.body).backgroundColor,
      contentBg: window.getComputedStyle(document.querySelector('.content')).backgroundColor,
      navVerticalBg: navVertical ? window.getComputedStyle(navVertical).backgroundColor : null,
      navCollapseBg: collapse ? window.getComputedStyle(collapse).backgroundColor : null,
      clockColor: clock ? window.getComputedStyle(clock).color : null
    };
  });
  console.log('--- 2. Default Fresh State (Should be Dark) ---');
  console.log(JSON.stringify(defaultState, null, 2));
  await page.screenshot({ path: '/home/ratul/Github/mikrotik-billing/screenshot_verified_dark.png' });

  // 3. Test single-click toggle -> should switch to light
  console.log('--- 3. Single-click toggle to Light ---');
  await page.click('#themeSwitchDropdown');
  await page.waitForTimeout(1000);

  const lightState = await page.evaluate(() => {
    const navVertical = document.querySelector('.navbar-vertical');
    const clock = document.querySelector('.text-xl.font-mono');
    return {
      themeAttr: document.documentElement.getAttribute('data-bs-theme'),
      localTheme: localStorage.getItem('theme'),
      bodyBg: window.getComputedStyle(document.body).backgroundColor,
      contentBg: window.getComputedStyle(document.querySelector('.content')).backgroundColor,
      navVerticalBg: navVertical ? window.getComputedStyle(navVertical).backgroundColor : null,
      clockColor: clock ? window.getComputedStyle(clock).color : null
    };
  });
  console.log(JSON.stringify(lightState, null, 2));
  await page.screenshot({ path: '/home/ratul/Github/mikrotik-billing/screenshot_verified_light.png' });

  // 4. Test single-click toggle again -> should switch back to dark
  console.log('--- 4. Single-click toggle back to Dark ---');
  await page.click('#themeSwitchDropdown');
  await page.waitForTimeout(1000);

  const darkAgainState = await page.evaluate(() => {
    const navVertical = document.querySelector('.navbar-vertical');
    const clock = document.querySelector('.text-xl.font-mono');
    return {
      themeAttr: document.documentElement.getAttribute('data-bs-theme'),
      localTheme: localStorage.getItem('theme'),
      bodyBg: window.getComputedStyle(document.body).backgroundColor,
      contentBg: window.getComputedStyle(document.querySelector('.content')).backgroundColor,
      navVerticalBg: navVertical ? window.getComputedStyle(navVertical).backgroundColor : null,
      clockColor: clock ? window.getComputedStyle(clock).color : null
    };
  });
  console.log(JSON.stringify(darkAgainState, null, 2));
  await page.screenshot({ path: '/home/ratul/Github/mikrotik-billing/screenshot_verified_toggle_back_dark.png' });

  // 5. Test page reload persistence in Dark mode
  console.log('--- 5. Testing Page Reload Persistence ---');
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  const reloadedState = await page.evaluate(() => {
    const navVertical = document.querySelector('.navbar-vertical');
    return {
      themeAttr: document.documentElement.getAttribute('data-bs-theme'),
      localTheme: localStorage.getItem('theme'),
      bodyBg: window.getComputedStyle(document.body).backgroundColor,
      contentBg: window.getComputedStyle(document.querySelector('.content')).backgroundColor,
      navVerticalBg: navVertical ? window.getComputedStyle(navVertical).backgroundColor : null
    };
  });
  console.log(JSON.stringify(reloadedState, null, 2));
  await page.screenshot({ path: '/home/ratul/Github/mikrotik-billing/screenshot_verified_reload_dark.png' });

  console.log('Console / Page Errors:', errors);
  await browser.close();
  console.log('ALL PLAYWRIGHT TESTS COMPLETE!');
})();
