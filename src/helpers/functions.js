export const unique = array => {
    return [...new Set(array)].filter(e => e !== "");
}

export const find = (array, search, equals) => {
    return array.find(e => e[search] === equals); // Array searcher
}

export const time = timeString => ({
    time: timeString,
    hour: parseInt(timeString.split(':')[0]),
    minute: parseInt(timeString.split(':')[1])
})

export const isSiteOkay = (arraySites, currentSite) => {
    for(const site of arraySites) {
        if(site.match(/^(?!https?\/\/)(www\.)?\w+\.\w+\/?$/)) {
            if(currentSite.includes(site)) return false
        } else if(site.match(/\*\w+\*/)) {
            let modifiedSite = site.slice(1, -1);
            if(site.includes(modifiedsite)) return false;
        }
    };
    return true;
}