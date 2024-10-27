# Express.js crud

This small application, built with Express.js, emulates a REST API and is conveniently testable using the Postman application. Its primary purpose is to showcase the adept handling of project structure, versioning, and date operations within the Express.js framework.


## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
  - [User Management](#user-management)
  - [Company Management](#company-management)
  - [Company Department Management](#company-department-management)
- [Requirements](#requirements)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Tests](#tests)



## Introduction

The project entails the development of a RESTful API using the Express.js framework, establishing a connection to a PostgreSQL database hosted on a server (Guja server) accessible through port forwarding with the k9s tool. This API will offer various endpoints facilitating CRUD (Create, Read, Update, Delete) operations on the database.

The initial phase involves establishing a connection to the database and configuring the required database schema, leveraging the predefined PostgreSQL database.

Following this, the project proceeds to craft RESTful API routes using Express.js, tailoring the endpoints to handle CRUD operations and meet specific requirements. Ensuring robust error handling is imperative throughout this process.

To guarantee the API's reliability, the project incorporates unit tests for each endpoint. Testing tools like Jest or Mocha are employed to create and execute these tests. Additionally, a Postman collection is crafted to offer a user-friendly interface for testing the API.

In summary, the project encompasses the construction of a robust and secure RESTful API using Express.js, connecting to a PostgreSQL database via port forwarding with k9s, implementing unit tests, and creating a Postman collection. This integrated approach ensures the development of a reliable API for use by other developers.

## Features
### User Management
- **Create User:**
  - Endpoint: `POST /api/users`
  - Description: Create a new user.

- **Get Paginated List of Users:**
  - Endpoint: `GET /api/users`
  - Description: Retrieve a paginated list of all users with support for search, sort, and filter parameters.

- **Get User by ID:**
  - Endpoint: `GET /api/users/:id`
  - Description: Retrieve user details by ID.

- **Update User by ID:**
  - Endpoint: `PUT /api/users/:id`
  - Description: Update user details by ID.

- **Delete User:**
  - Endpoint: `DELETE /api/users/:id`
  - Description: Delete a user by ID.

### Company Management
- **Create Company:**
  - Endpoint: `POST /api/companies`
  - Description: Create a new company.

- **Get Paginated List of Companies:**
  - Endpoint: `GET /api/companies`
  - Description: Retrieve a paginated list of all companies with search, sort, and filter options.

- **Get Company by ID:**
  - Endpoint: `GET /api/companies/:id`
  - Description: Retrieve company details by ID.

- **Update Company by ID:**
  - Endpoint: `PUT /api/companies/:id`
  - Description: Update company details by ID.

- **Delete Company:**
  - Endpoint: `DELETE /api/companies/:id`
  - Description: Delete a company by ID.

### Company Department Management
- **Create Company Department:**
  - Endpoint: `POST /api/departments`
  - Description: Create a new company department.

- **Get Company Department by ID:**
  - Endpoint: `GET /api/departments/:id`
  - Description: Retrieve company department details by ID.

- **Update Company Department by ID:**
  - Endpoint: `PUT /api/departments/:id`
  - Description: Update company department details by ID.

- **Delete Company Department:**
  - Endpoint: `DELETE /api/departments/:id`
  - Description: Delete a company department by ID.

- **Get All Departments with Parent-Child Relation:**
  - Endpoint: `GET /api/departments/with-relation`
  - Description: Retrieve all departments with relations based on parent_id.

## Requirements

- Node.js
- PostgreSQL

## Installation

1. Clone the repository:

   git clone https://git.barrage.net/forge/barrage-forge-5/marko-blaskovic/forge-task-2-express.js-crud.git

Install dependencies:
npm install @types/sequelize@^4.28.19
npm install bcrypt@^5.1.1
npm install dotenv@^16.3.1
npm install express@^4.18.2
npm install express-validator@^7.0.1
npm install sequelize@^6.35.2



## Configuration
Connect to VPN and port forward to the db

## Usage
npm run dev

## Tests
npm test


