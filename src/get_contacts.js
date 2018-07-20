class GetContacts {
    constructor(page) {
        this.page = page;
    }

    async goToContacts() {
        try {
            const {page} = this;
            await page.goto('https://www.linkedin.com/mynetwork/invite-connect/connections/',  {
                timeout: 0
            });
        } catch (err) {
            console.log(err);
            console.log("Can't go to contacts")
        }
    };

    /* This function is injected into the page and used to scrape items from it. */
    async extractContacts() {
        try {
            return await this.page.evaluate(() => {
                const USER_PROFILE_SELECTOR = 'a[data-control-name=connection_profile].mn-connection-card__link';
                const users = Array.from(window.document.querySelectorAll(USER_PROFILE_SELECTOR));
                return users.map((user) => user.href);
            })
        } catch (err) {
            console.log("Can't extract contacts");
        }
    };

    /**
     * Extract user counts count
     */
    extractContactCount() {
        try {
            return this.page.evaluate(() => {
                return window.document.querySelector('.mn-connections__header h2').innerText.replace(/\D+/g, "");
            })
        } catch (err) {
            console.log("Can't extract contacts count")
        }
    };

    /* Scrolls and extracts contacts from a page.
     */
    async scrapeInfiniteScrollItems(scrollDelay = 100) {
        try {
            const {page} = this;
            let items = [];
            let previousHeight;
            while (items.length < 50) {
                items = await this.extractContacts();
                previousHeight = await page.evaluate('window.document.querySelector(\'.mn-connections\').scrollHeight');
                await page.evaluate('window.scrollBy(0, 5000)');
                await page.waitForFunction(`window.document.querySelector('.mn-connections').scrollHeight > ${previousHeight}`);
                await page.waitFor(scrollDelay);
            }
            return items;
        } catch (err) {
            console.log("Can't scroll");
        }
    };

    async init() {
        await this.goToContacts();
        const contacts = await this.scrapeInfiniteScrollItems();
        console.log('Finish getContacts: ', contacts.length);
        return contacts;
    }
}

module.exports = (page) => {
    return new GetContacts(page);
};