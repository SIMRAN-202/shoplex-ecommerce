const express = require('express')
const route = express.Router()
const connection = require('./mysql_connect')
const user_obj = require('./controller/UserController')
const admin_obj = require('./controller/AdminController')
const product_obj = require('./controller/ProductController')
const payment_obj = require('./controller/PaymentController')
const multer = require('multer')   //for image storage
const path = require('path')     //to get image path


//image move to destination folder and assign unique name
var userProfilestorage = multer.diskStorage({
    destination:(req,res,callback)=>{
    callback(null,'./public/profile_image') 
    },
    filename : (req,file,callback)=>{
        //rename the image and give a unique name
        callback(null, file.originalname.split('.')[0]+'-'+ Date.now() + path.extname(file.originalname))
    }
})

var uploadUserProfile=multer({
    storage:userProfilestorage
})

const productStorage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, './public/product_image');
  },
  filename: (req, file, callback) => {
    callback(null, 'product-' + Date.now() + path.extname(file.originalname));
  }
});

const uploadProduct = multer({ storage: productStorage });


route.get('/', (req, res) => {
  const query = 'SELECT * FROM thrift_products LIMIT 8';

  connection.query(query, (err, results) => {
    if (err) {
      res.send(err)
    }

    res.render('home.ejs', { data: results }); 
  });
});

route.get('/user/user-dashboard',(req,res)=>{
  if(req.session.emailid != null && req.session.username!=null){
 res.render('user/user-dashboard.ejs', {name:req.session.username, photo:req.session.photo})
  }
  else{
    res.render('login',{message:"Login here...."})
  }
 
})
route.get('/contact',(req,res)=>{
  res.render('contact.ejs')
})
route.get('/about',(req,res)=>{
  res.render('about.ejs')
})


route.use('/register', uploadUserProfile.single('photo'),(req,res)=>{
 user_obj.user_registration(req,res)  
}
)

route.use('/login',(req,res)=>{
  user_obj.user_login(req,res)
})


route.use('/user/change-password',(req,res)=>{
  user_obj.change_password(req,res)
})

route.use('/user/user-profile',(req,res)=>{
  user_obj.user_profile(req,res)
})

route.use('/user/edit-profile', uploadUserProfile.single('photo'), (req, res) => {
  user_obj.edit_profile(req, res);
});

route.get('/user/shop',(req,res)=>{
  product_obj.view_products(req,res)
})

route.use('/brief_product',(req,res)=>{
  product_obj.brief_product(req,res)
})

route.get('/logout',(req,res)=>{
  req.session.destroy()
res.render('login',{message:"Logout Successfully"})
})





route.use('/admin-login',(req,res)=>{
 admin_obj.admin_login(req,res)
})

route.get('/admin/admin_dashboard',(req,res)=>{
  res.render('admin/admin_dashboard.ejs')
})

// View all products
route.get('/admin/products-list', (req, res) => {
    admin_obj.View_products(req,res)
});

route.post('/admin/products/add',uploadProduct.single('image_url'), (req, res) => {
    admin_obj.add_product(req,res)
});
route.post('/admin/products/delete/:id', (req, res)=>{
  product_obj.delete_product(req, res) 
})

route.use('/admin/products/edit/:id',uploadProduct.single('image_url'),(req,res)=>{
 admin_obj.admin_products_edit(req,res)
})
route.get('/admin/user-list',(req,res)=>{
  admin_obj.admin_users_list(req, res)
});
route.post('/admin/user/block/:id',(req,res)=>{
  admin_obj.block_user(req,res)
});
route.post('/admin/user/unblock/:id',(req,res)=>{
  admin_obj.unblock_user(req,res)
});









route.post('/user/success_payment',(req,res)=>{
   payment_obj.Payment_Success(req,res)
})

route.get('/user/success_payment_page', (req, res) => {
  payment_obj.Show_Success_Payment_Page(req,res)
});


module.exports=route