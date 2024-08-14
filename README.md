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

2 - In backend/database/config there are 2 files. config.js uses .env variables to configure database access, and it is the file used while running the app. But for migrations, sequelize needs the config.json file. So temporarily fill the database data in config.json and remove the config.js from that directory

3 - run npx sequelize-cli db:migrate in backend/database to run the migrations

4 - after running the migrations, remove any secrets or passwords from config.json

5 - access backend/

6 - run npm install to install all dependencies

7 - place the .env file and variables, an example will be added at the end of this file

8 - run node index.js

9 - The server should be running in http://localhost:3001


The app features an account system for normal users and administrators. Every app user must create an account in order to use the reservation features, but they do not need to be logged in for accessing the list and details of each book record. The information about user session can be found in the navbar, which can redirect the user to the login form and to the account creation form.

The authentication was built using useContext. I decided an external library like React Redux was a little overkill for this scenario, given that the authentication system was simple and straightforward. User data is stored in Local Storage, and due to this reason, security is implemented both in the frontend using this data, but because it can be tampered with, we also check if the user has permissions in every protected API endpoint.

The Home page features a list with book images. Most images have a very small resolution, and therefore are in very low quality. I decided to add some server side pagination for performance issues and because it is a good practice, even if not as usefull in this scenario. The list can also be filtered via title, authors and year, and the user needs to select "Search" in order to fetch the filtered results. I decided to implement the search feature like this because in a real scenario, we might need to decrease the amount of requests sent to the server. I wish I had more time to implement a more complete filtering and ordering system, with more usefull fields like rating, and with multiple value selection and different operators. Now, the filter function only works with a single value for each field and it is an "contains" comparison.

Selecting a book redirects the user to the book details page, where I added the information I thought relevant to the end-user. I also had some trouble deciding what some information meant, but I went with what I thought made sense. Here, a user can check if a reservation can be made on the book, which prompts the user to log in if he isn't and allows him to remove the reservation as well.

Both these pages are very responsive, with mobile access in mind, shifting the information and list around to fit the screen.

The administration page features a different list of books without the images as they seemed unecessary in this area, and that way we can speed up the page loading time. The search function also works differently, updating the list every time a new character is typed in the search bars. This can speed up the process of finding a specific record, while the administration page being inacessible to most users, not adding too much traffic to the backend and database. Each record can be edited, in a page that allows the admin to change all the fields shown to the end user, with proper error handling on both sides of the application, and the option to delete the records as well.

The user can also bulk create book records by importing the CSV clicking Create Records, which opens a modal that allows the user to select a file. Each file must be selected and submitted at a time, which is a restriction of the component chosen for this task. At the backend level, the CSV is uploaded, parsed and deleted. The CSV cannot contain any duplicate records, or the creation method will fail.

The reservation list can also be acessed via task bar by administrators. These have access to the full list of reservations in the app. These reservations can only be deleted by admins or the owner of the reservation. Also, even though there is a field, book_count, indicating that there might be possible to have more than one reservation, I decided, for the sake of this challenge, to only allow 1 reservation per book, which will make testing this feature quite easier. In case we wanted to use the book_count field, we would need a transaction to make sure book_count gets decremented by one and the new entry in the Reservations table gets created. This is made possible using the sequelize ORM.


This is the ERD of the database:

[alt text](https://github.com/AndreMendes960/CodeChallengeSH/blob/main/diagram.jpg?raw=true)
