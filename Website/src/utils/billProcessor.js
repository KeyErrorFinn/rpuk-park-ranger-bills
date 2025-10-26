//// BILL PROCESSOR \\\\

export const processBills = (
	logInputGenerateBtn,
	hunterMultiplier = false,
	consoleLogBills = false
) => {
	//// ERROR HANDLERS
	// Handles Button Error Showing
	if (logInputGenerateBtn.classList.contains("error")) {
		return { success: false, message: "" };
	}

	// Handles no text in input text area and changes button colour temporarily
	const logInputTextAreaText = document.querySelector(
		"#log-input-tab-container .small-box-text-area"
	).value;
	if (logInputTextAreaText === "") {
		return { success: false, message: "No Text Inputted".toUpperCase() };
	}

	//// CREATES CLEAN DATA FROM EACH LINE
	// Hunter Luke Richardson	- 20 (£2000)	.308 Winchester	N/A	21st September 2024, 11:52:21 pm
	// '-> ['Luke Richardson', '2000', '.308 Winchester', 20, false]

	// List of all ranks to remove in name
	const ranks = [
		"Hunter",
		"Trainee Ranger",
		"Assistant Ranger",
		"Senior Ranger",
		"Internal Affairs",
		"Deputy Ranger",
		"Head Ranger",
		"Ranger",
	];

	// Empty Bill List to add formatted bills
	const billList = [];

	// Splits all lines in Log Input Text Area
	const lines = logInputTextAreaText.split("\n");
	for (const line of lines) {
		// Skips lines with column titles
		if ((line.includes("Item Name") && line.includes("Quantity")) || !line)
			continue;

		// Splits data into 5 variables and keeps the first 3 variables
		// e.g. ['Hunter Luke Richardson', '- 20 (£2000)', '.308 Winchester']
		const datalist = line.trim().split("\t").slice(0, 3);
		let [name, amount, item] = datalist;

		// Goes through each rank to remove it from name. If person is not a hunter, it will add ranger attribute
		// e.g. "Hunter Luke Richardson" -> "Luke Richardson"
		let isRanger = false;
		for (const rank of ranks) {
			// Checks if name includes rank
			if (name.includes(rank)) {
				// Remove rank from name
				datalist[0] = name.replace(rank + " ", "");

				// Adds ranger attribute to person if person is not a hunter
				if (rank !== "Hunter") {
					isRanger = true;
				}

				break;
			}
		}

		// Gets the item count from the amount variable and pushes it to datalist
		// e.g. "- 20 (£2000)" -> 20
		const itemCount = parseInt(
			amount.slice(1, amount.indexOf("(")).replace(" ", ""),
			10
		);
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
			if (!isRanger && item === ".308 Winchester" && hunterMultiplier) {
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

		datalist[2] = item.replace("SmartPhone", "Smart Phone");

		if (item.includes("Photo")) {
			// || name.includes("Anonymous Citizen")
			if (!name.includes("Anonymous Citizen")) {
				datalist[2] = "Photography Job";
			}
			datalist[0] = "Hunting Shack";
		} else if (name.includes("Anonymous Citizen")) {
			datalist[0] = "Hunting Shack";
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
	}

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
	billList.forEach((log) => {
		// Splits the log into 5 variables
		// e.g. ['Luke Richardson', '2000', '.308 Winchester', 20, false]
		const [name, amount, item, itemCount, isRanger] = log;

		// Creates Person Info in Separate Bills Array if there is no person in Array
		// e.g { 'Luke Richardson': { 'Bill': 0, 'Items': {}, 'IsRanger': false } }
		if (!separateBills[name]) {
			separateBills[name] = { Bill: 0, Items: {}, IsRanger: isRanger };
		}

		// Adds positive or negative Amount onto person's bill
		separateBills[name]["Bill"] += amount;

		// Creates Item Info in "Items" Array if item is not in Array
		// e.g { 'Luke Richardson': { 'Bill': 0, 'Items': { '.308 Winchester': {"Taken": [0, 0], "Given": [0, 0]} }, 'IsRanger': false } }
		if (!separateBills[name]["Items"][item]) {
			separateBills[name]["Items"][item] = {
				Taken: [0, 0],
				Given: [0, 0],
			}; // item count, total cost
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
		if (separateBills[person]["Bill"] > 0 || person === "Hunting Shack") {
			// Adds person to Temp Separate Bills Array
			tempSeparateBills[person] = separateBills[person];
		}
	}

	console.log(tempSeparateBills);

	//// SORTS BILLS
	// Moves "Anonymous Citizen" to the top and sorts the rest by person name
	const sortedSeparateBills = Object.keys(tempSeparateBills)
		.sort((a, b) => {
			if (a === "Hunting Shack") return -1;
			if (b === "Hunting Shack") return 1;
			return a.localeCompare(b);
		})
		.reduce((acc, key) => {
			acc[key] = tempSeparateBills[key];
			return acc;
		}, {});

	console.log(sortedSeparateBills);

	// //// SORTS BILLS
	// // Sorts the Temp Separate Bills Array by the person name and stores in Sorted Separate Bills Array
	// const sortedSeparateBills = Object.keys(tempSeparateBills).sort().reduce((acc, key) => {
	//     acc[key] = tempSeparateBills[key];
	//     return acc;
	// }, {});

	//// OUTPUTS EACH PERSON'S FINAL BILL IF ENABLED
	if (consoleLogBills) {
		for (const person in sortedSeparateBills) {
			console.log(
				`${person} - ${JSON.stringify(sortedSeparateBills[person])}`
			);
		}
	}

	// Convert the bills object into an array of bill objects
	const billsArray = Object.entries(sortedSeparateBills).map(
		([Name, bill]) => ({
			Name,
			...bill,
		})
	);

	//// SHOWS COPY OUTPUT BUTTON
	// Creates output text for Google Sheet using each person's bill
	let outputText = "";
	for (const person in sortedSeparateBills) {
		outputText += `${person}\t${sortedSeparateBills[person]["Bill"]}\n`;
	}
	outputText = outputText.slice(0, -1);

	return { success: true, bills: billsArray, billsOutputText: outputText };
};
