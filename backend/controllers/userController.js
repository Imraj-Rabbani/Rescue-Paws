import userModel from "../models/userModel.js";


export const getUserData = async (req, res) => {
  const { userId } = req;
  try {
    if (!userId) {
      return res.json({ success: false });
    }

    const user = await userModel.findById(userId).select("-password");
    // console.log(user.role, "Inside getUserData");™
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
  console.log("Set User controller e ashtese")
  const { userId } = req;
  try {
    console.log(req.body, "Inside set user data")
    const updatedUser = await userModel.findByIdAndUpdate(userId, req.body, { new: true }).select("-password");
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: "Update failed" });
  }
};




