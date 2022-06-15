# Recipe Search APIs 

## Project Description:
Recipe Search APIs are the RESTful APIs for the [Recipe search App](https://github.com/lindazhao678/Recipe_search_app). 

They have two collections: 
- Users collection 
- Recipes collection 

The users have two types: 
- Admin user
- Regular user

The admin user can create, update, delete and read any user's data. The regular user can create, update, delete and read its own user data. 

The recipe APIs include creating, deleting, updating, and reading recipe. And all of the Recipe APIs can only be consumed by its own user.

## Project technologies:
- Build the APIs with Express.
- Store the data in mongoDB database.
- Use mongoose schema to model the data.
- Use Joi labrary for validation.
- Use Json Web Token for authentication.
- Use bcrypt library for hashing and salting passwords.
- Use winston library to create the error logs.