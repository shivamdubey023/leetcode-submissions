const simpleGit = require('simple-git');
const path = require('path');
const fs = require('fs');

const rootDir = path.join(__dirname, '..');
const git = simpleGit(rootDir);

async function pushToGit(submission) {
    try {
        const gitDir = path.join(rootDir, '.git');
        if (!fs.existsSync(gitDir)) {
            console.log('Git repository not initialized in workspace. Skipping Git push.');
            return;
        }

        console.log('Adding files to Git...');
        await git.add('.');

        const commitMsg = `Auto-Sync: ${submission.title} - ${submission.difficulty || ''}`;
        console.log(`Committing: "${commitMsg}"`);
        
        // Ensure there are changes to commit
        const status = await git.status();
        if (status.staged.length > 0 || status.modified.length > 0 || status.not_added.length > 0 || status.deleted.length > 0) {
            await git.commit(commitMsg);
        } else {
            console.log('No new changes to commit.');
        }

        console.log('Pushing to remote...');
        // Rename branch to main if it is master or something else
        await git.branch(['-M', 'main']);
        // Push and set upstream
        await git.push(['-u', 'origin', 'main']);
        
        console.log('Git push successful!');
    } catch (err) {
        console.error('Git operation failed:', err);
    }
}

async function initAndSetRemote(repoUrl) {
    try {
        const gitDir = path.join(rootDir, '.git');
        if (!fs.existsSync(gitDir)) {
            console.log('Initializing Git repository locally...');
            await git.init();
        }

        console.log('Setting remote origin to:', repoUrl);
        // Remove origin if it exists to avoid errors
        const remotes = await git.getRemotes();
        if (remotes.some(remote => remote.name === 'origin')) {
            await git.removeRemote('origin');
        }
        
        await git.addRemote('origin', repoUrl);
        
        // Rename branch to main just in case
        await git.branch(['-M', 'main']);

        console.log('Git remote linked successfully!');
        return { success: true };
    } catch (err) {
        console.error('Failed to link Git repo:', err);
        return { success: false, error: err.message };
    }
}

module.exports = {
    pushToGit,
    initAndSetRemote
};
