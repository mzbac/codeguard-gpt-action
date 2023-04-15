"use strict";
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
exports.getSuggestions = void 0;
/* eslint-disable filenames/match-regex */
/* eslint-disable sort-imports */
const openai_1 = require("openai");
const prompt_1 = require("./prompt");
const configuration = new openai_1.Configuration({
    apiKey: process.env.OPENAI_API_KEY
});
const openai = new openai_1.OpenAIApi(configuration);
function getSuggestions(textWithLineNumber, linesToReview) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        let prompt = (0, prompt_1.promptForJson)(textWithLineNumber, linesToReview.map(({ start, end }) => `line ${start}-${end}`).join(','));
        console.log(prompt);
        const response = yield openai.createCompletion({
            model: 'text-davinci-003',
            max_tokens: 2048,
            prompt: prompt
        });
        // extract the json from the response
        const result = (_a = response.data.choices[0].text) !== null && _a !== void 0 ? _a : '';
        console.log(result);
        // console.log(JSON.parse(response.data.choices[0].text ?? ''))
        const startIndex = result.indexOf('{');
        const endIndex = result.lastIndexOf('}');
        const json = startIndex !== -1 && endIndex !== -1 && endIndex > startIndex
            ? result.substring(startIndex, endIndex + 1)
            : '';
        let suggestions;
        try {
            suggestions = JSON.parse(json);
        }
        catch (err) {
            throw new Error(`ChatGPT response is not a valid json:\n ${response.data.choices[0].text}`);
        }
        return suggestions;
    });
}
exports.getSuggestions = getSuggestions;
