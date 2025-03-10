# AuthCast

AuthCast is a URL shortening service built with Node.js, Express, and PocketBase.

## Features

- Shorten URLs
- Retrieve recent short URLs
- Count active URLs grouped by day
- Batch shorten multiple URLs

## Prerequisites

- Node.js
- PocketBase

## Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/your-username/AuthCast.git
   cd AuthCast
 2. Install dependencies:
   ```sh
   npm install
3. Set up PocketBase:
- Sign up for a free account at [PocketBase](https://pocketbase.io/).
- Create a new database and copy the URL.
- Create a new table with the following schema:
- `shortened_url` (String)
- `original_url` (String)
- `created_at` (Date)
4. Create a `.env` file in the root directory of the project and add thefollowing environment variables:
```sh
POCKETBASE_URL=your-pocketbase-url
PORT=3000
5. Start the server:
```sh
npm run start
6. Visit `http://localhost:3000` in your browser to access the application.

```
## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file details.
```
API Endpoints
POST /shorten
Create a short URL.

Request Body:
{
  "long_url": "https://example.com",
  "expiry_date": "2023-12-31T23:59:59Z" // Optional
}
Response:
{
  "short_url": "http://localhost:3000/abc123"
}

GET /stats/active
Count active URLs grouped by day.

Response:
[
  {
    "date": "2023-12-31",
    "count": 5
  }
]
GET /urls/recent
Get the last 5 created short URLs.

Response:
[
  {
    "short_url": "http://localhost:3000/abc123",
    "original_url": "https://example.com",
    "created_at": "2023-12-31T12:00:00Z"
  }
]
POST /shorten/batch
Batch shorten multiple URLs.
Request Body:
{
  "urls": [
    "https://example.com",
    "https://example.org"
  ]
}
Response:
[
  {
    "short_url": "http://localhost:3000/abc123",
    "original_url": "https://example.com",
    "created_at": "2023-12-31T12:00:00Z"
  },
  {
    "short_url": "http://localhost:3000/def456",
    "original_url": "https://example.org",
    "created_at": "2023-12-31T12:00:00Z"
  }
]
```
```