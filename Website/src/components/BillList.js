import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
import TooltipIcon, { billListTooltipText } from './Tooltips';
import Bill from './Bill';

const BillList = ({ bills, billContacts, sampleMessage, currentStep }) => {
    const [listOfBillsPadding, setListOfBillsPadding] = useState({});
    const [lastNumber, setLastNumber] = useState("");
    const [lastMessage, setLastMessage] = useState("");
    const [allBillTabOpen, setAllBillTabsOpen] = useState(false);


    // Adjusts List of Bills for Scrollbar
    useEffect(() => {
        if (bills.length === 0) return;

        const listOfBills = document.getElementById("list-of-bills");
        // Changes Scroll Bar Padding if Scroll Bar is visible
        if (listOfBills.scrollHeight > listOfBills.clientHeight) {
            setListOfBillsPadding({paddingRight: "10px"})
        } else {
            setListOfBillsPadding({paddingRight: ""})
        }
    }, [bills]);

    const currencyFormat = new Intl.NumberFormat('en-GB', {
        style: 'currency',
        currency: 'GBP',
        minimumFractionDigits: 0, // Removes decimals
    });

    const toggleAllBills = (event) => {
        // Toggles All Bill Tabs
        setAllBillTabsOpen(!allBillTabOpen);
    };

    return (
        <div className="big-box box">
            <div className='big-box-title-container'>
                <div className={`big-box-title ${currentStep === 3 ? "current-step" : ""}`}>
                    Bill List
                    <TooltipIcon tooltipText={billListTooltipText} />
                </div>
                <div className="expand-contract-all-container" onClick={toggleAllBills}>
                    <div className="expand-contract-all-text">{allBillTabOpen ? "Hide All" : "Show All"}</div>
                    <div className={`big-box-arrow-container ${allBillTabOpen ? "open" : ""}`}>
                        <FontAwesomeIcon icon={faAngleRight} className="big-box-arrow"/>
                    </div>
                </div>
            </div>
            <div className="custom-scroll-bar" id="list-of-bills" style={listOfBillsPadding}>
            {bills.length === 0 ? (
                <div className="no-bills-message">
                    <div>No bills found</div>
                    <div>Generate a bill using the input forms</div>
                </div>
            ) : (
                bills.map((bill, index) => {
                    // Find the corresponding contact data for this bill
                    const personNameAndBill = `${bill["Name"]} - ${currencyFormat.format(bill["Bill"])}`;
                    const contactInfo = billContacts.find(
                        (contact) => `${contact["Name"]} - ${contact["Bill"]}` === personNameAndBill
                    );

                    const delay = index * 100;

                    return (
                        <Bill
                            person={bill}
                            currencyFormat={currencyFormat}
                            setListOfBillsPadding={setListOfBillsPadding}
                            contactInfo={contactInfo}
                            sampleMessage={sampleMessage}
                            lastMessageState={[lastMessage, setLastMessage]}
                            lastNumberState={[lastNumber, setLastNumber]}
                            allBillTabOpen={allBillTabOpen}
                            delay={delay}
                        />
                    )

                })
            )}
            </div>
        </div>
    );
};

export default BillList;