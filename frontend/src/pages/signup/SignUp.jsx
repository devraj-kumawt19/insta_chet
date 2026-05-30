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
		<div className="min-h-screen bg-gradient-to-br from-accent-50 via-white to-primary-50 dark:from-dark-bg dark:via-dark-surface dark:to-dark-bg flex flex-col items-center justify-center p-4 relative overflow-hidden">
			{/* Animated Background Blobs */}
			<div className="absolute top-20 right-10 w-72 h-72 bg-accent-300/30 dark:bg-accent-500/10 rounded-full mix-blend-multiply filter blur-3xl animate-pulse-subtle" />
			<div className="absolute bottom-20 left-10 w-72 h-72 bg-primary-300/30 dark:bg-primary-500/10 rounded-full mix-blend-multiply filter blur-3xl animate-pulse-subtle animation-delay-2000" />

			{/* Theme Toggle */}
			<button
				onClick={toggleTheme}
				className="absolute top-6 right-6 p-3 rounded-xl glass-card hover:scale-110 transition-transform duration-300 text-2xl"
				aria-label="Toggle dark mode"
			>
				{isDark ? <MdLightMode className="text-yellow-400" /> : <MdDarkMode className="text-blue-600" />}
			</button>

			{/* Main Content */}
			<div className="w-full max-w-md relative z-10 animate-slide-in-top">
				{/* Logo/Branding */}
				<div className="text-center mb-8">
					<div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-accent-600 to-primary-600 mb-4 shadow-xl">
						<span className="text-3xl font-bold text-white">✨</span>
					</div>
					<h1 className="text-4xl font-bold bg-gradient-to-r from-accent-600 to-primary-600 bg-clip-text text-transparent mb-2">
						ChatApp
					</h1>
					<p className="text-neutral-600 dark:text-neutral-400">Join the community</p>
				</div>

				{/* Sign Up Card */}
				<div className="glass-card p-8 sm:p-10 space-y-6">
					<div>
						<h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50 mb-1">
							Create Account
						</h2>
						<p className="text-sm text-neutral-600 dark:text-neutral-400">
							Start chatting in just a few steps
						</p>
					</div>

					<form onSubmit={handleSubmit} className="space-y-4">
						{/* Full Name Input */}
						<div className="space-y-2">
							<label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300">
								Full Name
							</label>
							<div className="relative">
								<MdPerson className="absolute left-3 top-3.5 text-lg text-neutral-400 dark:text-neutral-600" />
								<input
									type="text"
									placeholder="John Doe"
									className="input-modern pl-10 w-full"
									value={inputs.fullName}
									onChange={(e) => setInputs({ ...inputs, fullName: e.target.value })}
									required
								/>
							</div>
						</div>

						{/* Username Input */}
						<div className="space-y-2">
							<label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300">
								Username
							</label>
							<div className="relative">
								<MdOutlineMarkEmailUnread className="absolute left-3 top-3.5 text-lg text-neutral-400 dark:text-neutral-600" />
								<input
									type="text"
									placeholder="johndoe"
									className="input-modern pl-10 w-full"
									value={inputs.username}
									onChange={(e) => setInputs({ ...inputs, username: e.target.value })}
									required
								/>
							</div>
						</div>

						{/* Password Input */}
						<div className="space-y-2">
							<label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300">
								Password
							</label>
							<div className="relative">
								<MdOutlineLock className="absolute left-3 top-3.5 text-lg text-neutral-400 dark:text-neutral-600" />
								<input
									type="password"
									placeholder="••••••••"
									className="input-modern pl-10 w-full"
									value={inputs.password}
									onChange={(e) => setInputs({ ...inputs, password: e.target.value })}
									required
								/>
							</div>
						</div>

						{/* Confirm Password Input */}
						<div className="space-y-2">
							<label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300">
								Confirm Password
							</label>
							<div className="relative">
								<MdOutlineLock className="absolute left-3 top-3.5 text-lg text-neutral-400 dark:text-neutral-600" />
								<input
									type="password"
									placeholder="••••••••"
									className="input-modern pl-10 w-full"
									value={inputs.confirmPassword}
									onChange={(e) => setInputs({ ...inputs, confirmPassword: e.target.value })}
									required
								/>
							</div>
						</div>

						{/* Gender Selection */}
						<GenderCheckbox onCheckboxChange={handleCheckboxChange} selectedGender={inputs.gender} />

						{/* Sign Up Button */}
						<Button
							type="submit"
							variant="primary"
							size="md"
							disabled={loading}
							className="w-full justify-center gap-2 mt-6"
						>
							{loading ? (
								<>
									<LoadingSpinner size="sm" />
									<span>Creating account...</span>
								</>
							) : (
								"Sign Up"
							)}
						</Button>
					</form>

					{/* Divider */}
					<div className="relative">
						<div className="absolute inset-0 flex items-center">
							<div className="w-full border-t border-neutral-200 dark:border-neutral-700" />
						</div>
						<div className="relative flex justify-center text-sm">
							<span className="px-2 bg-white dark:bg-dark-surface text-neutral-600 dark:text-neutral-400">
								Already registered?
							</span>
						</div>
					</div>

					{/* Login Link */}
					<div className="text-center">
						<p className="text-neutral-600 dark:text-neutral-400">
							Already have an account?{" "}
							<Link
								to="/login"
								className="font-bold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
							>
								Sign in
							</Link>
						</p>
					</div>
				</div>

				{/* Footer */}
				<p className="text-center text-xs text-neutral-600 dark:text-neutral-400 mt-8">
					By creating an account, you agree to our{" "}
					<Link to="#" className="text-primary-600 dark:text-primary-400 hover:underline">
						Terms
					</Link>{" "}
					and{" "}
					<Link to="#" className="text-primary-600 dark:text-primary-400 hover:underline">
						Privacy Policy
					</Link>
				</p>
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
