module.exports = async (event, storage) => {
    const storageS = await storage.get('sites');
    const sites = sotrageS.sites;
    const site = $(event.currentTarget).parent().text().split(/ +/g)[0].trim();
    // const i = sites.indexOf($(event.currentTarget).parent().text().split(/ +/g)[0].trim());
    // const updatedSite = [...sites].splice(i, 1);
    // await storage.set({ sites: data.sites });
    // $(event.currentTarget).parent().remove();  
    // $('.amount-blocked-sites').text(data.sites.length);
    console.log(site);  
}