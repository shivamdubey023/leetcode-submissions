const fs = require('fs/promises');
const path = require('path');

const languageToExtension = {
    'python3': '.py',
    'python': '.py',
    'cpp': '.cpp',
    'c': '.c',
    'java': '.java',
    'javascript': '.js',
    'typescript': '.ts',
    'csharp': '.cs',
    'ruby': '.rb',
    'swift': '.swift',
    'golang': '.go',
    'scala': '.scala',
    'kotlin': '.kt',
    'rust': '.rs',
    'php': '.php',
    'erlang': '.erl',
    'racket': '.rkt',
    'elixir': '.ex'
};

async function saveSubmission(submission) {
    // Determine file extension
    const ext = languageToExtension[submission.language] || '.txt';
    
    // Create directory for the problem if it doesn't exist
    // E.g., submissions/two-sum/
    const folderName = submission.slug || submission.title.toLowerCase().replace(/ /g, '-');
    const dirPath = path.join(__dirname, '..', 'submissions', folderName);
    
    await fs.mkdir(dirPath, { recursive: true });
    
    // Save the file
    // E.g., solution.py
    const fileName = `solution${ext}`;
    const filePath = path.join(dirPath, fileName);
    
    // Write code to file
    const extensionToComment = {
        '.py': '#',
        '.rb': '#',
        '.ex': '#',
        '.rkt': ';',
        '.erl': '%'
    };
    const commentChar = extensionToComment[ext] || '//';
    
    let content = `${commentChar} Problem: ${submission.title}\n`;
    if (submission.difficulty) {
        content += `${commentChar} Difficulty: ${submission.difficulty}\n`;
    }
    content += `\n${submission.code}`;

    await fs.writeFile(filePath, content, 'utf8');
    
    console.log(`Saved code to ${filePath}`);
    
    return filePath;
}

module.exports = {
    saveSubmission
};
