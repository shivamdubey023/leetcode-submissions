# LeetCode Auto-Sync

LeetCode Auto-Sync is a Chrome extension and local Node.js server setup that automatically saves your accepted LeetCode submissions to your local machine and pushes them to a Git repository.

## Features

- **Automatic Interception**: Automatically detects when you submit a solution on LeetCode.
- **Accepted Check**: Waits for the submission status and only saves code that gets "Accepted".
- **Local Persistence**: Saves the code in a local `submissions` directory, categorized by the problem slug.
- **Git Auto-Push**: Automatically commits and pushes the accepted solution to your Git repository.

## Architecture

The project consists of two parts:
1. **Chrome Extension (`/extension`)**: Runs in your browser. It injects a script into LeetCode to intercept the `fetch` API, extracting your submitted code and monitoring the status of the submission. Once accepted, it forwards the data to the local server.
2. **Local Server (`/server`)**: A Node.js Express server running on port `4000`. It receives the payload from the extension, writes the code to a file with the correct language extension, and executes the Git commit and push commands.

## Installation & Setup

### 1. Prerequisites
- Node.js installed on your machine.
- Git installed on your machine.
- A GitHub repository (or any Git remote) where you want to store your code.

### 2. Git Setup
Ensure the root directory of this project is initialized as a Git repository and has an upstream remote set:
```bash
git init
git remote add origin <your-repo-url>
# Push your initial setup (optional)
git add .
git commit -m "Initial commit"
git push -u origin main
```

### 3. Start the Local Server
Navigate to the `server` directory, install dependencies, and start the server:
```bash
cd server
npm install
node index.js
```
The server will start listening on `http://localhost:4000`.

### 4. Load the Chrome Extension
1. Open Google Chrome and go to `chrome://extensions/`.
2. Enable **Developer mode** in the top right corner.
3. Click on **Load unpacked** in the top left corner.
4. Select the `extension` folder from this repository.

## Usage

1. Make sure your local Node.js server is running (`node index.js`).
2. Go to [LeetCode](https://leetcode.com) and solve a problem.
3. Click **Submit**.
4. If your solution is **Accepted**, the extension will automatically send the code to your local server.
5. The local server will save the code to the `server/submissions/` folder and push it to your Git repository!

## Troubleshooting

- **Server Not Responding**: Make sure the local server is running on port `4000`. If you change the port, you must also update the URL in `extension/background.js`.
- **Git Push Fails**: Ensure you have successfully set up your remote repository (`git remote -v`) and that your machine is authenticated with Git/GitHub.
- **Submissions Not Syncing**: Open the Chrome DevTools (F12) on LeetCode and check the Console. You should see logs like `Intercepted submission for...` and `Submission accepted! Sending to extension...`.
