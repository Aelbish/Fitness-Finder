const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const { Schema } = mongoose;

const ImageSchema = new Schema({
  url: String,
  filename: String,
});
ImageSchema.virtual("thumbnail").get(function () {
  return this.url.replace("/upload", "/upload/w_200");
});
const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  savedWorkouts: [
    {
      type: Schema.Types.ObjectId,
      ref: "WorkoutPlan",
    },
  ],
  images: [ImageSchema],
  bio: { type: String, default: " ... " },
  location: { type: String, default: "Los Angeles, California" },
  // images: {
  //   type: [String],
  //   default:
  //     "https://cdn.pixabay.com/photo/2018/04/18/18/56/user-3331257_960_720.png",
  // },
  bench: { type: Number, default: 0 },
  dead: { type: Number, default: 0 },
  squat: { type: Number, default: 0 },
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);
