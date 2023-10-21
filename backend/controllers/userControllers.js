const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')
const generateToken = require("../config/generateToken")

const registerUser = asyncHandler(async (req,res) => {
    const { name, email, password, pic } = req.body
    
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please Enter all the Fields" });
    }

    const userExist = await User.findOne({ email })
    
    if (userExist) {
        return res.status(400).json({ message: "User already exist" });
    }

    const user = await User.create({
        name,email,password,pic
    })
    
    if (user) {
        res.status(201).json({
          _id: user._id,
          name: user.name,
          email: user.email,
          pic: user.pic,
          token: generateToken(user._id),
        });
    } else {
        return res.status(400).json({ message: "Failed to create the user"});
    }
})

const authUser = asyncHandler(async(req,res) => {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    
    if (user && (await user.matchPassword(password))) {
        res.json({
          _id: user._id,
          name: user.name,
          email: user.email,
          pic: user.pic,
          token: generateToken(user._id),
        });
    } else {
        return res.status(401).json({ message: "Invalid email or password" });
    }
})

//  /api/user?search=harsh
const allUsers = asyncHandler(async (req,res) => {
    const keyword = req.query.search ? {
        $or : [
            { name: { $regx: req.query.search, $options: "i" } },
            { email: { $regx: req.query.search, $options: "i" } }
        ]
    } : {}
    const users = await User.find(keyword)
    res.send(users)
})

module.exports = { registerUser, authUser,allUsers };


