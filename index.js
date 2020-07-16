// Dependencies
const puppeteer = require('puppeteer');
const express = require('express');
const app = express();
const port = process.env.PORT || 8008;
const fs = require('fs');
const bodyParser = require('body-parser')

app.use(express.static('./app/build'));
app.use(bodyParser.json());

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
        const browser = await puppeteer.launch({headless: false, slowMo: 700});
        
        try {

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

          try {

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
              [...node.querySelectorAll('a')]
                .forEach(link => {
                  link.setAttribute('href', `https://dndbeyond.com${link.getAttribute('href')}`);
                  link.setAttribute('target', '_blank');
                })

              return node.outerHTML;

            });


            resolve(html);

          } catch(e) {
            console.log('Could Not Find Monster'); 
            reject('Could Not Find Monster');
          }

        } finally {

          // Finalize browser
          await browser.close();

        }

      })

}

app.get('/:monster', (req, res) => {
  getMonster(req.params.monster)
    .then(block => res.send(block))
    .catch(err => {
      res.status(500).send(err);
    });
})

app.post('/request-sheet', async (req, res) => {
  
      const { monsters } = req.body;

      async function gatherBlocks() {
        return new Promise((resolve) => {
          
          const blocks = [];

          monsters.forEach(async (mon, i) => {
            try {
              const block = await getMonster(mon);
              blocks.push(block);
              if(i + 1 === monsters.length) { resolve(blocks) }
            } catch(e) {
              res.sendStatus(500);
            }
          })

        }) 
      }

      const blocks = await gatherBlocks();

      let sheet = '';
      blocks.forEach(b => sheet += b);
 
      fs.writeFile(`encounter.html`, sheet, (err) => {
      
        err && console.error(err);

        res.download(`${__dirname}/encounter.html`, (dErr) => {
          fs.unlink(`${__dirname}/encounter.html`, (uErr) => {err && console.error(uErr)});
        });

      });

})

app.get('/', (req, res) => {
  res.sendFile('./app/build/index.html');
})

app.listen(port, () => console.log(`Monster Server running on PORT: ${port}`));
