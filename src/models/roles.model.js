import {model, Schema} from 'mongoose';
const roleSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  
});

const roleModel = model('Role', roleSchema);

export default roleModel;