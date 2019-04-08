import browser from 'webextension-polyfill';
import Storage from '../helpers/storage';
import * as helpers from '../helpers/functions';
import moment from 'moment';

const storage = new Storage(browser.storage.sync);

browser.webNavigation.onBeforeNavigate.addListener(async tab => {
    const storageS = await storage.get('sites');
    const storageT = await storage.get('times');

    const sites = storageS.sites;
    const times = storageT.times;
    
    const currentDay = moment().format('dddd').toLowerCase();
    const day = helpers.find(times, 'day', currentDay);

    if(day) {
        const time = day.time.split('-').map(helpers.time);
        const from = moment().hour(time[0].hour).minute(time[0].minute).seconds(0);
        const to = moment().hour(time[1].hour).minute(time[1].minute).seconds(0);
        if(moment().isBetween(from, to) && !helpers.isSiteOkay(sites, tab.url)) {
            const forbiddenUrl = browser.runtime.getURL('forbidden.html');
            await browser.tabs.update(tab.tabId, { url: forbiddenUrl })
        }
    }
});

browser.browserAction.onClicked.addListener(tab => {
    const optionsPage = browser.runtime.getURL('options.html');
    browser.tabs.create({ url: optionsPage, active: true })
})