import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
// import getDataUri from "../utils/dataUri.js";
// import cloudinary from "../utils/cloudinary.js";

//Register
export const register = async (req, res) => {
  try {
    //Get the data from form
    const { fullname, email, phoneNumber, password } = req.body;
    // console.log(fullname, email, phoneNumber, password);
    if (!fullname || !email || !phoneNumber || !password) {
      return res
        .status(400)
        .json({ message: "Something is missing!", success: false });
    }

    // const file = req.file;
    // const fileUri = getDataUri(file);
    // const cloudResponse = await cloudinary.uploader.upload(fileUri.content);

    //Check if user with the provided email exist or not
    const user = await User.findOne({ email });
    //If exist then
    if (user) {
      return res.status(400).json({
        message: "User already existed with this email!",
        success: false,
      });
    }

    //Hash the user password
    const hashedPassword = await bcrypt.hash(password, 10);

    //Create object of user in DB
    await User.create({
      fullname,
      email,
      phoneNumber,
      password: hashedPassword,
      //   profilePhoto: cloudResponse.secure_url,
    });

    return res.status(201).json({
      message: "Account created succesfully.",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

//Login
export const login = async (req, res) => {
  try {
    //Get the data from form
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Something is missing!", success: false });
    }

    //Check if user with the provided email exist or not
    let user = await User.findOne({ email });

    //If not exist then
    if (!user) {
      return res.status(400).json({
        message: "User does not exist! Please register first!",
        success: false,
      });
    }

    //Check whether password match or not
    const isPasswordMatch = await bcrypt.compare(password, user.password);

    //If password does not match
    if (!isPasswordMatch) {
      return res.status(400).json({
        message: "Incorrect email or password!",
        success: false,
      });
    }

    //Creating object containing user ID
    const tokenData = {
      userId: user._id,
    };

    //Creating token using tokenData and SECRET_KEY
    const token = jwt.sign(tokenData, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    //User object
    user = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profile: user.profile,
    };

    //Return this when success
    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "strict",
      })
      .json({
        message: `Welcome back ${user.fullname}`,
        user,
        success: true,
      });
  } catch (error) {
    console.log(error);
  }
};

//Logout
export const logout = async (req, res) => {
  try {
    return res.status(200).cookie("token", "", { maxAge: 0 }).json({
      message: "Logged out succesfully.",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

//Update User profile
export const updateProfile = async (req, res) => {
  try {
    const { fullname, email, phoneNumber } = req.body;

    const userID = req.id;
    // console.log("User ID:", userID);

    let user = await User.findById(userID);
    if (!user) {
      return res.status(400).json({
        message: "User not found.",
        success: false,
      });
    }

    //Updating Data
    if (fullname) user.fullname = fullname;
    if (email) user.email = email;
    if (phoneNumber) user.phoneNumber = phoneNumber;

    await user.save();

    user = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      phoneNumber: user.phoneNumber,
    };

    return res.status(200).json({
      message: "Profile updated succesfully.",
      user,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};