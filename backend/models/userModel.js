import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name : {type: String, required: true},
  email : {type: String, required: true, unique: true},
  password : {type: String, required: true},
  cartData : {type: Object, default: {}},  // So that when a user creates an account then his cart will be empty i.e. {} ==> empty object
},{minimize: false})
// minimize: false ==> cart data will be un-available, coz mongoose will neglect the property where we have empty object, so that its data will not be displayed in the mongodb


const userModel = mongoose.models.user || mongoose.model('user', userSchema);

export default userModel;