import ErrorHandler from "../middleware/error.js"
import User from "../models/user.js"
import bcrypt from "bcrypt";
import { sendCookie } from "../utils/features.js";

export const login = async (req,res,next) => {
    try {
        const { email, password } = req.body;
    
        const user = await User.findOne({ email }).select("+password");
    
      if (!user) return next(new ErrorHandler("Invalid email or password", 400));
    
      const isMatch = await bcrypt.compare(password, user.password);
    
      if (!isMatch) return next(new ErrorHandler("Invalid email or password", 404));
    
      sendCookie(user, res, `Welcome back, ${user.name}`, 200);
      } catch (error) {
        next(error)
      }
}

export const register = async (req,res,next) => {

    try {
        const {name, email, password} = req.body

    let user = await User.findOne({email})

    if(user) return next(new ErrorHandler("User already exists", 404))

    const hashedPassword = await bcrypt.hash(password,10)

    user = await User.create({
        name,
        email,
        password: hashedPassword,
    })

    sendCookie(user, res, "Registered Successfully", 201);
    } catch (error) {
        next(error)   
    }
}

export const logout = (req,res,next) => {
    res
    .status(200)
    .cookie("token", "", { 
      expires: new Date(Date.now()),
      sameSite: process.env.NODE_ENV === "Developement" ? "lax" : "none",
      secure: process.env.NODE_ENV === "Developement" ? false : true,
     })
    .json({
      success: true,
      user: req.user,
    });
}

export const submitContactForm = async (req,res,next) => {

    try {
        const {name, email, message } = req.body

    let user = await User.findOne({email})

    if(!user) return next(new ErrorHandler("User not found", 404))

    user.messages.push({message})

    await user.save()

    res.status(200).json({
        success: true,
        name,
        message: "Message submitted successfully",
        data: user.messages,
      });
    } catch (error) {
        next(error)
    }
}

export const getUserMessages = async (req,res,next) => {
    res.status(200).json({
        success: true,
        messages: req.user.messages,
      });
}