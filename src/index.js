const ChromePromise = require('chrome-promise');
const Storage = require('./src/helpers/storage');
const chromep = new ChromePromise(chrome);
const storage = new Storage(chromep);
const moment = require('moment');

chrome.webNavigation.onBeforeNavigate.addListener(async (info) => {
    const sites = await storage.get('sites');
    const times = await storage.get('times');
    
    const currentDay = moment().format('dddd').toLowerCase();
    const day = times.times.find((e) => e.day === currentDay);
    if(day.time && day.on) {
        const time = day.time.split("-");
        const fromArray = time[0].split(":").map(parseInt);
        const toArray = time[1].split(':').map(parseInt);
        const from = moment().hour(fromArray[0]).minute(fromArray[1]).seconds(0);
        const to = moment().hour(toArray[0]).minute(toArray[1]).seconds(0);
        if(!isSiteOkay(sites.sites, info.url) && moment().isBetween(from, to)) {
            const url = chrome.runtime.getURL('forbidden.html');
            chrome.tabs.update(info.tabId, { url });
        }
    }
});

function isSiteOkay(arraySites, site) {
    for(let i = 0; i < arraySites.length; i++) {
        if(arraySites[i].match(/^(?!https?\/\/)(www\.)?\w+\.\w+\/?$/)) {
            if(site.includes(arraySites[i])) return false;
        } else if(arraySites[i].match(/\*\w+\*/)) {
            let modifiedSite = arraySites[i].slice(1, arraySites[i].length-2);
            if(site.includes(modifiedSite)) return false;
        }
    }
    return true;
}