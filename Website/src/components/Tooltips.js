import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleQuestion } from '@fortawesome/free-solid-svg-icons';


//// Reusable TooltipIcon component \\\\
const TooltipIcon = ({ tooltipText }) => {
    return (
        <div className="tooltip-container">
            <FontAwesomeIcon icon={faCircleQuestion} className="help-tooltip" />
            <span className="help-tooltip-text small-help-tooltip-text-right">
                {tooltipText}
            </span>
        </div>
    );
};


//// Tooltip texts \\\\
// Log Input
export const logInputTooltipText = (
    <>
        This <b>Log Text Input box</b> is where you put the information you get from the <b>in-game computer</b>.
        <br /><br />
        You can either copy and paste the data multiple times (depending on amount of pages) or just paste it
        all into a text file and then paste it here.
    </>
);

// Sheet Input
export const sheetInputTooltipText = (
    <>
        This <b>Sheet Input box</b> is where you put information from the <b>Senior+ Google Sheet</b>.
        <br /><br />
        After pasting the <b>Output For Sheet box</b> content into the <b>Google Sheet</b>, you then
        <b>copy</b> the same data, <b>along</b> with the next <b>two</b> columns of automatically
        generated data here.
        <br /><br />
        So <b>you should have the columns</b>; <b>Name</b>, <b>Bill</b>,
        <b>Days active</b>, and <b>Phone Number</b> for the information you already pasted.
    </>
);

// Sheet Output
export const sheetOutputTooltipText = (
    <>
        This <b>Output For Sheet box</b> is where the generated bill output for the <b>Senior+ Google Sheet</b> goes.
        <br /><br />
        Once the bills have been properly generated from the <b>Log Text Input box</b>, you just need to press the
        <b>Copy button</b> and paste the output into the <b>Google Sheet</b>.
    </>
);

// Sample Message
export const sampleMessageTooltipText = (
    <>
        This <b>Sample Message box</b> is where the <b>custom message</b> that is sent to all <b>bill recipients</b> is set.
        <br /><br />
        You can modify the message to however you want and <b>reset</b> it back to its
        original state if needed.
        <br /><br />
        <b>Custom Attributes:</b><br />
        - [FIRSTNAME] -{'>'} Recipient's first name<br />
        - [AMOUNT] -{'>'} Recipient's bill
        <br /><br />
        Contact <b>mrbuushy</b> on discord to add more.
    </>
);

// Bill List
export const billListTooltipText = (
    <>
        This <b>Bill List box</b> is where all the generated bill information <b>appears</b>.
        <br /><br />
        Once generating the bills from the <b>Log Text Input box</b>, each <b>bill recipient</b> will show here
        <b>as a tab</b> with their <b>name</b> and <b>bill amount</b>. You can <b>expand</b> each tab to show <b>every item</b> they have
        taken <b>in or out</b> of the <b>armoury</b>, along with the <b>quantity</b> and <b>bill change</b> for each.
        <br /><br />
        After you have <b>generated the messages</b> from <b>the Sheet Input box</b>, each <b>tab</b> will gain <b>two buttons</b>.
        One button will be labelled as <b>the recipient's phone number</b>, and the other would be labelled
        as <b>"Message"</b>. You can <b>click</b> the phone number button to <b>copy</b> the recipient's phone number, and
        <b>click</b> the message button to <b>copy</b> the customized message for that recipient.
    </>
);

// Export the TooltipIcon component and tooltip texts
export default TooltipIcon;