import { BACKEND_URL } from '../utils/api';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { TbSocial } from 'react-icons/tb';
import { BsShare } from 'react-icons/bs';
import { AiOutlineInteraction } from 'react-icons/ai';
import { ImConnection } from 'react-icons/im';
import { CustomButton, Loading, TextInput } from '../components';
import Bgmain from '../assets/bgmain.png';
import { UserLogin } from '../redux/userSlice';
import { FaTimes } from 'react-icons/fa';

const Register = () => {
	const {
		register,
		handleSubmit,
		getValues,
		formState: { errors },
	} = useForm({
		mode: 'onChange',
	});
	const [errMsg, setErrMsg] = useState('');
	const [isSubmitting, setIsSubmitting] = useState(false);
	const dispatch = useDispatch();
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);
	const [selectedAvatars, setSelectedAvatars] = useState([]);
	const [hostedURL, setHostedURL] = useState('');
	const [selectedImage, setSelectedImage] = useState('');

	const imageUrls = [
		'https://ik.imagekit.io/georgebobby/cluster-pfp/9_qem0gy.png?updatedAt=1726898107678',
		'https://ik.imagekit.io/georgebobby/cluster-pfp/8_teqjug.png?updatedAt=1726898105064',
		'https://ik.imagekit.io/georgebobby/cluster-pfp/2_xx0yam.png?updatedAt=1726898105058',
		'https://ik.imagekit.io/georgebobby/cluster-pfp/6_lvbuxr.png?updatedAt=1726898105029',
		'https://ik.imagekit.io/georgebobby/cluster-pfp/3_rhzono.png?updatedAt=1726898105025g',
		'https://ik.imagekit.io/georgebobby/cluster-pfp/1_wa6j8q.png?updatedAt=1726898104970',
		'https://ik.imagekit.io/georgebobby/cluster-pfp/12_k6sjtd.png?updatedAt=1726898105053',
		'https://ik.imagekit.io/georgebobby/cluster-pfp/11_h1axb3.png?updatedAt=1726898105022',
		'https://ik.imagekit.io/georgebobby/cluster-pfp/10_duuwsu.png?updatedAt=1726898105032',
		'https://ik.imagekit.io/georgebobby/cluster-pfp/7_j9h2sr.png?updatedAt=1726898104964',
		'https://ik.imagekit.io/georgebobby/cluster-pfp/4_bvss6a.png?updatedAt=1726898104891',
	];

	const handleImageSelect = (imageUrl) => {
		setSelectedImage(imageUrl);
	};

	const openDrawer = () => {
		setIsDrawerOpen(true);
	};

	const closeDrawer = () => {
		setIsDrawerOpen(false);
	};

	// const onSubmit = async (data) => {
	//   setIsSubmitting(true);

	//   try {
	//     const response = await fetch(
	//       "https://cluster-delta.onrender.com/auth/register",
	//       {
	//         method: "POST",
	//         headers: {
	//           "Content-Type": "application/json",
	//         },
	//         body: JSON.stringify(data),
	//       }
	//     );

	//     if (response.ok) {
	//       const result = await response.json();
	//       setErrMsg({
	//         status: "success",
	//         message: "Registration successful!",
	//       });

	//       const newData = { token: result?.token, ...result?.user };
	//       console.log("Registration successful! Data:", result);
	//       console.log("New user data:", newData);
	//       dispatch(UserLogin(newData));

	//       setTimeout(() => {
	//         window.location.replace("/login");
	//       }, 2000);
	//     } else {
	//       // Handle registration failure
	//     }
	//   } catch (error) {
	//     // Handle error
	//   } finally {
	//     setIsSubmitting(false);
	//   }
	// };

	const onSubmit = async (data) => {
		setIsSubmitting(true);

		try {
			// Add the selected image URL to the data object
			const postData = {
				...data,
				profileUrl: selectedImage,
			};

			const response = await fetch(`${BACKEND_URL}/auth/register`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(postData),
			});

			if (response.ok) {
				const result = await response.json();
				setErrMsg({
					status: 'success',
					message: 'Registration successful!',
				});

				const newData = { token: result?.token, ...result?.user };
				console.log('Registration successful! Data:', result);
				console.log('New user data:', newData);
				dispatch(UserLogin(newData));

				setTimeout(() => {
					window.location.replace('/login');
				}, 2000);
			} else {
				// Handle registration failure
			}
		} catch (error) {
			// Handle error
		} finally {
			setIsSubmitting(false);
		}
	};

	// const onSubmit = async (data) => {
	//   setIsSubmitting(true);

	//   try {
	//     const response = await fetch("https://cluster-delta.onrender.com/auth/register", {
	//       method: "POST",
	//       headers: {
	//         "Content-Type": "application/json",
	//       },
	//       body: JSON.stringify(data),
	//     });

	//     if (response.ok) {
	//       const result = await response.json();
	//       setErrMsg({
	//         status: "success",
	//         message: "Registration successful!",
	//       });

	//       const newData = { token: result?.token, ...result?.user };
	//       dispatch(UserLogin(newData));

	//       setTimeout(() => {
	//         window.location.replace("/");
	//       }, 2000);
	//     } else {
	//       const result = await response.json();
	//       setErrMsg({
	//         status: "failed",
	//         message: result.message || "Registration failed. Please try again.",
	//       });
	//       console.error("Registration failed", result.message);
	//     }
	//   } catch (error) {
	//     console.error("Error during registration", error);
	//   } finally {
	//     setIsSubmitting(false);
	//   }
	// };

	return (
		<div
			className='bg-bgColor w-full h-full flex items-center justify-center p-3'
			style={{ overflowY: 'auto' }}
		>
			<div
				style={{ marginBottom: '300px' }}
				className='w-full md:w-2/3 h-fit lg:h-full 2xl:h-5/6 py-8 lg:py-0 flex flex-row-reverse bg-primary rounded-xl overflow-hidden shadow-xl'
			>
				{/* LEFT */}
				<div className='w-full lg:w-1/2 h-full p-10 2xl:px-20 flex flex-col justify-center '>
					<div className='w-full flex gap-2 items-center mb-6'>
						<div className='p-2 bg-[#000000] rounded text-white'>
							<TbSocial />
						</div>
						<span className='text-2xl text-[#000000] ' font-semibold>
							Cluster
						</span>
					</div>

					<p className='text-ascent-1 text-base font-semibold'>
						Create your account
					</p>
					<br />
					<br />
					<button
						className='text-black bg-white p-2 rounded-full'
						style={{
							border: '2px dashed grey',
							padding: '20px',
							textAlign: 'center',
							borderRadius: '8px',
							cursor: 'pointer',
						}}
						onClick={openDrawer}
					>
						{selectedImage ? (
							<div>
								<img
									src={selectedImage}
									alt='Chosen Profile'
									style={{
										width: '80px',
										height: '80px',
										borderRadius: '50%',
									}}
								/>
							</div>
						) : (
							'Choose Profile Picture'
						)}
					</button>

					<form
						className='py-8 flex flex-col gap-5'
						onSubmit={handleSubmit(onSubmit)}
					>
						<div className='w-full flex flex-col lg:flex-row gap-1 md:gap-2'>
							{/* BUTTON TO OPEN PROFILE DRAWER */}

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
								type='lastName'
								styles='w-full'
								register={register('lastName', {
									required: 'Last Name do no match',
								})}
								error={errors.lastName ? errors.lastName?.message : ''}
							/>
						</div>

						<TextInput
							name='email'
							placeholder='email@example.com'
							label='Email Address'
							type='email'
							register={register('email', {
								required: 'Email Address is required',
							})}
							styles='w-full'
							error={errors.email ? errors.email.message : ''}
						/>

						<div className='w-full flex flex-col lg:flex-row gap-1 md:gap-2'>
							<TextInput
								name='password'
								label='Password'
								placeholder='Password'
								type='password'
								styles='w-full'
								register={register('password', {
									required: 'Password is required!',
								})}
								error={errors.password ? errors.password?.message : ''}
							/>

							<TextInput
								label='Confirm Password'
								placeholder='Password'
								type='password'
								styles='w-full'
								register={register('cPassword', {
									validate: (value) => {
										const { password } = getValues();

										if (password != value) {
											return 'Passwords do no match';
										}
									},
								})}
								error={
									errors.cPassword && errors.cPassword.type === 'validate'
										? errors.cPassword?.message
										: ''
								}
							/>
						</div>

						{errMsg?.message && (
							<span
								className={`text-sm ${
									errMsg?.status == 'failed'
										? 'text-[#f64949fe]'
										: 'text-[#2ba150fe]'
								} mt-0.5`}
							>
								{errMsg?.message}
							</span>
						)}

						{isSubmitting ? (
							<Loading />
						) : (
							<CustomButton
								type='submit'
								containerStyles={`inline-flex justify-center rounded-md bg-blue px-8 py-3 text-sm font-medium text-white outline-none`}
								title='Create Account'
							/>
						)}
					</form>

					<p className='text-ascent-2 text-sm text-center'>
						Already has an account?{' '}
						<Link
							to='/login'
							className='text-[#065ad8] font-semibold ml-2 cursor-pointer'
						>
							Login
						</Link>
					</p>
				</div>
				{/* RIGHT */}

				<div className='hidden w-1/2 h-full lg:flex flex-col items-center justify-center bg-blue'>
					<div className='relative w-full flex items-center justify-center'>
						<img
							src={Bgmain}
							alt='Bg Image'
							className='w-48 2xl:w-64 h-48 2xl:h-64 rounded-full object-cover'
						/>

						<div className='absolute flex items-center gap-1 bg-white right-10 top-10 py-2 px-5 rounded-full'>
							<BsShare size={14} />
							<span className='text-xs font-medium'>Share</span>
						</div>

						<div className='absolute flex items-center gap-1 bg-white left-10 top-6 py-2 px-5 rounded-full'>
							<ImConnection />
							<span className='text-xs font-medium'>Connect</span>
						</div>

						<div className='absolute flex items-center gap-1 bg-white left-12 bottom-6 py-2 px-5 rounded-full'>
							<AiOutlineInteraction />
							<span className='text-xs font-medium'>Interact</span>
						</div>
					</div>

					<div className='mt-16 text-center'>
						<p className='text-white text-base'>
							Connect with Friends & have fun
						</p>
						<span className='text-sm text-white/80'>
							Connect Minds, Ignite Ideas: Your Academic Hub for Collaborative
							Excellence.
						</span>
					</div>
				</div>
			</div>

			{/* BOTTOM DRAWER TO CHOOSE PROFILE PIC */}
			{isDrawerOpen && (
				<div className='fixed inset-0 bg-gray-700 bg-opacity-50 z-50 backdrop-filter backdrop-blur-md'>
					{/* Background overlay when drawer is open */}
				</div>
			)}

			{isDrawerOpen && (
				<div className='fixed inset-0 flex items-end justify-center z-50'>
					<div
						style={{ backgroundColor: '#000000' }}
						className='p-4 rounded-t-lg'
					>
						{/* Drawer content */}
						<div className='flex justify-end'>
							{/* Close icon at the top right of the drawer */}
							<FaTimes
								onClick={() => closeDrawer()}
								style={{ color: 'red' }}
								className='cursor-pointer text-red-500 text-2xl'
							/>
						</div>
						<div className='flex flex-col items-center'>
							<p style={{ color: 'white' }}>Choose Your Profile Picture.</p>

							{/* Avatar selection */}
							<div className='flex flex-wrap justify-center mt-4'>
								{imageUrls.map((imageUrl, index) => (
									<img
										key={index}
										src={imageUrl}
										style={{
											margin: '8px',
											width: '80px',
											height: '80px',
										}}
										alt={`Avatar ${index + 1}`}
										className={`rounded-full cursor-pointer ${
											selectedImage === imageUrl
												? 'border-4 border-blue-500'
												: ''
										}`}
										onClick={() => {
											handleImageSelect(imageUrl);
											setHostedURL(imageUrl);
											closeDrawer();
										}}
									/>
								))}
							</div>
						</div>
						<div className='flex justify-center mt-4'>
							{/* Additional content or buttons */}
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default Register;
