import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRotate } from '@fortawesome/free-solid-svg-icons';
import TooltipIcon, { sampleMessageTooltipText } from './Tooltips';

const SampleMessage = ({ currentStep }: {
    currentStep: number;
}) => {
    const initialMessage = `Hello [FIRSTNAME],

Your equipment bill with the Park Rangers this week is: [AMOUNT]

Please contact a Senior Ranger to settle.

Regards,
SA Royal Park Rangers`;

    const resetSampleMessage = (event: React.MouseEvent<HTMLDivElement>) => {
        const sampleMessageTextArea = document.getElementById("sample-message-text-area") as HTMLTextAreaElement;
        if (!sampleMessageTextArea) return;
        
        sampleMessageTextArea.value = initialMessage;

        const sampleMessageResetBtnIcon = event.currentTarget.querySelector("svg");

        sampleMessageResetBtnIcon?.classList.add("spin");

        setTimeout(() => {
            sampleMessageResetBtnIcon?.classList.remove("spin");
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