# CodeGuard PR Review by ChatGPT

CodeGuard PR Review is an open-source project that provides reliable and efficient code reviews for your pull requests. It leverages the power of OpenAI's ChatGPT Plus, making it easy to use without worrying about the limitations of the free version.

## Features

- Quickly identify potential issues in pull requests, saving you time and effort.
- Easy to use and integrate into your workflow.
- Utilizes advanced natural language processing technology to provide unique and innovative solutions.
- Comprehensive coverage of potential issues to ensure that pull requests are thoroughly reviewed.

## Limitations

- The action is only available to paid users of ChatGPT Plus.
- The action may generate misleading comments that could confuse your contributors.

## Usage

This GitHub action can be used to perform code reviews on pull requests using ChatGPT Plus, an AI language model by OpenAI, available exclusively to paid users.

To use this action, you need to be a paid user of ChatGPT Plus and create a new workflow in your GitHub repository and add the following YAML code:

```yml
on: [pull_request]

name: Test ChatGPT Plus

jobs:
  codeguard:
    runs-on: ubuntu-latest
    name: ChatGPT Plus review PR
    steps:
      - name: ChatGPT Plus review PR
        uses: mzbac/codeguard-gpt-action@0.0.5
        with:
          number: ${{ github.event.pull_request.number }}
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
          CODEGUARD_COMMENT_BY_LINE: true
```

The action will be triggered every time a pull request is opened or updated.

Note that you need to define the following secrets in your GitHub repository:

- `OPENAI_API_KEY`: The cookies required to access the OpenAI API.

You can also set the `CODEGUARD_COMMENT_BY_LINE` environment variable to true if you want ChatGPT to comment on a specific line of code.
This will trigger the action every time a pull request is opened or updated, and will provide a thorough review of the pull request using the advanced natural language processing technology of OpenAI's ChatGPT.

For more information on how to use and configure the action, please refer to the official documentation.
