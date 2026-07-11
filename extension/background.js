console.log("LeetSync Background Started");

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === "PROCESS_SUBMISSION") {
        const submission = request.payload;
        console.log("Received submission in background:", submission);

        // Send to local server
        fetch('http://localhost:4000/save', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(submission)
        })
        .then(response => response.json())
        .then(data => {
            console.log("Server response:", data);
        })
        .catch(error => {
            console.error("Error sending submission to server:", error);
        });
    }
});