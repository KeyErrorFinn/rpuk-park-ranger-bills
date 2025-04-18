<h1 align="center">
  RPUK Park Ranger Bills Helper
</h1>

<p align="center">
  <a href="github.com/KeyErrorFinn/rpuk-park-ranger-bills/releases/latest"><img alt="GitHub release (latest by date including pre-releases)" src="https://img.shields.io/github/v/release/KeyErrorFinn/rpuk-park-ranger-bills?include_prereleases" /></a>
  <a href="https://github.com/KeyErrorFinn/rpuk-park-ranger-bills/commits/main/"><img alt="GitHub last commit" src="https://img.shields.io/github/last-commit/KeyErrorFinn/rpuk-park-ranger-bills" /></a>
  <a href="https://github.com/KeyErrorFinn/rpuk-park-ranger-bills/issues"><img alt="GitHub issues" src="https://img.shields.io/github/issues-raw/KeyErrorFinn/rpuk-park-ranger-bills" /></a>
</p>
<p align="center">
  <a href="#"><img alt="GitHub Pages" src="https://img.shields.io/badge/GitHub%20Pages-121013?logo=github&logoColor=white" /></a>
  <a href="#"><img alt="GitHub Actions" src="https://img.shields.io/badge/github%20actions-%232671E5.svg?logo=githubactions&logoColor=white" /></a>
</p>
<p align="center">
  <a href="#"><img alt="NPM" src="https://img.shields.io/badge/NPM-%23CB3837.svg?logo=npm&logoColor=white" /></a>
  <a href="#"><img alt="React" src="https://img.shields.io/badge/react-%2320232a.svg?logo=react&logoColor=%2361DAFB" /></a>
  <a href="#"><img alt="SCSS" src="https://img.shields.io/badge/SASS-hotpink.svg?logo=SASS&logoColor=white" /></a>
</p>
<p align="center">
  <a href="#"><img alt="HTML" src="https://img.shields.io/badge/HTML-%23E34F26.svg?logo=html5&logoColor=white" /></a>
  <a href="#"><img alt="CSS" src="https://img.shields.io/badge/CSS-1572B6?logo=css3&logoColor=fff" /></a>
  <a href="#"><img alt="JavaScript" src="https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=000" /></a>
</p>
<p align="center">
  <a href="#"><img alt="Python" src="https://img.shields.io/badge/Python-3776AB?logo=python&logoColor=fff" /></a>
</p>


This project is for helping the **RPUK SA Park Rangers** with their bills system to help efficiently work out the bills and save time.

**RPUK** = GTA V FiveM Roleplay Server [ROLEPLAY UK](https://www.roleplay.co.uk)

## Table of Contents

- [Table of Contents](#table-of-contents)
- [About the Project](#about-the-project)
  - [There are three sections:](#there-are-three-sections)
  - [The helper works by doing this:](#the-helper-works-by-doing-this)
  - [Website Version (Using React)](#website-version-using-react)
    - [What it includes:](#what-it-includes)
    - [TO-DO:](#to-do)
  - [EXE Version](#exe-version)
  - [OLD Website Version](#old-website-version)
    - [What it includes:](#what-it-includes-1)


## About the Project

### There are three sections:

1) **The Website Version (React)** ([LINK](https://git.finnley.co.uk/rpuk-park-ranger-bills/))
2) **And the EXE Version**
3) **The Old Website Version**

### The helper works by doing this:

1) A High rank uses the in-game computer to look at the bills log
2) They select all of the text in the bills log and either:
    1) Puts each page into a text file and then copy the entire text file
    2) Puts each page into the input of either section one-by-one
3) The helper generates the total bill for each person, and can even work out what items and amounts caused the bill 
4) The High rank then puts the generated output and pastes it into the high-rank google spreadsheet
5) By pasted the generated output of the name and bill, the sheet also gets days active and contact number
6) The High rank then mass-selects and copies all the Names, Bills, Days active, and Contact number, to paste into another helper input
7) After generating with that input, the helper with provide a contact number for each person, along with a custom message to send to them that can include their name and bill


### Website Version (Using React)

The Website Version can be found [here](https://git.finnley.co.uk/rpuk-park-ranger-bills/).

#### What it includes:

- Left
  - A small box with two tabs (TOP):
    - Log Input tab: inputting the bill data and copying the output
    - Sheet Input tab: inputting the google sheet data (Name, Bill, Days active, Contact number)
  - A small box for changing the custom message that gets generated for each person (BOTTOM)
- Middle
  - A big box that displays each person with information such as:
    - Whether they are a Ranger
    - Name
    - Bill amount
    - *ONCE GIVEN SHEET INPUT AND GENERATED:*
      - Contact Number button that copies to clipboard
      - Custom Message button that copies to clipboard
    - Dropdown of:
      - Each Logged Item:
        - Item Name
        - Item Taken Quantity
        - Item Given Quantity
        - Item Net Quantity
        - Item Net Cost

**Each box also includes a tooltip icon that tells you what the box does and how to use it.**

#### TO-DO:

- [x] <s>Create Program</s>
- [x] <s>Convert to static website</s>
- [x] <s>Add individual item bill costs in dropdown for each person</s>
- [x] <s>Make last copied number/message stand out to remember place in list</s>
- [x] <s>Show if person is Ranger</s>
- [x] <s>Add multiplier to bullets for non-rangers **(CURRENTLY DEACTIVATED)**</s>
- [x] <s>Fix info box cutting off information past 200px and all boxes open at same speed no matter the height</s>
- [x] <s>Show total items in and total items out each item separately</s>
- [x] <s>Show items returned in the bill log even if none were taken out</s>
- [x] <s>Add information tooltips to each small box</s>s>
- [x] <s>Redesign Website</s>
- [x] <s>Copying Item Information should paste as: -5 | +3 | -2 - £10,000</s>
- [x] <s>Add other features for Joe</s>
- [x] <s>Convert Website to React</s>
- [x] <s>Convert regular CSS to SCSS</s>
- [ ] COMMENT CODE
- [ ] Add Error logs
- [ ] Add "Person not found" error to sheet input box
- [ ] Make mini-game about... person
- [ ] Make Website Design Responsive

### EXE Version

> [!WARNING]
> This version is no longer maintained, please use the Website Version for updates.

The EXE version of the helper is made in python and then compiled using `python-to-exe`.

In the release, you will see a zip files with EXE files and instructions, read that and it will help you generate the files needed for the program to work.

### OLD Website Version

> [!WARNING]
> This version is no longer maintained, please use the New Website Version for updates.

#### What it includes:

- Left
  - A small box with two tabs (TOP):
    - Log Input tab: inputting the bill data and copying the output
    - Sheet Input tab: inputting the google sheet data (Name, Bill, Days active, Contact number)
  - A small box for changing the custom message that gets generated for each person (BOTTOM)
- Middle
  - A big box that displays each person with information such as:
    - Whether they are a Ranger
    - Name
    - Bill amount
    - *ONCE GIVEN SHEET INPUT AND GENERATED:*
      - Contact Number button that copies to clipboard
      - Custom Message button that copies to clipboard
    - Dropdown of:
      - Each Logged Item:
        - Item Name
        - Item Taken Quantity
        - Item Given Quantity
        - Item Net Quantity
        - Item Net Cost

**Each box also includes a tooltip icon that tells you what the box does and how to use it.**
