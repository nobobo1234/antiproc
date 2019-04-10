import $ from 'cash-dom';
import helpers from '../../helpers/functions';
import constants from '../../helpers/constants';
import moment from 'moment';

export default async (event, storage) => {
    const storageT = await storage.get({ times: [] });
    const times = storageT.times;

    //if changed, save to chrome storage
    $('.day-wrapper').find('.day').each(async (i, e) => {
        const parent = $(e);
        const timepickers = parent.find('.timepicker');

        if(timepickers.eq(0).val() && timepickers.eq(1).val()) {
            const day = {
                ...helpers.find(constants, 'day', parent.find('p').text().toLowerCase())
            }
            const updatedTimes = times.filter(e => e.day !== day.day);

            day.on = parent.find('.day-checkbox').is(':checked');
            const from = moment(timepickers.eq(0).val(), 'HH:mm');
            const to = moment(timepickers.eq(1).val(), 'HH:mm');
            if(to.isAfter(from)) {
                day.time = `${timepickers.eq(0).val()}-${timepickers.eq(1).val()}`;
            }
            updatedTimes.push(day);
            await storage.set({ times: updatedTimes });
        }
    });

    if(times.length) {
        const currentDay = moment().format('dddd').toLowerCase();
        const day = helpers.find(times, 'day', currentDay);
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
    }
}