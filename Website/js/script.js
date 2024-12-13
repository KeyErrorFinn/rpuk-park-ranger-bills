buttonNormalColour = "var(--action-btn-background)"
buttonActivatedColour = "#5D5D5D"

function toggleInformation(e) {
    const parentElement = e.parentElement;
    const informationElement = parentElement.querySelector(".bill-tab-information");
    parentElement.classList.toggle("open");
    if (parentElement.classList.contains("open")) {
        const fullHeight = informationElement.scrollHeight + 5 + 'px';
        informationElement.style.maxHeight = fullHeight;
    } else {
        informationElement.style.maxHeight = '0px';
    }

    const listOfBills = document.getElementById("listOfBills");
    
    if (listOfBills.scrollHeight > listOfBills.clientHeight) {
        listOfBills.style.paddingRight = "10px";
    } else {
        if (listOfBills.style.paddingLeft === "10px") {
            listOfBills.style.paddingLeft = "0";
        }
    }

}

function copyOutputForSheet(e) {
    const outputForSheet = document.getElementById("outputForSheet");
    if (outputForSheet.value !== "") {
        if (e.textContent !== "Copied") {
            e.textContent = "Copied";
            e.style.background = buttonActivatedColour
            setTimeout(() => {
                e.textContent = "Copy";
                e.style.background = buttonNormalColour
            }, 2500);
        }
        navigator.clipboard.writeText(outputForSheet.value);
    } else {
        e.style.background = "var(--action-btn-fail-background)";
        e.style.color = "#c1c1c1";
        setTimeout(() => {
            e.style.background = "";
        e.style.color = "";
        }, 1000);
    }
}

function resetSampleMessage() {
    const sampleMessage = document.getElementById("sampleMessage");
    sampleMessage.value = `Hello [FIRSTNAME],

Your bill with the Park Rangers this week is: [AMOUNT]
Please make contact via a dispatch to us to settle this.

Regards,
SA Royal Park Rangers`
}