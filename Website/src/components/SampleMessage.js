import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRotate } from '@fortawesome/free-solid-svg-icons';
import TooltipIcon, { sampleMessageTooltipText } from './Tooltips';

const SampleMessage = ({ currentStep }) => {
    const initialMessage = `Hello [FIRSTNAME],

Your bill with the Park Rangers this week is: [AMOUNT]
Please contact us via dispatch to settle this.

Regards,
SA Royal Park Rangers`;

    const resetSampleMessage = (event) => {
        const sampleMessageTextArea = document.getElementById("sample-message-text-area");
        sampleMessageTextArea.value = initialMessage;

        const sampleMessageResetBtnIcon = event.currentTarget.querySelector("svg");

        sampleMessageResetBtnIcon.classList.add("spin");

        setTimeout(() => {
            sampleMessageResetBtnIcon.classList.remove("spin");
        }, 500);
    };

    return (
        <div className="bottom-box box">
            <div className={`small-box-title ${currentStep === 2 ? "current-step" : ""}`}>
                Sample Message
                <TooltipIcon tooltipText={sampleMessageTooltipText} />
            </div>
            <textarea
                className="small-box-text-area custom-scroll-bar"
                placeholder="Create Sample Message ..."
                id="sample-message-text-area"
                defaultValue={initialMessage}
            />
            <div className="small-box-action-btns">
                <div
                    className="action-btn secondary btn-grow"
                    id="sample-message-reset-btn"
                    onClick={resetSampleMessage}
                >
                    <FontAwesomeIcon icon={faRotate} />
                    Reset
                </div>
            </div>
        </div>
    );
};

export default SampleMessage;