const express = require("express");
const cors = require("cors");
const mysql = require("mysql");

const app = express();
app.use(express.json()); //middleware parse json body
// ใช้ CORS middleware แบบอนุญาตทั้งหมด
app.use(cors());

//mysql
const connection = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "",
	database: "CPALL_Exam",
	port: 3306,
});

//Connect to mysql and create table if it doesn't exist
connection.connect((error) => {
	if (error) {
		console.error("Error connecting to the MySQL database:", error);
		return;
	}
	console.log("Successfully connected to the MySQL database");

	const createTableQuery = `
		CREATE TABLE IF NOT EXISTS Product (
			product_id INT AUTO_INCREMENT PRIMARY KEY,
			product_name VARCHAR(255) NOT NULL,
			price DECIMAL(10, 2) NOT NULL,
			stock_quantity INT NOT NULL
		)
	`;

	connection.query(createTableQuery, (error, results) => {
		if (error) {
			console.error("Error creating table:", error);
			return;
		}
		console.log("Table 'Product' is ready");
	});
});

// CREATE: POST /api/create
app.post("/api/create", async (req, res) => {
	const { product_name, price, stock_quantity } = req.body;

	try {
		connection.query(
			"INSERT INTO Product (product_name, price, stock_quantity) VALUES (?, ?, ?)",
			[product_name, price, stock_quantity],
			(error, createdResults) => {
				if (error) {
					console.error("Error creating product:", error);
					return res
						.status(400)
						.json({ message: "Error creating product", error });
				}
				connection.query(
					"SELECT * FROM Product WHERE product_id = ?",
					[createdResults.insertId],
					(error, results) => {
						if (error) {
							console.error("Error retrieving updated product:", error);
							return res.status(500).json({ message: "Internal Server Error" });
						}
						return res
							.status(201)
							.json({ message: "Created successfully", product: results[0] });
					}
				);
			}
		);
	} catch (error) {
		console.error("Error creating product:", error);
		return res.status(500).json({ message: "Internal Server Error" });
	}
});

// READ: GET /api/products (get all products)
app.get("/api/products", async (req, res) => {
	try {
		connection.query("SELECT * FROM Product", (error, results, fields) => {
			if (error) {
				console.error("Error getting products:", error);
				return res.status(400).json({ message: "Error getting products" });
			}
			return res.status(200).json(results);
		});
	} catch (error) {
		console.error("Error getting products:", error);
		return res.status(500).json({ message: "Internal Server Error" });
	}
});

// READ: GET /api/products/:product_id (get product by id)
app.get("/api/products/:product_id", async (req, res) => {
	const id = req.params.product_id;

	try {
		connection.query(
			"SELECT * FROM Product WHERE product_id = ?",
			[id],
			(error, results, fields) => {
				if (error) {
					console.error("Error getting product:", error);
					return res.status(400).json({ message: "Error getting product" });
				}
				if (results.length === 0) {
					return res.status(404).json({ message: "Product not found" });
				}
				return res.status(200).json(results[0]);
			}
		);
	} catch (error) {
		console.error("Error getting product:", error);
		return res.status(500).json({ message: "Internal Server Error" });
	}
});

// UPDATE: Patch /api/products/:product_id
app.patch("/api/products/:product_id", async (req, res) => {
	const product_id = req.params.product_id;
	const { product_name, price, stock_quantity } = req.body;

	try {
		if (!product_name && !price && !stock_quantity) {
			return res.status(400).json({ error: "No data provided for update" });
		}
		let updateQuery = "UPDATE Product SET ";
		const updateValues = [];

		if (product_name) {
			updateQuery += "product_name = ?, ";
			updateValues.push(product_name);
		}

		if (price) {
			updateQuery += "price = ?, ";
			updateValues.push(price);
		}

		if (stock_quantity) {
			updateQuery += "stock_quantity = ?, ";
			updateValues.push(stock_quantity);
		}

		updateQuery = updateQuery.slice(0, -2); //remove the last comma and space

		updateQuery += ` WHERE product_id = ?`;
		updateValues.push(product_id);

		// console.log("updateQuery", updateQuery);
		// console.log("updateValues", updateValues);

		connection.query(updateQuery, updateValues, (error, results) => {
			if (error) {
				console.error("Error updating product:", error);
				return res.status(500).json({ message: "Internal Server Error" });
			}

			if (results.affectedRows === 0) {
				return res.status(404).json({ error: "Product not found" });
			}

			connection.query(
				"SELECT * FROM Product WHERE product_id = ?",
				[product_id],
				(error, results) => {
					if (error) {
						console.error("Error retrieving updated product:", error);
						return res.status(500).json({ message: "Internal Server Error" });
					}
					return res.status(200).json(results[0]);
				}
			);
		});
	} catch (error) {
		console.error("Error updating product:", error);
		return res.status(500).json({ message: "Internal Server Error" });
	}
});

// DELETE: DELETE /api/products/:product_id
app.delete("/api/products/:product_id", async (req, res) => {
	const product_id = req.params.product_id;

	try {
		connection.query(
			"DELETE FROM Product WHERE product_id = ?",
			[product_id],
			(error, results) => {
				if (error) {
					console.error("Error deleting product:", error);
					return res.status(500).json({ message: "Internal Server Error" });
				}

				if (results.affectedRows === 0) {
					return res.status(404).json({ error: "Product not found" });
				}

				connection.query("Select * from Product", (error, results) => {
					if (error) {
						console.error("Error getting products:", error);
						return res.status(400).json({ message: "Error getting products" });
					}
					return res
						.status(200)
						.json({
							message: "Product deleted successfully",
							product: results,
						});
				});
			}
		);
	} catch (error) {
		console.error("Error deleting product:", error);
		return res.status(500).json({ message: "Internal Server Error" });
	}
});

app.listen(3000, () => console.log("Server running on port 3000"));
