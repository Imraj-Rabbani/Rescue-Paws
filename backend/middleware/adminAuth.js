const adminAuth = (req, res, next) => {
    if (req.user?.role === 'admin') {
      next();
    } else {
      return res.status(403).json({ success: false, message: "Access denied. Admins only." });
    }
  };
  
  export default adminAuth;
  