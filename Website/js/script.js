buttonNormalColour = "linear-gradient(100deg, #E6E600 -10%, #B95C00)"
buttonActivatedColour = "#5D5D5D"

function toggleInformation(e) {
    e.parentElement.classList.toggle("open");

    const listOfBills = document.getElementById("list-of-bills");
    
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