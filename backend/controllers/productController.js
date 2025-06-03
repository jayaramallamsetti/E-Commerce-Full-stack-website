
import {v2 as cloudinary} from "cloudinary"
import productModel from "../models/productModel.js"

// function for add product
const addProduct = async (req,res) => {
  //  to add a product, we will create middleware using multer so that if we send any file as form data then that file will be passed using multer
    try {
      const { name, description, price, category, subCategory, sizes, bestseller } = req.body
      // to get product images 
      const image1 = req.files.image1 && req.files.image1[0]
      const image2 = req.files.image2 && req.files.image2[0]
      const image3 = req.files.image3 && req.files.image3[0]
      const image4 = req.files.image4 && req.files.image4[0]

      // Now, we have to store the images in the database, but images can't be stored in database, to do that we upload the images in cloudinary , and from cloudinary we'll get the URL and we'll store that URL in the database

      const images = [image1, image2, image3, image4].filter((item) => item !== undefined)

      let imagesUrl = await Promise.all(
          images.map(async (item) => {
              let result = await cloudinary.uploader.upload(item.path, {resource_type: 'image'})
              return result.secure_url
          })
      )

      // to save the URL's of the images that were generated using cloudinary, in the mongoDb
      const productData = {
        name,
        description,
        category,
        price: Number(price),   // to convert string to number
        subCategory,
        bestseller: bestseller === "true" ? true : false ,
        // sizes are in array format, we cannot send the array in the form data, so we convert it into a string and then the string is converted to array using JSON.parse()
        sizes: JSON.parse(sizes),
        image:imagesUrl,
        date: Date.now()
      }
      console.log(productData);

      const product = new productModel(productData);
      await product.save()
      

      // console.log(name, description, price, category, subCategory, sizes, bestseller);
      // console.log(imagesUrl);

      res.json({success: true, message: "Product Added"})     
      
    } catch (error) {
      console.log(error);
        res.json({success:false, message:error.message})
    }
}

// function for list product
const listProducts = async (req,res) => {
  try {
    const products = await productModel.find({});
    res.json({success: true, products})
  } catch (error) {
    console.log(error);
    res.json({success:false, message:error.message})
  }
}

// function for removing product
const removeProduct = async (req,res) => {
    try {
        await productModel.findByIdAndDelete(req.body.id)
        res.json({success: true, message: "Product removed"})
    } catch (error) {
        console.log(error);
        res.json({success:false, message:error.message})
    }
}

// function for single product info
const singleProduct = async (req,res) => {
  try {
      const {productId} = req.body
      const product = await productModel.findById(productId)
      res.json({success: true, product})

  } catch (error) {
      console.log(error);
      res.json({success:false, message:error.message})
  }
}




export {listProducts, addProduct , removeProduct , singleProduct }

