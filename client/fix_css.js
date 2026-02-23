const fs = require('fs');
const path = require('path');

const indexCssPath = path.join(__dirname, 'src', 'index.css');
const recCssPath = path.join(__dirname, 'src', 'recommendations.css');

try {
    let indexCss = fs.readFileSync(indexCssPath, 'utf8');
    const recCss = fs.readFileSync(recCssPath, 'utf8');

    // Find the last valid CSS block before the corruption
    // The corruption started after ".no-results p { ... }"
    const marker = '.no-results p {';
    const markerIndex = indexCss.indexOf(marker);

    if (markerIndex === -1) {
        console.error('Could not find marker in index.css');
        process.exit(1);
    }

    // Find the closing brace of that block
    const closingBraceIndex = indexCss.indexOf('}', markerIndex);

    if (closingBraceIndex === -1) {
        console.error('Could not find closing brace in index.css');
        process.exit(1);
    }

    // Keep everything up to the closing brace (inclusive)
    const validCss = indexCss.substring(0, closingBraceIndex + 1);

    // Combine valid CSS with new recommendations CSS
    const newCss = validCss + '\n\n' + recCss;

    // Write back to index.css
    fs.writeFileSync(indexCssPath, newCss, 'utf8');

    console.log('Successfully fixed index.css');
} catch (err) {
    console.error('Error fixing CSS:', err);
    process.exit(1);
}
