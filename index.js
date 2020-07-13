const puppeteer = require('puppeteer');
const cookies = require('./cookies');

(async () => {

  const crumbs = cookies.split(';').map(c => {
    const nible = c.split('=');
    return { name: nible[0], value: nible[1] };
  });

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  crumbs.forEach(async (c) => await page.setCookie(c));

  await page.goto('https://dndbeyond.com/');
  await page.screenshot({path: 'snap.png'});

  await browser.close();

})()
