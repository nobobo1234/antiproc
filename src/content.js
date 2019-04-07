//import libraries, constants and helpers;
const ChromePromise = require('chrome-promise/index');
const Storage = require('../helpers/storage');
const constants = require('../helpers/constants');
const moment = require('moment/moment');
const chromep = new ChromePromise;
const storage = new Storage(chromep);
const unique = array => [...new Set(array)].filter(e => e !== ""); //unique array filterer

$(async () => {
    const times = await storage.get('times');
    
    if(times.times) {
        const currentday = moment().format('dddd').toLowerCase();
        const day = times.times.find((e) => e.day === currentday);
        if(day.time && day.on) {
            const time = day.time.split("-");
            const from = moment().hour(parseInt(time[0].split(":")[0])).minute(time[0].split(":")[1]).seconds(0);
            const to = moment().hour(parseInt(time[1].split(":")[0])).minute(time[1].split(":")[1]).seconds(0);
            if(moment().isBetween(from, to)) {
                location.href = "../forbidden.html"
            }
        }
    }
    $('ul.tabs').tabs(); //initialize the tabs feature
    if(times.times) {
        $('.days').each((i, e) => {
            let __times;
            const day = times.times.find(ce => $(e).find('p').text().toLowerCase() === ce.day);
            if(day.on)
                $(e).find('.day-checkbox').prop('checked', true);
            if(!day.on)
                $(e).find('.timepicker').prop('disabled', true);
            if(day.time) {
                __times = day.time.split('-');
                $(e).find('.timepicker').eq(0).val(__times[0]);
                $(e).find('.timepicker').eq(1).val(__times[1]);
            }
        });
    } else {
        $('.timepicker').prop('disabled', true);
    }
    //get all the sites from the storage and add them to the collection
    const data = await storage.get('sites');
    if(data.sites) $('.amount-blocked-sites').text(data.sites.length);
    else $('.amount-blocked-sites').text(0);
    if(data.sites) {
        for(let site of data.sites) {
            $('.sites-list').append(`<li class="valign-wrapper collection-item">${site}<button class="btn-floating btn-small delete">
                    <i class="material-icons">not_interested</i>
                </button>
            </li>`);
        }
    }
    /*
    check if delete button for sites is clicked, if clicked, 
    delete collection item and remove from chrome storage
    */
    $('.delete').click(async (event) => {
        const i = data.sites.indexOf($(event.currentTarget).parent().text().split(/ +/g)[0].trim());
        data.sites.splice(i, 1);
        await storage.set({ sites: data.sites });
        $(event.currentTarget).parent().remove();  
        $('.amount-blocked-sites').text(data.sites.length);  
    });
    //initialize the timepickers
    $('.timepicker').pickatime({
        twelvehour: false
    }).change(async (event) => {
        //if changed, save to chrome storage
        const times = [];
        $('#active-days').find('.days').each((i, e) => {
            const day = constants.times.find(ce => $(e).find('p').text().toLowerCase() === ce.day);
            day.on = $(e).find('.day-checkbox').is(':checked');
            if($(e).find('.timepicker').eq(0).val() !== "" && $(e).find('.timepicker').eq(1).val() !== "") {
                const timepickers = [$(e).find('.timepicker').eq(0), $(e).find('.timepicker').eq(1)];
                const timeOne = moment(timepickers[0].val(), 'HH:mm');
                const timeTwo = moment(timepickers[1].val(), 'HH:mm');
                if(timeTwo.isAfter(timeOne)) {
                    day.time = `${timepickers[0].val()}-${timepickers[1].val()}`;
                }
            }
            times.push(day);
        });
        await storage.set({ times });
        const sites = await storage.get('sites');
        const currentday = moment().format('dddd').toLowerCase();
        const day = times.find((e) => e.day === currentday);
        if(day.time && day.on) {
            const time = day.time.split("-");
            const from = moment().hour(parseInt(time[0].split(":")[0])).minute(time[0].split(":")[1]).seconds(0);
            const to = moment().hour(parseInt(time[1].split(":")[0])).minute(time[1].split(":")[1]).seconds(0);
            if(moment().isBetween(from, to)) {
                location.href = '../forbidden.html'
            }
        }
    });
    //check if checkboxes change
    $('.day-checkbox').change(async (checkbox) => {
        const parent = $(checkbox.target).parent().parent().parent();
        if($(checkbox.target).is(':checked')) {
            //if they're checked, make them all "typeable"
            parent.find('.timepicker').each((i, e) => {
                $(e).prop('disabled', false);
            });
            const times = [];
            //and save state to chrome storage
            $('#active-days').find('.days').each((i, e) => {
                const day = constants.times.find(ce => $(e).find('p').text().toLowerCase() === ce.day);
                day.on = $(e).find('.day-checkbox').is(':checked');
                if($(e).find('.timepicker').eq(0).val() !== "" && $(e).find('.timepicker').eq(1).val() !== "") {
                    const timepickers = [$(e).find('.timepicker').eq(0), $(e).find('.timepicker').eq(1)];
                    const timeOne = moment(timepickers[0].val(), 'HH:mm');
                    const timeTwo = moment(timepickers[1].val(), 'HH:mm');
                    if(timeTwo.isAfter(timeOne)) {
                        day.time = `${timepickers[0].val()}-${timepickers[1].val()}`;
                    }
                }
                times.push(day);
            });
            await storage.set({ times });
        } else { //if unchecked, make all inputs disabled
            const times = [];
            const parent = $(checkbox.target).parent().parent().parent();
            parent.find('.timepicker').each((i, e) => {
                $(e).prop('disabled', true);
            });
            //and save state to chrome storage
            $('#active-days').find('.days').each((i, e) => {
                const day = constants.times.find(ce => $(e).find('p').text().toLowerCase() === ce.day);
                day.on = $(e).find('.day-checkbox').is(':checked');
                if($(e).find('.timepicker').eq(0).val() !== "" && $(e).find('.timepicker').eq(1).val() !== "") {
                    const timepickers = [$(e).find('.timepicker').eq(0), $(e).find('.timepicker').eq(1)];
                    const timeOne = moment(timepickers[0].val(), 'HH:mm');
                    const timeTwo = moment(timepickers[1].val(), 'HH:mm');
                    if(timeTwo.isAfter(timeOne)) {
                        day.time = `${timepickers[0].val()}-${timepickers[1].val()}`;
                    }
                }
                times.push(day);
            });
            await storage.set({ times });
        }
    });
});

//check if sites submitbutton is clicked
$('.submitbutton').click(async (event) => {
    let textarea = $('.sites-to-block')[0].value.split('\n').map(e => e.trim());
    const blocked_sites = await storage.get('sites');
    let sites = unique(textarea);
    for(let site of sites) {
        if(blocked_sites.sites) {
            if(blocked_sites.sites.includes(site)) {
                $('.flash-message').text('One of these sites already exists!');
                setTimeout(() => {
                    $('.flash-message').text('');
                }, 3000);
                return true;
            }
        }
        $('.sites-list').append(`<li class="valign-wrapper collection-item">${site}<button class="btn-floating btn-small delete">
                <i class="material-icons">not_interested</i>
            </button>
        </li>`)
    }
    $('.amount-blocked-sites').text(sites.length);
    $('.delete').off();
    $('.delete').click(async (event) => {
        const data = await storage.get('sites');
        const i = data.sites.indexOf($(event.currentTarget).parent().text());
        data.sites.splice(i, 1);
        await storage.set({ sites: data.sites });
        $(event.currentTarget).parent().remove();
        $('.amount-blocked-sites').text(data.sites.length);    
    });
    const data = await storage.get('sites');
    if(data.sites) sites = data.sites.concat(sites);
    await storage.set({ sites });
});