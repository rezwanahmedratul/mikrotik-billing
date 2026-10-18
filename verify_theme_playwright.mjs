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

  // Set theme to dark first
  await page.evaluate(() => {
    window.applyGlobalTheme('dark');
    localStorage.setItem('theme', 'dark');
  });
  await page.waitForTimeout(1000);

  console.log('--- 2. Checking Dark Mode Navbar & Solid White Active States ---');
  const darkChecks = await page.evaluate(() => {
    const navVertical = document.querySelector('.navbar-vertical');
    const toggleBtn = document.querySelector('.navbar-vertical-toggle');
    const toggleIconWrapper = document.querySelector('.toggle-icon-wrapper');
    const content = document.querySelector('.content');

    // Sidebar active link
    const activeSidebarLink = document.querySelector('.navbar-vertical .nav-link.active') || document.querySelector('.navbar-vertical .nav-link');
    const activeSidebarStyle = activeSidebarLink ? window.getComputedStyle(activeSidebarLink) : null;
    const activeSidebarText = activeSidebarLink?.querySelector('.nav-link-text');
    const activeSidebarTextStyle = activeSidebarText ? window.getComputedStyle(activeSidebarText) : null;

    // React segmented tab (Overview & Financials)
    const reactTabs = Array.from(document.querySelectorAll('button')).filter(b => b.textContent.includes('Overview & Financials'));
    const activeTab = reactTabs[0];
    const activeTabStyle = activeTab ? window.getComputedStyle(activeTab) : null;

    return {
      theme: document.documentElement.getAttribute('data-bs-theme'),
      toggleBtnExists: !!toggleBtn && window.getComputedStyle(toggleBtn).display !== 'none',
      toggleIconWrapperExists: !!toggleIconWrapper && window.getComputedStyle(toggleIconWrapper).display !== 'none',
      navbarWidth: navVertical ? window.getComputedStyle(navVertical).width : null,
      navbarDisplay: navVertical ? window.getComputedStyle(navVertical).display : null,
      contentMarginLeft: content ? window.getComputedStyle(content).marginLeft : null,
      sidebarActiveBg: activeSidebarStyle ? activeSidebarStyle.backgroundColor : null,
      sidebarActiveColor: activeSidebarStyle ? activeSidebarStyle.color : null,
      sidebarActiveTextColor: activeSidebarTextStyle ? activeSidebarTextStyle.color : null,
      reactTabBg: activeTabStyle ? activeTabStyle.backgroundColor : null,
      reactTabColor: activeTabStyle ? activeTabStyle.color : null,
    };
  });
  console.log('Dark Mode Results:', JSON.stringify(darkChecks, null, 2));
  await page.screenshot({ path: '/home/ratul/Github/mikrotik-billing/screenshot_sidebar_dark.png' });

  console.log('--- 3. Switching to Light Mode ---');
  await page.evaluate(() => {
    window.applyGlobalTheme('light');
    localStorage.setItem('theme', 'light');
  });
  await page.waitForTimeout(1000);

  console.log('--- 4. Checking Light Mode Navbar & Solid Dark Active States ---');
  const lightChecks = await page.evaluate(() => {
    const navVertical = document.querySelector('.navbar-vertical');
    const toggleBtn = document.querySelector('.navbar-vertical-toggle');
    const toggleIconWrapper = document.querySelector('.toggle-icon-wrapper');
    const content = document.querySelector('.content');

    // Sidebar active link
    const activeSidebarLink = document.querySelector('.navbar-vertical .nav-link.active') || document.querySelector('.navbar-vertical .nav-link');
    const activeSidebarStyle = activeSidebarLink ? window.getComputedStyle(activeSidebarLink) : null;
    const activeSidebarText = activeSidebarLink?.querySelector('.nav-link-text');
    const activeSidebarTextStyle = activeSidebarText ? window.getComputedStyle(activeSidebarText) : null;

    // React segmented tab
    const reactTabs = Array.from(document.querySelectorAll('button')).filter(b => b.textContent.includes('Overview & Financials'));
    const activeTab = reactTabs[0];
    const activeTabStyle = activeTab ? window.getComputedStyle(activeTab) : null;

    return {
      theme: document.documentElement.getAttribute('data-bs-theme'),
      toggleBtnExists: !!toggleBtn && window.getComputedStyle(toggleBtn).display !== 'none',
      toggleIconWrapperExists: !!toggleIconWrapper && window.getComputedStyle(toggleIconWrapper).display !== 'none',
      navbarWidth: navVertical ? window.getComputedStyle(navVertical).width : null,
      navbarDisplay: navVertical ? window.getComputedStyle(navVertical).display : null,
      contentMarginLeft: content ? window.getComputedStyle(content).marginLeft : null,
      sidebarActiveBg: activeSidebarStyle ? activeSidebarStyle.backgroundColor : null,
      sidebarActiveColor: activeSidebarStyle ? activeSidebarStyle.color : null,
      sidebarActiveTextColor: activeSidebarTextStyle ? activeSidebarTextStyle.color : null,
      reactTabBg: activeTabStyle ? activeTabStyle.backgroundColor : null,
      reactTabColor: activeTabStyle ? activeTabStyle.color : null,
    };
  });
  console.log('Light Mode Results:', JSON.stringify(lightChecks, null, 2));
  await page.screenshot({ path: '/home/ratul/Github/mikrotik-billing/screenshot_sidebar_light.png' });

  // 5. Test tapping / clicking an inactive tab in Light Mode
  console.log('--- 5. Clicking MikroTik NOC tab in Light Mode ---');
  const mikrotikTab = page.locator('button:has-text("MikroTik Control NOC")');
  await mikrotikTab.click();
  await page.waitForTimeout(1000);

  const lightTabClickCheck = await page.evaluate(() => {
    const reactTabs = Array.from(document.querySelectorAll('button')).filter(b => b.textContent.includes('MikroTik Control NOC'));
    const activeTab = reactTabs[0];
    const activeTabStyle = activeTab ? window.getComputedStyle(activeTab) : null;
    return {
      tabBg: activeTabStyle ? activeTabStyle.backgroundColor : null,
      tabColor: activeTabStyle ? activeTabStyle.color : null,
    };
  });
  console.log('Light Mode MikroTik Tab Click Results:', JSON.stringify(lightTabClickCheck, null, 2));
  await page.screenshot({ path: '/home/ratul/Github/mikrotik-billing/screenshot_sidebar_light_clicked.png' });

  // 6. Switch back to Dark Mode and test clicking
  console.log('--- 6. Switching to Dark Mode and clicking Subscribers tab ---');
  await page.evaluate(() => {
    window.applyGlobalTheme('dark');
    localStorage.setItem('theme', 'dark');
  });
  await page.waitForTimeout(1000);

  const subscribersTab = page.locator('button:has-text("Subscribers & Resellers")');
  await subscribersTab.click();
  await page.waitForTimeout(1000);

  const darkTabClickCheck = await page.evaluate(() => {
    const reactTabs = Array.from(document.querySelectorAll('button')).filter(b => b.textContent.includes('Subscribers & Resellers'));
    const activeTab = reactTabs[0];
    const activeTabStyle = activeTab ? window.getComputedStyle(activeTab) : null;
    return {
      tabBg: activeTabStyle ? activeTabStyle.backgroundColor : null,
      tabColor: activeTabStyle ? activeTabStyle.color : null,
    };
  });
  console.log('Dark Mode Subscribers Tab Click Results:', JSON.stringify(darkTabClickCheck, null, 2));
  await page.screenshot({ path: '/home/ratul/Github/mikrotik-billing/screenshot_sidebar_dark_clicked.png' });

  console.log('All tests completed successfully. Errors encountered:', errors.length);
  await browser.close();
})();
