import { useState } from 'react';
import LogAndSheetInput from './LogAndSheetInput';
import SampleMessage from './SampleMessage';
import BillList from './BillList';

const MainContainer = () => {
    const [bills, setBills] = useState([]); // State to store the bills
    const [billContacts, setBillContacts] = useState([]); // State to store the bills
    const [sampleMessage, setSampleMessage] = useState(""); // State to store the bills
    const [currentStep, setCurrentStep] = useState(1);

    // Function to update the bills state
    const handleGenerateBills = (newBills) => {
        setBills(newBills);
    };

    // Function to add buttons
    const handleGenerateBillButtons = ([newBillContacts, newSampleMessage]) => {
        setBillContacts(newBillContacts);
        setSampleMessage(newSampleMessage);
    };

    return (
        <div className="main-container">
            <div className="left-boxes-container">
                <LogAndSheetInput
                    onGenerateBills={handleGenerateBills}
                    onGenerateBillButtons={handleGenerateBillButtons}
                    currentStep={currentStep}
                    setCurrentStep={setCurrentStep}
                />
                <SampleMessage currentStep={currentStep} />
            </div>
            <div className="right-box-container">
                <BillList
                    bills={bills}
                    billContacts={billContacts}
                    sampleMessage={sampleMessage}
                    currentStep={currentStep}
                />
            </div>
        </div>
    );
};

export default MainContainer;
