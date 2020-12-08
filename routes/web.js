
const authController = require('../app/http/controllers/authController');
const cartController = require('../app/http/controllers/customers/cartController')
const homeController = require('../app/http/controllers/homeController')
const orderController = require('../app/http/controllers/customers/orderController')
const AdminOrderController = require('../app/http/controllers/admin/orderController')
const statusController = require('../app/http/controllers/admin/statusController')


//middlewares thar protect the page
const guest=require('../app/http/middlewares/guest')
const auth=require('../app/http/middlewares/auth')
const admin=require('../app/http/middlewares/admin')

function initRoutes(app){
    app.get('/',homeController().index)
//     (req,res)=>{            // or instead of => use function(req,res){}
//     res.render('home')
// }
 
app.get('/login',guest,authController().login)
app.post('/login',authController().postLogin)

app.get('/register',guest,authController().register)
app.post('/register',authController().postRegister)

app.get('/cart',cartController().index)
app.post('/update-cart',cartController().update)

app.post('/logout',authController().logout)

//Customer route
app.post('/orders',auth,orderController().store)

app.get('/customer/orders',auth,orderController().index)

app.get('/customer/orders/:id',auth,orderController().show)


//Admin routes
app.get('/admin/orders',admin,AdminOrderController().index)

//admin/order/status
app.post('/admin/order/status',admin,statusController().update)



}

module.exports=initRoutes;