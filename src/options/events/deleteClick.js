import $ from 'cash-dom';

export default async (event, storage) => {
    const storageS = await storage.get({ sites: [] });
    const sites = storageS.sites;
    const site = $(event.currentTarget).parent().text().split(/ +/g)[0].trim();
    const i = sites.indexOf(site);
    const updatedSites = [...sites].filter(e => e === site);
    
    await storage.set({ sites: updatedSites });
    
    $(event.target).parents().eq(1).remove();  
    $('.amount-blocked-sites').text(updatedSites.length);
}