const _ = require('lodash');

class EndorseSkills {
    constructor(page, contacts) {
        this.page = page;
        this.contacts = contacts;
    }

    async goToContact(url) {
        const {page} = this;
        await page.goto(url);
        await page.waitForNavigation();
        await page.waitFor(300);
    };

    async scrollToContactsBlock() {
        try {
            let count = 0;
            let isFoundSkillsCategory = null;
            while (count < 1500) {
                await this.page.evaluate(`window.scrollBy(0, ${count})`);
                await this.page.waitFor(1500);
                isFoundSkillsCategory = await this.page.evaluate(() => document.querySelector('.pv-skill-categories-section'));
                count += 300;
            }
            return isFoundSkillsCategory;
        } catch (err) {
            console.log(err);
        }
    }
    async ensureSkills() {
        try {
            await this.page.evaluate(async () => {
                const buttons = document.querySelectorAll('button[data-control-name="endorse"]');
                for (let element of buttons) {
                    await element.click()
                }
            });
        } catch (err) {
            console.log(err.message)
        }
    }

    async init() {
        try {
            const contacts = _.chain(this.contacts).shuffle().take(10).value();
            for (let url of contacts) {
                await this.goToContact(url);
                const block = await this.scrollToContactsBlock();
                if (block) {
                    console.log('Click!', url);
                    return await this.ensureSkills();
                }
            }
        } catch (err) {
            console.log(err.message)
        }

    }
}

module.exports = (page, contacts) => {
    return new EndorseSkills(page, contacts);
};