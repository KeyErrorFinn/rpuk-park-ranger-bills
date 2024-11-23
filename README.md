# RPUK Park Ranger Bills Helper

[![GitHub release (latest by date including pre-releases)](https://img.shields.io/github/v/release/KeyErrorFinn/rpuk-park-ranger-bills?include_prereleases)](https://img.shields.io/github/v/release/KeyErrorFinn/rpuk-park-ranger-bills?include_prereleases)
[![GitHub last commit](https://img.shields.io/github/last-commit/KeyErrorFinn/rpuk-park-ranger-bills)](https://img.shields.io/github/last-commit/KeyErrorFinn/rpuk-park-ranger-bills)
[![GitHub issues](https://img.shields.io/github/issues-raw/KeyErrorFinn/rpuk-park-ranger-bills)](https://img.shields.io/github/issues-raw/KeyErrorFinn/rpuk-park-ranger-bills)
[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-121013?logo=github&logoColor=white)](#)
[![HTML](https://img.shields.io/badge/HTML-%23E34F26.svg?logo=html5&logoColor=white)](#)
[![CSS](https://img.shields.io/badge/CSS-1572B6?logo=css3&logoColor=fff)](#)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=000)](#)
[![Python](https://img.shields.io/badge/Python-3776AB?logo=python&logoColor=fff)](#)


This project is for helping the **RPUK SA Park Rangers** with their bills system to help efficiently work out the bills and save time.
## Table of Contents
- [Table of Contents](#table-of-contents)
- [About The Project](#about-the-project)
  - [There are two sections](#there-are-two-sections)
  - [The helper works by doing this](#the-helper-works-by-doing-this)
  - [Website Version](#website-version)
    - [What it includes](#what-it-includes)
    - [TO-DO](#to-do)
  - [EXE Version](#exe-version-not-maintained)


## About the Project

### There are two sections:
1) **The Website Version** ([LINK](https://keyerrorfinn.github.io/rpuk-park-ranger-bills/))
2) **And the EXE Version**

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


### Website Version
The Website Version can be found [here](https://keyerrorfinn.github.io/rpuk-park-ranger-bills/).

#### What it includes:
- Left
  - A small box for inputing the bill data (TOP)
  - A small box for copying the generated bills (BOTTOM)
- Middle
  - A big box that displays each person with information such as:
    - Name
    - Bill amount
    - Dropdown of:
      - Items taken/given
      - Item quanitity
    - *ONCE GIVEN SHEET INPUT AND GENERATED:*
      - Contact Number button that copies to clipboard
      - Custom Message button that copies to clipboard 
- Right
  - A small box for inputting the google sheet data (Name, Bill, Days active, Contact number) (TOP)
  - A small box for changing the custom message that gets generated for each person (BOTTOM)

#### TO-DO:
- [x] <s>Create Program</s>
- [x] <s>Convert to static website</s>
- [ ] Redesign Website
- [ ] Add Error Log
- [ ] Add information tooltips to each small box
- [ ] Add "Person not found" error to sheet input box
- [ ] Add individual item bill costs in dropdown for each person

### EXE Version
> [!WARNING]
> This version is no longer maintained, please use the Website Version for updates.

The EXE version of the helper is made in python and then compiled using `python-to-exe`.

In the release, you will see a zip files with EXE files and instructions, read that and it will help you generate the files needed for the program to work.
