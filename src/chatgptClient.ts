/* eslint-disable filenames/match-regex */
/* eslint-disable sort-imports */
import {Configuration, OpenAIApi} from 'openai'
import {promptForJson} from './prompt'
import {Suggestions} from './utils'

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
})
const openai = new OpenAIApi(configuration)

export async function getSuggestions(
  textWithLineNumber: string,
  linesToReview: {start: number; end: number}[]
): Promise<Suggestions> {
  const response = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: promptForJson(
      textWithLineNumber,
      linesToReview.map(({start, end}) => `line ${start}-${end}`).join(',')
    )
  })

  // extract the json from the response
  const result = response.data.choices[0].text ?? ''
  const startIndex = result.indexOf('{')
  const endIndex = result.lastIndexOf('}')
  const json =
    startIndex !== -1 && endIndex !== -1 && endIndex > startIndex
      ? result.substring(startIndex, endIndex + 1)
      : ''

  let suggestions
  try {
    suggestions = JSON.parse(json)
  } catch (err) {
    throw new Error(
      `ChatGPT response is not a valid json:\n ${response.data.choices[0].text}`
    )
  }
  return suggestions
}
