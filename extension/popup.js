document.addEventListener('DOMContentLoaded', () => {
    const linkBtn = document.getElementById('linkBtn');
    const repoUrlInput = document.getElementById('repoUrl');
    const statusSpan = document.getElementById('status');

    linkBtn.addEventListener('click', async () => {
        const repoUrl = repoUrlInput.value.trim();
        
        if (!repoUrl) {
            statusSpan.innerText = "Please enter a Git URL.";
            statusSpan.style.color = "red";
            return;
        }

        statusSpan.innerText = "Linking...";
        statusSpan.style.color = "orange";
        
        try {
            const response = await fetch('http://localhost:4000/link-repo', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ repoUrl })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                statusSpan.innerText = "Repo linked successfully!";
                statusSpan.style.color = "green";
                repoUrlInput.value = "";
            } else {
                statusSpan.innerText = "Error: " + (data.error || "Failed to link");
                statusSpan.style.color = "red";
            }
        } catch (error) {
            console.error('Error linking repo:', error);
            statusSpan.innerText = "Error connecting to server.";
            statusSpan.style.color = "red";
        }
    });
});