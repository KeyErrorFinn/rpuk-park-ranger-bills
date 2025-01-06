//// BILL PROCESSOR \\\\

//// ADDS OUTPUT COPY FUNCTIONALITY TO BUTTON
// The Log Input Copy Output Button
const logInputCopyOutputBtn = document.getElementById("log-input-copy-output-btn");

// Adds a click event that copies the log-generated-output attribute text to user's clipboard
logInputCopyOutputBtn.addEventListener("click", () => {
    // Gets the Sheet Input text from the log-generated-output attribute
    const sheetInputText = logInputCopyOutputBtn.getAttribute("log-generated-output");

    const originalLogInputCopyOutputBtnInnerHTML = '<i class="fa-classic fa-regular fa-copy fa-fw"></i> Output <i class="fa-solid \
fa-circle-question help-tooltip"><span class="help-tooltip-text small-help-tooltip-text-right"> This <b>Output For Sheet \
box</b> is where the generated bill output for the <b>Senior+ Google Sheet</b> goes.<br><br>Once the bills have been \
properly generated from the <b>Log Text Input box</b>, you just need to press the <b>Copy button</b> and paste the output \
into the <b>Google Sheet</b>.</span></i>';

    if (sheetInputText == "") {
        logInputCopyOutputBtn.innerHTML = "No Text To Copy".toUpperCase();
        logInputCopyOutputBtn.classList.add("error");
        setTimeout(() => {
            logInputCopyOutputBtn.innerHTML = originalLogInputCopyOutputBtnInnerHTML;
            logInputCopyOutputBtn.classList.remove("error");
        }, 2500);
        return;
    }
    
    navigator.clipboard.writeText(sheetInputText);
    logInputCopyOutputBtn.innerHTML = "Copied";
    logInputCopyOutputBtn.classList.add("success");
    setTimeout(() => {
        logInputCopyOutputBtn.innerHTML = originalLogInputCopyOutputBtnInnerHTML;
        logInputCopyOutputBtn.classList.remove("success");
    }, 2500);
});


//// GENERATE BILLS FUNCTION
// The Log Input Generate Button
const logInputGenerateBtn = document.getElementById("log-input-generate-btn");

// Adds functionality to Log Input Generate Button
logInputGenerateBtn.addEventListener("click", () => {
    // Hunter multiplier option that multiplies bullet bill by 1.5x
    const hunterMultiplier = false;


    //// ERROR HANDLERS
    // Handles Button Error Showing
    if (logInputGenerateBtn.classList.contains("error")) {
        return;
    }
    
    // Handles no text in input text area and changes button colour temporarily
    const logInputTextAreaText = document.querySelector("#log-input-tab-container .small-box-text-area").value;
    if (logInputTextAreaText == "") {
        logInputGenerateBtn.textContent = "No Text Inputted".toUpperCase();
        logInputGenerateBtn.classList.add("error");
        setTimeout(() => {
            logInputGenerateBtn.textContent = "Generate";
            logInputGenerateBtn.classList.remove("error");
        }, 2500);
        return;
    }
    

    //// CREATES CLEAN DATA FROM EACH LINE
    // Hunter Luke Richardson	- 20 (£2000)	.308 Winchester	N/A	21st September 2024, 11:52:21 pm
    // '-> ['Luke Richardson', '2000', '.308 Winchester', 20, false]

    // List of all ranks to remove in name
    const ranks = ["Hunter", "Trainee Ranger", "Park Ranger", "Senior Ranger", "Deputy Ranger", "Head Ranger"];

    // Empty Bill List to add formatted bills
    const billList = [];

    // Splits all lines in Log Input Text Area
    const lines = logInputTextAreaText.split("\n");
    lines.forEach(line => {
        // Skips lines with column titles
        if (line.includes("Reason") && line.includes("Quantity")) return;
        
        // Splits data into 5 variables and keeps the first 3 variables
        // e.g. ['Hunter Luke Richardson', '- 20 (£2000)', '.308 Winchester']
        const datalist = line.trim().split("\t").slice(0, 3);
        let [name, amount, item] = datalist;
        
        // Goes through each rank to remove it from name. If person is not a hunter, it will add ranger attribute
        // e.g. "Hunter Luke Richardson" -> "Luke Richardson"
        let isRanger = false;
        ranks.forEach(rank => {
            // Checks if name includes rank
            if (name.includes(rank)) {
                // Remove rank from name
                // e.g. ['Luke Richardson', '- 20 (£2000)', '.308 Winchester']
                datalist[0] = name.replace(rank + " ", "");
                // Adds ranger attribute to person if person is not a hunter
                if (rank !== "Hunter") {
                    isRanger = true;
                }
            }
        });

        // Gets the item count from the amount variable and pushes it to datalist
        // e.g. "- 20 (£2000)" -> 20
        const itemCount = parseInt(amount.slice(1, amount.indexOf("(")).replace(" ", ""), 10);
        // e.g. ['Luke Richardson', '- 20 (£2000)', '.308 Winchester', 20]
        datalist.push(itemCount);
        
        // Calculates bill log amount
        // e.g. "- 20 (£2000)" -> 2000
        let amountCost = amount.slice(amount.indexOf("(") + 2, -1);
        // Checks whether its vehicle insurance or not to handle it differently
        if (item.includes("Vehicle Insurance")) {
            const insuranceCost = amount.slice(amount.indexOf(" ") + 1);
            datalist[1] = parseInt(insuranceCost, 10);
        } else {
            amountCost = parseInt(amountCost, 10);
            // If the person is a hunter and the hunter multiplier is enabled, then bullets go from 100 each to 150 each
            if (!isRanger && item === ".308 Winchester" && hunterMultiplier ) {
                amountCost = itemCount * 150;
            }

            // If the amount variable starts with "-" then it keeps the cost positive, else the cost is negative. Then changes in datalist
            // e.g. ['Luke Richardson', '2000', '.308 Winchester', 20]
            if (amount.startsWith("-")) {
                datalist[1] = amountCost;
            } else {
                datalist[1] = -amountCost;
            }
        }

        // Adds the attribute about if the person is a ranger or not
        // e.g. ['Luke Richardson', '2000', '.308 Winchester', 20, false]
        datalist.push(isRanger);

        // Adds cleaned data to Bill List
        // e.g. [
        //     ['Ben Wong', -1000, 'Binoculars', 1, true],
        //     ['Luke Richardson', '2000', '.308 Winchester', 20, false]
        // ]
        billList.push(datalist);
    });


    //// TOTALS UP ALL BILLS FOR EACH PERSON
    // e.g. 
    // { 'Luke Richardson': {
    //         "Bill": 30500,
    //         "Items": {
    //             ".308 Winchester": { "Taken": [220, 22000], "Given": [0, 0] },
    //             "Binoculars": { "Taken": [2, 2000], "Given": [1, -1000] },
    //             "Hunting Knife": { "Taken": [2, 5000], "Given": [1, -2500] },
    //             "Hunting Rifle": { "Taken": [2, 10000], "Given": [1, -5000] }
    //         },
    //         "IsRanger": false
    //     }
    // }

    // Empty Separate Bills Array to deal with totalled bills
    const separateBills = {};

    // Goes through each Log in the Bill List
    billList.forEach(log => {
        // Splits the log into 5 variables
        // e.g. ['Luke Richardson', '2000', '.308 Winchester', 20, false]
        const [name, amount, item, itemCount, isRanger] = log;

        // Creates Person Info in Separate Bills Array if there is no person in Array
        // e.g { 'Luke Richardson': { 'Bill': 0, 'Items': {}, 'IsRanger': false } }
        if (!separateBills[name]) {
            separateBills[name] = { "Bill": 0, "Items": {}, "IsRanger": isRanger };
        }
        
        // Adds positive or negative Amount onto person's bill
        separateBills[name]["Bill"] += amount;

        // Creates Item Info in "Items" Array if item is not in Array
        // e.g { 'Luke Richardson': { 'Bill': 0, 'Items': { '.308 Winchester': {"Taken": [0, 0], "Given": [0, 0]} }, 'IsRanger': false } }
        if (!separateBills[name]["Items"][item]) {
            separateBills[name]["Items"][item] = {"Taken": [0, 0], "Given": [0, 0]}; // item count, total cost
        }

        // Adds Item Count and Amount to either "Taken" list or "Given" list if amount is more than 0 or less than 0
        // e.g { 'Luke Richardson': { "Bill": 2000, "Items": { ".308 Winchester":{ "Taken": [20,2000], "Given": [0,0] } }, "IsRanger": false } }
        if (amount >= 0) {
            separateBills[name]["Items"][item]["Taken"][0] += itemCount;
            separateBills[name]["Items"][item]["Taken"][1] += amount;
        } else if (amount < 0) {
            separateBills[name]["Items"][item]["Given"][0] += itemCount;
            separateBills[name]["Items"][item]["Given"][1] += amount;
        }
    });


    //// REMOVES BLANK BILLS
    // Adds only people with a Bill over 0 to the Temp Separate Bills Array
    const tempSeparateBills = {};
    for (const person in separateBills) {
        if (separateBills[person]["Bill"] > 0) {
            tempSeparateBills[person] = separateBills[person];
        }
    }


    //// SORTS BILLS
    // Sorts the Temp Separate Bills Array by the person name and stores in Sorted Separate Bills Array
    const sortedSeparateBills = Object.keys(tempSeparateBills).sort().reduce((acc, key) => {
        acc[key] = tempSeparateBills[key];
        return acc;
    }, {});


    //// OUTPUTS EACH PERSON'S FINAL BILL IF ENABLED
    const consoleLogBills = false;
    if (consoleLogBills) {
        for (const person in sortedSeparateBills) {
            console.log(`${person} - ${JSON.stringify(sortedSeparateBills[person])}`);
        }
    }


    //// SHOWS COPY OUTPUT BUTTON
    // Creates output text for Google Sheet using each person's bill
    let outputText = "";
    for (const person in sortedSeparateBills) {
        outputText += `${person}\t${sortedSeparateBills[person]["Bill"]}\n`;
    }
    outputText = outputText.slice(0, -1);

    // Log Input Copy Output Button
    const logInputCopyOutputBtn = document.getElementById("log-input-copy-output-btn");
    // Sets the copy text to the "log-generated-output" attribute
    logInputCopyOutputBtn.setAttribute("log-generated-output", outputText);
    // Shows the button
    logInputCopyOutputBtn.classList.remove("hidden");
    // Changes the Current Step Effect
    document.getElementById("log-input-tab-btn").classList.remove("current-step");
    document.getElementById("sheet-input-tab-btn").classList.add("current-step");


    //// DISPLAYS BILLS IN LIST
    // Gets the List of Bills area
    const listOfBills = document.getElementById("list-of-bills");

    // Sets List of Bills Inner HTML variable
    let listOfBillsInnerHTML = "";

    // Clears List of Bills
    listOfBills.innerHTML = "";

    // Goes through each Person in the Sorted Separate Bills Array
    for (const person in sortedSeparateBills) {
        // Creates Currency Format for values that represent money
        const currencyFormat = new Intl.NumberFormat('en-GB', {
                                style: 'currency',
                                currency: 'GBP',
                                minimumFractionDigits: 0, // Removes decimals
                            });

        // Formats the Person's Bill
        const formattedPersonBill = currencyFormat.format(sortedSeparateBills[person]["Bill"]);


        // Creates BILL TAB \\
        const billTab = document.createElement("div");
        billTab.classList.add("bill-tab");
        const personNameAndBill = `${person} - ${formattedPersonBill}`
        billTab.setAttribute("name-and-bill", personNameAndBill);
        // Adds BILL TAB to LIST OF BILLS
        listOfBills.appendChild(billTab);


            // Creates BILL TAB HEADER \\
            const billTabHeader = document.createElement("div");
            billTabHeader.classList.add("bill-tab-header");
            // Adds Header Click Functionality
            billTabHeader.addEventListener("click", () => {
                // Gets needed variables like List of Bills, Bill Tab, and Bill Tab Info
                const listOfBills = document.getElementById("list-of-bills");
                const billTab = billTabHeader.parentElement;
                const billTabInfo = billTab.querySelector(".bill-tab-info");

                // Toggles the Bill Tab Box
                billTab.classList.toggle("open");
                if (billTab.classList.contains("open")) {
                    const fullHeight = billTabInfo.scrollHeight + 5 + 'px';
                    const overFullHeight = billTabInfo.scrollHeight + 20 + 'px';
                    billTabInfo.style.height = fullHeight;
                    billTabInfo.style.maxHeight = overFullHeight;
                } else {
                    billTabInfo.style.height = "";
                    // billTabInfo.style.maxHeight = "";
                }
                
                // Changes Scroll Bar Padding if Scroll Bar is visible
                if (listOfBills.scrollHeight > listOfBills.clientHeight) {
                    listOfBills.style.paddingRight = "10px";
                } else {
                    if (listOfBills.style.paddingLeft === "10px") {
                        listOfBills.style.paddingLeft = "0";
                    }
                }
            });
            // Adds BILL TAB HEADER to BILL TAB
            billTab.appendChild(billTabHeader);

            
                // Creates BILL TAB PERSON INFO \\
                const billTabPersonInfo = document.createElement("div");
                billTabPersonInfo.classList.add("bill-tab-person-info");
                // Adds BILL TAB PERSON INFO to BILL TAB HEADER
                billTabHeader.appendChild(billTabPersonInfo);


                    // Creates BILL TAB RANGER TAG if person is a Ranger \\
                    const isRanger = sortedSeparateBills[person]["IsRanger"];
                    if (isRanger) {
                        const billTabRangerTag = document.createElement("div");
                        billTabRangerTag.classList.add("bill-tab-ranger-tag");
                        billTabRangerTag.textContent = "RANGER";
                        // Adds BILL TAB RANGER TAG to BILL TAB PERSON INFO
                        billTabPersonInfo.appendChild(billTabRangerTag);
                    }


                    // Creates BILL TAB NAME AND BILL \\
                    const billTabNameAndBill = document.createElement("div");
                    billTabNameAndBill.classList.add("name-and-bill");
                    billTabNameAndBill.textContent = personNameAndBill;
                    // Adds BILL TAB NAME AND BILL to BILL TAB PERSON INFO
                    billTabPersonInfo.appendChild(billTabNameAndBill);


                // Creates BILL TAB BUTTONS \\
                const billTabBtns = document.createElement("div");
                billTabBtns.classList.add("bill-btns");
                // Adds BILL TAB BUTTONS to BILL TAB HEADER
                billTabHeader.appendChild(billTabBtns);

            
                // Creates BILL TAB ARROW CONTAINER \\
                const billTabArrowContainer = document.createElement("div");
                billTabArrowContainer.classList.add("bill-tab-arrow-container");
                // Adds BILL TAB ARROW CONTAINER to BILL TAB HEADER
                billTabHeader.appendChild(billTabArrowContainer);


                    // Creates BILL TAB ARROW \\
                    const billTabArrow = document.createElement("div");
                    billTabArrow.className = "bill-tab-arrow fa-solid fa-angle-right";
                    // Adds BILL TAB ARROW to BILL TAB ARROW CONTAINER
                    billTabArrowContainer.appendChild(billTabArrow);


            // Creates BILL TAB INFO \\
            const billTabInfo = document.createElement("div");
            billTabInfo.classList.add("bill-tab-info");
            // Adds BILL TAB INFO to BILL TAB
            billTab.appendChild(billTabInfo);


            // Creates BILL TAB DIVIDER \\
            const billTabDivider = document.createElement("div");
            billTabDivider.classList.add("bill-tab-divider");
            // Adds BILL TAB DIVIDER to BILL TAB
            billTabInfo.appendChild(billTabDivider);


            // Gets all Person's Bill Items
            // e.g.
            // "Items": {
            //     ".308 Winchester": { "Taken": [220, 22000], "Given": [0, 0] },
            //     "Binoculars": { "Taken": [2, 2000], "Given": [1, -1000] },
            //     "Hunting Knife": { "Taken": [2, 5000], "Given": [1, -2500] },
            //     "Hunting Rifle": { "Taken": [2, 10000], "Given": [1, -5000] }
            // },
            const personItems = sortedSeparateBills[person]["Items"];
            const items = Object.keys(personItems);
            const lastItem = items[items.length - 1];
            for (const itemName in personItems) {
                const itemInfo = personItems[itemName];


                // Creates BILL INFO ITEM \\
                const billInfoItem = document.createElement("div");
                billInfoItem.classList.add("bill-info-item");
                billInfoItem.setAttribute("item-name", itemName);
                // Adds BILL INFO ITEM to BILL TAB INFO
                billTabInfo.appendChild(billInfoItem);


                    // Creates BILL INFO ITEM INFO \\
                    const billInfoItemInfo = document.createElement("div");
                    billInfoItemInfo.classList.add("bill-info-item-info");
                    // Adds BILL INFO ITEM INFO to BILL INFO ITEM
                    billInfoItem.appendChild(billInfoItemInfo);


                        // Creates BILL INFO ITEM TITLE \\
                        const billInfoItemTitle = document.createElement("div");
                        billInfoItemTitle.classList.add("bill-info-item-title");
                        billInfoItemTitle.textContent = itemName.trimEnd();
                        // Adds BILL INFO ITEM HEADER TITLE to BILL INFO ITEM
                        billInfoItemInfo.appendChild(billInfoItemTitle);


                        // Creates BILL INFO ITEM STATS \\
                        const billInfoItemStats = document.createElement("div");
                        billInfoItemStats.classList.add("bill-info-item-stats");
                        // Adds BILL INFO ITEM STATS to BILL INFO ITEM
                        billInfoItemInfo.appendChild(billInfoItemStats);


                            // Creates BILL INFO ITEM INVISIBLE DIVIDER between Items \\
                            function createInvisibleDivider(text) {
                                const billInfoItemInvisibleDivider = document.createElement("div");
                                billInfoItemInvisibleDivider.classList.add("bill-info-item-invisible-divider");
                                billInfoItemInvisibleDivider.textContent = ` ${text} `;
                                return billInfoItemInvisibleDivider;
                            }

                            billInfoItemStats.appendChild(createInvisibleDivider("|"));

                            // Checks if any items were taken
                            if (itemInfo["Taken"][0] > 0) {
                                // Creates BILL INFO ITEM TAKEN \\
                                const billInfoItemTaken = document.createElement("div");
                                billInfoItemTaken.classList.add("bill-info-item-stat");
                                billInfoItemTaken.classList.add("taken");
                                billInfoItemTaken.textContent = "-" + itemInfo["Taken"][0];
                                // Adds BILL INFO ITEM ITEM to BILL INFO ITEM STATS
                                billInfoItemStats.appendChild(billInfoItemTaken);
                                billInfoItemStats.appendChild(createInvisibleDivider("|"));
                            }


                            // Checks if any items were given
                            if (itemInfo["Given"][0] > 0) {
                                // Creates BILL INFO ITEM GIVEN \\
                                const billInfoItemGiven = document.createElement("div");
                                billInfoItemGiven.classList.add("bill-info-item-stat");
                                billInfoItemGiven.classList.add("given");
                                billInfoItemGiven.textContent = "+" + itemInfo["Given"][0];
                                // Adds BILL INFO ITEM GIVEN to BILL INFO ITEM STATS
                                billInfoItemStats.appendChild(billInfoItemGiven);
                                billInfoItemStats.appendChild(createInvisibleDivider("|"));
                            }

                            // Checks if any items were given and taken
                            if (itemInfo["Taken"][0] > 0 && itemInfo["Given"][0] > 0) {
                                // Creates BILL INFO ITEM NET \\
                                const billInfoItemNet = document.createElement("div");
                                billInfoItemNet.classList.add("bill-info-item-stat");
                                billInfoItemNet.classList.add("net");
                                const itemNetQuantity = itemInfo["Taken"][0]-itemInfo["Given"][0];
                                billInfoItemNet.textContent = (itemNetQuantity < 0) ? "+" + (itemNetQuantity*-1) : (itemNetQuantity > 0) ? "-" + itemNetQuantity : "0";
                                // Adds BILL INFO ITEM NET to BILL INFO ITEM STATS
                                billInfoItemStats.appendChild(billInfoItemNet);
                                billInfoItemStats.appendChild(createInvisibleDivider("-"));
                            }


                            // Creates BILL INFO ITEM NET COST \\
                            const billInfoItemNetCost = document.createElement("div");
                            billInfoItemNetCost.classList.add("bill-info-item-stat");
                            billInfoItemNetCost.classList.add("net-cost");
                            const itemNetCost = itemInfo["Taken"][1]+itemInfo["Given"][1];
                            billInfoItemNetCost.classList.add((itemNetCost > 0) ? "positive" : (itemNetCost < 0) ? "negative" : "neutral");
                            billInfoItemNetCost.textContent = currencyFormat.format(itemNetCost);;
                            // Adds BILL INFO ITEM NET COST to BILL INFO ITEM STATS
                            billInfoItemStats.appendChild(billInfoItemNetCost);




                    // // Creates BILL INFO ITEM HEADER AMOUNT \\
                    // const billInfoItemHeaderAmount = document.createElement("div");
                    // billInfoItemHeaderAmount.classList.add("bill-info-item-header-amount");
                    // billInfoItemHeaderAmount.textContent = currencyFormat.format(itemInfo["Taken"][1]+itemInfo["Given"][1]);
                    // if (itemInfo["Taken"][1]+itemInfo["Given"][1] > 0) {
                    //     billInfoItemHeaderAmount.classList.add("positive");
                    // } else if (itemInfo["Taken"][1]+itemInfo["Given"][1] < 0) {
                    //     billInfoItemHeaderAmount.classList.add("negative");
                    // }
                    // // Adds BILL INFO ITEM HEADER AMOUNT to BILL INFO ITEM HEADER
                    // billInfoItemHeader.appendChild(billInfoItemHeaderAmount);


                // // Checks if any items were taken
                // if (itemInfo["Taken"][0] > 0) {
                //     // Creates BILL INFO ITEM TAKEN \\
                //     const billInfoItemTaken = document.createElement("div");
                //     billInfoItemTaken.classList.add("bill-info-item-taken");
                //     // Adds BILL INFO ITEM TAKEN to BILL INFO ITEM
                //     billInfoItem.appendChild(billInfoItemTaken);


                //         // Creates BILL INFO ITEM TAKEN QUANTITY \\
                //         const billInfoItemTakenQuantity = document.createElement("div");
                //         billInfoItemTakenQuantity.classList.add("bill-info-item-taken-quantity");
                //         billInfoItemTakenQuantity.innerHTML = `Taken <b>x${itemInfo["Taken"][0]}</b>`;
                //         // Adds BILL INFO ITEM TAKEN QUANTITY to BILL INFO ITEM TAKEN
                //         billInfoItemTaken.appendChild(billInfoItemTakenQuantity);


                //         // Creates BILL INFO ITEM TAKEN AMOUNT \\
                //         const billInfoItemTakenAmount = document.createElement("div");
                //         billInfoItemTakenAmount.classList.add("bill-info-item-taken-amount");
                //         billInfoItemTakenAmount.textContent = currencyFormat.format(itemInfo["Taken"][1]);
                //         // Adds BILL INFO ITEM TAKEN AMOUNT to BILL INFO ITEM TAKEN
                //         billInfoItemTaken.appendChild(billInfoItemTakenAmount);
                // }


                // // Checks if any items were given
                // if (itemInfo["Given"][0] > 0) {
                //     // Creates BILL INFO ITEM GIVEN \\
                //     const billInfoItemGiven = document.createElement("div");
                //     billInfoItemGiven.classList.add("bill-info-item-given");
                //     // Adds BILL INFO ITEM GIVEN to BILL INFO ITEM
                //     billInfoItem.appendChild(billInfoItemGiven);


                //         // Creates BILL INFO ITEM GIVEN QUANTITY \\
                //         const billInfoItemGivenQuantity = document.createElement("div");
                //         billInfoItemGivenQuantity.classList.add("bill-info-item-given-quantity");
                //         billInfoItemGivenQuantity.innerHTML = `Given <b>x${itemInfo["Given"][0]}</b>`;
                //         // Adds BILL INFO ITEM GIVEN QUANTITY to BILL INFO ITEM GIVEN
                //         billInfoItemGiven.appendChild(billInfoItemGivenQuantity);


                //         // Creates BILL INFO ITEM GIVEN AMOUNT \\
                //         const billInfoItemGivenAmount = document.createElement("div");
                //         billInfoItemGivenAmount.classList.add("bill-info-item-given-amount");
                //         billInfoItemGivenAmount.textContent = currencyFormat.format(itemInfo["Given"][1]);
                //         // Adds BILL INFO ITEM GIVEN AMOUNT to BILL INFO ITEM GIVEN
                //         billInfoItemGiven.appendChild(billInfoItemGivenAmount);
                // }

                if (itemName !== lastItem) {
                    // Creates BILL TAB INFO DIVIDER \\
                    const billTabInfoDivider = document.createElement("div");
                    billTabInfoDivider.classList.add("bill-tab-info-divider");
                    // Adds BILL TAB INFO DIVIDER to BILL INFO ITEM
                    billInfoItem.appendChild(billTabInfoDivider);
                }
            }

    };

    // Adjusts List of Bills for Scrollbar
    if (listOfBills.scrollHeight > listOfBills.clientHeight) {
        listOfBills.style.paddingRight = "10px";
    } else {
        if (listOfBills.style.paddingLeft === "10px") {
            listOfBills.style.paddingLeft = "0";
        }
    }

    // Deals with effects for Generate Button
    if (logInputGenerateBtn.textContent !== "Generated") {
        logInputGenerateBtn.textContent = "Generated";
        logInputGenerateBtn.classList.add("success");
        setTimeout(() => {
            logInputGenerateBtn.textContent = "Generate";
            logInputGenerateBtn.classList.remove("success")
        }, 2500);
    }
});