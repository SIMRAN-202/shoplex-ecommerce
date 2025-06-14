const connection = require('../mysql_connect')

class AdminAccount{

admin_login(req, res) {
    if (req.method === "GET") {
      res.render('admin/admin_login.ejs');
    } else {
      const { email, password } = req.body;

      const ADMIN_EMAIL = "admin@gmail.com";
      const ADMIN_PASSWORD = "admin";

      if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        res.redirect('/admin/admin_dashboard');
      } else {
        res.render('admin/admin_login.ejs', { message: "Invalid credentials" });
      }
    }
  }


 // View all products (with category names)
  View_products(req, res) {
    const productQuery = `
      SELECT p.id, p.name, p.price, p.stock, p.image_url, c.name AS category
      FROM thrift_products p
      JOIN product_categories c ON p.category_id = c.id
    `;

    const categoryQuery = `SELECT id, name FROM product_categories`;

    connection.query(productQuery, (err, products) => {
      if (err) return res.send(err);

      connection.query(categoryQuery, (err2, categories) => {
        if (err2) return res.send(err2);

        res.render('admin/products-list.ejs', {
          products: products,
          categories: categories
        });
      });
    });
  }



 // Add new product
add_product(req, res) {
  const { name, category_id, price, stock, description } = req.body;
  const image_url = req.file.filename;

  const insertQuery = `
    INSERT INTO thrift_products (name, category_id, price, stock, description, image_url)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  connection.query(
    insertQuery,
    [name, category_id, price, stock, description, image_url],
    (err, result) => {
      if (err) return res.send(err);
      res.redirect('/admin/products-list');
    }
  );
}


admin_products_edit(req, res) {
  const productId = req.params.id;

  if (req.method === "GET") {
    const productQuery = `SELECT * FROM thrift_products WHERE id = ?`;
    const categoryQuery = `SELECT id, name FROM product_categories`;

    connection.query(productQuery, [productId], (err, productResults) => {
      if (err) return res.send(err);
      if (productResults.length === 0) return res.send("Product not found");

      const product = productResults[0];

      connection.query(categoryQuery, (err2, categories) => {
        if (err2) return res.send(err2);

        res.render('admin/edit_product.ejs', {
          product: product,
          categories: categories,
          message: null
        });
      });
    });

  } else if (req.method === "POST") {
    const { name, category_id, price, stock, description } = req.body;
    const image_url = req.file ? req.file.filename : null;

    let updateQuery = `
      UPDATE thrift_products 
      SET name = ?, category_id = ?, price = ?, stock = ?, description = ?
    `;
    const queryParams = [name, category_id, price, stock, description];

    if (image_url) {
      updateQuery += `, image_url = ?`;
      queryParams.push(image_url);
    }

    updateQuery += ` WHERE id = ?`;
    queryParams.push(productId);

    connection.query(updateQuery, queryParams, (err, result) => {
      if (err) return res.send(err);

      // Fetch updated product and categories again after update
      const productQuery = `SELECT * FROM thrift_products WHERE id = ?`;
      const categoryQuery = `SELECT id, name FROM product_categories`;

      connection.query(productQuery, [productId], (err2, productResults) => {
        if (err2) return res.send(err2);
        if (productResults.length === 0) return res.send("Product not found");

        const product = productResults[0];

        connection.query(categoryQuery, (err3, categories) => {
          if (err3) return res.send(err3);

          // Render edit page with updated product and success message
          res.render('admin/edit_product.ejs', {
            product: product,
            categories: categories,
            message: "Product updated successfully."
          });
        });
      });
    });
  } else {
    res.status(405).send("Method Not Allowed");
  }
}

admin_users_list(req, res) {
  const query = `SELECT * FROM thrift_users`;
  connection.query(query, (err, results) => {
    if (err) return res.send(err);
    res.render('admin/user-list', { users: results });
  });
}

block_user(req, res) {
  const userId = req.params.id;
  connection.query(`UPDATE thrift_users SET status = 0 WHERE id = ?`, [userId], (err) => {
    if (err) return res.send(err);
    res.redirect('/admin/user-list');
  });
}

unblock_user(req, res) {
  const userId = req.params.id;
  connection.query(`UPDATE thrift_users SET status = 1 WHERE id = ?`, [userId], (err) => {
    if (err) return res.send(err);
    res.redirect('/admin/user-list');
  });
}


}
const obj = new AdminAccount()

module.exports = obj