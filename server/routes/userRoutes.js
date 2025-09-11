import express from "express";
import path from "path";
import User from "../models/userModel.js";
import {
  acceptRequest,
  changePassword,
  friendRequest,
  getFriendRequest,
  getUser,
  profileViews,
  requestPasswordReset,
  resetPassword,
  suggestedFriends,
  updateUser,
  verifyEmail,
  getAllUsers,
} from "../controllers/userController.js";
import {checkFollowing,followUser,unfollowUser} from "../controllers/connection.controller.js";
import userAuth from "../middleware/authMiddleware.js";
import likePost from "../controllers/postLikes.controller.js";
import tickUser from '../controllers/tick.controller.js';

const router = express.Router();
const __dirname = path.resolve(path.dirname(""));



router.get("/verify/:userId/:token", verifyEmail);
// PASSWORD RESET
router.post("/request-passwordreset", requestPasswordReset);
router.get("/reset-password/:userId/:token", resetPassword);
router.post("/reset-password", changePassword);

//GET ALL USERS
router.get("/getAllusers", getAllUsers);

// user routes
router.post("/get-user/:id?", getUser);
router.put("/update-user", userAuth, updateUser);

// friend request
router.post("/friend-request", userAuth, friendRequest);
router.post("/get-friend-request", userAuth, getFriendRequest);

// accept / deny friend request
router.post("/accept-request", userAuth, acceptRequest);

// view profile
router.post("/profile-view", userAuth, profileViews);

//suggested friends
router.post("/suggested-friends", suggestedFriends);

router.get("/verified", (req, res) => {
  res.sendFile(path.join(__dirname, "./views/build", "index.html"));
});

router.get("/resetpassword", (req, res) => {
  res.sendFile(path.join(__dirname, "./views/build", "index.html"));
});

router.get('/is-following/:id',  checkFollowing);


router.get('/is-following/:id',  checkFollowing);

router.post("/follow", async (req, res) => {
  const { followerId, followeeId } = req.body;

  try {
    const result = await followUser(followerId, followeeId);
    res.status(200).json({ message: result });
  } catch (error) {
    console.error("Failed to follow user:", error);
    res.status(500).json({ error: "Failed to follow user" });
  }
});

router.post("/unfollow", async (req, res) => {
  const { followerId, followeeId } = req.body;

  try {
    const result = await unfollowUser(followerId, followeeId);
    res.status(200).json({ message: result });
  } catch (error) {
    console.error("Failed to unfollow user:", error);
    res.status(500).json({ error: "Failed to unfollow user" });
  }
});

router.get("/checkFollowing/:loggedInUserId/:viewedUserId", async (req, res) => {
  const { loggedInUserId, viewedUserId } = req.params;

  try {
    const result = await checkFollowing(loggedInUserId, viewedUserId);
    res.status(200).json(result);
  } catch (error) {
    console.error("Failed to check following status:", error);
    res.status(500).json({ error: "Failed to check following status" });
  }
});

router.get('/followers/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    // Assuming your User model has a followers field which is an array of follower IDs
    const user = await User.findById(userId).populate('followers', 'firstName lastName profileUrl');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Extract followers' profile information
    const followers = user.followers.map(follower => ({
      id: follower._id,
      firstName: follower.firstName,
      lastName: follower.lastName,
      profileUrl: follower.profileUrl
    }));
    
    res.json({ followers });
  } catch (error) {
    console.error('Error fetching followers:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


router.post('/like', likePost);

router.put('/tick/:userId',tickUser)


export default router;
