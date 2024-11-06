import os
cwd = os.path.dirname(__file__) + "\\"
billInputFile = cwd+"1.billInput.txt"
billOutputFile = cwd+"3.billOutput.txt"
messageInputFile = cwd+"4.messageInput.txt"
sampleMessageFile = cwd+"!sampleMessage.txt"
instructionsFile = cwd+"!!instructions.txt"

# Creates 1.billInput.txt file if it does not exist
try:
    checkFile = open(billInputFile, "r")
except FileNotFoundError:
    open(billInputFile, "w")

# Creates 4.messageInput.txt file if it does not exist
try:
    checkFile = open(messageInputFile, "r")
except FileNotFoundError:
    open(messageInputFile, "w")

# Creates !sampleMessage.txt file if it does not exist
try:
    checkFile = open(sampleMessageFile, "r")
except FileNotFoundError:
    with open(sampleMessageFile, "w") as f:
        ogSampleMessage = '''Hello [FIRSTNAME],

Your bill with the Park Rangers this week is: [AMOUNT]
Please make contact via a dispatch to us to settle this.

Regards,
SA Royal Park Rangers'''
        ogSampleMessage = ogSampleMessage.split("\n")
        for line in ogSampleMessage[:-1]:
            f.write(line + "\n")
        f.write(ogSampleMessage[-1])

# Creates !!instructions.txt file if it does not exist
try:
    checkFile = open(instructionsFile, "r")
except FileNotFoundError:
    with open(instructionsFile, "w") as f:
        instructionsMessage = '''1) If you dont have any of the neccessary text files, just open the exe file and the neccessary files should appear

2) Copy and Paste Ranger logs into 1.billInput.txt

3) Run 2.billCounter.exe

4) Copy contents of 3.billOutput.txt into the bills spreadsheet

5) Copy Name, Amount To Pay, Days Active, and Phone Number columns from the spreadsheet to 4.messageInput.txt

6) Run 5.messageCreator.exe

7) Send messages from 6.messageOutput.txt to people'''
        instructionsMessage = instructionsMessage.split("\n")
        for line in instructionsMessage[:-1]:
            f.write(line + "\n")
        f.write(instructionsMessage[-1])


# Turns 1.billInput.txt file into a list
billList = []
with open(billInputFile, "r") as f:

    # Gets each line in file
    for line in f:
        
        # Removes Column Names
        if "Reason" in line and "Quantity" in line:
            continue

        # Cleans each line and splits into sections (also excluses gun sig and date/time)
        datalist = line.strip().split("\t")[:3]
        name = datalist[0]
        amount = datalist[1]
        item = datalist[2]

        # Removes all ranks from names
        for rank in ["Hunter", "Trainee Ranger", "Park Ranger", "Senior Ranger", "Deputy Ranger", "Head Ranger"]:
            if rank in name:
                datalist[0] = name.replace(rank + " ", "")
                break

        # Works out money owed
        amountCost = amount[amount.find("(")+3:-1]
        # If item is taken, then add to bill, else if given, take from bill
        if "Vehicle Insurance" in item:
            insuranceCost = amount[amount.find(" ")+1:]
            datalist[1] = int(insuranceCost)
        elif amount.startswith("-"):
            datalist[1] = int(amountCost)
        else:
            datalist[1] = int("-" + amountCost)

        # Works out amount given/taken
        itemCount = amount[1:amount.find("(")].replace(" ", "")
        datalist.append(int(itemCount))

        # Adds list of info to bill list
        billList.append(datalist)


# Sorts each person's bill and taken items
seperateBills = {}
for log in billList:

    # Gets each column
    name = log[0]
    amount = log[1]
    item = log[2]
    itemCount = log[3]



    # Creates bill log for each person
    if name not in seperateBills:
        seperateBills[name] = {"Bill": 0}

    # Adds or subtracts bill to person
    seperateBills[name]["Bill"] += amount

    # Adds item they taken to person's bill log
    if item not in seperateBills[name]:
        seperateBills[name][item] = 0
    
    # Adds or subtracts item count to person's bill log
    if amount >= 0:
        seperateBills[name][item] += itemCount
    elif amount < 0:
        seperateBills[name][item] -= itemCount
    
    # Deletes item from log if its item count is 0
    if seperateBills[name][item] == 0:
        del seperateBills[name][item]

# Deletes bill log for person if their bill is 0 or less
tempSeperateBills = {}
for person in seperateBills:
    if seperateBills[person]["Bill"] > 0:
        tempSeperateBills[person] = seperateBills[person]
seperateBills = tempSeperateBills

# Sorts seperate bills alphebetically
sortedSeperateBills = dict(sorted(seperateBills.items()))

# for person in sortedSeperateBills:
#     print(person + " - " + str(sortedSeperateBills[person]))

# Outputs seperate bills to file
with open(billOutputFile, "w") as f:
    for person in sortedSeperateBills:
        f.write(person + "\t" + str(sortedSeperateBills[person]["Bill"]) + "\n")