//// INPUTS TAB SWITCHER ////

// Tab Buttons and Containers
const logInputBtn = document.getElementById("log-input-tab-btn");
const logInputContainer = document.getElementById("log-input-tab-container");
const sheetInputBtn = document.getElementById("sheet-input-tab-btn");
const sheetInputContainer = document.getElementById("sheet-input-tab-container");

// Button and Container links
const tabLinks = [
    [logInputBtn, logInputContainer],
    [sheetInputBtn, sheetInputContainer]
]

// Add click event listeners to each tab button
for (const [tabBtn, tabContainer] of tabLinks) {
    // Makes tab active when clicked
    tabBtn.addEventListener("click", () => {
        // If the button isn't already activated
        if (!tabBtn.classList.contains("active")) {
            // Resets all tabs by removing "active" from buttons and "hidden" from containers
            for (const [otherBtn, otherContainer] of tabLinks) {
                otherBtn.classList.remove("active");
                otherContainer.classList.add("hidden");
            }

            // Activate the clicked tab
            tabBtn.classList.add("active");
            tabContainer.classList.remove("hidden");
        }
    });
}


//// Sample Message Reset ////

// Sample Message Button
const sampleMessageResetBtn = document.getElementById("sample-message-reset-btn")

// Resets the text in the box when clicked
sampleMessageResetBtn.addEventListener("click", () => {
    // Sample Message Text Area
    const sampleMessageTextArea = document.getElementById("sample-message-text-area");
    
    // Sets Text Area Value
    sampleMessageTextArea.value = `Hello [FIRSTNAME],

Your bill with the Park Rangers this week is: [AMOUNT]
Please contact us via dispatch to settle this.

Regards,
SA Royal Park Rangers`

    const sampleMessageResetBtnIcon = sampleMessageResetBtn.querySelector("i");

    // Add the spin class
    sampleMessageResetBtnIcon.classList.add("spin");

    // Remove the spin class after the animation ends
    setTimeout(() => {
        sampleMessageResetBtnIcon.classList.remove("spin");
    }, 500); // Match this to the animation duration (0.5s)
});

// const thing = document.getElementsByClassName("bill-tab")[0];

// thing.addEventListener("click", () => {
//     thing.classList.toggle("open")
// });