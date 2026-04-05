
const fs = require('fs');

const frContent = fs.readFileSync('src/language/fr.js', 'utf8');
const arContent = fs.readFileSync('src/language/ar.js', 'utf8');

const extractKeys = (content) => {
    const keys = new Set();
    const regex = /"(.*?)"\s*:/g;
    let match;
    while ((match = regex.exec(content)) !== null) {
        keys.add(match[1]);
    }
    const regex2 = /(\w+):\s*"/g; // For unquoted keys like "get: "يحصل","
    while ((match = regex2.exec(content)) !== null) {
        keys.add(match[1]);
    }
    return keys;
};

const frKeys = extractKeys(frContent);
const arKeys = extractKeys(arContent);

const missingInFr = [...arKeys].filter(key => !frKeys.has(key));

if (missingInFr.length > 0) {
    console.log("Keys present in ar.js but missing in fr.js:");
    missingInFr.forEach(key => console.log(`- ${key}`));
} else {
    console.log("No missing keys found in fr.js compared to ar.js.");
}

