# BackEnd API

This API provides CRUD operations for managing products in Database.

## Usage

```bash
npm install
npm run dev
```

## Database Setup

1. Ensure your MySQL server is running.
2. Create the database:
   ```sql
   CREATE DATABASE XXXXX;
   ```
3. Update the MySQL connection settings in `server.js` if necessary.

## Database Migration

The server will automatically create the necessary database schema if it doesn't exist. Ensure your MySQL server is running and properly configured.

## Base URL

```
http://localhost:3000
```

## Endpoints

### 1. Create a Product

- **URL:** `/api/create`
- **Method:** `POST`
- **Description:** Creates a new product.
- **Request Body:**
  ```json
  {
    "product_name": "string",
    "price": "number",
    "stock_quantity": "number"
  }
  ```
- **Response:**
  - **201 Created:** Product created successfully.
  - **400 Bad Request:** Error creating product.
  - **500 Internal Server Error:** Internal server error.

### 2. Get All Products

- **URL:** `/api/products`
- **Method:** `GET`
- **Description:** Retrieves all products.
- **Response:**
  - **200 OK:** List of products.
  - **400 Bad Request:** Error getting products.
  - **500 Internal Server Error:** Internal server error.

### 3. Get Product by ID

- **URL:** `/api/products/:product_id`
- **Method:** `GET`
- **Description:** Retrieves a product by its ID.
- **Response:**
  - **200 OK:** Product details.
  - **400 Bad Request:** Error getting product.
  - **404 Not Found:** Product not found.
  - **500 Internal Server Error:** Internal server error.

### 4. Update a Product

- **URL:** `/api/products/:product_id`
- **Method:** `PATCH`
- **Description:** Updates a product by its ID.
- **Request Body:**
  ```json
  {
    "product_name": "string",
    "price": "number",
    "stock_quantity": "number"
  }
  ```
- **Response:**
  - **200 OK:** Product updated successfully.
  - **400 Bad Request:** No data provided for update.
  - **404 Not Found:** Product not found.
  - **500 Internal Server Error:** Internal server error.

### 5. Delete a Product

- **URL:** `/api/products/:product_id`
- **Method:** `DELETE`
- **Description:** Deletes a product by its ID.
- **Response:**
  - **200 OK:** Product deleted successfully.
  - **404 Not Found:** Product not found.
  - **500 Internal Server Error:** Internal server error.
