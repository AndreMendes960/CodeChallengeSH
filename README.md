# CodeChallengeSH

This project was developed for the Sword Health Code Challenge.



This application was built using React with Typescript and Node.js with Express.js and sequelize for the ORM. The database used during development was PostgreSQL, but in theory the ORM should support every dialect.

Some components where built using Prime React in order to save some time during development, but also deliver a rich UI, while sacrificing some customization.

Before local installation, it is important to have Node.js installed, The version was 20.16.0, previous versions might not work
Steps for a local installation:
Frontend:

1 - Access the frontend directory frontend/react-ts
2 - run npm install to install all dependencies
3 - run npm run dev

After this, the app should be accessible at http://localhost:5173/. For some configuration, change config.tsx in the source directory

Backend:

1 - Access the backend directory at backend/database
2 - In backend/database/config there are 2 files. config.js uses .env variables to configure database access, and it is the file used while running the app. But for migrations, sequelize needs the config.json file. So temporarily fill the database data in config.json
3 - run npx sequelize-cli db:migrate in backend/database to run the migrations
4 - after running the migrations, remove any secrets or passwords from config.json
5 - access backend/
6 - run npm install to install all dependencies
7 - place the .env file and variables, an example will be added at the end of this file
8 - run node index.js
9 - The server should be running in http://localhost:3001


The app features a register and login features for normal and admin users. All non authenticated users can visit the homepage, where the list of records is visible, and access each book record individually, however they must be logged in to place a reservation.
To create an admin, all that is needed is to create a new row in the Admin table linking to the User table via id. Even though the data is the same and Admin could be a new column in the Users table, for organization and scalability purposes, as well as good practices, I decided to separate them.

The admins have access to the administration page, where they can also see book list and can access them to edit some relevant fields. I had some trouble deciding what fields should be shown to the users and editable by the admins, and ended up going with the ones I found most important and less redundant. The list contained in this administration page is very different from the one present in the home page, and features a different type of search and filter method

