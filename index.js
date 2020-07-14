// Dependencies
const puppeteer = require('puppeteer');
const app = require('express')();
const port = process.env.PORT || 8008;
const cors = require('cors');

app.use(cors());

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
function getMonster(monster) {

      return new Promise(async (resolve, reject) => {
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
        await page.goto(`https://www.dndbeyond.com/search?q=${monster}`); 

        const result = await page.$('div.ddb-search-results-listing-item-header a');
        const statPage = await result.evaluate(node => node.getAttribute('href'));

        await page.goto(`https://dndbeyond.com${statPage}`);

        const block = await page.$('div.mon-stat-block');
        const html = await block.evaluate(node => {
          
          window.scrollTo(0, node.offsetTop); 
         
          function convert(el) {
            const computed = window.getComputedStyle(el);
            
            Object.keys(computed)
              .forEach(key => {
                const prop = computed[key];
                const value = window.getComputedStyle(el)[prop];
                el.style[prop] = value;
              })   
          }

          convert(node);
          [...node.querySelectorAll('*')].forEach(el => convert(el));
          node.querySelector('div.mon-stat-block__name').style.margin = '10px 0';

          return node.outerHTML;

        });
        
        // Finalize browser
        await browser.close();

        resolve(html);
      })

}

app.get('/:monster', (req, res) => {
  getMonster(req.params.monster).then(block => res.send(block));
})

app.listen(port, () => console.log(`Monster Server running on PORT: ${port}`));
