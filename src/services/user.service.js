import User from '../models/user.model.js';

export const getAllUsers = async () => {
  return await User.find();
};

export const createUser = async (data) => {
  const user = new User(data);
  return await user.save();
};