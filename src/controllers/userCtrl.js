import userModel from "../models/user.model.js";
import roleModel from "../models/roles.model.js";
import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";
const createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }
    const newUser = new userModel({
      name,
      email,
      password: await userModel.enCryptPassword(password),
      rol: await roleModel.findOne({ name: "user" }),
    });
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    const userSaved = await newUser.save();
    if (!userSaved) {
      return res.status(400).json({ error: "User not created" });
    }
    res.status(201).json({
      message: "User created successfully",
      user: { name: userSaved.name, iduser: userSaved._id },
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }
    const emailFound = await userModel.findOne({ email });
    if (!emailFound) {
      return res.status(400).json({ error: "Email or Passowrd is incorrect" });
    }
    const passwordMatch = await userModel.comparePassword(
      password,
      emailFound.password
    );
    if (!passwordMatch) {
      return res.status(400).json({ error: "Email or Passowrd is incorrect" });
    }
    const token = jwt.sign({ id: emailFound._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.status(200).json({ token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getUser = async (req, res) => {
  try {
    const user = await userModel.find();

    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }
    const updatedUser = await userModel.findByIdAndUpdate(
      id,
      { name, email, password },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(updatedUser);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await userModel.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export { login, createUser, getUser, updateUser, deleteUser };
