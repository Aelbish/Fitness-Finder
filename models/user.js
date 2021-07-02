const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema({
  bio: String,
  location: String,
  images: [String],
  bench: Number,
  dead: Number,
  squat: Number,
  email: {
    type: String,
    required: true,
    unique: true,
  },
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);
