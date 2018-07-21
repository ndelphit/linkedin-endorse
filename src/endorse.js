const _ = require('lodash');

class EndorseSkills {
    constructor(page, contacts) {
        this.page = page;
        this.contacts = contacts;
    }

    /**
     * Go to contact profile page
     */
    async goToContact(url) {
        const {page} = this;
        await page.goto(url, {
            timeout: 0
        });
    };

    /**
     * Scrolls to user skills block.
     */
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
            console.log("Can't scroll to user skills block");
        }
    }

    /**
     * Ensure users skills
     */
    async ensureSkills(url) {
        try {
            await this.page.evaluate(async () => {
                const buttons = document.querySelectorAll('button[data-control-name="endorse"]');
                for (let element of buttons) {
                    await element.click()
                }
            });
            console.log('Click!', url);
        } catch (err) {
            console.log("Can't ensure user skills")
        }
    }

    /**
     * Run loop for busting users and ensure him skills
     */
    async init() {
        try {
            const contacts = _.chain(this.contacts).shuffle().value();
            for (let url of contacts) {
                await this.goToContact(url);
                const block = await this.scrollToContactsBlock();
                console.log('___________');
                if (block) {
                    await this.ensureSkills(url);
                }
            }
        } catch (err) {
            console.log("Can't run loop for busting users and ensure")
        }

    }
}

module.exports = (page, contacts) => {
    return new EndorseSkills(page, contacts);
};