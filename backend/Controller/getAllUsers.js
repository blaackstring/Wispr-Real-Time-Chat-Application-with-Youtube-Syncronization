
import ConversationModel from "../models/conversation.model.js";
import user from "../models/user.model.js";
export const getAllUsers = async (req, res) => {
    try {
      const requestedUsers = String(req.query.fullname)
  
      console.log("Search Query:", requestedUsers);
  
      // If no query is provided, return an empty array or a message
      if (!requestedUsers) {
        return res.status(400).json({ message: "Please provide a search query" });
      }
  
      // Create a case-insensitive regex pattern
      const regexPattern = new RegExp(requestedUsers, "i"); // 'i' makes it case-insensitive
  
      const AllUsers = await user
        .find({
          $and: [
            {
              $or: [
                { fullname: { $regex: regexPattern } },
                { username: { $regex: regexPattern } }
              ]
            },
            { _id: { $ne: req.user._id } } // Exclude the logged-in user
          ]
        })
        .select("-password"); // Exclude password, include email
  
      console.log("Found Users:", AllUsers);
  
      if (!AllUsers.length) {
        return res.status(404).json({ message: "No users found" });
      }
  
      res.status(200).json({
        message: "Users fetched successfully",
        users: AllUsers
      });
  
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({
        success: false,
        message: "Error while fetching users"
      });
    }
  };
  

  export const getRecentUsers = async(req,res)=>{
    try {
        
        
        const recentUserswithDisturbData = await ConversationModel.find({
            participants: req.user._id
        }).sort({updatedAt:-1})
if(!recentUserswithDisturbData) return res.status(200).send({ message: "NO recent Chats "})

        const otherParticipantsIDS = recentUserswithDisturbData.reduce((ids, data) => {
            const filteredUsers = data.participants
                .filter(userids => req.user._id.toString() !== userids.toString())
                .map(userids => userids.toString()); // Convert all IDs to strings
        
            return [...ids, ...filteredUsers];
        }, []);
        const users = await user.find({ _id: { $in: otherParticipantsIDS } }).select("-password -email");
        console.log(users);
        
        res.status(200).send({
          message: "Recent Users fetched successfully",
            recentUsers:users
        });
    } catch (error) {
        console.error("Error in fetching recent  users:", error);
        res.status(500).json({
          success: false,
          message: "Error in fetching recent  users:"
        });
    }
  }