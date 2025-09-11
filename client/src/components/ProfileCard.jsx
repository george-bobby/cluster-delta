import { BACKEND_URL } from '../utils/api';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BsPersonFillAdd } from 'react-icons/bs';
import { CiLocationOn } from 'react-icons/ci';
import moment from 'moment';
import { NoProfile } from '../assets';
import axios from 'axios';
import { BsInstagram, BsFacebook } from 'react-icons/bs';
import { FaTwitterSquare } from 'react-icons/fa';
import Modal from '../components/FollowerModel';
import { FaCheckCircle } from 'react-icons/fa';
import SkillProfilePills from './SkillProfilePills';
import EditProfile from './EditProfile';

const ProfileCard = ({ user, loggedInUser }) => {
	const [isFollowing, setIsFollowing] = useState(false);
	const [showFollowersModal, setShowFollowersModal] = useState(false);
	const [followers, setFollowers] = useState([]);
	const [showEditModal, setEditModal] = useState(false);
	useEffect(() => {
		const checkFollowingStatus = async () => {
			try {
				const response = await axios.get(
					`${BACKEND_URL}/users/checkFollowing/${loggedInUser}/${user._id}`
				);
				setIsFollowing(response.data.isFollowing);
			} catch (error) {
				console.error('Failed to check following status:', error);
			}
		};

		if (loggedInUser) {
			checkFollowingStatus();
		}
	}, [loggedInUser, user._id]);

	const handleFollow = async () => {
		try {
			await axios.post(`${BACKEND_URL}/users/follow`, {
				followerId: loggedInUser,
				followeeId: user._id,
			});

			setIsFollowing(true); // Update isFollowing state after successful follow
			console.log('User followed successfully');
		} catch (error) {
			console.error('Failed to follow user:', error);
		}
	};

	const handleUnfollow = async () => {
		try {
			await axios.post(`${BACKEND_URL}/users/unfollow`, {
				followerId: loggedInUser,
				followeeId: user._id,
			});

			setIsFollowing(false); // Update isFollowing state after successful unfollow
			console.log('User unfollowed successfully');
		} catch (error) {
			console.error('Failed to unfollow user:', error);
		}
	};

	const toggleFollowersModal = async () => {
		try {
			const response = await axios.get(
				`${BACKEND_URL}/users/followers/${user._id}`
			);
			setFollowers(response.data.followers);
			setShowFollowersModal(!showFollowersModal);
		} catch (error) {
			console.error('Failed to fetch followers:', error);
		}
	};

	return (
		<div>
			<div className='w-full bg-primary flex flex-col items-center shadow-sm rounded-xl px-6 py-4'>
				<div className='w-full flex flex-wrap items-center justify-between border-b pb-5 border-[#66666645]'>
					<Link to={'/profile/' + user?._id} className='flex gap-2'>
						<img
							src={user && user.profileUrl ? user.profileUrl : NoProfile}
							alt={user && user.email}
							className='w-14 h-14 object-cover rounded-full'
						/>
						<div className='flex flex-col justify-center'>
							<div className='flex items-center'>
								<p
									className='text-lg font-medium text-ascent-1'
									style={{
										marginBottom: '-5px',
									}}
								>
									{user?.firstName} {user?.lastName}
								</p>
								{user?.tick && (
									<FaCheckCircle
										className='ml-1'
										style={{ color: '#0084ff' }}
									/>
								)}
							</div>
							<span className='text-ascent-2'>
								{user?.profession ?? 'No Profession'} • Joined{' '}
								{moment(user?.createdAt).fromNow()}
							</span>
						</div>
					</Link>
					<div className='ml-auto md:ml-2 lg:ml-4 mt-4'>
						<button
							style={{
								backgroundColor: 'black',
								color: 'white',
								padding: '10px',
								borderRadius: '5px',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
							}}
							onClick={() => setEditModal(true)}
						>
							<svg
								xmlns='http://www.w3.org/2000/svg'
								viewBox='-2 -2 24 24'
								width='28'
								fill='currentColor'
							>
								<path d='M5.72 14.456l1.761-.508 10.603-10.73a.456.456 0 0 0-.003-.64l-.635-.642a.443.443 0 0 0-.632-.003L6.239 12.635l-.52 1.82zM18.703.664l.635.643c.876.887.884 2.318.016 3.196L8.428 15.561l-3.764 1.084a.901.901 0 0 1-1.11-.623.915.915 0 0 1-.002-.506l1.095-3.84L15.544.647a2.215 2.215 0 0 1 3.159.016zM7.184 1.817c.496 0 .898.407.898.909a.903.903 0 0 1-.898.909H3.592c-.992 0-1.796.814-1.796 1.817v10.906c0 1.004.804 1.818 1.796 1.818h10.776c.992 0 1.797-.814 1.797-1.818v-3.635c0-.502.402-.909.898-.909s.898.407.898.91v3.634c0 2.008-1.609 3.636-3.593 3.636H3.592C1.608 19.994 0 18.366 0 16.358V5.452c0-2.007 1.608-3.635 3.592-3.635h3.592z'></path>
							</svg>
							<span>Edit Profile</span>
						</button>
					</div>
					<div className=''>
						{loggedInUser && user && loggedInUser !== user._id && (
							<button
								onClick={isFollowing ? handleUnfollow : handleFollow}
								className={`bg-[#000000] flex text-sm text-white p-2 rounded ${
									isFollowing ? 'border-black' : ''
								}`}
								style={{ backgroundColor: isFollowing ? '#fc4e54' : '' }}
							>
								{isFollowing ? 'Unfollow' : 'Follow'}
								<BsPersonFillAdd size={20} className='text-[#ffffff] ml-3' />
							</button>
						)}
					</div>
				</div>
				<div className='w-full flex flex-col gap-2 py-4 border-b border-[#66666645]'>
					<div className='flex gap-2 items-center text-ascent-2'>
						<CiLocationOn className='text-xl text-ascent-1' />
						<span>{user?.location ?? 'Add Class'}</span>
					</div>
					<div className='flex gap-2 items-center text-ascent-2'>
						<span>Profession:</span>
						<span>{user?.profession ?? 'Add Proffession'}</span>
					</div>
					<div
						className='flex gap-2 items-center text-ascent-2'
						style={{ cursor: 'pointer' }}
						onClick={toggleFollowersModal}
					>
						<span>Followers:</span>
						<span>{user?.followers?.length} Followers</span>
					</div>
				</div>
				{/* <div className="w-full flex flex-col gap-2 py-4 border-b border-[#66666645]" onClick={toggleFollowersModal} >
          <p className="text-xl text-ascent-1 font-semibold">
            {user?.followers?.length} Followers
          </p>
          <span className="text-base text-blue">
            {user?.verified ? "Verified Account" : "Not Verified"}
          </span>
        </div> */}
				<div className='w-full flex flex-col gap-4 py-4 pb-6'>
					<p className='text-ascent-1 text-lg font-semibold'>Skills</p>
					<div className='flex flex-wrap gap-2'>
						{user.skills && user.skills.length > 0 ? (
							<SkillProfilePills skills={user.skills} />
						) : (
							<span className='text-ascent-2'>No Skills Added</span>
						)}
					</div>
				</div>

				{/* Render modal if showFollowersModal is true */}
				{showFollowersModal && (
					<Modal onClose={toggleFollowersModal} followers={followers} />
				)}
				{showEditModal && (
					<EditProfile
						closeModal={() => {
							setEditModal(false);
						}}
						userskills={user.skills}
						userlocation={user.location}
						userprof={user.profession}
						userprofileurl={user.profileUrl}
						userid={user._id}
					/>
				)}
				<div className='w-full flex flex-col gap-4 py-4 pb-6'>
					<p className='text-ascent-1 text-lg font-semibold'>Social Profile</p>

					<div className='flex gap-2 items-center text-ascent-2'>
						<BsInstagram className=' text-xl text-ascent-1' />
						<span>Instagram</span>
					</div>
					<div className='flex gap-2 items-center text-ascent-2'>
						<FaTwitterSquare className=' text-xl text-ascent-1' />
						<span>Twitter</span>
					</div>
					<div className='flex gap-2 items-center text-ascent-2'>
						<BsFacebook className=' text-xl text-ascent-1' />
						<span>Facebook</span>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ProfileCard;
