// open a new tab with an html of mine, only after installing the extension ONCE
// asking for the users's bank name that they are using 
// input field for bank name, autocomplete ON, 
// i want to select a bank from a list, typeahead type of thing
// after that, you can add multiple banks, make a list of user's banks
// save the banks name in local storage
// if the user has already installed the extension, don't show the html page

chrome.runtime.onInstalled.addListener(() => {
    chrome.tabs.create({ url: chrome.runtime.getURL('templates/firstTime.html') });
});