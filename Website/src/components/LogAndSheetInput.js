import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/free-regular-svg-icons";
import TooltipIcon, { logInputTooltipText, sheetInputTooltipText, sheetOutputTooltipText } from "./Tooltips";
import { processBills } from "../utils/billProcessor";
import { CClean } from '../utils/cleanClassNames';
// import { addTestData } from "../utils/addTestData"; // Comment on Build and Push

const LogAndSheetInput = ({ onGenerateBills, onGenerateBillButtons, currentStep, setCurrentStep }) => {
    const [activeTab, setActiveTab] = useState("log");
    const [outputText, setOutputText] = useState("");
    const [logInputGenerateBtnText, setLogInputGenerateBtnText] = useState("Generate");
    const [logInputGenerateBtnStatus, setLogInputGenerateBtnStatus] = useState("");
    const [copyOutputBtnText, setCopyOutputBtnText] = useState("Output");
    const [copyOutputBtnStatus, setCopyOutputBtnStatus] = useState("");
    const [copyOutputBtnScale, setCopyOutputBtnScale] = useState(0.1);
    const [sheetInputGenerateBtnText, setSheetInputGenerateBtnText] = useState("Generate");
    const [sheetInputGenerateBtnStatus, setSheetInputGenerateBtnStatus] = useState("");


    // Comment on Build and Push
    // useEffect(() => {
    //     addTestData();
    // }, []);


    function changeBtnStatus(setBtnText, newBtnText, oldBtnText, setBtnStatus, newStatus) {
        setBtnText(newBtnText);
        setBtnStatus(newStatus);

        setTimeout(() => {
            setBtnText(oldBtnText);
            setBtnStatus("");
        }, 2500);
    }


    const generateBills = (event) => {
        const logInputGenerateBtn = event.currentTarget; 
        const result = processBills(logInputGenerateBtn);

        if (result.success) {
            const bills = result.bills;
            const billsOutputText = result.billsOutputText;

            if (outputText === "") {
                setTimeout(() => {
                    setCopyOutputBtnScale("")
                }, 10);
            }
            setOutputText(billsOutputText);
            setCurrentStep(2);

            onGenerateBills(bills);

            // Deals with effects for Generate Button
            if (logInputGenerateBtnText !== "Generated") {
                changeBtnStatus(setLogInputGenerateBtnText, "Generated", "Generate", setLogInputGenerateBtnStatus, "success");
            }
        } else if (result.message !== "") {
            changeBtnStatus(setLogInputGenerateBtnText, result.message, "Generate", setLogInputGenerateBtnStatus, "error")
        }
    };


    const copySheetOutput = (event) => {
        const logInputCopyOutputBtn = event.currentTarget;
        const sheetOutputText = logInputCopyOutputBtn.getAttribute("log-generated-output");

        if (sheetOutputText === "") {
            changeBtnStatus(setCopyOutputBtnText, "No Text To Copy".toUpperCase(), "Output", setCopyOutputBtnStatus, "error");
            return;
        };

        navigator.clipboard.writeText(sheetOutputText).then(() => {
            changeBtnStatus(setCopyOutputBtnText, "Copied!", "Output", setCopyOutputBtnStatus, "success");
        });
    }


    const generateContactButtons = () => {
        // Gets all Bill Elements and Sheet Input Text
        const listOfBills = document.getElementById("list-of-bills");

        //// ERROR HANDLERS
        // Handles no Bills in Bill List
        const billTabs = listOfBills.getElementsByClassName("bill-tab");
        if (billTabs.length === 0) {
            changeBtnStatus(setSheetInputGenerateBtnText, "NO BILLS IN LIST", "Generate", setSheetInputGenerateBtnStatus, "error");
            return;
        };

        // Handles no Text in Sheet Input Text Area
        const sheetInputText = document.querySelector("#sheet-input-tab-container .small-box-text-area").value;
        if (sheetInputText === "") {
            changeBtnStatus(setSheetInputGenerateBtnText, "NO SHEET INPUT GIVEN", "Generate", setSheetInputGenerateBtnStatus, "error");
            return;
        };
        
        // Handles no Sample Message in Box
        const sampleMessageText = document.getElementById("sample-message-text-area").value;
        if (sampleMessageText === "") {
            changeBtnStatus(setSheetInputGenerateBtnText, "NO SAMPLE MESSAGE", "Generate", setSheetInputGenerateBtnStatus, "error");
            return;
        };

        const lines = sheetInputText.split("\n");
        let billContacts = [];
        lines.forEach(line => {
            // Splits data into 4 variables and removes 3rd value
            // e.g. ['Aaron Gorton', '£9,200', '304', '352-2053']
            const datalist = line.trim().split("\t");
            let [name, bill, , number] = datalist;
            if (name !== "Hunting Shack") {
                billContacts.push({Name: name, Bill: bill, Number: number});
            }
        });

        onGenerateBillButtons([billContacts, sampleMessageText]);

        changeBtnStatus(setSheetInputGenerateBtnText, "Generated", "Generate", setSheetInputGenerateBtnStatus, "success");

        setCurrentStep(3);
    }


    return (
        <div className="top-box box">
            <div className="box-option-btns-container">
                <div 
                    className={CClean(`
                        box-option-btn 
                        ${activeTab === "log" ? "active" : ""} 
                        ${currentStep === 1 ? "current-step" : ""}
                    `)}
                    id="log-input-tab-btn"
                    onClick={() => setActiveTab("log")}
                >
                    Logs Input
                    <TooltipIcon tooltipText={logInputTooltipText} />
                </div>
                <div 
                    className={CClean(`
                        box-option-btn
                        ${activeTab === "sheet" ? "active" : ""}
                        ${currentStep === 2 ? "current-step" : ""}
                    `)}
                    id="sheet-input-tab-btn"
                    onClick={() => setActiveTab("sheet")}
                >
                    Sheet Input
                    <TooltipIcon tooltipText={sheetInputTooltipText} />
                </div>
            </div>
            <div className={`small-box-content-container ${activeTab === "log" ? "" : "hidden"}`} id="log-input-tab-container">
                <textarea className="small-box-text-area custom-scroll-bar" placeholder="Log Text ..." spellcheck="false"></textarea>
                <div className="small-box-action-btns">
                    <div className={`action-btn ${logInputGenerateBtnStatus}`} id="log-input-generate-btn" onClick={generateBills}>{logInputGenerateBtnText}</div>
                    <div
                        className={`action-btn secondary ${outputText === "" ? "hidden" : ""} ${copyOutputBtnStatus}`}
                        id="log-input-copy-output-btn"
                        log-generated-output={outputText}
                        onClick={copySheetOutput}
                        style={{ scale: copyOutputBtnScale }}
                    >
                        { (copyOutputBtnText === "Output") && (<FontAwesomeIcon icon={faCopy} className="fa-fw" />) }
                        {copyOutputBtnText}
                        { (copyOutputBtnText === "Output") && (<TooltipIcon tooltipText={sheetOutputTooltipText} />) }
                    </div>
                </div>
            </div>
            <div className={`small-box-content-container ${activeTab === "sheet" ? "active" : "hidden"}`} id="sheet-input-tab-container">
                <textarea className="small-box-text-area custom-scroll-bar" id="" placeholder="Sheet Name, Bill, Days active, Phone Number ..." spellcheck="false"></textarea>
                <div className="small-box-action-btns">
                    <div
                        className={`action-btn ${sheetInputGenerateBtnStatus}`}
                        id="sheet-input-generate-btn"
                        onClick={generateContactButtons}
                    >{sheetInputGenerateBtnText}</div>
                </div>
            </div>
        </div>
    );
};

export default LogAndSheetInput;