export const addTestData = () => {

    // Tab Containers
    const logInputContainer = document.getElementById("log-input-tab-container");
    const sheetInputContainer = document.getElementById("sheet-input-tab-container");

    const logInputTextArea = logInputContainer?.querySelector<HTMLTextAreaElement>(".small-box-text-area");
    if (!logInputTextArea) return

    logInputTextArea.value = ``

    const sheetInputTextArea = sheetInputContainer?.querySelector<HTMLTextAreaElement>(".small-box-text-area")
    if (!sheetInputTextArea) return;

    sheetInputTextArea.value = ``

    return ""
}