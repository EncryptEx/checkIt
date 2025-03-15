// check if url of website is part of a phishing attack
// if it is, modify the website to show a warning
// if it is not, do nothing

// get the url of the website
var url = window.location.href;

// check if the url is part of a phishing attack
// if it is, modify the website to show a warning
isPhishing(url).then(isPhishing => {
	if (isPhishing) {
		var popup = document.createElement("div");
		popup.style.position = "fixed";
		popup.style.top = "0";
		popup.style.left = "0";
		popup.style.width = "100%";
		popup.style.height = "100%";
		popup.style.backgroundColor = "rgba(214, 40, 40, 0.8)";
		popup.style.color = "white";
		popup.style.padding = "20px";
		popup.style.display = "flex";
		popup.style.justifyContent = "center";
		popup.style.alignItems = "center";
		// popup.style.fontSize = "30px";
		// popup.style.fontWeight = "bold";
		popup.style.zIndex = "9999";
		
		var textContainer = document.createElement("div");
		// background-color: rgb(155, 30, 30); padding: 50px; border-radius: 5px;'>

		textContainer.style.backgroundColor = "rgb(155, 30, 30)";
		textContainer.style.padding = "50px";
		textContainer.style.borderRadius = "5px";
		
		popup.appendChild(textContainer);

		var text = document.createElement("div");
		text.innerHTML = `
		<div class='background-color: rgb(155, 30, 30) !important; padding: 50px !important; border-radius: 5px !important; font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","Noto Sans",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji" !important;'>
		<h1 style='color: white !important; font-size: 30px !important; font-weight: bold !important;'>
			This is a Phishing Website!!!
		</h1>
		<br>
		<div>
		<p style='color: white !important;'>Phishing attacks are a common way for hackers to steal your personal information.</p>
		<p style='color: white !important;'>We have checked this website and it is safe to use.</p>
		<br>
		<p style='color: white !important;'>Remember to always be cautious when entering personal information online.</p>
		<p style='color: white !important;'>Stay safe!</p>
		<br><br>
		<p style='color: white !important;'>If you are really sure that this website is NOT a phishing website, please click the button below to continue.</p>
		<br><br>
		</div>
	`;

		textContainer.appendChild(text);

		var continueButton = document.createElement("button");
		continueButton.innerHTML = "Accept Risk and Continue";
		continueButton.style.backgroundColor = "#4CAF50";
		continueButton.style.borderRadius = "5px";
		continueButton.style.color = "white";
		continueButton.style.border = "none";
		continueButton.style.padding = "10px";
		continueButton.style.cursor = "pointer";
		continueButton.onclick = function() {
			popup.style.display = "none";
		};

		textContainer.appendChild(continueButton);
		document.body.appendChild(popup);
	} else {
		// insert a popup right corner of the website
		// green and says: "This website is safe"
		var popup = document.createElement("div");
		popup.style.position = "fixed";
		popup.style.top = "0";
		popup.style.right = "0";
		popup.style.backgroundColor = "#2C6E49";
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
		
		var closeButton = document.createElement("button");
		closeButton.innerHTML = "X";
		closeButton.style.top = "10px";
		closeButton.style.right = "10px";
		closeButton.style.backgroundColor = "#2C6E49";
		closeButton.style.borderRadius = "5px";
		closeButton.style.color = "white";
		closeButton.style.border = "none";
		closeButton.style.padding = "10px";
		closeButton.style.cursor = "pointer";
		closeButton.onclick = function() {
			popup.style.display = "none";
		};

		// disapear in 2s 
		setTimeout(() => {
			// fade out
			popup.style.transition = "opacity 1s";
			popup.style.opacity = "0";
			setTimeout(() => {
				popup.style.display = "none";
			}, 1000);

		}, 5000);
		
		popup.appendChild(closeButton);
		document.body.appendChild(popup);
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