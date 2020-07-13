// Dependencies
const puppeteer = require('puppeteer');

/** 
* Break existing cookies into individual pieces for puppeteer to use 
* @returns {Array} Individual cookies separated by name and value
*/
function cookieMonster(cookies) {
  const crumbs = cookies.split(';').map(c => {
    const crumb = c.split('=');
    return { name: crumb[0], value: crumb[1] };
  });
  
  return crumbs;
}

// Program
async function main() {

      // Initialize browser context
      const browser = await puppeteer.launch({headless: false, slowMo: 2000});
      const page = await browser.newPage();
      
      // Establish cookies
      const cookies = cookieMonster(require('./cookies')); 
      cookies.forEach(async (c) => await page.setCookie(c));
     
      // Enable JavaScript
      await page.setJavaScriptEnabled(true);
      
      // Capture DnD Beyond Image
      await page.goto('https://www.dndbeyond.com/');
      await page.reload('https://www.dndbeyond.com');
      await page.goto('https://www.dndbeyond.com/search?q=goblin'); 

      await page.screenshot({path: 'snap.png'});
      
      // Finalize browser
      await browser.close();

}

// Start the Program
main();
