import mongoose from "mongoose";

// Creating Schema for our structure
const productSchema = new mongoose.Schema({
  name: {type:String, required:true},   //req: true ==> name field is compulsory
  description : {type:String, required:true},
  price : {type:Number, required:true},
  image : {type:Array, required:true},
  category : {type:String, required:true},
  subCategory : {type:String, required:true},
  sizes : {type:Array, required:true},
  bestSeller : {type:Boolean},
  date: {type: Number, required: true}

})

const productModel = mongoose.models.product || mongoose.model("product", productSchema)   

// so the schema is stored in productModel , so , whenever we run this project the model will be created multiple times , we do "mongoose.models.product" i.e. when the product model is already available then that model will be used and is assigned in the "productModel" variable , else it will be created using the " mongoose.model("product", productSchema) "

export default productModel;