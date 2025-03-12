import jwt from 'jsonwebtoken';
import user from '../models/user.model.js'; .3

const authMiddleware = async (req, res, next) => {
  try {
    // Get token from cookies or authorization header
    const token = req.cookies.token;
    console.log(token+"-"+"token");
    

    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
if (!decoded) {
  return res.status(403).json({ message: "Invalid token" });  // Return 403 if token is invalid or expired
 
}
    // Find the user by decoded ID (Check if your token contains `userId` or `id`)
    const userId = decoded.id;

    console.log(userId)
const loggedInUser = await user.findById(userId).select("-password"); 

    if (!loggedInUser) {
      return res.status(404).json({ message:  `${loggedInUser}` });
    }

    // Attach user details to request object
    req.user = loggedInUser;
    
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    return res.status(403).json({ message: "Invalid token", error: error.message });
  }
};

export default authMiddleware;
