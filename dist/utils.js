"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateSuggestions = exports.fixMultiLineSuggestions = exports.isSuggestions = exports.getChangedLineNumbers = exports.extractCommitHash = exports.addLineNumbers = void 0;
function addLineNumbers(text) {
    const lines = text.split('\n');
    let result = '';
    for (let i = 0; i < lines.length; i++) {
        result += `${i + 1}: ${lines[i]}\n`;
    }
    return result;
}
exports.addLineNumbers = addLineNumbers;
function extractCommitHash(url) {
    const regex = /\/raw\/([a-z0-9]+)\//i;
    const result = url.match(regex);
    if (result) {
        return result[1];
    }
    return null;
}
exports.extractCommitHash = extractCommitHash;
function getChangedLineNumbers(filePatch) {
    const lines = filePatch.split('\n');
    const changedLineNumbers = [];
    for (const line of lines) {
        if (line.startsWith('@@')) {
            const match = line.match(/@@ -(\d+),(\d+) \+(\d+),(\d+) @@/);
            if (match) {
                const [, , , newStart, newLength] = match;
                changedLineNumbers.push({
                    start: +newStart,
                    end: +newStart + +newLength - 1
                });
            }
        }
    }
    return changedLineNumbers;
}
exports.getChangedLineNumbers = getChangedLineNumbers;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isSuggestions(obj) {
    if (typeof obj === 'object' && obj === null) {
        return false;
    }
    for (const key in obj) {
        if (!obj.hasOwnProperty(key)) {
            continue;
        }
        const line = obj[key];
        if (typeof line !== 'object') {
            return false;
        }
        if (typeof line.suggestion !== 'string') {
            return false;
        }
        if (typeof line.reason !== 'string') {
            return false;
        }
    }
    return true;
}
exports.isSuggestions = isSuggestions;
function fixMultiLineSuggestions(suggestions) {
    const fixedSuggestions = {};
    for (const [key, suggestion] of Object.entries(suggestions)) {
        const index = key.includes('-') ? Number(key.split('-')[0]) : Number(key);
        fixedSuggestions[index] = suggestion;
    }
    return fixedSuggestions;
}
exports.fixMultiLineSuggestions = fixMultiLineSuggestions;
function validateSuggestions(suggestions) {
    if (!isSuggestions(fixMultiLineSuggestions(suggestions))) {
        throw new Error(`ChatGPT response is not of type Suggestions\n${JSON.stringify(suggestions)}`);
    }
}
exports.validateSuggestions = validateSuggestions;
