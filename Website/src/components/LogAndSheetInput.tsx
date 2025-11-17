import { useRef, useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/free-regular-svg-icons";

import TooltipIcon, { logInputTooltipText, sheetInputTooltipText, sheetOutputTooltipText } from "./Tooltips";
import { processBills } from "../utils/billProcessor";
import { CClean } from '../utils/cleanClassNames';

import type { ProcessBill } from "../types/billProcessorTypes"
import type { BillContact } from "../types/billContactTypes"
// import { addTestData } from "../utils/addTestData"; // Comment on Build and Push
void useEffect;

type LogAndSheetInputProps = {
    onGenerateBills: (bills: ProcessBill[]) => void;
    onGenerateBillButtons: (data: [BillContact[], string]) => void;
    currentStep: number;
    setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
};

const LogAndSheetInput = ({ onGenerateBills, onGenerateBillButtons, currentStep, setCurrentStep }: LogAndSheetInputProps) => {
    const [activeTab, setActiveTab] = useState("log");
    const [outputText, setOutputText] = useState("");
    
    const [logInputGenerateBtnText, setLogInputGenerateBtnText] = useState("Generate");
    const [logInputGenerateBtnStatus, setLogInputGenerateBtnStatus] = useState("");
    
    const [copyOutputBtnText, setCopyOutputBtnText] = useState("Output");
    const [copyOutputBtnStatus, setCopyOutputBtnStatus] = useState("");
    const [copyOutputBtnScale, setCopyOutputBtnScale] = useState(0.1);
    
    const [sheetInputGenerateBtnText, setSheetInputGenerateBtnText] = useState("Generate");
    const [sheetInputGenerateBtnStatus, setSheetInputGenerateBtnStatus] = useState("");
    
    const sheetInputRef = useRef<HTMLTextAreaElement>(null);
    

    // // Comment on Build and Push
    // useEffect(() => {
    //     addTestData();
    // }, []);


    function changeBtnStatus(
        setBtnText: React.Dispatch<React.SetStateAction<string>>,
        newBtnText: string,
        oldBtnText: string,
        setBtnStatus: React.Dispatch<React.SetStateAction<string>>,
        newStatus: string
    ) {
        setBtnText(newBtnText);
        setBtnStatus(newStatus);

        setTimeout(() => {
            setBtnText(oldBtnText);
            setBtnStatus("");
        }, 2500);
    }


    const generateBills = (event: React.MouseEvent<HTMLDivElement>) => {
        const logInputGenerateBtn = event.currentTarget; 
        const result = processBills(logInputGenerateBtn);

        if (result.success && result.billsOutputText && result.bills) {
            const bills = result.bills;
            const billsOutputText = result.billsOutputText;

            if (outputText === "") {
                setTimeout(() => {
                    setCopyOutputBtnScale(1)
                }, 10);
            }
            setOutputText(billsOutputText);
            setCurrentStep(2);

            onGenerateBills(bills);

            // Deals with effects for Generate Button
            if (logInputGenerateBtnText !== "Generated") {
                changeBtnStatus(setLogInputGenerateBtnText, "Generated", "Generate", setLogInputGenerateBtnStatus, "success");
            }
        } else if (result.message && result.message !== "") {
            changeBtnStatus(setLogInputGenerateBtnText, result.message, "Generate", setLogInputGenerateBtnStatus, "error")
        }
    };


    const copySheetOutput = (event: React.MouseEvent<HTMLDivElement>) => {
        const logInputCopyOutputBtn = event.currentTarget;
        const sheetOutputText = logInputCopyOutputBtn.getAttribute("log-generated-output");

        if (sheetOutputText === "" || sheetOutputText === null) {
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
        if (listOfBills === null) return;

        /// ERROR HANDLERS
        // Handles no Bills in Bill List
        const billTabs = listOfBills.getElementsByClassName("bill-tab");
        if (billTabs.length === 0) {
            changeBtnStatus(setSheetInputGenerateBtnText, "NO BILLS IN LIST", "Generate", setSheetInputGenerateBtnStatus, "error");
            return;
        };

        // Handles no Text in Sheet Input Text Area
        const sheetInputText = sheetInputRef.current?.value || "";
        if (sheetInputText === "") {
            changeBtnStatus(setSheetInputGenerateBtnText, "NO SHEET INPUT GIVEN", "Generate", setSheetInputGenerateBtnStatus, "error");
            return;
        };
        
        // Handles no Sample Message in Box
        const sampleMessageText = (document.getElementById("sample-message-text-area") as HTMLTextAreaElement | null)?.value ?? ""
        if (sampleMessageText === "") {
            changeBtnStatus(setSheetInputGenerateBtnText, "NO SAMPLE MESSAGE", "Generate", setSheetInputGenerateBtnStatus, "error");
            return;
        };

        const lines = sheetInputText.split("\n");
        const billContacts: BillContact[] = [];
        lines.forEach(line => {
            // Splits data into 4 variables and removes 3rd value
            // e.g. ['Aaron Gorton', '£9,200', '304', '352-2053']
            const datalist = line.trim().split("\t");
            const [name, bill, , number] = datalist;
            if (name !== "Hunting Shack" && name !== "Jobs") {
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
                <textarea
                    className="small-box-text-area custom-scroll-bar"
                    placeholder="Log Text ..."
                    spellCheck="false"
                ></textarea>
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
            <div
                className={`small-box-content-container ${activeTab === "sheet" ? "active" : "hidden"}`}
                id="sheet-input-tab-container"
            >
                <textarea
                    ref={sheetInputRef}
                    className="small-box-text-area custom-scroll-bar"
                    placeholder="Sheet Name, Bill, Days active, Phone Number ..."
                    spellCheck="false"
                ></textarea>
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