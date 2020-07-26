# E-Commerce-API

---

This API has been made for a small scale e commerce businesses.

## The tech stack is:

* Node.js
* MongoDB and Mongoose
* Express
* Stripe API for payments(to be added)

## Description: 

There are endpoints for Sellers, Buyers and their interaction with Products.

## Features to be added:

* Standard error messages and HTTP codes
* Support for transportation
* Payments through stripe API
* A better relationship between databases
* Cart feature for buyers

## Endpoints:

### Buyer Related:

|     Endpoint      | HTTP Method |                            Usage                             |                           Returns                            | Requires Auth | Development Status |
| :---------------: | :---------: | :----------------------------------------------------------: | :----------------------------------------------------------: | ------------- | ------------------ |
| `/buyer/register` |   `POST`    |  Accepts the name, email, password and address of the user.  |        JSON data of the user details and a JWT token.        | No            | Works              |
|    `/buyer/me`    |    `GET`    |    Call the API with required bearer JWT token in header.    | Returns the entire buyer details except private details like passwords. | Yes           | Works              |
|    `/buyer/me`    |   `PATCH`   | Call the API with required bearer JWT token in header and the details that are to be changed. | Returns the entire buyer details except private details like passwords. | Yes           | Works              |
|    `/buyer/me`    |  `DELETE`   |    Call the API with required bearer JWT token in header.    | Returns the entire buyer details except private details like passwords and Deletes the data from the collection | Yes           | Works              |
|  `/buyer/login`   |   `POST`    |             Call the API with email and password             | Returns the entire buyer details except private details like passwords and JWT token for accessing enndpoints that require authentication. | No            | Works              |
|  `/buyer/logout`  |   `POST`    |    Call the API with required bearer JWT token in header.    | Deletes the provided token in the header from the JWT token array. | Yes           | Works              |
| `/buyer/buy/:id`  |   `POST`    | Call the API with required bearer JWT token in header and the ID(mongo db _id) of the product. | Removes the seller as owner from the product database and sets owner to the buyer after the payment is completed. | Yes           | In Progress        |



### Seller Related:

|           Endpoint           | HTTP Method |                            Usage                             |                           Returns                            | Requires Auth | Development Status |
| :--------------------------: | :---------: | :----------------------------------------------------------: | :----------------------------------------------------------: | ------------- | ------------------ |
|      `/seller/register`      |   `POST`    | Accepts the name, email, password and address of the seller. |        JSON data of the user details and a JWT token.        | No            | Works              |
|         `/seller/me`         |    `GET`    |    Call the API with required bearer JWT token in header.    | Returns the entire buyer details except private details like passwords. | Yes           | Works              |
|         `/seller/me`         |   `PATCH`   | Call the API with required bearer JWT token in header and the details that are to be changed. | Returns the entire buyer details except private details like passwords. | Yes           | Works              |
|         `/buyer/me`          |  `DELETE`   |    Call the API with required bearer JWT token in header.    | Returns the entire buyer details except private details like passwords and Deletes the data from the collection | Yes           | Works              |
|       `/seller/login`        |   `POST`    |             Call the API with email and password             | Returns the entire buyer details except private details like passwords and JWT token for accessing enndpoints that require authentication. | No            | Works              |
|       `/seller/logout`       |   `POST`    |    Call the API with required bearer JWT token in header.    | Deletes the provided token in the header from the JWT token array. | Yes           | Works              |
|    `/seller/product/add`     |   `POST`    | Requires a JSON of prodict details and JWT token in the header | Returns the JSON of the product that has been sent and stores in the database. | Yes           | Works              |
|  `/seller/product/edit/:id`  |   `POST`    | Requires a JSON of prodict details that are needed to be changed and JWT token in the header |  Returns the new data of the product that has been updated.  | Yes           | Works              |
| `/seller/product/delete/:id` |   `POST`    | Requires the ID(mongo db id) of the product that is needed to be deleted and JWT token | Returns the JSON product whose ID was given and deleted it from the database. | Yes           | Works              |
|      `/seller/products`      |    `GET`    |               Required JWT token in the header               |     Returns the products that are posted by the seller.      | Yes           | Works              |



### Product Related:

|           Endpoint           | HTTP Method |                            Usage                             |                           Returns                            | Requires Auth | Development Status |
| :--------------------------: | :---------: | :----------------------------------------------------------: | :----------------------------------------------------------: | ------------- | ------------------ |
|  `/seller/product/edit/:id`  |   `POST`    | Requires a JSON of prodict details that are needed to be changed and JWT token in the header |  Returns the new data of the product that has been updated.  | Yes           | Works              |
| `/seller/product/delete/:id` |   `POST`    | Requires the ID(mongo db id) of the product that is needed to be deleted and JWT token | Returns the JSON product whose ID was given and deleted it from the database. | Yes           | Works              |
|      `/seller/products`      |    `GET`    |               Required JWT token in the header               |     Returns the products that are posted by the seller.      | Yes           | Works              |
|    `/seller/product/add`     |   `POST`    | Requires a JSON of prodict details and JWT token in the header | Returns the JSON of the product that has been sent and stores in the database. | Yes           | Works              |
|       `/buyer/buy/:id`       |   `POST`    | Call the API with required bearer JWT token in header and the ID(mongo db _id) of the product. | Removes the seller as owner from the product database and sets owner to the buyer after the payment is completed. | Yes           | In Progress        |



## Database Schemas

### Product:

| Name        | Type                             |
| ----------- | -------------------------------- |
| _id         | `mongoose.Schema.Types.ObjectId` |
| item_name   | `String`                         |
| description | `String`                         |
| category    | `String`                         |
| price       | `Number`                         |
| Owner       | `mongoose.Schema.Types.ObjectId` |



### Seller:

| Name     | Type                             |
| -------- | -------------------------------- |
| _id      | `mongoose.Schema.Types.ObjectId` |
| name     | `String`                         |
| email    | `String`                         |
| password | `String`                         |
| tokens   | `Array` of strings               |



### Buyer:

| Name     | Type                             |
| -------- | -------------------------------- |
| _id      | `mongoose.Schema.Types.ObjectId` |
| name     | `String`                         |
| email    | `String`                         |
| password | `String`                         |
| Address  | `String`                         |
| tokens   | `Array` of strings               |



## Database Design

Description to be added

