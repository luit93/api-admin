# api-admin

This is part of the eshop system. THis is the backend API for admin cms,

## How to run

-clone the project and go inside root folder

- run `nmp install`
- run `npm run dev`, please run `npm i nodemon` if you already don't have the nodemon installed

## APIS

All the API will follow the following path
`${rootUrl}/api/v1` ie http://localhost

### User API

All user API will follow the following endpoint `${rootUrl}/api/v1`
|# | API | METHOD | DESCRIPTION|
|---|---- |--------|------------|
|1|`/` |POST|Expects the user info object and creates user inDB and returns stat message|
|2|`/email-verification` |POST|Expects the user info object and checks if the link is valid|
|---|---- |--------|------------|

### Category API

All user API will follow the following endpoint `${rootUrl}/api/v1/category`
|# | API | METHOD | DESCRIPTION|
|---|---- |--------|------------|
|1|`/category` |POST|Expects the category info object and creates category in DB and returns stat message|
|2|`/{_id}` |POST|Expects the object id and deletes if the id is valid|
|---|---- |--------|------------|

### Login API

All login API will follow the following endpoint `/`
|# | API | METHOD | DESCRIPTION|
|---|---- |--------|------------|
|1|`/category` |POST|Expects the category info object and creates category in DB and returns stat message|
|2|`/{_id}` |POST|Expects the object id and deletes if the id is valid|
|---|---- |--------|------------|
