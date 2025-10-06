# Language Upload Tool

This project is a command-line tool designed to facilitate the upload of language data from a spreadsheet to a Content Delivery Network (CDN). It allows frontend developers to easily retrieve the corresponding language data from the CDN after modifications are made in the spreadsheet.

## Features

- Upload language data from an Excel spreadsheet to a CDN.
- Automatically build and prepare language data for upload.
- Simple command-line interface for ease of use.
- Logging utility for tracking operations and debugging.

## Project Structure

```
language-upload-tool
├── src
│   ├── cli.js                # Command-line interface for the tool
│   ├── config
│   │   └── index.js          # Configuration settings (API keys, CDN URLs, etc.)
│   ├── services
│   │   ├── cdnService.js     # Functions for interacting with the CDN
│   │   └── spreadsheetService.js # Functions for reading and processing spreadsheet data
│   ├── tasks
│   │   ├── buildLocales.js    # Builds language data from the spreadsheet
│   │   └── uploadLocales.js    # Uploads built language data to the CDN
│   └── utils
│       └── logger.js          # Utility functions for logging
├── scripts
│   └── publish.js             # Script to trigger build and upload processes
├── data
│   └── sample
│       └── locales.xlsx       # Sample Excel spreadsheet with language data
├── tests
│   └── services.test.js       # Unit tests for services
├── package.json               # npm configuration file
├── README.md                  # Project documentation
└── .env.example               # Example environment variables
```

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd language-upload-tool
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file based on the `.env.example` file and fill in the required environment variables.

## Usage

To build and upload language data, run the following command:
```
node scripts/publish.js
```

## Contribution

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.# muti-language-tool-upload-to-cdn
