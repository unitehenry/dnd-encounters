// Dependencies
const puppeteer = require('puppeteer');

/** 
* Break existing cookies into individual pieces for puppeteer to use 
* @returns {Array} Individual cookies separated by name and value
*/
function cookieMonster(cookies) {
 return new Promise((resolve, reject) => {
    try {
      const crumbs = cookies.split(';').map(c => {
        const crumb = c.split('=');
        return { name: crumb[0], value: crumb[1] };
      });
    
      resolve(crumbs);
    } catch (err) {
      reject(err);
    }
 }) 
}

// Program
async function main() {

  // Initiate browser
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
 
  // Establish cookies
  const cookies = await cookieMonster(require('./cookies'); 
  cookies.forEach(async (c) => await page.setCookie(c));

  // Capture DnD Beyond Image
  await page.goto('https://dndbeyond.com/');
  await page.screenshot({path: 'snap.png'});

  // Finalize browser
  await browser.close();

}

// Start the Program
main();
