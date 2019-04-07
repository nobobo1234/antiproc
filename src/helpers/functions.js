exports.unique = array => {
    return [...new Set(array)].filter(e => e !== "");
}

exports.find = (array, search, equals) => {
    return array.find(e => e[search] === equals); // Array searcher
}

exports.time = timeString => ({
    time: timeString,
    hour: parseInt(timeString.split(':')[0]),
    minute: parseInt(timeString.split(':')[1])
})