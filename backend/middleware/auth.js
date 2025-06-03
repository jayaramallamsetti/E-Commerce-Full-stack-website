// to authenticate user whenever user he performs any activity (i.e. adding products, updating cart, getUserCart )

// Middleware to authenticate user before performing actions (add to cart, update cart, etc.)
import jwt from 'jsonwebtoken';

const authUser = async (req, res, next) => {
  const { token } = req.headers;

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not Authorized, Login Again' }); // ❌ Fixed `response.json()`
  }

  try {
    const token_decode = jwt.verify(token, process.env.JWT_SECRET);
    req.body.userId = token_decode.id;
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ success: false, message: 'Invalid or Expired Token' });
  }
};

export default authUser;







// import { response } from 'express';
// import jwt from 'jsonwebtoken'

// const authUser = async (req,res,next) => {

//   const { token } = req.headers;

//   if (!token) {
//     return response.json({success:false, message: 'Not Authorized, Login Again'})
//   }

//   try {
//       const token_decode = jwt.verify(token,process.env.JWT_SECRET)
//       req.body.userId = token_decode.id
//       next()
//   } catch (error) {
//     console.log(error);
//     res.json({success:false, message:error.message})
//   }
  
// }

// export default authUser
