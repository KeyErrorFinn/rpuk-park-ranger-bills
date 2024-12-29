//// MESSAGE CREATOR \\\\

//// GENERATE MESSAGES FUNCTION
// The Log Input Generate Button
const sheetInputGenerateBtn = document.getElementById("sheet-input-generate-btn");

// Adds functionality to Log Input Generate Button
sheetInputGenerateBtn.addEventListener("click", () => {
    // Gets all Bill Elements and Sheet Input Text
    const listOfBills = document.getElementById("list-of-bills");
    const billTabs = listOfBills.getElementsByClassName("bill-tab");
    const sheetInputText = document.querySelector("#sheet-input-tab-container .small-box-text-area").value;

    //// ERROR HANDLERS
    // Function to reset Generation Button back to default
    function resetGenerationBtn() {
        sheetInputGenerateBtn.classList.remove("error");
        sheetInputGenerateBtn.textContent = "Generate";
    }

    // Handles no Bills in Bill List
    if (billTabs.length === 0) {
        sheetInputGenerateBtn.classList.add("error");
        sheetInputGenerateBtn.textContent = "NO BILLS IN LIST";
        setTimeout(resetGenerationBtn, 2500);
        return;
    };

    // Handles no Text in Sheet Input Text Area
    if (sheetInputText == "") {
        sheetInputGenerateBtn.classList.add("error");
        sheetInputGenerateBtn.textContent = "NO SHEET INPUT GIVEN";
        setTimeout(resetGenerationBtn, 2500);
        return;
    };
    
    // Handles no Sample Message in Box
    const sampleMessageText = document.getElementById("sample-message-text-area").value;
    if (sampleMessageText === "") {
        sheetInputGenerateBtn.classList.add("error");
        sheetInputGenerateBtn.textContent = "NO SAMPLE MESSAGE";
        setTimeout(resetGenerationBtn, 2500);
        return;
    };
    

    //// CREATES MESSAGE FOR EACH PERSON
    // Splits all lines in Sheet Input Text Area
    const lines = sheetInputText.split("\n");
    let tempBillTabs = Array.from(billTabs);
    lines.forEach(line => {
        // Splits data into 4 variables and removes 3rd value
        // e.g. ['Aaron Gorton', '£9,200', '304', '352-2053']
        const datalist = line.trim().split("\t");
        let [name, bill, _, number] = datalist;


        //// FINDS BILL TAB FROM EACH LINE
        let foundBillTabIndex = tempBillTabs.findIndex(billTab => 
            billTab.getAttribute("name-and-bill") === `${name} - ${bill}`
        );
    

        // If Bill Tab Index found then remove from Array, else give error
        let billTab;
        if (foundBillTabIndex !== -1) {
            // Remove the found tab from Bill Tabs Array
            billTab = tempBillTabs[foundBillTabIndex];
            tempBillTabs.splice(foundBillTabIndex, 1);
        } else {
            // console.log("error")
            return;
        }

        document.getElementById("sheet-input-tab-btn").classList.remove("current-step");
        document.querySelector(".big-box-title").classList.add("current-step");


        //// ADDS CONTACT BUTTONS TO EACH BILL TAB
        const billTabBtns = billTab.querySelector(".bill-btns");
        billTabBtns.innerHTML = "";

        // Creates PHONE BUTTON \\
        const phoneButton = document.createElement("div");
        phoneButton.className = "small-action-btn phone";
        phoneButton.innerHTML = `<i class="fa-solid fa-phone"></i> ${number}`;
        phoneButton.style.scale = 0.1;
        // Adds copy functionality
        phoneButton.addEventListener('click', function(event) {
            // Stops tab triggering
            event.stopPropagation();

            // Writes to clipboard
            navigator.clipboard.writeText(number);

            // Sets Phone Button to last used if not already
            if (!phoneButton.classList.contains("last-phone")) {
                const lastPhone = document.querySelector(".small-action-btn.last-phone");
                if (lastPhone) {
                    lastPhone.classList.remove("last-phone");
                }
                phoneButton.classList.add("last-phone");
            }

            // Shows copy effect on Button when used
            if (phoneButton.textContent !== "COPIED") {
                phoneButton.classList.add("copied");
                phoneButton.innerHTML = "COPIED";
                setTimeout(() => {
                    phoneButton.classList.remove("copied");
                    phoneButton.innerHTML = `<i class="fa-solid fa-phone"></i> ${number}`;
                }, 2500);
            }
        });
        // Adds PHONE BUTTON to BILL TAB BUTTONS
        billTabBtns.appendChild(phoneButton);
    

        // Creates MESSAGE BUTTON \\
        const messageButton = document.createElement("div");
        messageButton.className = "small-action-btn message";
        messageButton.innerHTML = `<i class="fa-solid fa-envelope"></i> Message`;
        messageButton.style.scale = 0.1;
        // Adds copy functionality
        messageButton.addEventListener('click', function(event) {
            // Stops tab triggering
            event.stopPropagation();

            // Modifies message to align with recipient
            let message = sampleMessageText
            message = message.replace("[FIRSTNAME]", name.split(" ")[0])
            message = message.replace("[AMOUNT]", bill)

            // Writes to clipboard
            navigator.clipboard.writeText(message);

            // Sets Message Button to last used if not already
            if (!messageButton.classList.contains("last-message")) {
                const lastMessage = document.querySelector(".small-action-btn.last-message");
                if (lastMessage) {
                    lastMessage.classList.remove("last-message");
                }
                messageButton.classList.add("last-message");
            }

            // Shows copy effect on Button when used
            if (messageButton.textContent !== "COPIED") {
                messageButton.classList.add("copied");
                messageButton.innerHTML = "COPIED";
                setTimeout(() => {
                    messageButton.classList.remove("copied");
                    messageButton.innerHTML = `<i class="fa-solid fa-envelope"></i> Message`;
                }, 2500);
            }
        });
        // Adds MESSAGE BUTTON to BILL TAB BUTTONS
        billTabBtns.appendChild(messageButton);

        setTimeout(() => {
            phoneButton.style.scale = "";
            messageButton.style.scale = "";
        }, 10);
    });

    // Deals with effects for Generate Button
    if (sheetInputGenerateBtn.textContent !== "Generated") {
        sheetInputGenerateBtn.textContent = "Generated";
        sheetInputGenerateBtn.classList.add("success");
        setTimeout(() => {
            sheetInputGenerateBtn.textContent = "Generate";
            sheetInputGenerateBtn.classList.remove("success")
        }, 2500);
    }
});