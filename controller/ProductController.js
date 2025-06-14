const connection = require('../mysql_connect')

class Product{
view_products(req, res) {
  if (req.session.emailid != null && req.session.username != null) {
    const selectedCategory = req.query.category || null;

    connection.getConnection((err, myconnect) => {
      if (err) {
        res.send(err);
      } else {
        // Base query to join products and categories
        let productQuery = `
          SELECT p.*, c.name AS category
          FROM thrift_products p
          JOIN product_categories c ON p.category_id = c.id
        `;

        // If category filter exists, add WHERE clause
        if (selectedCategory) {
          productQuery += ` WHERE c.id = ${myconnect.escape(selectedCategory)}`;
        }

        myconnect.query(productQuery, (err, record) => {
          if (err) {
            res.send(err);
          } else {
            // Fetch categories to show in sidebar
            myconnect.query('SELECT * FROM product_categories', (catErr, categories) => {
              if (catErr) {
                res.send(catErr);
              } else {
                // Render view with products, categories, username, and selected category
                res.render('user/shop', {
                  name: req.session.username,
                  data: record,
                  categories: categories,
                  selectedCategory: selectedCategory
                });
              }
            });
          }
        });
      }
    });
  } else {
    res.render('login', { message: 'Login here....' });
  }
}

 brief_product(req,res)
      {
           if(req.session.emailid != null && req.session.username!=null){

           if(req.method=='GET')
           {
                 connection.getConnection((err,myconnect)=>
               {
                     if(err)
                     {
                          res.send(err)
                     }
                     else 
                     {
                          const q=`select * from thrift_products where id='${req.query.pid}'`
                          myconnect.query(q,(err,record)=>
                         {
                               if(err)
                               {
                                    res.send(err)
                               }
                               else 
                               {
                                   
                                   res.render('user/detailsproduct',{name:req.session.username,data:record,email:req.session.emailid,address:req.session.useraddress})
                               }
                         })
                     }
               })
           }
           else 
           {

           }
          }
          else 
          {
                res.render('login',{message:"Login here...."})
          }
      }

 delete_product(req, res) {
  const productId = req.params.id;

  connection.getConnection((err, myconnect) => {
    if (err) {
      console.error('❌ DB connection error:', err);
      return res.status(500).send('Database connection error');
    }

    const sql = 'DELETE FROM thrift_products WHERE id = ?';

    myconnect.query(sql, [productId], (err, result) => {

      if (err) {
        console.error('❌ Error deleting product:', err);
        return res.status(500).send('Failed to delete product');
      }

      console.log(`✅ Product ID ${productId} deleted successfully`);
      res.redirect('/admin/products-list');
    });
  });
}


}


const obj = new Product()

module.exports = obj