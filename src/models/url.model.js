import { model,Schema } from "mongoose";

const urlSchema = new Schema({
    name:String,
    url:String,
    custom:String,
    author:{
        type:Schema.Types.ObjectId,
        ref:'User',
        required:true,
    },

})
const urlModel = new model('Url',urlSchema);
export default urlModel;