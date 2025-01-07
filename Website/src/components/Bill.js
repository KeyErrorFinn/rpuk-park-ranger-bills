import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { PhoneButton, MessageButton } from './BillButtons';

const Bill = ({ person, currencyFormat, setListOfBillsPadding, contactInfo, sampleMessage, lastMessageState, lastNumberState, delay }) => {
    const [billTabOpen, setBillTabOpen] = useState(false);
    const [billTabHeight, setBillTabHeight] = useState({});
    const [billTabInfoElement, setBillTabInfoElement] = useState(document.querySelector('.bill-tab-info'));
    const [showPhoneButton, setShowPhoneButton] = useState(false);
    const [showMessageButton, setShowMessageButton] = useState(false);
    const isFirstRender = useRef(true); // Ref to track initial render

    const personName = person["Name"];
    const personBill = person["Bill"];
    const personRangerStatus = person["IsRanger"];
    const personItems = person["Items"];

    const formattedPersonBill = currencyFormat.format(personBill);

    const personNameAndBill = `${personName} - ${formattedPersonBill}`;


    useEffect(() => {
        if (isFirstRender.current) {
            // Skip the effect on the first render
            isFirstRender.current = false;
            return;
        }

        // Gets the List of Bills
        const listOfBills = document.getElementById("list-of-bills");

        // Gets the Height variables from Bill Tab Info Scroll Height
        const billTabInfoScrollHeight = billTabInfoElement.scrollHeight;
        const fullHeight = billTabInfoScrollHeight + 5;
        const overFullHeight = billTabInfoScrollHeight + 20;

        setBillTabHeight( billTabOpen ? {
            height: fullHeight + 'px',
            maxHeight: overFullHeight + 'px'
        } : {
            height: "",
            maxHeight: overFullHeight + 'px'
        } );
 
        // Changes Scroll Bar Padding if Scroll Bar is visible
        if ((listOfBills.scrollHeight + overFullHeight) > listOfBills.clientHeight) {
            if (listOfBills.style.paddingRight !== "10px") {
                setListOfBillsPadding({paddingRight: "10px"});
            }
        } else {
            const removePaddingTimeout = setTimeout(() => {
                setListOfBillsPadding({paddingRight: ""});
            }, 300);

            // Cleanup function
            return () => {
                clearTimeout(removePaddingTimeout);
            };
        }
    }, [billTabOpen, billTabInfoElement, setListOfBillsPadding]);


    useEffect(() => {
        if (!contactInfo) return;

        // Render PhoneButton 0.1 seconds after MessageButton
        const phoneTimeout = setTimeout(() => {
            setShowPhoneButton(true);
        }, delay);

        // Render MessageButton after the specified delay
        const messageTimeout = setTimeout(() => {
            setShowMessageButton(true);
        }, delay);

        // Cleanup timeouts
        return () => {
            clearTimeout(phoneTimeout);
            clearTimeout(messageTimeout);
        };
    }, [delay, contactInfo]);


    const toggleBill = (event) => {
        // Toggles the Bill Tab Box
        setBillTabInfoElement(event.currentTarget.nextElementSibling);
        setBillTabOpen(!billTabOpen);
    };


    return (
        <div className={`bill-tab ${billTabOpen ? "open" : ""}`} name-and-bill={personNameAndBill}>
            <div className="bill-tab-header" onClick={toggleBill}>
                <div className="bill-tab-person-info">
                    { personRangerStatus && (<div className="bill-tab-ranger-tag">RANGER</div>)}
                    <div className="name-and-bill">{personNameAndBill}</div>
                </div>
                <div className="bill-btns">
                { contactInfo && (
                    <>
                    {showPhoneButton && (
                    <PhoneButton
                        number={contactInfo["Number"]}
                        lastNumberState={lastNumberState}
                    />
                    )}
                    {showMessageButton && (
                    <MessageButton
                        name={contactInfo["Name"]}
                        bill={contactInfo["Bill"]}
                        sampleMessage={sampleMessage}
                        lastMessageState={lastMessageState}
                    />
                    )}
                    </>
                )}
                </div>
                <div className="bill-tab-arrow-container">
                    <FontAwesomeIcon icon={faAngleRight} className="bill-tab-arrow"/>
                </div>
            </div>
            <div className="bill-tab-info" style={billTabHeight}>
                <div className="bill-tab-divider"></div>
                {Object.entries(personItems).map(([itemName, itemInfo], index) => {
                const takenQuantity = itemInfo["Taken"][0];
                const givenQuantity = itemInfo["Given"][0];

                const netQuantity = takenQuantity - givenQuantity;
                const netCost = itemInfo["Taken"][1]+itemInfo["Given"][1];

                const formattedNetCost = currencyFormat.format(netCost);

                const isLastItem = index === Object.entries(personItems).length - 1;
                
                return (
                <div className="bill-info-item" item-name={itemName}>
                    <div className="bill-info-item-info">
                        <div className="bill-info-item-title">{itemName.trimEnd()}</div>
                        <div className="bill-info-item-stats">
                            <div className="bill-info-item-invisible-divider"> | </div>
                            { takenQuantity > 0 && (
                            <>
                            <div className="bill-info-item-stat taken">{`-${takenQuantity}`}</div>
                            <div className="bill-info-item-invisible-divider"> | </div>
                            </>
                            ) }
                            { givenQuantity > 0 && (
                            <>
                            <div className="bill-info-item-stat given">{`+${givenQuantity}`}</div>
                            <div className="bill-info-item-invisible-divider"> | </div>
                            </>
                            ) }
                            { (takenQuantity > 0 && givenQuantity > 0) && (
                            <>
                            <div className="bill-info-item-stat net">{netQuantity < 0 ? `+${netQuantity*-1}` : (netQuantity > 0 ? `-${netQuantity}` : "0")}</div>
                            <div className="bill-info-item-invisible-divider"> - </div>
                            </>
                            ) }
                            <div className={`bill-info-item-stat net-cost ${netCost > 0 ? "positive" : (netCost < 0 ? "negative" : "neutral")}`}>{formattedNetCost}</div>
                        </div>
                    </div>
                    { !isLastItem && (<div className="bill-tab-info-divider"></div>) }
                </div>
                )})}
            </div>
        </div>
    );
};

export default React.memo(Bill);