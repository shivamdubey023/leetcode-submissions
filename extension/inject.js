// LeetSync Inject Script
// This script runs in the context of the LeetCode web page.

const originalFetch = window.fetch;

let pendingSubmission = null;

window.fetch = async (...args) => {
    const url = args[0];
    let method = "GET";
    let body = null;

    if (args[1]) {
        method = args[1].method || "GET";
        body = args[1].body;
    }

    // Intercept submission POST request
    if (url && typeof url === 'string' && url.includes('/submit/') && method.toUpperCase() === 'POST') {
        try {
            const bodyObj = JSON.parse(body);
            // URL format: /problems/<slug>/submit/
            const match = url.match(/\/problems\/(.+?)\/submit/);
            if (match && bodyObj) {
                pendingSubmission = {
                    slug: match[1],
                    title: match[1].split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
                    language: bodyObj.lang,
                    code: bodyObj.typed_code
                };
                console.log('Intercepted submission for:', pendingSubmission.slug);
            }
        } catch (e) {
            console.error('Error parsing submission request', e);
        }
    }

    const response = await originalFetch(...args);

    // Intercept check GET request to see if accepted
    if (url && typeof url === 'string' && url.includes('/check/') && pendingSubmission) {
        try {
            const clone = response.clone();
            const data = await clone.json();

            if (data.state === 'SUCCESS') {
                if (data.status_msg === 'Accepted') {
                    console.log('Submission accepted! Sending to extension...', data);
                    
                    pendingSubmission.runtime = data.status_runtime;
                    pendingSubmission.memory = data.status_memory;
                    pendingSubmission.difficulty = ''; // Difficulty might need to be fetched via GraphQL if needed later

                    // Send to content script
                    window.postMessage({
                        type: "LEETSYNC_SUBMISSION_ACCEPTED",
                        payload: pendingSubmission
                    }, "*");

                    // Clear pending
                    pendingSubmission = null;
                } else if (data.state === 'SUCCESS') {
                     // Status is not accepted (e.g. Wrong Answer, TLE), clear it if you only want accepted
                     // Actually state is SUCCESS means execution finished, but it could be WA.
                     pendingSubmission = null;
                }
            }
        } catch (e) {
            console.error('Error parsing check response', e);
        }
    }

    return response;
};
