# Best Todo App
## Description
This app is in development mode and is not ready for use.
## Configuration
1. Create .env.development file in root directory
2. Fill up the .env.development, use .env template
   ` .env.development example`:
 ```
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=postgres
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_DB=test
```
4. Go to ./database and run `docker-compose up`
5. Go to ./backend and run `npm i` and `npm run start:dev`
6. Go to ./frontend and run `yarn i` and `yarn run dev`