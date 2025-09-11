import { BACKEND_URL } from '../utils/api';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import { ProfileCard, TopBar } from '../components';
import notfound from '../assets/404.jpg';
import Skeleton from 'react-loading-skeleton';
import { useSelector } from 'react-redux';

const Profile = () => {
	const { id } = useParams(); // Extract the id parameter from the URL
	// console.log(id) ✅
	const [viewedUser, setViewedUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const [isFollowing, setIsFollowing] = useState(false);
	const { user } = useSelector((state) => state.user);
	const [loggedInUser, setLoggedInUser] = useState('');
	// console.log(id)
	// console.log(user._id)

	useEffect(() => {
		setLoggedInUser(user._id);
	}, []);

	useEffect(() => {
		const fetchUserProfile = async () => {
			try {
				const response = await axios.post(
					`${BACKEND_URL}/users/get-user/${id}`
				);
				setViewedUser(response.data.user);
				setIsFollowing(response.data.user.followers.includes(user._id));
			} catch (error) {
				console.error('Failed to fetch user profile:', error);
			} finally {
				setLoading(false);
			}
		};

		fetchUserProfile();
	}, [id, user]);

	return (
		<div className='home w-full px-0 lg:px-10 pb-20 2xl:px-40 bg-bgColor lg:rounded-lg h-screen overflow-hidden'>
			<TopBar />

			{/* Loading Skeleton */}
			{loading && (
				<div className='w-full flex flex-col items-center justify-center gap-4 pt-5 pb-10'>
					<Skeleton height={100} width={100} circle />
					<Skeleton height={20} width={150} />
					<Skeleton height={20} width={300} />
					<Skeleton height={20} width={400} />
				</div>
			)}

			{/* User not found */}
			{!loading && !viewedUser && (
				<div
					className='w-full flex flex-col items-center justify-center gap-2 lg:gap-4 pt-5 pb-10 h-full items-center mb-1 '
					style={{ backgroundColor: 'white' }}
				>
					<center>
						<img
							src={notfound}
							style={{
								maxWidth: '100%',
								maxHeight: 'calc(100vh - 140px)',
								marginTop: '-200px',
							}}
							alt=''
							height='400px'
							width='400px'
						/>
						<p style={{ fontSize: '25px', color: 'grey' }}>User not Found !</p>
					</center>
				</div>
			)}

			{/* User profile */}
			{!loading && viewedUser && (
				<div className='w-full flex flex-col items-center justify-center gap-2 lg:gap-4 pt-5 pb-10 h-full sm:mx-10 p-5'>
					<div className='w-full md:w-2/3 text-center mx-auto m-4'>
						{/* Pass loggedInUser as id to ProfileCard */}
						<ProfileCard user={viewedUser} loggedInUser={loggedInUser} />
					</div>
				</div>
			)}
		</div>
	);
};

export default Profile;
