import mongoose from "mongoose";
import Verification from "../models/emailVerification.js";
import Users from "../models/userModel.js";
import { compareString, createJWT, hashString } from "../utils/index.js";
import PasswordReset from "../models/PasswordReset.js";
import { resetPasswordLink } from "../utils/sendEmail.js";
import FriendRequest from "../models/friendRequest.js";

export const verifyEmail = async (req, res) => {
  const { userId, token } = req.params;

  try {
    const result = await Verification.findOne({ userId });

    if (result) {
      const { expiresAt, token: hashedToken } = result;

      // token has expires
      if (expiresAt < Date.now()) {
        Verification.findOneAndDelete({ userId })
          .then(() => {
            Users.findOneAndDelete({ _id: userId })
              .then(() => {
                const message = "Verification token has expired.";
                res.redirect(`/users/verified?status=error&message=${message}`);
              })
              .catch((err) => {
                res.redirect(`/users/verified?status=error&message=`);
              });
          })
          .catch((error) => {
            console.log(error);
            res.redirect(`/users/verified?message=`);
          });
      } else {
        //token valid
        compareString(token, hashedToken)
          .then((isMatch) => {
            if (isMatch) {
              Users.findOneAndUpdate({ _id: userId }, { verified: true })
                .then(() => {
                  Verification.findOneAndDelete({ userId }).then(() => {
                    const message = "Email verified successfully";
                    res.redirect(
                      `/users/verified?status=success&message=${message}`
                    );
                  });
                })
                .catch((err) => {
                  console.log(err);
                  const message = "Verification failed or link is invalid";
                  res.redirect(
                    `/users/verified?status=error&message=${message}`
                  );
                });
            } else {
              // invalid token
              const message = "Verification failed or link is invalid";
              res.redirect(`/users/verified?status=error&message=${message}`);
            }
          })
          .catch((err) => {
            console.log(err);
            res.redirect(`/users/verified?message=`);
          });
      }
    } else {
      const message = "Invalid verification link. Try again later.";
      res.redirect(`/users/verified?status=error&message=${message}`);
    }
  } catch (error) {
    console.log(error);
    res.redirect(`/users/verified?message=`);
  }
};

export const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await Users.findOne({ email });

    if (!user) {
      return res.status(404).json({
        status: "FAILED",
        message: "Email address not found.",
      });
    }

    const existingRequest = await PasswordReset.findOne({ email });
    if (existingRequest) {
      if (existingRequest.expiresAt > Date.now()) {
        return res.status(201).json({
          status: "PENDING",
          message: "Reset password link has already been sent tp your email.",
        });
      }
      await PasswordReset.findOneAndDelete({ email });
    }
    await resetPasswordLink(user, res);
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

export const resetPassword = async (req, res) => {
  const { userId, token } = req.params;

  try {
    // find record
    const user = await Users.findById(userId);

    if (!user) {
      const message = "Invalid password reset link. Try again";
      res.redirect(`/users/resetpassword?status=error&message=${message}`);
    }

    const resetPassword = await PasswordReset.findOne({ userId });

    if (!resetPassword) {
      const message = "Invalid password reset link. Try again";
      return res.redirect(
        `/users/resetpassword?status=error&message=${message}`
      );
    }

    const { expiresAt, token: resetToken } = resetPassword;

    if (expiresAt < Date.now()) {
      const message = "Reset Password link has expired. Please try again";
      res.redirect(`/users/resetpassword?status=error&message=${message}`);
    } else {
      const isMatch = await compareString(token, resetToken);

      if (!isMatch) {
        const message = "Invalid reset password link. Please try again";
        res.redirect(`/users/resetpassword?status=error&message=${message}`);
      } else {
        res.redirect(`/users/resetpassword?type=reset&id=${userId}`);
      }
    }
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const { userId, password } = req.body;

    const hashedpassword = await hashString(password);

    const user = await Users.findByIdAndUpdate(
      { _id: userId },
      { password: hashedpassword }
    );

    if (user) {
      await PasswordReset.findOneAndDelete({ userId });

      res.status(200).json({
        ok: true,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

// export const getUser = async (req, res, next) => {
//   try {
//     const { userId } = req.body.user;
//     const { id } = req.params;

//     const user = await Users.findById(id ?? userId).populate({
//       path: "friends",
//       select: "-password",
//     });

//     if (!user) {
//       return res.status(200).send({
//         message: "User Not Found",
//         success: false,
//       });
//     }

//     user.password = undefined;

//     res.status(200).json({
//       success: true,
//       user: user,
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({
//       message: "auth error",
//       success: false,
//       error: error.message,
//     });
//   }
// };


export const getUser = async (req, res, next) => {
  try {
    const { id } = req.params; // Use req.params directly

    console.log(id, "id");
    console.log(req.params, "req.params");
    
    const user = await Users.findById(id).populate({
      path: "friends",
      select: "-password",
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User Not Found",
      });
    }

    user.password = undefined;

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};



// export const updateUser = async (req, res, next) => {
//   try {
//     const { firstName, lastName, location, profileUrl, profession, skills } = req.body;

//     if (!(firstName || lastName || profession || location)) {
//       return res.status(400).json({ message: "Please provide all required fields" });
//     }

//     const { userId } = req.body.user;

//     const updateUser = {
//       firstName,
//       lastName,
//       location,
//       profileUrl,
//       profession,
//       skills,
//       _id: userId,
//     };

//     const user = await Users.findByIdAndUpdate(userId, updateUser, {
//       new: true,
//     });

//     await user.populate({ path: "friends", select: "-password" }); 

//     const token = createJWT(user._id); 

//     user.password = undefined; 

//     res.status(200).json({
//       success: true,
//       message: "User updated successfully",
//       user,
//       token,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: error.message });
//   }
// };
export const updateUser = async (req, res, next) => {
  try {
    const { firstName, lastName, location, profileUrl, profession, skills, userId, role, experienceLevel, portfolioUrl, githubUrl, linkedinUrl, university, graduationYear } = req.body;

    // Validate userId
    if (!userId) {
      return res.status(400).json({ message: "User ID is missing." });
    }

    if (!(firstName || lastName || profession || location)) {
      return res.status(400).json({ message: "Please provide all required fields" });
    }

    const updateUser = {
      firstName,
      lastName,
      location,
      profileUrl,
      profession,
      skills,
      role,
      experienceLevel,
      portfolioUrl,
      githubUrl,
      linkedinUrl,
      university,
      graduationYear,
      _id: userId,
    };

    const user = await Users.findByIdAndUpdate(userId, updateUser, {
      new: true,
    });

    await user.populate({ path: "friends", select: "-password" }); 

    const token = createJWT(user._id); 

    user.password = undefined; 

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      user,
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};


export const friendRequest = async (req, res, next) => {
  try {
    const { userId } = req.body.user;

    const { requestTo } = req.body;

    const requestExist = await FriendRequest.findOne({
      requestFrom: userId,
      requestTo,
    });

    if (requestExist) {
      next("Friend Request already sent.");
      return;
    }

    const accountExist = await FriendRequest.findOne({
      requestFrom: requestTo,
      requestTo: userId,
    });

    if (accountExist) {
      next("Friend Request already sent.");
      return;
    }

    const newRes = await FriendRequest.create({
      requestTo,
      requestFrom: userId,
    });

    res.status(201).json({
      success: true,
      message: "Friend Request sent successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "auth error",
      success: false,
      error: error.message,
    });
  }
};

export const getFriendRequest = async (req, res) => {
  try {
    const { userId } = req.body.user;

    const request = await FriendRequest.find({
      requestTo: userId,
      requestStatus: "Pending",
    })
      .populate({
        path: "requestFrom",
        select: "firstName lastName profileUrl profession -password",
      })
      .limit(10)
      .sort({
        _id: -1,
      });

    res.status(200).json({
      success: true,
      data: request,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "auth error",
      success: false,
      error: error.message,
    });
  }
};

export const acceptRequest = async (req, res, next) => {
  try {
    const id = req.body.user.userId;

    const { rid, status } = req.body;

    const requestExist = await FriendRequest.findById(rid);

    if (!requestExist) {
      next("No Friend Request Found.");
      return;
    }

    const newRes = await FriendRequest.findByIdAndUpdate(
      { _id: rid },
      { requestStatus: status }
    );

    if (status === "Accepted") {
      const user = await Users.findById(id);

      user.friends.push(newRes?.requestFrom);

      await user.save();

      const friend = await Users.findById(newRes?.requestFrom);

      friend.friends.push(newRes?.requestTo);

      await friend.save();
    }

    res.status(201).json({
      success: true,
      message: "Friend Request " + status,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "auth error",
      success: false,
      error: error.message,
    });
  }
};

export const profileViews = async (req, res, next) => {
  try {
    const { userId } = req.body.user;
    const { id } = req.body.params;

    const user = await Users.findById(id);

    user.views.push(userId);

    await user.save();

    res.status(201).json({
      success: true,
      message: "Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "auth error",
      success: false,
      error: error.message,
    });
  }
};

export const suggestedFriends = async (req, res) => {
  try {
    const { userId } = req.body;

    // Get current user's skills
    const currentUser = await Users.findById(userId).select("skills friends");
    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const currentUserSkills = currentUser.skills || [];
    const currentUserFriends = currentUser.friends || [];

    // Find all users except current user and existing friends
    const allUsers = await Users.find({
      _id: { $ne: userId, $nin: currentUserFriends }
    }).select("firstName lastName profileUrl profession skills -password");

    // Calculate skill similarity for each user
    const usersWithSimilarity = allUsers.map(user => {
      const userSkills = user.skills || [];
      
      // Flatten skills array if it's nested
      const flatCurrentSkills = currentUserSkills.flat();
      const flatUserSkills = userSkills.flat();
      
      // Calculate similarity score based on common skills
      const commonSkills = flatCurrentSkills.filter(skill => 
        flatUserSkills.some(userSkill => 
          userSkill.toLowerCase().trim() === skill.toLowerCase().trim()
        )
      );
      
      // Calculate similarity percentage
      const totalUniqueSkills = new Set([...flatCurrentSkills, ...flatUserSkills]).size;
      const similarityScore = totalUniqueSkills > 0 ? (commonSkills.length / totalUniqueSkills) * 100 : 0;
      
      return {
        ...user.toObject(),
        similarityScore,
        commonSkills: commonSkills.length,
        actualCommonSkills: commonSkills
      };
    });

    // Sort by similarity score (descending) and filter users with at least some similarity
    const suggestedFriends = usersWithSimilarity
      .filter(user => user.commonSkills > 0) // Only users with at least 1 common skill
      .sort((a, b) => {
        // First sort by number of common skills, then by similarity score
        if (b.commonSkills !== a.commonSkills) {
          return b.commonSkills - a.commonSkills;
        }
        return b.similarityScore - a.similarityScore;
      })
      .slice(0, 5); // Limit to 5 suggestions as requested

    // If no users with similar skills found, return some random users
    if (suggestedFriends.length === 0) {
      const randomUsers = usersWithSimilarity
        .sort(() => 0.5 - Math.random())
        .slice(0, 5);
      
      return res.status(200).json({
        success: true,
        data: randomUsers.map(user => ({
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          profileUrl: user.profileUrl,
          profession: user.profession,
          skills: user.skills
        })),
        message: "No users with similar skills found. Showing random suggestions."
      });
    }

    // Remove similarity scores from response (keep it clean for frontend)
    const cleanSuggestions = suggestedFriends.map(user => ({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      profileUrl: user.profileUrl,
      profession: user.profession,
      skills: user.skills
    }));

    res.status(200).json({
      success: true,
      data: cleanSuggestions,
      message: "Friend suggestions based on similar skills"
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};


export const getAllUsers = async (req, res) => {
  try {
    // Fetch all users from the database
    const users = await Users.find();

    // Return the list of users in the response
    res.status(200).json({ users });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
