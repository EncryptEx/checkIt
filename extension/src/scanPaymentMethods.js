// send html contents to /is_checkout_page
const pagecontent = document.documentElement.innerHTML;

chrome.storage.local.get(['bankPool'], (result) => {
    if (!result.bankPool) {
        chrome.storage.local.set({ bankPool: [] });
    }
});

chrome.storage.local.get(['banks'], (result) => {
    const savedBanks = result.banks || [];
    const namesBanks = savedBanks.map(bank => bank.name.toLowerCase());

    fetch("http://127.0.0.1:8000/scan_page/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            'html_content': btoa(unescape(encodeURIComponent(pagecontent))),
            'url': window.location.href,
            'user_payment_methods': namesBanks
        }),
    })
        .then((response) => response.json())
        .then((data) => {
            console.log("Is the page checkout?: ", data.is_checkout_page);
            console.log("Payment methods: ", data.payment_methods);

            if (data.payment_methods.user_has.length === 0) {
                console.log("No payment methods found");
                return;
            }
            
            let finalMethods = [];
            // this is where magic happens
            const userHasPromises = data.payment_methods.user_has.map((element) => {
                return new Promise((resolve, reject) => {
                    // try to find the url of the bank in saved url banks, 
                    // else use /get_bank_pic
                    chrome.storage.local.get(['bankPool'], (result) => {
                        let bankPool = result.bankPool || [];
                        const bank = bankPool.find(bank => bank.name.toLowerCase() === element.toLowerCase());

                        if (bank) {
                            finalMethods.push({ name: element, url: bank.url });
                            resolve();
                        } else {
                            // fetch /get_bank_pic
                            fetch("http://127.0.0.1:8000/get_bank_pic/" + element, {
                                method: "GET",
                                headers: {
                                    "Content-Type": "application/json",
                                },
                            })
                                .then((response) => response.json())
                                .then((data) => {
                                    let bankUrl = data.url;
                                    console.log("NEW Bank URL: ", bankUrl);

                                    // save the new bank url
                                    chrome.storage.local.set({
                                        bankPool: [...bankPool, { name: element, url: bankUrl }]
                                    });

                                    finalMethods.push({ name: element, url: bankUrl });
                                    resolve();
                                })
                                .catch((error) => {
                                    console.error("Failed to fetch bank URL", error);
                                    reject(error);
                                });
                        }
                    });
                });
            });

            console.log("Final methods: ", finalMethods);
            let not_available = [];
            const availablePromises = data.payment_methods.available.map((element) => {
                return new Promise((resolve, reject) => {
                    // if not in user_has, add to not_available
                    if (!data.payment_methods.user_has.includes(element)) {
                        chrome.storage.local.get(['bankPool'], (result) => {
                            let bankPool = result.bankPool || [];
                            const bank = bankPool.find(bank => bank.name.toLowerCase() === element.toLowerCase());

                            if (bank) {
                                not_available.push({ name: element, url: bank.url });
                                console.log("NOT AV. OLD Bank URL: ", bank.url);
                                resolve();
                            } else {
                                // fetch /get_bank_pic
                                fetch("http://127.0.0.1:8000/get_bank_pic/" + element, {
                                    method: "GET",
                                    headers: {
                                        "Content-Type": "application/json",
                                    },
                                })
                                    .then((response) => response.json())
                                    .then((data) => {
                                        let bankUrl = data.url;
                                        console.log("NOT AV. NEW Bank URL: ", bankUrl);

                                        // save the new bank url
                                        chrome.storage.local.set({
                                            bankPool: [...bankPool, { name: element, url: bankUrl }]
                                        });

                                        not_available.push({ name: element, url: bankUrl });
                                        resolve();
                                    })
                                    .catch((error) => {
                                        console.error("Failed to fetch bank URL", error);
                                        reject(error);
                                    });
                            }
                        });
                    } else {
                        resolve();
                    }
                });
            });

            // Wait for all promises to resolve
            Promise.all([...userHasPromises, ...availablePromises])
                .then(() => {
                    console.log("Final not available: ", not_available);
                    // open dialog of available payment methods
                    openDialog(finalMethods, not_available);
                }).catch((error) => {
                    console.error("Failed to process payment methods", error);
                });
        })
        .catch((error) => {
            console.error("Failed to fetch bank URL", error);
        });
});

function openDialog(finalMethods, not_available) {
    const dialog = document.createElement('dialog');
    dialog.innerHTML = `
        <h1 class='text-lg'>Available Payment Methods at this checkout:</h1>
        <style>
        @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300&display=swap');
        @import url('https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css');
        @media (max-width: 600px) { 
            .cont {
                flex-direction: column; 
                }
            }
        .cont {
            display: flex; flex-direction: row; align-items: center;
        }
        
        .check-img {            .
            position: absolute; !important
            top: 10px;
            left: 10px;
            width: 48px; 
            height: 48px;
        }
        .bank-img {
            width: 100px;
            height: 100px;
            margin: 5px;
            border-radius: 10px;
        }
        .btn {
            padding: 5px;
            margin: 5px;
            border-radius: 5px;
            color: black;
            border: none;
            cursor: pointer;
        }
        div.cont {
            display: flex; /* Ensure the divs are aligned in a row */
            gap: 10px; /* Adds space between boxes */
        }

        div.cont div.greeeeeeeeen, div.cont div.reeeeeeeed {
            position: relative; /* Needed for absolute positioning of icons */
            border-radius: 5px; 
            padding: 10px; 
            margin: 10px; 
            width: 200px; 
            height: 270px; /* Set a fixed height */
        }

        .flex {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
        }

        .greeeeeeeeen {
            border: 2px solid green;
        }

        .greeeeeeeeen button {
            color: white;
            background-color: #0080008f;
            border: 2px solid green;
        }

        .reeeeeeeed {
            border: 2px solid red;
            
        }
        .reeeeeeeed button {
            color: #928e8e;
            background-color: #f4f4f4
        }
        </style>
        <div class='cont'>
            ${finalMethods.map(method => `
                <div class='greeeeeeeeen'>
                    <img src="${chrome.runtime.getURL('img/chill.png')}" alt="check" class='check-img'>
                    <div class='flex'>
                        <img src="${method.url}" alt="${method.name}" style='max-width: 100%;' class='bank-img'>
                        <button class='btn' >Help me checkout with ${method.name}</button>
                    </div>
                </div>
            `).join('')}
            ${not_available.map(method => `
                <div class='reeeeeeeed'>
                    <img src="${chrome.runtime.getURL('img/no-chill.png')}" alt="no-check" class='check-img'>
                    <div class='flex'>
                        <img src="${method.url}" alt="${method.name}" style='max-width: 100%;' class='bank-img'>
                        <button class='btn' disabled><span style='text-transform: capitalize'>${method.name}</span> not available</button>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
    document.body.appendChild(dialog);
    dialog.showModal();
}
