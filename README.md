
## To run:
`npm i` to install required packages
`npm start` to launch server

### Available endpoints/features

## Articles
  #### POST `/articles` - creates article
  #### GET `/articles` - get all articles
  #### PUT `/articles/:id` - update article with :id
  #### GET `/articles/:id` - get certain article by :id
  ##### GET `/articles/:id/report` - get certain article PDF report

## Comments
  #### POST `/articles/:articleId/comments` - add a comment to article with :articleId
  #### GET `/articles/:articleId/comments` - get the list of comments for :articleId

## Users
  #### POST `/sign_up` - register new user
  #### GET `/login` - login user

## S3
  #### GET `/sign-s3` - get pre-signed url for direct AWS S3 file upload

## Other
  #### Implemented sending email via nodemailer - `utils/emails.js`
  #### Implemented jwt token authorization - all the routes except certain are protected via token
  #### on GET `/articles/:articleId/comments` implemented pagination
  #### Set up AWS S3 bucket to store public files
  #### DB is up and running on Mongodb Atlas
