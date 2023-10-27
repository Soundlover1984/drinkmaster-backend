const bcrypt = require("bcrypt");
const { model, Schema } = require("mongoose");
const { fullYearsCalculate } = require("../helpers");

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    birthData: {
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
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
userSchema.pre("save", async function (next) {
  const fullYears = await fullYearsCalculate(this.birthData);
  if (fullYears >= 18) {
    this.isAdult = true;
  }

  const salt = await bcrypt.genSalt(10);

  this.password = await bcrypt.hash(this.password, salt);

  next();
});

const User = model("User", userSchema);

module.exports = User;
