import { BACKEND_URL } from '../utils/api';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	Card,
} from '@mui/material';
import style from '../styles/admin.css'; // Import your old styling here

const UserListTable = () => {
	const [userList, setUserList] = useState([]);
	const [joinedToday, setJoinedToday] = useState(0);
	const [last30Days, setLast30Days] = useState(0);

	useEffect(() => {
		axios
			.get(`${BACKEND_URL}/users/getAllUsers`)
			.then((response) => {
				setUserList(response.data.users);
				calculateStatistics(response.data.users);
			})
			.catch((error) => {
				console.error('Error fetching user list:', error);
			});
	}, []);

	const calculateStatistics = (users) => {
		const today = new Date();
		const thirtyDaysAgo = new Date();
		thirtyDaysAgo.setDate(today.getDate() - 30);

		const joinedTodayCount = users.filter(
			(user) => new Date(user.createdAt).toDateString() === today.toDateString()
		).length;

		const last30DaysCount = users.filter(
			(user) =>
				new Date(user.createdAt) >= thirtyDaysAgo &&
				new Date(user.createdAt) <= today
		).length;

		setJoinedToday(joinedTodayCount);
		setLast30Days(last30DaysCount);
	};

	const handleCheckboxChange = async (userId, isChecked) => {
		try {
			await axios.put(`${BACKEND_URL}/users/tick/${userId}`, {
				tick: isChecked,
			});

			const updatedUserList = userList.map((user) => {
				if (user._id === userId) {
					return { ...user, tick: isChecked };
				}
				return user;
			});
			setUserList(updatedUserList);
		} catch (error) {
			console.error('Error updating tick status:', error);
		}
	};

	return (
		<div>
			{/* Statics Card */}
			<Card variant='outlined' style={{ marginBottom: 16 }}>
				<div
					id='rootforadmin'
					className='flex flex-col md:flex-row md:items-stretch md:space-x-4 m-4'
				>
					<div className='container'>
						<div className='flex flex-wrap md:-mx-4'>
							<div className='c-dashboardInfo col w-full md:w-1/3 px-4 mb-4 md:mb-0'>
								<div className='wrap'>
									<h4 className='heading heading5 hind-font medium-font-weight c-dashboardInfo__title'>
										Total Users
									</h4>
									<span className='hind-font caption-12 c-dashboardInfo__count'>
										{userList.length}
									</span>
								</div>
							</div>
							<div className='c-dashboardInfo col w-full md:w-1/3 px-4 mb-4 md:mb-0'>
								<div className='wrap'>
									<h4 className='heading heading5 hind-font medium-font-weight c-dashboardInfo__title'>
										Joined Today
									</h4>
									<span className='hind-font caption-12 c-dashboardInfo__count'>
										{joinedToday}
									</span>
								</div>
							</div>
							<div className='c-dashboardInfo col w-full md:w-1/3 px-4 mb-4 md:mb-0'>
								<div className='wrap'>
									<h4 className='heading heading5 hind-font medium-font-weight c-dashboardInfo__title'>
										Last 30 days users
									</h4>
									<span className='hind-font caption-12 c-dashboardInfo__count'>
										{last30Days}
									</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</Card>

			{/* User List Table */}
			<TableContainer component={Paper}>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell>User ID</TableCell>
							<TableCell>Username</TableCell>
							<TableCell>Email</TableCell>
							<TableCell>Joined Date</TableCell>
							<TableCell>Tick</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{userList
							.slice()
							.reverse()
							.map((user) => (
								<TableRow key={user._id}>
									<TableCell>{user._id}</TableCell>
									<TableCell>{user.firstName}</TableCell>
									<TableCell>{user.email}</TableCell>
									<TableCell>
										{new Intl.DateTimeFormat('en-US', {
											year: 'numeric',
											month: 'long',
											day: 'numeric',
											hour: 'numeric',
											minute: 'numeric',
											second: 'numeric',
											hour12: false,
										}).format(new Date(user.createdAt))}
									</TableCell>
									<TableCell>
										<input
											type='checkbox'
											checked={user.tick}
											onChange={(e) =>
												handleCheckboxChange(user._id, e.target.checked)
											}
										/>
									</TableCell>
								</TableRow>
							))}
					</TableBody>
				</Table>
			</TableContainer>
		</div>
	);
};

export default UserListTable;
