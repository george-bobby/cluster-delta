import { BACKEND_URL } from '../utils/api';
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { MdClose } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import TextInput from './TextInput';
import Loading from './Loading';
import CustomButton from './CustomButton';
import './fileUpload.css';
import { UpdateProfile, UserLogin } from '../redux/userSlice';
const EditProfile = ({
	closeModal,
	userskills,
	userprof,
	userlocation,
	userprofileurl,
	userid,
}) => {
	const { user } = useSelector((state) => state.user);
	const dispatch = useDispatch();
	const [errMsg, setErrMsg] = useState('');
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [picture, setPicture] = useState(null);
	const [skills, setSkills] = useState(userskills || []);
	const [skillInput, setSkillInput] = useState('');
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		mode: 'onChange',
		defaultValues: {
			firstName: user?.firstName,
			lastName: user?.lastName,
			profession: userprof,
			location: userlocation,
		},
	});

	useEffect(() => {
		const userToken = localStorage.getItem('user');
		console.log('Stored token:', userToken);
		const parsedToken = JSON.parse(userToken);
		console.log('Parsed token:', parsedToken);
		console.log('Final token value:', parsedToken?.token);
		console.log('User:', user);
	}, []);

	const onSubmit = async (data) => {
		setIsSubmitting(true);
		setErrMsg('');

		try {
			const userToken = localStorage.getItem('user');
			if (!userToken) {
				setErrMsg('No authentication token found');
				return;
			}

			const parsedToken = JSON.parse(userToken);
			if (!parsedToken?.token) {
				setErrMsg('Invalid token format');
				return;
			}

			// Log the exact request configuration
			console.log('Request headers:', {
				'Authorization': `Bearer ${parsedToken.token}`,
				'Content-Type': 'multipart/form-data',
			});
			let formData = {
				firstName: data.firstName,
				lastName: data.lastName,
				location: data.location,
				profession: data.profession === '' ? user.profession : data.profession,
				skills: skills.length === 0 ? user.skills : skills,
				profileUrl: picture || userprofileurl,
				userId: userid,
			};
			formData = JSON.stringify(formData);
			console.log(formData);
			const response = await fetch(`${BACKEND_URL}/users/update-user/`, {
				method: 'PUT',
				headers: {
					'Authorization': `Bearer ${parsedToken.token}`,
					'Content-Type': 'application/json',
				},
				body: formData,
			});
			if (response.status === 200) {
				const responseData = await response.json();
				responseData.user.skills = responseData.user.skills.flat();
				let finalresponse = {
					...responseData.user,
					token: parsedToken.token,
				};
				console.log('Response data:', responseData);
				// dispatch(UpdateProfile(responseData.user));
				dispatch(UpdateProfile(false));
				dispatch(UserLogin(finalresponse));
				closeModal();
				window.location.reload();
			}
		} catch (error) {
			console.error('Full error object:', error);
			console.error('Error response:', error.response);
			setErrMsg(
				error.response?.data?.message ||
					'Authentication failed. Please try logging in again.'
			);
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleClose = () => {
		dispatch(UpdateProfile(false));
		closeModal();
	};

	// const handleSelect = (e) => {
	//   const file = e.target.files[0];
	//   if (file && file.size <= 5 * 1024 * 1024) {
	//     setPicture(file);
	//   } else {
	//     setErrMsg("File size should be less than 5MB");
	//   }
	// };

	const handleSelect = (e) => {
		const file = e.target.files[0];
		if (file && file.size <= 5 * 1024 * 1024) {
			const reader = new FileReader();
			reader.onloadend = () => {
				setPicture(reader.result); // Set the base64 image as the picture state
			};
			reader.readAsDataURL(file); // Convert the file to base64 string
		} else {
			setErrMsg('File size should be less than 5MB');
		}
	};

	const handleSkillChange = (e) => {
		setSkillInput(e.target.value);
	};

	const handleAddSkill = (e) => {
		if (e.key === 'Enter' || e.key === ',') {
			e.preventDefault();
			const newSkill = skillInput.trim();
			if (newSkill && !skills.includes(newSkill)) {
				setSkills((prevSkills) => [...prevSkills, newSkill]);
			}
			setSkillInput('');
		}
	};

	const handleDeleteSkill = (index) => {
		setSkills((prevSkills) => prevSkills.filter((_, i) => i !== index));
	};

	return (
		<div className='fixed z-50 inset-0 overflow-y-auto'>
			<div className='flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0'>
				<div className='fixed inset-0 transition-opacity'>
					<div className='absolute inset-0 bg-[#000] opacity-70'></div>
				</div>
				<span className='hidden sm:inline-block sm:align-middle sm:h-screen'></span>
				&#8203;
				<div
					className='inline-block align-bottom bg-primary rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full'
					role='dialog'
					aria-modal='true'
					aria-labelledby='modal-headline'
				>
					<div className='flex justify-between px-6 pt-5 pb-2'>
						<label
							htmlFor='name'
							className='block font-medium text-xl text-ascent-1 text-left'
						>
							Edit Profile
						</label>

						<button className='text-ascent-1' onClick={handleClose}>
							<MdClose size={22} />
						</button>
					</div>

					<form
						className='px-4 sm:px-6 flex flex-col gap-3 2xl:gap-6'
						onSubmit={handleSubmit(onSubmit)}
					>
						<TextInput
							name='firstName'
							label='First Name'
							placeholder='First Name'
							type='text'
							styles='w-full'
							register={register('firstName', {
								required: 'First Name is required!',
							})}
							error={errors.firstName ? errors.firstName?.message : ''}
						/>
						<TextInput
							label='Last Name'
							placeholder='Last Name'
							type='text'
							styles='w-full'
							register={register('lastName', {
								required: 'Last Name is required',
							})}
							error={errors.lastName ? errors.lastName?.message : ''}
						/>
						<TextInput
							name='profession'
							label='Profession'
							placeholder='Profession'
							type='text'
							styles='w-full'
							register={register('profession', {
								required: 'Profession is required!',
							})}
							error={errors.profession ? errors.profession?.message : ''}
						/>
						<TextInput
							label='Location'
							placeholder='Location'
							type='text'
							styles='w-full'
							register={register('location', {
								required: 'Location is required',
							})}
							error={errors.location ? errors.location?.message : ''}
						/>

						{/* Skills Input */}
						<label className='text-ascent-2 text-sm w-full' htmlFor='skills'>
							Skills
						</label>
						<div className='relative'>
							<input
								type='text'
								id='skills'
								value={skillInput}
								onChange={handleSkillChange}
								onKeyDown={handleAddSkill}
								className='w-full p-2 bg-secondary rounded border border-[#66666690] outline-none text-sm text-ascent-1 px-4 py-3 placeholder:text-[#666]'
								placeholder='Enter skills and press comma or Enter'
							/>
							<div className='flex flex-wrap gap-2 mt-2'>
								{skills.map((skill, index) => (
									<span
										key={index}
										style={{
											background: '#333',
											color: '#eee',
											padding: '10px',
											borderRadius: '10px',
											display: 'flex',
											alignItems: 'center',
											gap: '5px',
										}}
									>
										<span>{skill}</span>
										<button
											type='button'
											onClick={() => handleDeleteSkill(index)}
											className='text-sm text-white'
											style={{
												background: 'transparent',
												border: 'none',
												padding: '0',
												cursor: 'pointer',
											}}
										>
											<svg
												xmlns='http://www.w3.org/2000/svg'
												viewBox='-2 -2 24 24'
												width='16'
												fill='currentColor'
											>
												<path d='M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm0 2C4.477 20 0 15.523 0 10S4.477 0 10 0s10 4.477 10 10-4.477 10-10 10z'></path>
												<path d='M11.414 10l2.829 2.828a1 1 0 0 1-1.415 1.415L10 11.414l-2.828 2.829a1 1 0 1 1-1.415-1.415L8.586 10 5.757 7.172a1 1 0 0 1 1.415-1.415L10 8.586l2.828-2.829a1 1 0 0 1 1.415 1.415L11.414 10z'></path>
											</svg>
										</button>
									</span>
								))}
							</div>
						</div>

						{/* File Upload */}
						<div className='file-upload-container'>
							<input
								type='file'
								id='imgUpload'
								onChange={handleSelect}
								accept='.jpg, .png, .jpeg'
								className='file-input'
							/>
							<label htmlFor='imgUpload' className='file-input-label'>
								Choose a File
							</label>
						</div>

						{errMsg && (
							<span role='alert' className='text-sm text-[#f64949fe] mt-0.5'>
								{errMsg}
							</span>
						)}

						<div className='py-5 sm:flex sm:flex-row-reverse border-t border-[#66666645]'>
							{isSubmitting ? (
								<Loading />
							) : (
								<CustomButton
									type='submit'
									containerStyles={`inline-flex justify-center rounded-md bg-blue px-8 py-3 text-sm font-medium text-white outline-none`}
									title='Submit'
								/>
							)}
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};

export default EditProfile;
