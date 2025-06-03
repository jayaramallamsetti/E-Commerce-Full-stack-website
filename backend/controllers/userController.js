import validator from "validator";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken'
import userModel from "../models/userModel.js";



const createToken = (id) =>{
  return jwt.sign({id}, process.env.JWT_SECRET)
}

// Route for user login
const loginUser = async (req,res) => {
  // to get the user email and password and if the user is genuine we'll create one token
    try {
        const {email,password} = req.body;
        const user = await userModel.findOne({email});
        if (!user) {
          return res.json({success: false, message: "User doesn't exists"})
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (isMatch) {

          const token = createToken(user._id)
          res.json({success: true, token})
          
        }
        else{
          res.json({success:false, message:'Invalid credentials'})
        }

    } catch (error) {
      console.log(error);
      res.json({success: false, message: error.message})      
      
    }
}

// Route for user registration
const registerUser = async (req,res) => {
  try {
    
    const {name, email, password} = req.body;
    
    // checking user already exists or not
    const exists = await userModel.findOne({email})
    if(exists){
      return res.json({success: false, message: 'User already exists'})
    }

    //  validating email format & strong password
    if (!validator.isEmail(email)) {
      return res.json({success: false, message: 'Please enter a valid email'})
    }
    if (password.length < 8) {
      return res.json({success: false, message: 'Please enter a strong password'})
    }

    // before creating the account we have to hash the password using bcrypt.......
    // hashing user password
    const salt = await bcrypt.genSalt(10)  // genSalt(num: 5-15) if num is larger then it will take more time to encrypt the password
    const hashedPassword = await bcrypt.hash(password,salt)

    // to create the user
    const newUser = new userModel({
      name,
      email,
      password:hashedPassword
    })

    const user = await newUser.save()  // new user will be stored in the database
    const token =  createToken(user._id) // token ==> so that user can login into the application, i.e. wher ever user is created then in that ._id property is generated so using that we will create a token

    res.json({success: true, token})

  } catch (error) {
      console.log(error);
      res.json({success: false, message: error.message})
    
  }
}

// Route for admin login
const adminLogin = async (req,res) => {
    try {
        const {email, password} = req.body

        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign(email+password,process.env.JWT_SECRET)
            res.json({success: true, token})          
        }
        else res.json({success: false, message: "Invalid credentials"})

    } catch (error) {
      console.log(error);
      res.json({success: false, message: error.message})
    }        
}

export {loginUser, registerUser, adminLogin}