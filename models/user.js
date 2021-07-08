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

const opts = { toJSON: { virtuals: true } };

const UserSchema = new Schema(
  {
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
    geometry: {
      type: {
        String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
      default: { type: "Point", coordinates: [-118.2437, 34.0522] },
    },
    bench: { type: Number, default: 0 },
    dead: { type: Number, default: 0 },
    squat: { type: Number, default: 0 },
  },
  opts
);

UserSchema.virtual("properties.popUpText").get(function () {
  return `<h6><strong><a href="/users/${
    this._id
  }">${this.username}</a></strong></h6><p>${this.bio.substring(0, 20)} ... </p>`;
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);
