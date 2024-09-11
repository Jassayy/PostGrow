import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { ApiError } from "../utils/ApiError.js";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      index: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 8,
    },

    avatar: {
      type: String, //cloudinary Url
    },

    bio: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

//method for hashing password before saving it in db
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (error) {
    next(new ApiError("Error hashing password", error.message));
  }
});

//we can initializ our own functions such as isPasswordCorrect() to check whethe the password entered by the user is correct or not
userSchema.methods.isPasswordCorrect = async function (password) {
  if (!password || !this.password) {
    throw new ApiError(401, "Password and has are required");
  }

  const match = await bcrypt.compare(password, this.password);

  return match;
};

//method for generating Jwt tokens

userSchema.methods.generateAccessToken = async function () {
  return jwt.sign(
    {
      _id: this._id,
      username: this.username,
      email: this.email,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

userSchema.methods.generateRefreshToken = async function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

export const User = mongoose.model("User", userSchema);
