const puppeteer = require('puppeteer');
const express = require('express')

const app = express()
const port = 3000

const asyncHandler = fn => (req, res, next) =>
Promise.resolve(fn(req, res, next)).catch(next)
  
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/recovery', asyncHandler(async (req, res) => {
    
    try {
     
        const number = req?.body?.number;
        const email = req?.body?.email;
	
	console.log(number, email);

        const response = await getRecovery(number, email);
        res.json(response);
        
    } catch (error) {
        res.json(error, 500);
    }

}))

async function getRecovery(number, email) {
  
    try {

        if(number == null && email == null || number.length < 10) {
            throw {"Error": true, "Message": "Error in data request"};
        }

        const browser = await puppeteer.launch({args: [
	'--no-sandbox',
	'--log-level=3',
                    '--no-default-browser-check',
                    '--disable-site-isolation-trials',
                    '--no-experiments',
                    '--ignore-gpu-blacklist',
                    '--ignore-certificate-errors',
                    '--ignore-certificate-errors-spki-list',
                    '--disable-gpu',
                    '--disable-extensions',
                    '--disable-default-apps',
                    '--enable-features=NetworkService',
                    '--disable-setuid-sandbox',
	]});

        const page = await browser.newPage();
	console.log(browser);        
        await page.waitForTimeout(60000, async () => {
            await page.close();
            await browser.close();
       })

        await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.125 Safari/537.36')
        await page.goto('https://www.whatsapp.com/contact/?subject=messenger');

        await page.waitForSelector('input[name="phone_number"]', { visible: true });
        await page.type('input[name="phone_number"]', number)

        await page.waitForSelector('input[name="email"]', { visible: true });
        await page.type('input[name="email"]', email)

        await page.waitForSelector('input[name="email_confirm"]', { visible: true });
        await page.type('input[name="email_confirm"]', email)

        await page.waitForSelector('textarea[name="your_message"]', { visible: true });
        await page.type('textarea[name="your_message"]', "Eu não enviei spam nesse número, poderiam por gentileza verificar o que aconteceu?")

        await page.waitForSelector("button[id='submit']");
	await page.$eval("button[id='submit']", form => form.click() );

        ps = Date.now();
        let ts = Math.floor(ps/1000);

        await page.waitForSelector("button[id='submit']", { visible: true });
	await page.$eval("button[id='submit']", form => form.click() );

        await page.waitForSelector('.bold', { visible: true });
        let element = await page.$('.bold')

        let confirmed = await page.evaluate(el => el.textContent, element)

        let response = {"number": number, "email": email, "solicited": false, "success": false, "confirmed": false, 'updated_at': ts}
        if(confirmed === 'WHATSAPP'){
            response = {"number": number, "email": email, "message": "This number is solicited for WhatsApp Inc, this process await for 48h hours ty again", "solicited": true, "success": true, "confirmed": true, 'updated_at': ts}
        }

        return response;

    } catch (error) {

        ps = Date.now();
        let ts = Math.floor(ps/1000);

        let response = { "number": number, "email": email, "solicited": false, "success": false, "error": error, 'updated_at': ts}
        return response;
    }
}

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`)
})
