import userModel from "../models/userModel.js";

export const volunteers = async (req, res) => {
  try {
    const { location } = req.query;

    // Base query: get all users with role 'volunteer'
    let query = { role: 'volunteer' };

    // If location is provided, apply location filter (case-insensitive)
    if (location) {
      query.location = { $regex: new RegExp(location, 'i') };
    }

    const volunteers = await userModel.find(query).select('-password -verifyOtp -resetOtp');
    res.status(200).json(volunteers);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch volunteers', error });
  }
};
