function generateMessages(e) {
    const peopleInfoList = []
    const sheetInputText = document.getElementById("sheetInput").value;
    const lines = sheetInputText.split("\n");
    const listOfBills = document.getElementById("listOfBills");
    const listOfBillsElements = Array.from(listOfBills.getElementsByClassName("bill-tab"));
    if (listOfBillsElements.length === 0) return;

    const sampleMessage = document.getElementById("sampleMessage");
    if (sampleMessage.value === "") return;



    lines.forEach(line => {
        const datalist = line.trim().split("\t");
        let [name, bill, _, number] = datalist;

        let foundElement = null;
        for (let elementIndex = 0; elementIndex < listOfBillsElements.length; elementIndex++) {
            const listOfBillsElement = listOfBillsElements[elementIndex];
            if (listOfBillsElement.getAttribute("name-and-bill") == `${name} - ${bill}`) {
                const billButtons = listOfBillsElement.getElementsByClassName("bill-buttons")[0];
                billButtons.innerHTML = ""
                const resetButtonBackgroundColour = getComputedStyle(document.getElementsByClassName("reset-btn")[0]).backgroundColor

                const numberButton = document.createElement("div");
                numberButton.className = "small-action-btn";
                numberButton.textContent = number;
                billButtons.appendChild(numberButton);
                const numberButtonBackground = getComputedStyle(numberButton).background;
                numberButton.addEventListener('click', function(event) {
                    event.stopPropagation();
                    navigator.clipboard.writeText(number);
                    if (!this.classList.contains("last-number")) {
                        const lastNumber = document.querySelector(".small-action-btn.last-number");
                        if (lastNumber) {
                            lastNumber.classList.remove("last-number");
                        }
                        this.classList.add("last-number");
                    }
                    if (this.textContent !== "Copied") {
                        this.textContent = "Copied";
                        this.style.background = resetButtonBackgroundColour;
                        setTimeout(() => {
                            this.textContent = number;
                            this.style.background = "";
                        }, 2500);
                    }
                });

                const messageButton = document.createElement("div");
                messageButton.className = "small-action-btn";
                messageButton.textContent = "Message";
                billButtons.appendChild(messageButton);
                const messageButtonBackground = getComputedStyle(messageButton).background;
                messageButton.addEventListener('click', function(event) {
                    event.stopPropagation();
                    let message = sampleMessage.value
                    message = message.replace("[FIRSTNAME]", name.split(" ")[0])
                    message = message.replace("[AMOUNT]", bill)
                    navigator.clipboard.writeText(message);
                    if (!this.classList.contains("last-message")) {
                        const lastMessage = document.querySelector(".small-action-btn.last-message");
                        if (lastMessage) {
                            lastMessage.classList.remove("last-message");
                        }
                        this.classList.add("last-message");
                    }
                    if (this.textContent !== "Copied") {
                        this.textContent = "Copied";
                        this.style.background = resetButtonBackgroundColour;
                        setTimeout(() => {
                            this.textContent = "Message";
                            this.style.background = "";
                        }, 2500);
                    }
                });
                
                foundElement = elementIndex;
                break;
            }
        }

        listOfBillsElements.splice(foundElement, 1)
    });

    if (e.textContent !== "Generated") {
        e.textContent = "Generated";
        e.style.background = buttonActivatedColour
        setTimeout(() => {
            e.textContent = "Generate";
            e.style.background = buttonNormalColour
        }, 2500);
    }
}