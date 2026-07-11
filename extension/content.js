console.log("🚀 LeetSync Content Script Loaded");

// Inject script into the page context
const script = document.createElement("script");
script.src = chrome.runtime.getURL("inject.js");
script.onload = () => script.remove();
(document.head || document.documentElement).appendChild(script);

// Listen for messages from the injected script
window.addEventListener("message", (event) => {
    // We only accept messages from ourselves
    if (event.source !== window) return;

    if (event.data.type && event.data.type === "LEETSYNC_SUBMISSION_ACCEPTED") {
        const submission = event.data.payload;
        console.log("📦 Received accepted submission:", submission);
        
        // Forward to background script
        chrome.runtime.sendMessage({
            type: "PROCESS_SUBMISSION",
            payload: submission
        });
    }
});