"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.processSuggestions = exports.postCommentToPR = exports.addCommentToPR = exports.getRawFileContent = void 0;
/* eslint-disable sort-imports */
const core = __importStar(require("@actions/core"));
const node_fetch_1 = __importDefault(require("node-fetch"));
const utils_1 = require("./utils");
function getRawFileContent(url) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield (0, node_fetch_1.default)(url);
            const text = yield response.text();
            return text;
        }
        catch (error) {
            core.error(JSON.stringify(error));
        }
    });
}
exports.getRawFileContent = getRawFileContent;
function addCommentToPR(owner, repo, pullNumber, filePath, comment, commitId, line, octokit) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield octokit.request('POST /repos/{owner}/{repo}/pulls/{pull_number}/comments', {
                owner,
                repo,
                pull_number: pullNumber,
                body: comment,
                path: filePath,
                line,
                side: 'RIGHT',
                commit_id: commitId
            });
        }
        catch (error) {
            core.error(JSON.stringify(error, null, 2));
        }
    });
}
exports.addCommentToPR = addCommentToPR;
function postCommentToPR(owner, repo, pullNumber, comment, octokit) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield octokit.request('POST /repos/{owner}/{repo}/issues/{issue_number}/comments', {
                owner,
                repo,
                issue_number: pullNumber,
                body: comment
            });
            core.debug(`Comment posted successfully: ${result.data.html_url}`);
        }
        catch (error) {
            core.error(`Failed to post comment: ${error}`);
        }
    });
}
exports.postCommentToPR = postCommentToPR;
function processSuggestions(file, suggestions, owner, repo, pullNumber, octokit, changedLines) {
    return __awaiter(this, void 0, void 0, function* () {
        for (const line in suggestions) {
            if (changedLines.some(({ start, end }) => start <= Number(line) && Number(line) <= end)) {
                yield addCommentToPR(owner, repo, pullNumber, file.filename, `
### Line ${line}
## CodeGuard Suggestions
**Suggestion:** ${suggestions[line].suggestion}
**Reason:** ${suggestions[line].reason}\n
`, (0, utils_1.extractCommitHash)(file.raw_url), Number(line), octokit);
            }
        }
    });
}
exports.processSuggestions = processSuggestions;
