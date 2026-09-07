# Google Docs Code Blocks

Add code-block formatting and basic syntax highlighting directly to Google Docs without granting an unknown third-party add-on access to your documents.

Google Docs Code Blocks is a self-owned Google Apps Script Editor add-on. It formats selected text using a monospace font, a code-block background, and language-aware syntax colors. Processing stays within Google Apps Script and does not call external APIs.

## Features

- Formats selected text as a code block
- Applies basic syntax highlighting
- Automatically detects the likely language
- Allows explicit language selection when detection is ambiguous
- Removes code formatting from selected text
- Uses no analytics, advertisements, tracking, or external services
- Requests access only to the current Google document

## Supported languages

- JavaScript
- TypeScript
- Bash / Shell
- PowerShell
- YAML
- JSON
- HTTP
- Markdown
- Python
- PHP
- Go
- Swift
- Kotlin
- C
- C++
- C#
- SQL
- Dockerfile
- Makefile

## How to use

1. Open a Google Doc.
2. Select the code you want to format.
3. Open the **Code Block** menu.
4. Select **Auto-detect and highlight**.
5. If automatic detection is incorrect, select **Code Block → Highlight as language**, then choose the language.
6. To undo the code styling, select the formatted text and choose **Code Block → Remove code formatting**.

> Do not run `onOpen()` directly from the Apps Script editor. The function requires an active Google Docs user-interface context. Open or refresh a Google Doc instead.

## Example

Before formatting:

```javascript
async function getGreeting(name) {
  const greeting = `Hello, ${name}`;
  console.log(greeting);
  return greeting;
}
```

After selecting the code and running the add-on, Google Docs applies:

- Roboto Mono
- 10-point text
- Light code-block background
- Keyword, string, comment, variable, property, and number colors

## Repository contents

```text
.
├── Code.gs
├── appsscript.json
├── IMPLEMENTATION-AND-PUBLISHING-HOWTO.md
├── PRIVACY.md
├── README.md
├── TERMS.md
└── assets
    ├── card-banner-220x140.png
    ├── icon-32.png
    ├── icon-48.png
    ├── icon-96.png
    └── icon-128.png
```

## Install for development

### 1. Create the Apps Script project

1. Open [Google Apps Script](https://script.google.com/).
2. Create a standalone project named `gdocs-codeblocks`.
3. Replace the default `Code.gs` content with the repository's `Code.gs` file.
4. Open **Project Settings**.
5. Enable **Show "appsscript.json" manifest file in editor**.
6. Replace the generated manifest with the repository's `appsscript.json` file.
7. Save the project.

### 2. Create a test deployment

1. In Apps Script, select **Deploy → Test deployments**.
2. Choose **Editor add-on** as the deployment type.
3. Add a Google Doc as the test document.
4. Select **Latest code**.
5. Save and execute the test.
6. Authorize the requested current-document permissions.
7. In the test document, select code and use the **Code Block** menu.

### 3. Test the core workflow

Verify all of the following before publishing:

- The **Code Block** menu appears after the document opens.
- Auto-detection works for representative JavaScript and Python snippets.
- Explicit language selection works for YAML and PowerShell.
- Strings and comments are not recolored as keywords.
- **Remove code formatting** restores normal document styling.
- No document content is sent to an external service.

## Publish as a Google Docs add-on

The complete publishing procedure is documented in:

[IMPLEMENTATION-AND-PUBLISHING-HOWTO.md](IMPLEMENTATION-AND-PUBLISHING-HOWTO.md)

The high-level flow is:

1. Create a standard Google Cloud project.
2. Configure the OAuth consent screen.
3. Connect the Cloud project to the Apps Script project.
4. Enable the Google Workspace Marketplace SDK.
5. Create a numbered Apps Script version, such as `1`.
6. Configure the Marketplace listing as a Docs add-on.
7. Upload the assets from `assets/`.
8. Add the privacy policy, terms, support, and setup URLs.
9. Select the desired distribution visibility.
10. Submit the listing for review and install the approved add-on.

## Marketplace listing values

### Application name

```text
Google Docs Code Blocks
```

### Category

```text
Web Development
```

### Pricing

```text
Free of charge
```

### Short description

```text
Syntax highlighting and code block formatting for Google Docs.
```

### Detailed description

```text
Google Docs Code Blocks adds code formatting and basic syntax highlighting directly to Google Docs.

It supports JavaScript, TypeScript, Bash/Shell, PowerShell, Python, YAML, JSON, HTTP, SQL, Markdown, Dockerfile, Makefile, C, C++, C#, PHP, Go, Swift, and Kotlin.

Features include automatic language detection, manual language selection, monospace styling, syntax highlighting, and removal of code formatting. Processing occurs entirely within Google Apps Script with no external APIs or third-party services.
```

### Support links

- Setup and help: <https://github.com/vinas1/gdocs-codeblocks#readme>
- Report an issue: <https://github.com/vinas1/gdocs-codeblocks/issues>
- Privacy policy: <https://github.com/vinas1/gdocs-codeblocks/blob/main/PRIVACY.md>
- Terms of service: <https://github.com/vinas1/gdocs-codeblocks/blob/main/TERMS.md>

### Post-install tip

```text
Open any Google Doc, select code, then use Code Block → Auto-detect and highlight.
```

## Permissions and privacy

The add-on is designed to use these OAuth scopes:

```text
https://www.googleapis.com/auth/documents.currentonly
https://www.googleapis.com/auth/script.container.ui
```

The add-on does not intentionally:

- Read unrelated Google Drive files
- Access Gmail
- Send document text to an external service
- Store document text in an external database
- Use analytics or advertising trackers
- Sell or share user data

See [PRIVACY.md](PRIVACY.md) for the published privacy statement.

## Updating the add-on

1. Modify `Code.gs`.
2. Test the changes with an Editor add-on test deployment.
3. Create a new immutable Apps Script version.
4. Update the Marketplace configuration to use the new numeric version.
5. Save the listing changes.
6. Submit the updated listing for review if Google requires it.
7. Verify the updated add-on in a new Google Doc.

Use numeric versions in the Marketplace configuration:

```text
1
2
3
```

Do not enter labels such as `v1` in a numeric script-version field.

## Troubleshooting

### `Cannot call DocumentApp.getUi() from this context`

`onOpen()` was run from the Apps Script editor. Open or refresh the Google Doc instead.

### The Code Block menu does not appear

- Confirm the test deployment or Marketplace installation is active.
- Confirm the project is configured as a Google Docs Editor add-on.
- Refresh the Google Doc.
- Confirm `onOpen()` exists in `Code.gs`.

### `This item contains one or more errors`

Expand the Marketplace language entry, complete every required field, and click **Done** before submitting.

### The script version is rejected

Enter the numeric Apps Script version, such as `1`, rather than `v1`.

### Automatic language detection is incorrect

Select the code and use **Code Block → Highlight as language** to choose the language explicitly.

## Security notes

- Keep `@OnlyCurrentDoc` in `Code.gs`.
- Keep OAuth scopes minimal.
- Do not add external HTTP requests unless the privacy policy and security model are updated.
- Review all code changes before creating a new deployment version.
- Do not commit credentials, OAuth client secrets, API keys, or deployment secrets to this repository.

## Limitations

- Highlighting is regex-based and is not a full compiler or parser.
- Similar languages can be difficult to distinguish automatically.
- Embedded languages, such as JavaScript inside HTML, are not parsed independently.
- Google Docs formatting APIs are slower than a dedicated code editor for very large selections.
- The add-on formats existing text. It does not provide an IDE, linting, completion, or code execution.

## Contributing

Issues and focused improvements are welcome:

<https://github.com/vinas1/gdocs-codeblocks/issues>

When proposing a language-highlighting change, include:

1. The language
2. A minimal code sample
3. The expected colors or token classes
4. The current incorrect behavior
5. Confirmation that existing languages still work

## License

No open-source license has been declared yet. Until a license file is added, all rights remain with the repository owner.
