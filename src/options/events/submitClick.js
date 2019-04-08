import $ from 'cash-dom';
import { unique } from '../../helpers/functions';
import deleteClick from './deleteClick';

export default async (event, storage) => {
    const storageS = await storage.get('sites');
    const blockedSites = storageS.sites;

    let textarea = $('.sites-to-block')
        .val()
        .split('\n')
        .map(e => e.trim()); // Extract all the sites from textarea

    let newSites = unique(textarea);
    for(let site of newSites) {
        if(blockedSites.length && blockedSites.includes(site)) {
            $('.flash-message').text('One of these sites already exists!');
            setTimeout(() => {
                $('.flash-message').text('');
            }, 3000);
            newSites.splice(newSites.indexOf(site), 1);
            return true;
        }
        $('.sites-list').append(`
            <li class="valign-wrapper collection-item">
                ${site}
                <button class="btn-floating btn-small delete">
                    <i class="material-icons">not_interested</i>
                </button>
            </li>
        `)
    }

    $('.delete').on('click', async (event) => {
        await deleteClick(event, storage);
    });

    if(blockedSites.length) newSites = [...newSites, ...blockedSites];
    await storage.set({ sites: newSites });

    $('.amount-blocked-sites').text(newSites.length);
}