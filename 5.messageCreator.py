# Creates 1.billInput.txt file if it does not exist
try:
    checkFile = open("1.billInput.txt", "r")
except FileNotFoundError:
    open("1.billInput.txt", "w")

# Creates 4.messageInput.txt file if it does not exist
try:
    checkFile = open("4.messageInput.txt", "r")
except FileNotFoundError:
    open("4.messageInput.txt", "w")

# Creates !sampleMessage.txt file if it does not exist
try:
    checkFile = open("!sampleMessage.txt", "r")
except FileNotFoundError:
    with open("!sampleMessage.txt", "w") as f:
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
    checkFile = open("!!instructions.txt", "r")
except FileNotFoundError:
    with open("!!instructions.txt", "w") as f:
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


# Turns 4.messageInput.txt file into a list
peopleInfoList = []
with open("4.messageInput.txt", "r", encoding='utf-8') as f:

    # Gets each line in file
    for line in f:

        # Cleans each line and splits into sections (also excluses gun sig and date/time)
        datalist = line.strip().split("\t")

        # Gets rid of date data
        datalist.pop(2)

        # Adds people data to list
        peopleInfoList.append(datalist)

# Outputs player messages to file
with open("6.messageOutput.txt", "w", encoding='utf-8') as f:

    # Reads sample message from sampleMessage.txt file
    with open("!sampleMessage.txt", "r") as f2:
        sampleMessage = f2.readlines()

    # Gets each persons info in the list
    for info in peopleInfoList:
        # Gets each column
        name = info[0]
        amount = info[1]
        contactNumber = info[2]

        # Formats the amount into proper currency
        for i in ["£", ","]:
            amount = amount.replace(i, "")
        formattedAmount = '£{:,}'.format(int(amount))


        # Creates message from sample message
        textMessage = [line.replace("[NAME]", name).replace("[FIRSTNAME]", name.split(" ")[0]).replace("[AMOUNT]", formattedAmount) for line in sampleMessage]
        textMessage.append("\n")

        # Writes message to file
        f.write("==========================================================\n")
        f.write(str(name) + "\n")
        f.write(str(contactNumber) + "\n")
        f.write("--------------MESSAGE START--------------\n")
        f.writelines(textMessage)
        f.write("---------------MESSAGE END---------------\n")
        f.write("==========================================================\n\n\n")