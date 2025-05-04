import userModel from '../models/userModel.js';
// import RescueImage from '../models/rescueImageModel.js';
import RescueImage from '../models/imageModel.js';

export const volunteers = async (req, res) => {
  try {
    const { location } = req.query;

    let query = { role: 'volunteer' };

    if (location) {
      query.location = { $regex: new RegExp(location, 'i') };
    }

    const volunteers = await userModel.find(query)
      .select('-password -verifyOtp -resetOtp')
      .sort({ points: -1 }); // Sort by points descending
      
    res.status(200).json(volunteers);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch volunteers', error });
  }
};

export const getVolunteerProfile = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get volunteer info
    const volunteer = await userModel.findById(id)
      .select('-password -verifyOtp -verifyOtpExpireAt -resetOtp -resetOtpExpireAt');
    
    if (!volunteer || volunteer.role !== 'volunteer') {
      return res.status(404).json({ message: 'Volunteer not found' });
    }
    
    // Get volunteer's rescue images with pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const [rescueImages, totalImages] = await Promise.all([
      RescueImage.find({ userId: id })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      RescueImage.countDocuments({ userId: id })
    ]);
    
    res.status(200).json({
      volunteer,
      rescueImages,
      totalImages,
      totalPages: Math.ceil(totalImages / limit),
      currentPage: page
    });
    
  } catch (error) {
    console.error('Error fetching volunteer profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// New controller to get top volunteers
export const getTopVolunteers = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    
    const topVolunteers = await userModel.find({ role: 'volunteer' })
      .sort({ points: -1 })
      .limit(limit)
      .select('name points imageUrl'); // Assuming you'll add profile images later
      
    res.status(200).json(topVolunteers);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch top volunteers', error });
  }
};