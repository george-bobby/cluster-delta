import Users from "../models/userModel.js";
import { compareString, createJWT, hashString } from "../utils/index.js";
import { sendVerificationEmail } from "../utils/sendEmail.js";

export const register = async (req, res, next) => {
  const { firstName, lastName, email, password, profileUrl, role, experienceLevel, portfolioUrl, githubUrl, linkedinUrl, university, graduationYear, profession, skills, location } = req.body;

  //validate fileds
  if (!(firstName || lastName || email || password)) {
    next("Provide Required Fields!");
    return;
  }

  try {
    const userExist = await Users.findOne({ email });

    if (userExist) {
      next("Email Address already exists");
      return;
    }

    const hashedPassword = await hashString(password);

    const user = await Users.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      profileUrl,
      role,
      experienceLevel,
      portfolioUrl,
      githubUrl,
      linkedinUrl,
      university,
      graduationYear,
      profession,
      skills,
      location,
    });

    const token = createJWT(user._id);

    res.status(201).json({
      success: "SUCCESSFUL",
      message: "Registration successful. Token created.",
      token,
      user,
    });

    //send email verification to user
    // sendVerificationEmail(user, res);
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};



export const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    // Validation
    if (!email || !password) {
      throw new Error("Please Provide User Credentials");
    }

    // Find user by email
    const user = await Users.findOne({ email }).select("+password").populate({
      path: "friends",
      select: "firstName lastName location profileUrl -password",
    });

    
    if (!user) {
      next("Invalid email or password");
      throw new Error("Invalid email or password");
      
    }

    if (!user?.verified) {
      throw new Error("User email is not verified. Check your email account and verify your email");
    }

    // Compare password
    const isMatch = await compareString(password, user?.password);

    if (!isMatch) {
      throw new Error("Invalid email or password");
    }

    // Clear sensitive information
    user.password = undefined;

    const token = createJWT(user?._id);

    res.status(200).json({
      success: true,
      message: "Login successfully",
      user,
      token,
    });
  } catch (error) {
    console.error(error);

    // Pass the error to the next middleware
    next(error);
  }
};
