import userModel from "../models/userModel.js";


export const getUserData = async (req, res) => {
  const { userId } = req;
  try {
    if (!userId) {
      return res.json({ success: false });
    }

    const user = await userModel.findById(userId).select("-password");
    if (!user) {
      return res.json({ success: false });
    }
    res.json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        location: user.location,
        bio: user.bio,
        role: user.role,
        points: user.points,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false });
  }
};

export const setUserData = async (req, res) => {
  const { userId } = req;
  try {
    const updatedUser = await userModel.findByIdAndUpdate(userId, req.body, { new: true }).select("-password");
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: "Update failed" });
  }
};

export const addPoints = async (req, res) => {
  try {
    const {userId} = req;
    const { bkashNumber, amount } = req.body;

    if (!bkashNumber || !amount) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.points += parseInt(amount);
    await user.save();

    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: "Failed to add points" });
  }
};


