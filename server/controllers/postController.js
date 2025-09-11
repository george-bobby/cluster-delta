import Comments from '../models/commentModel.js';
import Posts from '../models/postModel.js';
import Users from '../models/userModel.js';
import express from 'express';

// export const createPost = async (req, res, next) => {
//   try {
//     const { userId } = req.body.user;
//     const { description, image } = req.body;

//     if (!description) {
//       next("You must provide a description");
//       return;
//     }

//     const post = await Posts.create({
//       userId,
//       description,
//       image,
//     });

//     res.status(200).json({
//       sucess: true,
//       message: "Post created successfully",
//       data: post,
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(404).json({ message: error.message });
//   }
// };

// export const createPost = async (req, res, next) => {
//   try {
//     const { userId } = req.body.user;
//     const { description } = req.body;

//     if (!description) {
//       return res.status(400).json({ success: false, message: 'You must provide a description' });
//     }

//     let imageUrl = null;

//     // Check if file exists in the request
//     if (req.file) {
//       // Upload the file to Cloudinary
//       const result = await cloudinary.uploader.upload(req.file.path, {
//         folder: 'your_folder_name', // Set your desired folder name in Cloudinary
//         quality: 'auto',
//       });

//       // Get the URL from the Cloudinary response
//       imageUrl = result.secure_url;
//     }

//     // Create a new post with the Cloudinary image URL
//     const post = await Posts.create({
//       userId,
//       description,
//       image: imageUrl,
//     });

//     res.status(201).json({
//       success: true,
//       message: 'Post created successfully',
//       data: post,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: 'Internal Server Error' });
//   }
// };

export const createPost = async (req, res, next) => {
	try {
		console.log(req.body);

		const { userId, description, image } = req.body;

		if (!userId || !description) {
			return res.status(400).json({
				success: false,
				message: 'UserId and description are required - Server error',
			});
		}

		// Create a new post with the provided image URL
		const post = await Posts.create({
			userId,
			description,
			image,
		});

		res.status(201).json({
			success: true,
			message: 'Post created successfully',
			data: post,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ success: false, message: 'Internal Server Error' });
	}
};

// export const getPost = async (req, res) => {
//   try {
//     // Get posts from the database
//     const { userId } = req.body;
//     const posts = await Posts.find().populate('userId', 'firstName lastName profileUrl tick');

//     // Send the posts as a response
//     res.status(200).json({
//       success: true,
//       message: 'Posts retrieved successfully',
//       data: posts,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: 'Internal Server Error' });
//   }
// };

export const getPost = async (req, res) => {
	try {
		// Get posts from the database
		const { userId } = req.body;
		const posts = await Posts.find().populate({
			path: 'userId',
			select: 'firstName lastName profileUrl tick', // Include tick attribute
		});

		// Send the posts as a response
		res.status(200).json({
			success: true,
			message: 'Posts retrieved successfully',
			data: posts,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ success: false, message: 'Internal Server Error' });
	}
};

// export const getPost = async (req, res, next) => {
//   try {
//     const { id } = req.params;

//     const post = await Posts.findById(id).populate({
//       path: "userId",
//       select: "firstName lastName location profileUrl -password",
//     });
//     // .populate({
//     //   path: "comments",
//     //   populate: {
//     //     path: "userId",
//     //     select: "firstName lastName location profileUrl -password",
//     //   },
//     //   options: {
//     //     sort: "-_id",
//     //   },
//     // })
//     // .populate({
//     //   path: "comments",
//     //   populate: {
//     //     path: "replies.userId",
//     //     select: "firstName lastName location profileUrl -password",
//     //   },
//     // });

//     res.status(200).json({
//       sucess: true,
//       message: "successfully",
//       data: post,
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(404).json({ message: error.message });
//   }
// };

export const getUserPost = async (req, res, next) => {
	try {
		const { id } = req.params;

		const post = await Posts.find({ userId: id })
			.populate({
				path: 'userId',
				select: 'firstName lastName location profileUrl -password',
			})
			.sort({ _id: -1 });

		res.status(200).json({
			sucess: true,
			message: 'successfully',
			data: post,
		});
	} catch (error) {
		console.log(error);
		res.status(404).json({ message: error.message });
	}
};

export const getComments = async (req, res, next) => {
	try {
		const { postId } = req.params;

		const postComments = await Comments.find({ postId })
			.populate({
				path: 'userId',
				select: 'firstName lastName location profileUrl -password',
			})
			.populate({
				path: 'replies.userId',
				select: 'firstName lastName location profileUrl -password',
			})
			.sort({ _id: -1 });

		res.status(200).json({
			sucess: true,
			message: 'successfully',
			data: postComments,
		});
	} catch (error) {
		console.log(error);
		res.status(404).json({ message: error.message });
	}
};

export const likePost = async (req, res, next) => {
	try {
		const { userId } = req.body.user;
		const { id } = req.params;

		const post = await Posts.findById(id);

		const index = post.likes.findIndex((pid) => pid === String(userId));

		if (index === -1) {
			post.likes.push(userId);
		} else {
			post.likes = post.likes.filter((pid) => pid !== String(userId));
		}

		const newPost = await Posts.findByIdAndUpdate(id, post, {
			new: true,
		});

		res.status(200).json({
			sucess: true,
			message: 'successfully',
			data: newPost,
		});
	} catch (error) {
		console.log(error);
		res.status(404).json({ message: error.message });
	}
};

export const likePostComment = async (req, res, next) => {
	const { userId } = req.body.user;
	const { id, rid } = req.params;

	try {
		if (rid === undefined || rid === null || rid === `false`) {
			const comment = await Comments.findById(id);

			const index = comment.likes.findIndex((el) => el === String(userId));

			if (index === -1) {
				comment.likes.push(userId);
			} else {
				comment.likes = comment.likes.filter((i) => i !== String(userId));
			}

			const updated = await Comments.findByIdAndUpdate(id, comment, {
				new: true,
			});

			res.status(201).json(updated);
		} else {
			const replyComments = await Comments.findOne(
				{ _id: id },
				{
					replies: {
						$elemMatch: {
							_id: rid,
						},
					},
				}
			);

			const index = replyComments?.replies[0]?.likes.findIndex(
				(i) => i === String(userId)
			);

			if (index === -1) {
				replyComments.replies[0].likes.push(userId);
			} else {
				replyComments.replies[0].likes = replyComments.replies[0]?.likes.filter(
					(i) => i !== String(userId)
				);
			}

			const query = { '_id': id, 'replies._id': rid };

			const updated = {
				$set: {
					'replies.$.likes': replyComments.replies[0].likes,
				},
			};

			const result = await Comments.updateOne(query, updated, { new: true });

			res.status(201).json(result);
		}
	} catch (error) {
		console.log(error);
		res.status(404).json({ message: error.message });
	}
};

export const commentPost = async (req, res, next) => {
	try {
		const { comment, from } = req.body;
		const { userId } = req.body.user;
		const { id } = req.params;

		if (comment === null) {
			return res.status(404).json({ message: 'Comment is required.' });
		}

		const newComment = new Comments({ comment, from, userId, postId: id });

		await newComment.save();

		//updating the post with the comments id
		const post = await Posts.findById(id);

		post.comments.push(newComment._id);

		const updatedPost = await Posts.findByIdAndUpdate(id, post, {
			new: true,
		});

		res.status(201).json(newComment);
	} catch (error) {
		console.log(error);
		res.status(404).json({ message: error.message });
	}
};

export const replyPostComment = async (req, res, next) => {
	const { userId } = req.body.user;
	const { comment, replyAt, from } = req.body;
	const { id } = req.params;

	if (comment === null) {
		return res.status(404).json({ message: 'Comment is required.' });
	}

	try {
		const commentInfo = await Comments.findById(id);

		commentInfo.replies.push({
			comment,
			replyAt,
			from,
			userId,
			created_At: Date.now(),
		});

		commentInfo.save();

		res.status(200).json(commentInfo);
	} catch (error) {
		console.log(error);
		res.status(404).json({ message: error.message });
	}
};

export const deletePost = async (req, res, next) => {
	try {
		const { id } = req.params;

		await Posts.findByIdAndDelete(id);

		res.status(200).json({
			success: true,
			message: 'Deleted successfully',
		});
	} catch (error) {
		console.log(error);
		res.status(404).json({ message: error.message });
	}
};
