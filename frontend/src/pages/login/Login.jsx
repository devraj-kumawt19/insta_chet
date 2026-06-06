import { useState } from "react";
import { Link } from "react-router-dom";
import useLogin from "../../hooks/useLogin";
import { Button, LoadingSpinner } from "../../components/ui/UIComponents";
import { useTheme } from "../../context/ThemeContext";
import { MdOutlineMarkEmailUnread, MdOutlineLock, MdDarkMode, MdLightMode } from "react-icons/md";

const Login = () => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const { loading, login } = useLogin();
	const { isDark, toggleTheme } = useTheme();

	const handleSubmit = async (e) => {
		e.preventDefault();
		await login(username, password);
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-dark-bg dark:via-dark-surface dark:to-dark-bg flex flex-col items-center justify-center p-4 relative overflow-hidden">
			{/* Animated Background Blobs */}
			<div className="absolute top-20 left-10 w-72 h-72 bg-primary-300/30 dark:bg-primary-500/10 rounded-full mix-blend-multiply filter blur-3xl animate-pulse-subtle" />
			<div className="absolute top-40 right-10 w-72 h-72 bg-secondary-300/30 dark:bg-secondary-500/10 rounded-full mix-blend-multiply filter blur-3xl animate-pulse-subtle animation-delay-2000" />
			<div className="absolute -bottom-8 left-20 w-72 h-72 bg-accent-300/30 dark:bg-accent-500/10 rounded-full mix-blend-multiply filter blur-3xl animate-pulse-subtle animation-delay-4000" />

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
				<div className="text-center mb-10">
					<div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-600 to-accent-600 mb-4 shadow-xl">
						<span className="text-3xl font-bold text-white">💬</span>
					</div>
					<h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent mb-2">
						ChetGram
					</h1>
					<p className="text-neutral-600 dark:text-neutral-400">Chat, Posts & Stories</p>
				</div>

				{/* Login Card */}
				<div className="glass-card p-8 sm:p-10 space-y-6">
					<div>
						<h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50 mb-1">
							Welcome Back
						</h2>
						<p className="text-sm text-neutral-600 dark:text-neutral-400">
							Sign in to your account to continue
						</p>
					</div>

					<form onSubmit={handleSubmit} className="space-y-5">
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
									value={username}
									onChange={(e) => setUsername(e.target.value)}
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
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									required
								/>
							</div>
						</div>

						{/* Remember Me & Forgot Password */}
						<div className="flex items-center justify-between text-sm">
							<label className="flex items-center gap-2 cursor-pointer">
								<input type="checkbox" className="w-4 h-4 rounded border-neutral-300 dark:border-neutral-600" />
								<span className="text-neutral-600 dark:text-neutral-400">Remember me</span>
							</label>
							<Link
								to="#"
								className="text-primary-600 dark:text-primary-400 hover:underline font-semibold"
							>
								Forgot?
							</Link>
						</div>

						{/* Login Button */}
						<Button
							type="submit"
							variant="primary"
							size="md"
							disabled={loading}
							className="w-full justify-center gap-2"
						>
							{loading ? (
								<>
									<LoadingSpinner size="sm" />
									<span>Signing in...</span>
								</>
							) : (
								"Sign In"
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
								New user?
							</span>
						</div>
					</div>

					{/* Sign Up Link */}
					<div className="text-center">
						<p className="text-neutral-600 dark:text-neutral-400">
							Don't have an account?{" "}
							<Link
								to="/signup"
								className="font-bold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
							>
								Create one
							</Link>
						</p>
					</div>
				</div>

				{/* Footer */}
				<p className="text-center text-xs text-neutral-600 dark:text-neutral-400 mt-8">
					By signing in, you agree to our{" "}
					<Link to="#" className="text-primary-600 dark:text-primary-400 hover:underline">
						Terms
					</Link>{" "}
					and{" "}
					<Link to="#" className="text-primary-600 dark:text-primary-400 hover:underline">
						Privacy
					</Link>
				</p>
			</div>
		</div>
	);
};

export default Login;

// STARTER CODE FOR THIS FILE
// const Login = () => {
// 	return (
// 		<div className='flex flex-col items-center justify-center min-w-96 mx-auto'>
// 			<div className='w-full p-6 rounded-lg shadow-md bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0'>
// 				<h1 className='text-3xl font-semibold text-center text-gray-300'>
// 					Login
// 					<span className='text-blue-500'> ChatApp</span>
// 				</h1>

// 				<form>
// 					<div>
// 						<label className='label p-2'>
// 							<span className='text-base label-text'>Username</span>
// 						</label>
// 						<input type='text' placeholder='Enter username' className='w-full input input-bordered h-10' />
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
// 					<a href='#' className='text-sm  hover:underline hover:text-blue-600 mt-2 inline-block'>
// 						{"Don't"} have an account?
// 					</a>

// 					<div>
// 						<button className='btn btn-block btn-sm mt-2'>Login</button>
// 					</div>
// 				</form>
// 			</div>
// 		</div>
// 	);
// };
// export default Login;
