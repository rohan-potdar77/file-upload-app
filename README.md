- Steps for backend setup: inside backend folder
- Node Js version - v20.11.0

1. create .env file in backend folder 
2. define these environment variables in .env file

- TOKEN_EXPIRATION="30m"
- REFRESH_THRESHOLD_IN_MIN="5"
- TOKEN_SECRET="23587657348"
- PORT="4000"
- DATABASE="mongodb://localhost:27017/FileUpload"

3. run command "npm install" to install dependencies.
4. run command "node index.js" or can use nodemon script with index.js

- Steps for frontend setup: inside frontend folder

1. run command "npm install" to install dependencies.
2. run command "npm run dev" to start the app.
3. In browser go to url - "http://localhost:5173/"