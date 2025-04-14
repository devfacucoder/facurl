import { model, Schema } from "mongoose";

const urlSchema = new Schema({
  name: String,
  url: String,
  custom: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: false, // porque puede ser anónima
  },
  tempo:{
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 60 * 60 * 1 // 5 horas en segundos
  }
});

const UrlModel = model("Url", urlSchema);
export default UrlModel;
