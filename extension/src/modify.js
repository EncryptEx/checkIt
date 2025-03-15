// check if url of website is part of a phishing attack
// if it is, modify the website to show a warning
// if it is not, do nothing

// get the url of the website
var url = window.location.href;

// check if the url is part of a phishing attack
// if it is, modify the website to show a warning
isPhishing(url).then(isPhishing => {
	if (isPhishing) {
		alert("This website is part of a phishing attack");
	}
});

// check if the url is part of a phishing attack
async function isPhishing(url) {
	// get url 127.0.0.1:/8000/check/{url}
	// this url will return a boolean value
	// true if the url is part of a phishing attack
	// false if the url is not part of a phishing attack
	var checkUrl = "http://127.0.0.1:8000/check";
	try {
		let response = await fetch(checkUrl, {
			method: "POST",
			headers: {
				"Content-Type": "application/json;charset=UTF-8"
			},
			body: JSON.stringify({ url: url })
		});
		let result = await response.json();
		console.log("Is phising?:", result.malicious);
		return result.malicious;
	} catch (error) {
		console.error("Error checking phishing status:", error);
		return false;
	}
}