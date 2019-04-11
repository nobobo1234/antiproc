import 'materialize-css';
import browser from 'webextension-polyfill';
import Storage from '../helpers/storage';
import * as helpers from '../helpers/functions';
import moment from 'moment';
import $ from 'cash-dom'

import onTimeChange from './events/onTimeChange';
import deleteClick from './events/deleteClick';
import checkBoxChange from './events/checkBoxChange';
import submitClick from './events/submitClick';

const storage = new Storage(browser.storage.sync);

import './options.css';
import 'materialize-css/dist/css/materialize.min.css';

$(async () => {
    let storageT = await storage.get({ times: [] });
    const blockTimes = storageT.times;
    
    if(blockTimes.length) {
        const currentDay = moment().format('dddd').toLowerCase();
        const day = helpers.find(blockTimes, 'day', currentDay);
        if(day) {
            const time = day.time.split('-').map(helpers.time);
            const from = moment().hour(time[0].hour).minute(time[0].minute).seconds(0);
            const to = moment().hour(time[1].hour).minute(time[1].minute).seconds(0);
            if(moment().isBetween(from, to)) {
                const tab = await browser.tabs.getCurrent();
                const forbiddenUrl = browser.runtime.getURL('forbidden.html');
                browser.tabs.update(tab.id, { url: forbiddenUrl })
            }
        }

        $('.day').each((i, e) => {
            const el = $(e);
            const day = helpers.find(blockTimes, 'day', el.find('p').text().toLowerCase());
            if(!day) {
                el.find('.timepicker').prop('disabled', true);
                return true;
            };

            if(day.on) {
                el.find('.day-checkbox').prop('checked', true);
                el.find('.timepicker').prop('disabled', false);
            } else if(!day.on) {
                el.find('.timepicker').prop('disabled', true);
            }
            if(day.time) {
                const timeRange = day.time.split('-');
                el.find('.timepicker').eq(0).val(timeRange[0]); // Set the from picker
                el.find('.timepicker').eq(1).val(timeRange[1]); // Set the to picker
            }
        });
    } else {
        $('.timepicker').prop('disabled', true);
    }

    M.Tabs.init(document.querySelector('.tabs')) //initialize the tabs feature
    
    //get all the sites from the storage and add them to the collection
    const storageS = await storage.get({ sites: [] });
    const sites = storageS.sites;

    if(sites) $('.amount-blocked-sites').text(sites.length);

    if(sites.length) {
        for(let site of sites) {
            $('.sites-list').append(`
                <li class="valign-wrapper collection-item">
                    ${site}
                    <button class="btn-floating btn-small delete">
                        <i class="material-icons">not_interested</i>
                    </button>
                </li>
            `);
        }

        $('.delete').on('click', async (event) => {
            await deleteClick(event, storage);
        }); // delete the site if delete button is clicked
    }

    //initialize the timepickers
    M.Timepicker.init(document.querySelectorAll('.timepicker'), {
        twelveHour: false
    })
    $('.timepicker').on('change', (event) => onTimeChange(event, storage));

    //check if checkboxes change
    $('.day-checkbox').on('change', async (event) => {
        await checkBoxChange(event, storage);
    });

    //check if sites submitbutton is clicked
    $('.submitbutton').on('click', async (event) => {
        await submitClick(event, storage);
    });
});