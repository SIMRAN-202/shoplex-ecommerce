const connection = require('../mysql_connect')


class payment 
{

     Payment_Success(req,res)
     {
       
                    if(req.session.emailid != null && req.session.username!=null){
                       connection.getConnection((err,myconnect)=>
                    {
                         if(err)
                         {
                             res.send(err)
                         }
                         else 
                         {
                            const {
                                    payerid,
                                    merchantid,
                                    createtime,
                                    transactionid,
                                    amount,
                                    pqnty,
                                    pname,
                                    ptype,
                                    pphoto
                            } = req.body;
                            const buyeremail=req.session.emailid;
                            const buyername=req.session.username;
                            const buyeraddress=req.session.useraddress;
                             const q=`insert into payments(product_name,product_type,quantity_order,product_image,buyer_name,buyer_email,buyer_address,payer_id,merchant_id,payment_trans_no,payed_amount,payment_date)values('${pname}','${ptype}','${pqnty}','${pphoto}','${buyername}','${buyeremail}','${buyeraddress}','${payerid}','${merchantid}','${transactionid}',${amount},'${createtime}')`;
                             myconnect.query(q,(err)=>
                            {
                                 if(err)
                                 {
                                     console.log(err)
                                     res.send(err)
                                 }
                                 else {
                                    req.session.transactionId = transactionid;
                                       res.status(200).json({ success: true });
                                 }
                            })
                         }
                    })

                    }
                    else 
                    {
                        res.render('login',{message:"Login here...."})  
                    }
    }

async Show_Success_Payment_Page(req, res) {
  if (!req.session.username) {
    return res.redirect('/login');
  }

  const transactionId = req.session.transactionId;
  if (!transactionId) {
    return res.status(400).send("Transaction ID missing in session");
  }

  connection.getConnection((err, myconnect) => {
    if (err) {
      return res.status(500).send("Database connection error");
    }

    const q = "SELECT * FROM payments WHERE payment_trans_no = ?";

    myconnect.query(q, [transactionId], (err, results) => {
      if (err) {
        return res.status(500).send("Error fetching order details");
      }

      if (results.length === 0) {
        return res.status(404).send("Order not found");
      }

      const order = results[0];
      // Clear transaction id from session after fetching order to avoid reuse issues
      delete req.session.transactionId;
      res.render("user/success_payment", { order, name: req.session.username });
    });
  });
}



}


const obj=new payment()


module.exports=obj