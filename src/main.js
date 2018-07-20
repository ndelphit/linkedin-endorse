const puppeteer = require('puppeteer');

/**
 * Disable images loading on site (For fast loading)
 */
const disableImagesLoad = async (page) => {
    await page.setRequestInterception(true);
    page.on('request', request => {
        if (request.resourceType() === 'image') {
            request.abort()
        } else {
            request.continue()
        }
    });
};
/**
 * Initialize bot
 */
const main = async (email, password) => {
    try {
        const browser = await puppeteer.launch({
            headless: false,
            args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu']
        });
        const page = await browser.newPage();
        await disableImagesLoad(page);

        let login = require('./login')(page, email, password);
        await login.init();

        let contacts = require('./get_contacts')(page);
        const urls = await contacts.init();

        let endorse = require('./endorse')(page, urls);
        await endorse.init();

        await browser.close();
    } catch (err) {
        console.error(err);
        process.exit();
    }
};

module.exports = main;
