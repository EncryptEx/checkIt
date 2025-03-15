document
    .getElementById("bankInput")
    .addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            document.getElementById("addBankButton").click();
        }
    });

document.addEventListener("DOMContentLoaded", () => {
    const bankInput = document.getElementById("bankInput");
    // fetch the bank URL input

    // fetch 127.0.0.1/get_domain/{bank_name}
    // this will return the bank URL


    // fetch the bank URL input

    const addBankButton = document.getElementById("addBankButton");

    // Load saved banks from local storage
    chrome.storage.local.get({ banks: [] }, function (result) {
        const savedBanks = result.banks;
        savedBanks.forEach((bank) => addBankToList(bank));




        addBankButton.addEventListener("click", () => {
            fetch("http://127.0.0.1:8000/get_domain/" + bankInput.value)
                .then((response) => response.json())
                .then((data) => {
                    const bankName = bankInput.value.trim();
                    const bankUrl = data.domain.trim(); // Get the bank URL from the response
                    if (
                        bankName &&
                        !savedBanks.some((bank) => bank.name === bankName)
                    ) {
                        const bank = { name: bankName, url: bankUrl };
                        savedBanks.push(bank);
                        chrome.storage.local.set({ banks: savedBanks }, function () {
                            addBankToList(bank);
                        });
                        bankInput.value = "";
                    }
                })
                .catch((error) => {
                    console.error("Failed to fetch bank URL", error);
                });
        });

        function addBankToList(bank) {
            const divelem = document.createElement("div");
            divelem.className = "p-4 my-2 bg-gray-200 flex items-center";

            const textel = document.createElement("p");
            textel.className = "text-lg mx-4 capitalize";
            textel.textContent = bank.name;

            // Add image next to the name
            const img = document.createElement("img");
            img.src = `https://img.logo.dev/${bank.url}?token=pk_D70v6BA4Q-qHCW8Jkx9eaA&size=149&retina=true`;
            img.alt = "Bank logo";
            img.className = "w-12 h-12 rounded-lg";

            const deleteButton = document.createElement("button");
            deleteButton.className = "ml-auto text-red-500 mr-6 text-lg"; // Changed to ml-auto to push it to the right
            deleteButton.innerHTML = '<i class="fas fa-trash-alt"></i>';
            deleteButton.addEventListener("click", () => {
                const index = savedBanks.indexOf(bank);
                if (index > -1) {
                    savedBanks.splice(index, 1);
                    chrome.storage.local.set({ banks: savedBanks }, function () {
                        bankList.removeChild(divelem);
                    });
                }
            });

            divelem.appendChild(img); // Append the image to the list item
            divelem.appendChild(textel);
            divelem.appendChild(deleteButton);
            bankList.appendChild(divelem);
        }
    });
});
