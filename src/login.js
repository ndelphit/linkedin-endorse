class Login {
    constructor(page, email, password) {
        this.page = page;
        this.email = email;
        this.password = password;
    }

    async init() {
        try {
            const {page, email, password} = this;
            await page.goto('https://www.linkedin.com/', {waitUntil: 'networkidle2'})
            await page.bringToFront();
            await page.waitForSelector('#login-email');
            await page.type('#login-email', email, {delay: 10});
            await page.waitForSelector('#login-password');
            await page.type('#login-password', password, {delay: 10});
            await page.click('#login-submit');
            await page.waitForNavigation();
        } catch (err) {
            console.log("Can't login on LinkedIn")
        }
    }
}

module.exports = (page, email, password) => {
    return new Login(page, email, password);
};