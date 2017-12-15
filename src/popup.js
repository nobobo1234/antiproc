const url = chrome.runtime.getURL('options/options.html');
document.querySelector('.options').addEventListener('click', () => {
    chrome.tabs.create({ url });
})