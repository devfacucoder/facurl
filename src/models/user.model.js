import {model,Schema} from "mongoose";
import bcrypt from "bcrypt";
const userSchema = new Schema({
    name:String,
    email:String,
    password:String,
    rol:{
        type:Schema.Types.ObjectId,
        ref:'Role'  
    },
    userUrls:[{
        type:Schema.Types.ObjectId,
        ref:'Url'
    }]
})
userSchema.statics.enCryptPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  };
  userSchema.statics.comparePassword = async (password, recivePassword) => {
    return await bcrypt.compare(password, recivePassword);
  };

const userModel = new model('User',userSchema);
export default userModel;