import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { CClean } from '../utils/cleanClassNames';

export const PhoneButton = ({ number, lastNumberState }: {
    number: string;
    lastNumberState: [string, React.Dispatch<React.SetStateAction<string>>];
}) => {
    const [lastNumber, setLastNumber] = lastNumberState;
    const [numberBtnText, setNumberBtnText] = useState(number);
    const [btnScale, setBtnScale] = useState(0.1);

    useEffect(() => {
        // After 10ms, change the scale to 1
        const btnScaleTimeout = setTimeout(() => {
            setBtnScale(1);
        }, 10);

        // Cleanup function
        return () => {
            clearTimeout(btnScaleTimeout);
        };
    }, []);

    const copyNumber = (event: React.MouseEvent<HTMLDivElement>) => {
        // Stops tab triggering
        event.stopPropagation();

        // Writes to clipboard
        navigator.clipboard.writeText(number);

        if (lastNumber !== number) {
            setLastNumber(number);
        }

        // Shows copy effect on Button when used
        setNumberBtnText("COPIED");
        setTimeout(() => {
            setNumberBtnText(number);
        }, 2500);
    }

    return (
        <div className={CClean(`
                small-action-btn phone
                ${(lastNumber === number) ? "last-phone" : ""}
                ${(numberBtnText === "COPIED") ? "copied" : ""}
            `)} 
            onClick={copyNumber}
            style={{ scale: btnScale}}
        >
            { (numberBtnText === number ) && (<FontAwesomeIcon icon={faPhone} />) }
            <div className="phone-text">{numberBtnText}</div>
        </div>
    );
}


export const MessageButton = ({ name, bill, sampleMessage, lastMessageState }: {
    name: string;
    bill: string;
    sampleMessage: string;
    lastMessageState: [string, React.Dispatch<React.SetStateAction<string>>];
}) => {
    const [lastMessage, setLastMessage] = lastMessageState;
    const [messageBtnText, setMessageBtnText] = useState("Message");
    const [btnScale, setBtnScale] = useState(0.1);

    useEffect(() => {
        // After 10ms, change the scale to 1
        const btnScaleTimeout = setTimeout(() => {
            setBtnScale(1);
        }, 10);

        // Cleanup function
        return () => {
            clearTimeout(btnScaleTimeout);
        };
    }, []);

    // Modifies message to align with recipient
    const message = sampleMessage
        .replace("[FIRSTNAME]", name.split(" ")[0])
        .replace("[AMOUNT]", bill);

    const copyMessage = (event: React.MouseEvent<HTMLDivElement>) => {
        // Stops tab triggering
        event.stopPropagation();

        // Writes to clipboard
        navigator.clipboard.writeText(message);

        if (lastMessage !== message) {
            setLastMessage(message);
        }

        // Shows copy effect on Button when used
        setMessageBtnText("COPIED");
        setTimeout(() => {
            setMessageBtnText("Message");
        }, 2500);
    }

    return (
        <div className={CClean(`
                small-action-btn message
                ${(lastMessage === message) ? "last-message" : ""}
                ${(messageBtnText === "COPIED") ? "copied" : ""}
            `)}
            style={{ scale: btnScale}}
            onClick={copyMessage}
        >
            { (messageBtnText === "Message" ) && (<FontAwesomeIcon icon={faEnvelope} />) }
            <div className="message-text">{messageBtnText}</div>
        </div>
    );
}