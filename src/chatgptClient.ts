/* eslint-disable filenames/match-regex */
/* eslint-disable sort-imports */
import {sendPostRequest} from 'chatgpt-plus-api-client'
import {promptForJson} from './prompt'
import {Suggestions} from './utils'

export async function getSuggestions(
  textWithLineNumber: string,
  linesToReview: {start: number; end: number}[]
): Promise<Suggestions> {
  const response = await sendPostRequest({
    prompt: promptForJson(
      textWithLineNumber,
      linesToReview.map(({start, end}) => `line ${start}-${end}`).join(',')
    )
  })

  // extract the json from the response
  const result = response?.message?.content?.parts[0] ?? ''
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
      `ChatGPT response is not a valid json:\n ${response.message.content.parts[0]}`
    )
  }
  return suggestions
}
