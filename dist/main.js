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
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable sort-imports */
const core = __importStar(require("@actions/core"));
const action_1 = require("@octokit/action");
const openai_1 = require("openai");
const client_1 = require("./client");
const chatgptClient_1 = require("./chatgptClient");
const prompt_1 = require("./prompt");
const utils_1 = require("./utils");
const octokit = new action_1.Octokit();
const configuration = new openai_1.Configuration({
    apiKey: process.env.OPENAI_API_KEY
});
const openai = new openai_1.OpenAIApi(configuration);
function run() {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // const extensions = core.getInput('extensions').split(',')
            //
            // const pullNumber = parseInt(core.getInput('number'))
            const extensions = ['ts'];
            const pullNumber = 2;
            const [owner, repo] = process.env.GITHUB_REPOSITORY.split('/');
            const files = yield octokit.request(`GET /repos/${owner}/${repo}/pulls/${pullNumber}/files`);
            for (const file of files.data) {
                const extension = file.filename.split('.').pop();
                if (extensions.includes(extension)) {
                    const text = yield (0, client_1.getRawFileContent)(file.raw_url);
                    const textWithLineNumber = (0, utils_1.addLineNumbers)(text);
                    if (process.env.CODEGUARD_COMMENT_BY_LINE) {
                        const changedLines = (0, utils_1.getChangedLineNumbers)(file.patch);
                        const suggestions = yield (0, chatgptClient_1.getSuggestions)(textWithLineNumber, changedLines);
                        (0, utils_1.validateSuggestions)(suggestions);
                        yield (0, client_1.processSuggestions)(file, suggestions, owner, repo, pullNumber, octokit, changedLines);
                    }
                    else {
                        const response = yield openai.createCompletion({
                            model: 'text-davinci-003',
                            max_tokens: 2048,
                            prompt: (0, prompt_1.promptForText)(file.filename, textWithLineNumber)
                        });
                        yield (0, client_1.postCommentToPR)(owner, repo, pullNumber, (_a = response.data.choices[0].text) !== null && _a !== void 0 ? _a : '', octokit);
                    }
                }
            }
        }
        catch (error) {
            if (error instanceof Error)
                core.debug(error.message);
        }
    });
}
run();
