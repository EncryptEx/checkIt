// send html contents to /is_checkout_page



    // send html contents to /is_checkout_page
    const pagecontent = document.documentElement.innerHTML;

    chrome.storage.local.get(['banks'], (result) => {
        const savedBanks = result.banks || [];
        const namesBanks = savedBanks.map(bank => bank.name);

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
            })
            .catch((error) => {
                console.error("Failed to fetch bank URL", error);
            });
    });



