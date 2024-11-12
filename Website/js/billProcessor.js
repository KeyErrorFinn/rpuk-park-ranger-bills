function processBill() {
    const billList = [];
    const ranks = ["Hunter", "Trainee Ranger", "Park Ranger", "Senior Ranger", "Deputy Ranger", "Head Ranger"];
    
    const logTextInputText = document.getElementById("logTextInput").value;
    const outputForSheet = document.getElementById("outputForSheet");
    const lines = logTextInputText.split("\n");

    if (logTextInputText == "") {
        outputForSheet.placeholder = "NO TEXT INPUTTED TO LOG TEXT INPUT"
    }
    
    // console.log(lines);
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
            seperateBills[name] = { "Bill": 0 };
        }
        
        seperateBills[name]["Bill"] += amount;

        if (!seperateBills[name][item]) {
            seperateBills[name][item] = 0;
        }

        if (amount >= 0) {
            seperateBills[name][item] += itemCount;
        } else if (amount < 0) {
            seperateBills[name][item] -= itemCount;
        }

        if (seperateBills[name][item] === 0) {
            delete seperateBills[name][item];
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
}