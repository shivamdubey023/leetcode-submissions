const express = require('express');
const cors = require('cors');
const { saveSubmission } = require('./save');
const { pushToGit, initAndSetRemote } = require('./git');

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

app.post('/save', async (req, res) => {
    try {
        const submission = req.body;
        
        if (!submission || !submission.title || !submission.code) {
            return res.status(400).json({ error: 'Invalid submission data' });
        }

        console.log(`Received submission for: ${submission.title}`);

        // 1. Save the file locally
        const filePath = await saveSubmission(submission);

        // 2. Commit and push to git
        await pushToGit(submission);

        res.status(200).json({ message: 'Submission saved and pushed successfully', filePath });
    } catch (error) {
        console.error('Error processing submission:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/link-repo', async (req, res) => {
    try {
        const { repoUrl } = req.body;
        if (!repoUrl) {
            return res.status(400).json({ error: 'Git URL is required' });
        }

        console.log(`Received request to link repo: ${repoUrl}`);
        const result = await initAndSetRemote(repoUrl);

        if (result.success) {
            res.status(200).json({ message: 'Repo linked successfully' });
        } else {
            res.status(500).json({ error: result.error });
        }
    } catch (error) {
        console.error('Error linking repo:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(PORT, () => {
    console.log(`LeetCode Auto-Sync server running on http://localhost:${PORT}`);
});
