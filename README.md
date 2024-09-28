- Steps for backend setup: Inside backend folder
- Node Js version - v20.11.0

1. Create .env file in backend folder if not present
2. Define these environment variables in .env file if not present

- TOKEN_EXPIRATION="30m"
- REFRESH_THRESHOLD_IN_MIN="5"
- TOKEN_SECRET="23587657348"
- PORT="4000"
- DATABASE="mongodb://localhost:27017/FileUpload"

3. Run command "npm install" to install dependencies
4. Run command "node index.js" or can use nodemon script with index.js

- Steps for frontend setup: Inside frontend folder

1. Run command "npm install" to install dependencies
2. Run command "npm run dev" to start the app
3. In browser go to url - "http://localhost:5173/"