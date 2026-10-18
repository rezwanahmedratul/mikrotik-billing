import { chromium } from 'playwright-core';

(async () => {
  const browser = await chromium.launch({
    executablePath: '/usr/bin/google-chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  console.log('--- 1. Login and navigate to dashboard ---');
  await page.goto('http://127.0.0.1:8000/login');
  await page.fill('input[type="email"]', 'rezwanahmedratul007@gmail.com');
  await page.fill('input[type="password"]', 'rezwanahmedratul007@gmail.com');
  await Promise.all([page.waitForNavigation(), page.click('button[type="submit"]')]);
  if (!page.url().includes('billing/dashboard')) await page.goto('http://127.0.0.1:8000/billing/dashboard');
  await page.waitForTimeout(2000);

  // Set theme to dark
  await page.evaluate(() => {
    window.applyGlobalTheme('dark');
    localStorage.setItem('theme', 'dark');
  });
  await page.waitForTimeout(1000);

  console.log('--- 2. Inspecting Topbar and Sidebar Initial State (Dark) ---');
  const initialDarkMetrics = await page.evaluate(() => {
    const topbar = document.querySelector('.content .navbar-top');
    const navVertical = document.querySelector('.navbar-vertical');
    const firstLabel = document.querySelector('.navbar-vertical-label-wrapper');
    const mikrotikToggle = document.querySelector('a[href="#mikrotikSetup"]');
    
    // Topbar children heights
    const topbarChildren = topbar ? Array.from(topbar.children).map(c => ({
      tag: c.tagName,
      className: c.className,
      height: window.getComputedStyle(c).height,
      marginTop: window.getComputedStyle(c).marginTop,
      marginBottom: window.getComputedStyle(c).marginBottom,
      paddingTop: window.getComputedStyle(c).paddingTop,
      paddingBottom: window.getComputedStyle(c).paddingBottom,
    })) : [];

    return {
      topbarHeight: topbar ? window.getComputedStyle(topbar).height : null,
      topbarPadding: topbar ? window.getComputedStyle(topbar).padding : null,
      topbarChildren,
      sidebarWidth: navVertical ? window.getComputedStyle(navVertical).width : null,
      firstLabelPadding: firstLabel ? window.getComputedStyle(firstLabel).padding : null,
      mikrotikExpanded: mikrotikToggle ? mikrotikToggle.getAttribute('aria-expanded') : null,
    };
  });
  console.log('Initial Dark Metrics:', JSON.stringify(initialDarkMetrics, null, 2));

  console.log('--- 3. Testing Mikrotik Setup Collapse Expand ---');
  // Click Mikrotik Setup dropdown trigger
  await page.click('a[href="#mikrotikSetup"]');
  await page.waitForTimeout(600);

  const mikrotikExpandedMetrics = await page.evaluate(() => {
    const mikrotikToggle = document.querySelector('a[href="#mikrotikSetup"]');
    const mikrotikMenu = document.querySelector('#mikrotikSetup');
    const toggleStyle = mikrotikToggle ? window.getComputedStyle(mikrotikToggle) : null;
    const menuStyle = mikrotikMenu ? window.getComputedStyle(mikrotikMenu) : null;
    const firstSubItem = mikrotikMenu ? mikrotikMenu.querySelector('.nav-link') : null;
    const firstSubItemStyle = firstSubItem ? window.getComputedStyle(firstSubItem) : null;

    return {
      ariaExpanded: mikrotikToggle ? mikrotikToggle.getAttribute('aria-expanded') : null,
      menuDisplay: menuStyle ? menuStyle.display : null,
      menuHeight: menuStyle ? menuStyle.height : null,
      menuHasShowClass: mikrotikMenu ? mikrotikMenu.classList.contains('show') : false,
      toggleBg: toggleStyle ? toggleStyle.backgroundColor : null,
      toggleColor: toggleStyle ? toggleStyle.color : null,
      isSolidWhite: toggleStyle ? (toggleStyle.backgroundColor === 'rgb(255, 255, 255)' || toggleStyle.backgroundColor === '#ffffff') : false,
      firstSubItemPadding: firstSubItemStyle ? firstSubItemStyle.padding : null,
      firstSubItemColor: firstSubItemStyle ? firstSubItemStyle.color : null,
    };
  });
  console.log('Mikrotik Expanded Metrics (Dark):', JSON.stringify(mikrotikExpandedMetrics, null, 2));

  await page.screenshot({ path: '/home/ratul/Github/mikrotik-billing/screenshot_collapse_dark.png' });

  console.log('--- 4. Testing Collections & Reports Collapse ---');
  // Click Collection dropdown
  await page.click('a[href="#collections"]');
  await page.waitForTimeout(600);

  const collectionsMetrics = await page.evaluate(() => {
    const colMenu = document.querySelector('#collections');
    return {
      collectionsExpanded: document.querySelector('a[href="#collections"]')?.getAttribute('aria-expanded'),
      collectionsHasShow: colMenu ? colMenu.classList.contains('show') : false
    };
  });
  console.log('Collections Metrics:', JSON.stringify(collectionsMetrics, null, 2));

  console.log('--- 5. Testing Light Mode Navbar & Collapse ---');
  await page.evaluate(() => {
    window.applyGlobalTheme('light');
    localStorage.setItem('theme', 'light');
  });
  await page.waitForTimeout(1000);

  const lightMetrics = await page.evaluate(() => {
    const mikrotikToggle = document.querySelector('a[href="#mikrotikSetup"]');
    const toggleStyle = mikrotikToggle ? window.getComputedStyle(mikrotikToggle) : null;

    return {
      toggleBg: toggleStyle ? toggleStyle.backgroundColor : null,
      toggleColor: toggleStyle ? toggleStyle.color : null,
      isSolidDark: toggleStyle ? (toggleStyle.backgroundColor === 'rgb(9, 9, 11)' || toggleStyle.backgroundColor === '#09090b') : false,
    };
  });
  console.log('Light Mode Collapse Metrics:', JSON.stringify(lightMetrics, null, 2));

  await page.screenshot({ path: '/home/ratul/Github/mikrotik-billing/screenshot_collapse_light.png' });

  await browser.close();
  console.log('--- Test Completed Successfully ---');
})();
