
const User=require('../../models/user')
const bcrypt=require('bcrypt')
const passport = require('passport')

function authController(){
     
    const _getRedirectUrl=(req)=>{
        return req.user.role==='admin' ? '/admin/orders' : '/customer/orders'
    }

 
    return{
        login(req,res){
            res.render('auth/login')
        },
        postLogin(req,res,next){
         passport.authenticate('local',(err,user,info)=>{
           if(err){
               req.flash('error',info.message)
               return next(err)
           }
           if(!user){
               req.flash('error',info.message)
               return res.redirect('/login')
           }
           req.logIn(user,(err)=>{
              if(err){
                req.flash('error',info.message)
                return next(err)
              }
              return res.redirect(_getRedirectUrl(req))
           })
         })(req,res,next)

        },






        register(req,res){
            res.render('auth/register')
        },
       async postRegister(req,res){ //async beacuse we are using await
            const{name, email, password }= req.body
            //validate request
            if(!name || !email || !password){
                req.flash('error','All fields are required')
                req.flash('name',name)
                req.flash('email',email)

            return res.redirect('/register')
            }
            //check if email exist
            User.exists({email:email},(err,result)=>{  //two parameter 1st is key i.e email 2nd is function
                if(result){
                req.flash('error','Email is already taken')
                req.flash('name',name)
                req.flash('email',email)
                return res.redirect('/register')
                }
            })
            //hash password package required 'bcrypt'
            const hashedPassword= await bcrypt.hash(password,10)
            //create a user
            const user = new User({
                name: name,
                email:email,
                password:hashedPassword
            })
             
            user.save().then(()=>{     //true condition
                //login

                return res.redirect('/')

            }).catch(errr=>{  //false i.e else part
                 req.flash('error','Something went Wrong')
                 return res.redirect('/register')
            })


            console.log(req.body)
        },
        logout(req,res){
            req.logout()
            return res.redirect('/login')
        }

    }
}
module.exports=authController;