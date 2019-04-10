import $ from 'cash-dom';
import { find } from '../../helpers/functions'; 
import constants from '../../helpers/constants'

export default async (event, storage) => {
    const checkbox = $(event.target);
    const parent = $(event.target).parents().eq(2);
    const storageT = await storage.get({ times: [] });
    const times = storageT.times;
    const timepickers = parent.find('.timepicker');


    if(checkbox.is(':checked')) {
        //if they're checked, make them all "typeable"
        timepickers.prop('disabled', false);
        //and save state to chrome storage
        
        if(timepickers.eq(0).val() && timepickers.eq(1).val()) {
            const day = {
                ...find(constants, 'day', parent.find('p').text().toLowerCase())
            }
            const updatedTimes = times.filter(e => e.day !== day.day);
    
            day.on = checkbox.is(':checked');
            const from = moment(timepickers.eq(0).val(), 'HH:mm');
            const to = moment(timepickers.eq(1).val(), 'HH:mm');
            if(to.isAfter(from)) {
                day.time = `${timepickers.eq(0).val()}-${timepickers.eq(1).val()}`;
            }

            updatedTimes.push(day);
            await storage.set({ times: updatedTimes });
        }
    } else {
        parent.find('.timepicker').prop('disabled', true);
        //and save state to chrome storage
        if(timepickers.eq(0).val() && timepickers.eq(1).val()) {
            const day = {
                ...find(constants, 'day', parent.find('p').text().toLowerCase())
            }
            const updatedTimes = times.filter(e => e.day === day.day);
    
            day.on = checkbox.is(':checked');
            const from = moment(timepickers.eq(0).val(), 'HH:mm');
            const to = moment(timepickers.eq(1).val(), 'HH:mm');
            if(from.isAfter(to)) {
                day.time = `${timepickers.eq(0).val()}-${timepickers.eq(1).val()}`;
            }

            updatedTimes.push(day);
            await storage.set({ times: updatedTimes });
        }
    }    
}