const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const { Schema } = mongoose;

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
  bio: { type: String, default: " ... " },
  location: { type: String, default: "Los Angeles, California" },
  images: {
    type: [String],
    default: "https://www.thefamouspeople.com/profiles/images/david-laid-1.jpg",
  },
  bench: { type: Number, default: 0 },
  dead: { type: Number, default: 0 },
  squat: { type: Number, default: 0 },
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);
