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
	} else {
		// insert a popup right corner of the website
		// green and says: "This website is safe"
		var popup = document.createElement("div");
		popup.style.position = "fixed";
		popup.style.top = "0";
		popup.style.right = "0";
		popup.style.backgroundColor = "green";
		popup.style.color = "white";
		popup.style.padding = "20px";
		popup.style.fontSize = "20px";
		popup.style.fontWeight = "bold";
		popup.style.border = "2px solid white";
		popup.style.borderRadius = "5px";
		popup.style.zIndex = "9999";
		popup.style.boxShadow = "0px 0px 10px rgba(0, 0, 0, 0.5)";
		popup.style.borderRadius = "5px";
		popup.innerHTML = "This website is safe";
		document.body.appendChild(popup);

		// insert a popup left corner of the website
		// red and says: "This website is not safe"
		// var popup = document.createElement("div");
		// popup.style.position = "fixed";
		// popup.style.top = "0";
		// popup.style.left = "0";
		// popup.style.backgroundColor = "red";
		// popup.style.color = "white";
		// popup.style.padding = "10px";
		// popup.style.zIndex = "1000";
		// popup.innerHTML = "This website is not safe";
		// document.body.appendChild(popup);
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