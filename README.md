# aip-favors-app

Quoc Hao Vo-Nguyen
GitHub: andrewvo89

Sean Clark
GitHub: bitcyked

Marshall Sutton
GitHub: peefeeyatko

Ding Sun
GitHub: qqqwwweee12339

### Connect to MongoDB through CLI

1. Install [MongoDB Shell](https://www.mongodb.com/try/download/shell)

2. Run command `sudo mongosh "mongodb+srv://aip-favors-app.umokf.mongodb.net/production" --username admin --password <db-password>`

### Copy .env files for Server and Client

### Client .env file structure

REACT_APP_REST_URL=http://localhost:8080

### Server .env file structure

APP_NAME=aip.favors.app
PORT=8080
DB_USER=admin
DB_PASS=xxxxxxx
DB_ADDRESS=xxxxxxx.mongodb.net
DB_NAME=production
ACCESS_TOKEN_SECRET=xxxxxxx
REFRESH_TOKEN_SECRET=xxxxxxx
ACCESS_TOKEN_EXPIRY=1 hour
REFRESH_TOKEN_EXPIRY=7 days
CLIENT_DOMAIN=http://localhost:3000
