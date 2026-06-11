import { Link } from "react-router-dom";
import GenderCheckbox from "./GenderCheckbox";
import { useState } from "react";
import useSignup from "../../hooks/useSignup";
import { Button, LoadingSpinner } from "../../components/ui/UIComponents";
import { useTheme } from "../../context/ThemeContext";
import { MdPerson, MdOutlineMarkEmailUnread, MdOutlineLock, MdDarkMode, MdLightMode } from "react-icons/md";

const SignUp = () => {
	const [inputs, setInputs] = useState({
		fullName: "",
		username: "",
		password: "",
		confirmPassword: "",
		gender: "",
	});

	const { loading, signup } = useSignup();
	const { isDark, toggleTheme } = useTheme();

	const handleCheckboxChange = (gender) => {
		setInputs({ ...inputs, gender });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		await signup(inputs);
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 dark:from-gray-950 dark:via-gray-900 dark:to-black px-4 relative overflow-hidden">

			{/* Background Effect */}
			<div className="absolute w-80 h-80 bg-white/20 rounded-full blur-3xl -top-20 -left-20"></div>
			<div className="absolute w-80 h-80 bg-pink-400/20 rounded-full blur-3xl bottom-0 right-0"></div>


			{/* Theme Button */}
			<button
				onClick={toggleTheme}
				className="absolute top-5 right-5 bg-white/20 backdrop-blur-xl p-3 rounded-full text-2xl shadow-lg hover:scale-110 transition"
			>
				{isDark ? (
					<MdLightMode className="text-yellow-300" />
				) : (
					<MdDarkMode className="text-white" />
				)}
			</button>


			<div className="w-full max-w430px max-w-md z-10">

				{/* Logo */}
				<div className="text-center mb-6">
					<div className="mx-auto w-20 h-20 rounded-3xl bg-white/20 backdrop-blur-xl flex items-center justify-center shadow-xl">
						<span className="text-4xl">
							💬
						</span>
					</div>

					<h1 className="mt-4 text-5xl font-extrabold text-white">
						ChetGram
					</h1>

					<p className="text-white/70 mt-2">
						Connect with your friends
					</p>

				</div>


				{/* Card */}

				<div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-2xl rounded-3xl shadow-2xl p-8">


					<h2 className="text-3xl font-bold text-gray-900 dark:text-white">
						Create Account 🚀
					</h2>

					<p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
						Join ChetGram today
					</p>



					<form
						onSubmit={handleSubmit}
						className="space-y-4"
					>


						{/* Full Name */}

						<div className="relative">
							<MdPerson className="absolute left-4 top-4 text-gray-400 text-xl" />

							<input
								type="text"
								placeholder="Full Name"
								className="w-full pl-12 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-purple-500"
								value={inputs.fullName}
								onChange={(e) =>
									setInputs({
										...inputs,
										fullName: e.target.value
									})
								}
							/>
						</div>



						{/* Username */}

						<div className="relative">

							<MdOutlineMarkEmailUnread className="absolute left-4 top-4 text-gray-400 text-xl" />

							<input
								type="text"
								placeholder="Username"
								className="w-full pl-12 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-purple-500"

								value={inputs.username}

								onChange={(e) =>
									setInputs({
										...inputs,
										username: e.target.value
									})
								}
							/>

						</div>



						{/* Password */}

						<div className="relative">

							<MdOutlineLock className="absolute left-4 top-4 text-gray-400 text-xl" />

							<input
								type="password"
								placeholder="Password"
								className="w-full pl-12 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-purple-500"

								value={inputs.password}

								onChange={(e) =>
									setInputs({
										...inputs,
										password: e.target.value
									})
								}
							/>

						</div>



						{/* Confirm Password */}

						<div className="relative">

							<MdOutlineLock className="absolute left-4 top-4 text-gray-400 text-xl" />

							<input
								type="password"
								placeholder="Confirm Password"

								className="w-full pl-12 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-purple-500"

								value={inputs.confirmPassword}

								onChange={(e) =>
									setInputs({
										...inputs,
										confirmPassword: e.target.value
									})
								}
							/>

						</div>



						{/* Gender same connection */}

						<GenderCheckbox
							onCheckboxChange={handleCheckboxChange}
							selectedGender={inputs.gender}
						/>



						<Button
							type="submit"
							variant="primary"
							disabled={loading}
							className="w-full rounded-xl py-3 text-lg shadow-xl hover:scale-[1.02] transition"
						>

							{
								loading ? (
									<>
										<LoadingSpinner size="sm" />
										Creating...
									</>
								)
									:
									"Create Account"
							}


						</Button>

					</form>



					<p className="text-center mt-6 text-gray-600 dark:text-gray-400">

						Already have account?

						<Link
							to="/login"
							className="ml-2 text-purple-600 font-bold hover:underline"
						>
							Login
						</Link>

					</p>


				</div>

			</div>

		</div>
	);
};

export default SignUp;

// STARTER CODE FOR THE SIGNUP COMPONENT
// import GenderCheckbox from "./GenderCheckbox";

// const SignUp = () => {
// 	return (
// 		<div className='flex flex-col items-center justify-center min-w-96 mx-auto'>
// 			<div className='w-full p-6 rounded-lg shadow-md bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0'>
// 				<h1 className='text-3xl font-semibold text-center text-gray-300'>
// 					Sign Up <span className='text-blue-500'> ChatApp</span>
// 				</h1>

// 				<form>
// 					<div>
// 						<label className='label p-2'>
// 							<span className='text-base label-text'>Full Name</span>
// 						</label>
// 						<input type='text' placeholder='John Doe' className='w-full input input-bordered  h-10' />
// 					</div>

// 					<div>
// 						<label className='label p-2 '>
// 							<span className='text-base label-text'>Username</span>
// 						</label>
// 						<input type='text' placeholder='johndoe' className='w-full input input-bordered h-10' />
// 					</div>

// 					<div>
// 						<label className='label'>
// 							<span className='text-base label-text'>Password</span>
// 						</label>
// 						<input
// 							type='password'
// 							placeholder='Enter Password'
// 							className='w-full input input-bordered h-10'
// 						/>
// 					</div>

// 					<div>
// 						<label className='label'>
// 							<span className='text-base label-text'>Confirm Password</span>
// 						</label>
// 						<input
// 							type='password'
// 							placeholder='Confirm Password'
// 							className='w-full input input-bordered h-10'
// 						/>
// 					</div>

// 					<GenderCheckbox />

// 					<a className='text-sm hover:underline hover:text-blue-600 mt-2 inline-block' href='#'>
// 						Already have an account?
// 					</a>

// 					<div>
// 						<button className='btn btn-block btn-sm mt-2 border border-slate-700'>Sign Up</button>
// 					</div>
// 				</form>
// 			</div>
// 		</div>
// 	);
// };
// export default SignUp;
