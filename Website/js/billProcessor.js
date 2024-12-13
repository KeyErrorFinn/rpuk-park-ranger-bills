function processBill(e) {
    const hunterMultiplier = false;
    const billList = [];
    const ranks = ["Hunter", "Trainee Ranger", "Park Ranger", "Senior Ranger", "Deputy Ranger", "Head Ranger"];
    
    const logTextInputText = document.getElementById("logTextInput").value;
    const outputForSheet = document.getElementById("outputForSheet");
    const lines = logTextInputText.split("\n");

    if (logTextInputText == "") {
        outputForSheet.placeholder = "NO TEXT INPUTTED TO LOG TEXT INPUT";
        return
    }
    
    lines.forEach(line => {
        if (line.includes("Reason") && line.includes("Quantity")) return;
        
        const datalist = line.trim().split("\t").slice(0, 3);
        let [name, amount, item] = datalist;
        
        // Remove ranks from names
        let isRanger = false;
        ranks.forEach(rank => {
            if (name.includes(rank)) {
                datalist[0] = name.replace(rank + " ", "");
                if (rank !== "Hunter") {
                    isRanger = true;
                }
            }
        });

        const itemCount = parseInt(amount.slice(1, amount.indexOf("(")).replace(" ", ""), 10);
        datalist.push(itemCount);
        
        // Calculate amount owed
        let amountCost = amount.slice(amount.indexOf("(") + 2, -1);
        if (item.includes("Vehicle Insurance")) {
            const insuranceCost = amount.slice(amount.indexOf(" ") + 1);
            datalist[1] = parseInt(insuranceCost, 10);
        } else {
            amountCost = parseInt(amountCost, 10);
            if (!isRanger && item === ".308 Winchester" && hunterMultiplier ) {
                amountCost = itemCount * 150
            }

            if (amount.startsWith("-")) {
                datalist[1] = amountCost;
            } else {
                datalist[1] = -amountCost;
            }
        }

        datalist.push(isRanger);

        billList.push(datalist);
    });


    const separateBills = {};
    billList.forEach(log => {
        const [name, amount, item, itemCount, isRanger] = log;

        if (!separateBills[name]) {
            separateBills[name] = { "Bill": 0, "Items": {}, "IsRanger": isRanger};
        }
        
        separateBills[name]["Bill"] += amount;

        if (!separateBills[name]["Items"][item]) {
            separateBills[name]["Items"][item] = {"Taken": [0, 0], "Given": [0, 0]}; // item count, total cost
        }

        // console.log(separateBills["Ethan Walker"])
        try {
            // console.log(separateBills["Ethan Walker"]["Items"]["Hunting Knife"])
        } catch (error) {}

        if (amount >= 0) {
            separateBills[name]["Items"][item]["Taken"][0] += itemCount;
            separateBills[name]["Items"][item]["Taken"][1] += amount;
        } else if (amount < 0) {
            separateBills[name]["Items"][item]["Given"][0] += itemCount;
            separateBills[name]["Items"][item]["Given"][1] += amount;
        }

        // if (separateBills[name]["Items"][item][0] <= 0) {
        //     delete separateBills[name]["Items"][item];
        // }
    });

    // console.log(separateBills)

    const tempSeparateBills = {};
    for (const person in separateBills) {
        if (separateBills[person]["Bill"] > 0) {
            tempSeparateBills[person] = separateBills[person];
        }
    }

    const sortedSeparateBills = Object.keys(tempSeparateBills).sort().reduce((acc, key) => {
        acc[key] = tempSeparateBills[key];
        return acc;
    }, {});

    // for (const person in sortedSeparateBills) {
    //     console.log(`${person} - ${JSON.stringify(sortedSeparateBills[person])}`)
    // }

    let outputText = "";
    for (const person in sortedSeparateBills) {
        outputText += `${person}\t${sortedSeparateBills[person]["Bill"]}\n`;
    }

    outputText = outputText.slice(0, -1);

    outputForSheet.value = outputText;


    const listOfBills = document.getElementById("listOfBills");

    let listOfBillsInnerHTML = ""

    for (const person in sortedSeparateBills) {
        const personBill = sortedSeparateBills[person]["Bill"];
        const personItems = sortedSeparateBills[person]["Items"];
        const currencyFormat = new Intl.NumberFormat('en-GB', {
                                style: 'currency',
                                currency: 'GBP',
                                minimumFractionDigits: 0, // Removes decimals
                            })
        const formattedPersonBill = currencyFormat.format(personBill);
        listOfBillsInnerHTML += `<div class="bill-tab" name-and-bill="${person} - ${formattedPersonBill}">`;
        listOfBillsInnerHTML += '<div class="bill-tab-header" onclick="toggleInformation(this)">'; // Header START
        const prefix = sortedSeparateBills[person]["IsRanger"] ? "RANGER | " : ""
        listOfBillsInnerHTML += `<div class="name-and-bill">${prefix + person} - ${formattedPersonBill}</div>`;
        listOfBillsInnerHTML += '<div class="bill-buttons"></div>';
        listOfBillsInnerHTML += '<div class="bill-tab-arrow">></div>';
        listOfBillsInnerHTML += '</div>'; // Header END
        listOfBillsInnerHTML += '<div class="bill-tab-information">'; // Information START
        for (const itemName in personItems) {
            const itemInfo = personItems[itemName];
            listOfBillsInnerHTML += '<div class="bill-information-divider"></div>';

            if (true) {
                const differenceItemAmount = itemInfo["Taken"][0]-itemInfo["Given"][0];
                const formattedDifferenceItemCost = currencyFormat.format(itemInfo["Taken"][1]+itemInfo["Given"][1]);
                listOfBillsInnerHTML += '<div class="bill-information-item difference-item"><div class="bill-information-item-name">'
                listOfBillsInnerHTML += `${itemName} | ${differenceItemAmount}</div><div class="bill-information-item-cost">${formattedDifferenceItemCost}</div></div>`;
            }

            if (itemInfo["Taken"][0] > 0) {
                const takenItemAmount = itemInfo["Taken"][0];
                const formattedTakenItemCost = currencyFormat.format(itemInfo["Taken"][1]);
                listOfBillsInnerHTML += '<div class="bill-information-item taken-item"><div class="bill-information-item-name">'
                listOfBillsInnerHTML += `${itemName} | ${takenItemAmount}</div><div class="bill-information-item-cost">${formattedTakenItemCost}</div></div>`;
            }
            // if (itemInfo["Taken"][0] > 0 && itemInfo["Given"][0] > 0) {
            //     listOfBillsInnerHTML += '<div class="bill-information-divider"></div>';
            // }
            if (itemInfo["Given"][0] > 0) {
                const givenItemAmount = itemInfo["Given"][0];
                const formattedGivenItemCost = currencyFormat.format(itemInfo["Given"][1]);
                listOfBillsInnerHTML += '<div class="bill-information-item given-item"><div class="bill-information-item-name">'
                listOfBillsInnerHTML += `${itemName} | ${givenItemAmount}</div><div class="bill-information-item-cost">${formattedGivenItemCost}</div></div>`;
            }
        }
        listOfBillsInnerHTML += '</div></div>'; // Information & Tab END

    };

    listOfBills.innerHTML = listOfBillsInnerHTML;

    if (listOfBills.scrollHeight > listOfBills.clientHeight) {
        listOfBills.style.paddingRight = "10px";
    } else {
        if (listOfBills.style.paddingLeft === "10px") {
            listOfBills.style.paddingLeft = "0";
        }
    }

    if (e.textContent !== "Generated") {
        e.textContent = "Generated";
        e.style.background = buttonActivatedColour
        setTimeout(() => {
            e.textContent = "Generate";
            e.style.background = ""
        }, 2500);
    }
}