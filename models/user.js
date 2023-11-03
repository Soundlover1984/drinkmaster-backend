const bcrypt = require("bcrypt");
const { model, Schema } = require("mongoose");
const { fullYearsCalculate } = require("../helpers");
const crypto = require("crypto");

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    birthDate: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: [true, "Email already exists..."],
    },
    password: {
      type: String,
      required: true,
    },
    token: {
      type: String,
      default: null,
    },
    isAdult: {
      type: Boolean,
      default: false,
    },
    avatar: String,
    subscribe: {
      type: Boolean,
      default: false,
    },
    theme: {
      type: String,
      default: "dark",
    },
    userAuth: {type: Number, default: 0},
    userFavorite: {type: Number, default: 0},
    // refreshToken: String,
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
userSchema.pre("save", async function (next) {
  if (this.isNew) {
    const emailHash = crypto.createHash("md5").update(this.email).digest("hex");
    this.avatar = `https://www.gravatar.com/avatar/${emailHash}.jpg?d=wavatar`;
  }
  const fullYears = await fullYearsCalculate(this.birthDate);
  if (fullYears >= 18) {
    this.isAdult = true;
  }

  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);

  this.password = await bcrypt.hash(this.password, salt);

  next();
});

const User = model("User", userSchema);

module.exports = User;
