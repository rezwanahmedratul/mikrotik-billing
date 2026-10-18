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

  // Set theme to dark
  await page.evaluate(() => {
    window.applyGlobalTheme('dark');
    localStorage.setItem('theme', 'dark');
  });
  await page.waitForTimeout(1000);

  console.log('--- 2. Checking React Sidebar Mounting & Initial State (Dark) ---');
  const darkState = await page.evaluate(() => {
    const reactSidebar = document.querySelector('.react-sidebar-navigation');
    const sections = Array.from(document.querySelectorAll('.react-sidebar-navigation .nav-section-wrapper'));
    const firstSection = sections[0];
    const dashboardLink = reactSidebar ? reactSidebar.querySelector('a[href*="dashboard"]') : null;
    const dashboardStyle = dashboardLink ? window.getComputedStyle(dashboardLink) : null;
    const mikrotikToggle = reactSidebar ? Array.from(reactSidebar.querySelectorAll('button')).find(b => b.textContent.includes('Mikrotik Setup')) : null;

    return {
      isMounted: !!reactSidebar,
      sectionCount: sections.length,
      dashboardBg: dashboardStyle ? dashboardStyle.backgroundColor : null,
      dashboardColor: dashboardStyle ? dashboardStyle.color : null,
      mikrotikToggleFound: !!mikrotikToggle,
      errors: window.errors || [],
    };
  });
  console.log('Dark State:', JSON.stringify(darkState, null, 2));

  console.log('--- 3. Testing Mikrotik Setup Collapse in React ---');
  // Click "Mikrotik Setup" in React sidebar
  const toggleBtn = await page.locator('.react-sidebar-navigation button:has-text("Mikrotik Setup")');
  await toggleBtn.click();
  await page.waitForTimeout(600); // allow framer-motion animation

  const collapseExpandedMetrics = await page.evaluate(() => {
    const reactSidebar = document.querySelector('.react-sidebar-navigation');
    const mikrotikToggle = Array.from(reactSidebar.querySelectorAll('button')).find(b => b.textContent.includes('Mikrotik Setup'));
    const toggleStyle = mikrotikToggle ? window.getComputedStyle(mikrotikToggle) : null;
    const ipPoolLink = Array.from(reactSidebar.querySelectorAll('a')).find(a => a.textContent.includes('IP & Pool'));
    const ipPoolStyle = ipPoolLink ? window.getComputedStyle(ipPoolLink) : null;

    return {
      toggleBg: toggleStyle ? toggleStyle.backgroundColor : null,
      toggleColor: toggleStyle ? toggleStyle.color : null,
      isSolidWhite: toggleStyle ? (toggleStyle.backgroundColor === 'rgb(255, 255, 255)') : false,
      ipPoolFound: !!ipPoolLink,
      ipPoolColor: ipPoolStyle ? ipPoolStyle.color : null,
      ipPoolPadding: ipPoolStyle ? ipPoolStyle.padding : null,
    };
  });
  console.log('Collapse Expanded Metrics (Dark):', JSON.stringify(collapseExpandedMetrics, null, 2));

  await page.screenshot({ path: '/home/ratul/Github/mikrotik-billing/screenshot_react_nav_dark.png' });

  console.log('--- 4. Testing Light Mode Navbar & Collapse ---');
  await page.evaluate(() => {
    window.applyGlobalTheme('light');
    localStorage.setItem('theme', 'light');
  });
  await page.waitForTimeout(1000);

  const lightMetrics = await page.evaluate(() => {
    const reactSidebar = document.querySelector('.react-sidebar-navigation');
    const dashboardLink = reactSidebar ? reactSidebar.querySelector('a[href*="dashboard"]') : null;
    const dashboardStyle = dashboardLink ? window.getComputedStyle(dashboardLink) : null;
    const mikrotikToggle = Array.from(reactSidebar.querySelectorAll('button')).find(b => b.textContent.includes('Mikrotik Setup'));
    const toggleStyle = mikrotikToggle ? window.getComputedStyle(mikrotikToggle) : null;

    return {
      dashboardBg: dashboardStyle ? dashboardStyle.backgroundColor : null,
      dashboardColor: dashboardStyle ? dashboardStyle.color : null,
      isSolidDark: dashboardStyle ? (dashboardStyle.backgroundColor === 'rgb(9, 9, 11)' || dashboardStyle.backgroundColor === '#09090b') : false,
      toggleBg: toggleStyle ? toggleStyle.backgroundColor : null,
      isToggleSolidDark: toggleStyle ? (toggleStyle.backgroundColor === 'rgb(9, 9, 11)' || toggleStyle.backgroundColor === '#09090b') : false,
    };
  });
  console.log('Light Mode Metrics:', JSON.stringify(lightMetrics, null, 2));

  await page.screenshot({ path: '/home/ratul/Github/mikrotik-billing/screenshot_react_nav_light.png' });

  if (errors.length > 0) {
    console.log('Page/Console Errors detected:', errors);
  } else {
    console.log('Zero console/page errors detected!');
  }

  await browser.close();
  console.log('--- React Navigation Test Completed ---');
})();
