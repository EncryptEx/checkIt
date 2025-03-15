// send html contents to /is_checkout_page

// await dom loaded
// send html contents to /is_checkout_page



// code starts here


const pagecontent = document.documentElement.innerHTML;
// post 
fetch("http://127.0.0.1:8000/is_checkout_page/", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
    },
    body: JSON.stringify({
        'html_content': btoa(unescape(encodeURIComponent(pagecontent))),
        'url': window.location.href
    }),
})
    .then((response) => response.json())
    .then((data) => {
        console.log("Is the page checkout?: ", data.is_checkout_page);
    })
    .catch((error) => {
        console.error("Failed to fetch bank URL", error);
    });


