## Node.js backend that provides functionality for the Drink Master application.


This is the server-side component of the Drink Master project, developed using the Express framework in a Node.js environment. It relies on MongoDB as its database and utilizes Cloudinary for storing images. The server offers the following functionalities:


User Authentication and Management

      Authentication and deauthentication of users: This involves processes
      for user login and logout.

      Recording user information in the database: Storing user profiles, including
      usernames and email addresses.
      
      Allowing modifications to user profiles within a user collection: This encompasses
      the ability to update user details and perform other user-related tasks.

        
Recipe Handling

      Sorting existing recipes: Implementing various methods for organizing recipes based
      on criteria such as popularity, rating, or category.

      Recipe filtering: Providing options for users to refine their recipe search based 
      on factors like ingredients, recipe category, age preferences, and more.

      Enabling users to add recipes to their favorites: Allowing users to save their
      preferred recipes to their profiles.

      Incorporating new recipes into the database: Providing functionality for  authorized
      users to include new recipes in the collection, which involves storing comprehensive 
      recipe information, ingredients, preparation steps, and possibly images.


## Used Technologies:

      Node.js: The backend server is constructed with Node.js,
      facilitating efficient execution of server-side JavaScript code.

      Express: The web application framework, Express, is harnessed to
      streamline routing, middleware implementation, and the handling 
      of HTTP requests.

      MongoDB: We employ MongoDB as a NoSQL database to both store
      and manage data, offering the advantage of flexibility and
      scalability.

      Mongoose: Mongoose functions as an Object Data Modeling (ODM)
      library tailored for MongoDB. It defines data schemas and facilitates
      interactions with the database.

      Cloudinary: Meanwhile, Cloudinary is harnessed for cloud-based 
      image storage, simplifying image management and service within
      the application. To initiate its use, follow the provided instructions.

      Swagger: Swagger is utilized to simplify the documentation of APIs,
      enhancing developers' comprehension and utilization of API endpoints.

      Postman: For testing and interacting with our APIs, we employ Postman.
      Postman is a versatile tool that allows developers to send requests
      to API endpoints, inspect responses, and automate various testing scenarios.


## API Documentation

For comprehensive API documentation and testing, you can access the [Swagger API Documentation](https://drink-master-app.onrender.com/api-docs/). Please note that the initial loading time might be extended, as the backend deployment relies on a free render.com service.


## Contributors:

- Denys Kovtun - Team Lead / Developer
  - [GitHub](https://github.com/Soundlover1984)
  - [LinkedIn](https://www.linkedin.com/in/denys-kovtun/)
- Katerina Riabukh - Developer
  - [GitHub](https://github.com/Katerina-Riabukh)
  - [LinkedIn](https://www.linkedin.com/in/katerinariabukh/)

