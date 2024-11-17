function processBill(e) {
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
        ranks.forEach(rank => {
            if (name.includes(rank)) {
                datalist[0] = name.replace(rank + " ", "");
            }
        });
        
        // Calculate amount owed
        const amountCost = amount.slice(amount.indexOf("(") + 2, -1);
        if (item.includes("Vehicle Insurance")) {
            const insuranceCost = amount.slice(amount.indexOf(" ") + 1);
            datalist[1] = parseInt(insuranceCost, 10);
        } else if (amount.startsWith("-")) {
            datalist[1] = parseInt(amountCost, 10);
        } else {
            datalist[1] = -parseInt(amountCost, 10);
        }

        const itemCount = parseInt(amount.slice(1, amount.indexOf("(")).replace(" ", ""), 10);
        datalist.push(itemCount);

        billList.push(datalist);
    });



    const seperateBills = {};
    billList.forEach(log => {
        const [name, amount, item, itemCount] = log;

        if (!seperateBills[name]) {
            seperateBills[name] = { "Bill": 0, "Items": {}};
        }
        
        seperateBills[name]["Bill"] += amount;

        if (!seperateBills[name]["Items"][item]) {
            seperateBills[name]["Items"][item] = 0;
        }

        if (amount >= 0) {
            seperateBills[name]["Items"][item] += itemCount;
        } else if (amount < 0) {
            seperateBills[name]["Items"][item] -= itemCount;
        }

        if (seperateBills[name]["Items"][item] === 0) {
            delete seperateBills[name]["Items"][item];
        }
    });

    const tempSeperateBills = {};
    for (const person in seperateBills) {
        if (seperateBills[person]["Bill"] > 0) {
            tempSeperateBills[person] = seperateBills[person];
        }
    }

    const sortedSeperateBills = Object.keys(tempSeperateBills).sort().reduce((acc, key) => {
        acc[key] = tempSeperateBills[key];
        return acc;
    }, {});

    // for (const person in sortedSeperateBills) {
    //     console.log(`${person} - ${JSON.stringify(sortedSeperateBills[person])}`)
    // }

    let outputText = "";
    for (const person in sortedSeperateBills) {
        outputText += `${person}\t${sortedSeperateBills[person]["Bill"]}\n`;
    }

    outputText = outputText.slice(0, -1);

    outputForSheet.value = outputText;


    const listOfBills = document.getElementById("listOfBills");

    let listOfBillsInnerHTML = ""

    for (const person in sortedSeperateBills) {
        const personBill = sortedSeperateBills[person]["Bill"];
        const personItems = sortedSeperateBills[person]["Items"];
        const formattedPersonBill = new Intl.NumberFormat('en-GB', {
                                style: 'currency',
                                currency: 'GBP',
                                minimumFractionDigits: 0, // Removes decimals
                            }).format(personBill);
        listOfBillsInnerHTML += `<div class="bill-tab" name-and-bill="${person} - ${formattedPersonBill}">`;
        listOfBillsInnerHTML += '<div class="bill-tab-header" onclick="toggleInformation(this)">'; // Header START
        listOfBillsInnerHTML += `<div class="name-and-bill">${person} - ${formattedPersonBill}</div>`;
        listOfBillsInnerHTML += '<div class="bill-buttons"></div>';
        listOfBillsInnerHTML += '<div class="bill-tab-arrow">></div>';
        listOfBillsInnerHTML += '</div>'; // Header END
        listOfBillsInnerHTML += '<div class="bill-tab-information">'; // Information START
        for (const itemName in personItems) {
            const itemAmount = personItems[itemName];
            listOfBillsInnerHTML += '<div class="bill-information-divider"></div>';
            listOfBillsInnerHTML += `<div class="bill-information-item">${itemName} | ${itemAmount}</div>`;
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
            e.style.background = buttonNormalColour
        }, 2500);
    }
}