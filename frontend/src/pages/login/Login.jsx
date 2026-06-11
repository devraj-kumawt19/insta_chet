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
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 dark:from-gray-950 dark:via-gray-900 dark:to-black px-4 relative overflow-hidden">

			{/* Background Glow */}
			<div className="absolute -top-20 -left-20 w-80 h-80 bg-white/20 rounded-full blur-3xl"></div>

			<div className="absolute bottom-0 right-0 w-80 h-80 bg-pink-400/20 rounded-full blur-3xl"></div>


			{/* Theme Toggle */}

			<button
				onClick={toggleTheme}
				className="absolute top-5 right-5 bg-white/20 backdrop-blur-xl p-3 rounded-full text-2xl shadow-xl hover:scale-110 transition"
			>

				{
					isDark ?
						<MdLightMode className="text-yellow-300" />
						:
						<MdDarkMode className="text-white" />
				}

			</button>



			<div className="w-full max-w-md z-10">


				{/* Logo */}

				<div className="text-center mb-8">

					<div className="mx-auto w-20 h-20 rounded-3xl bg-white/20 backdrop-blur-xl flex items-center justify-center shadow-xl">

						<span className="text-4xl">
							💬
						</span>

					</div>


					<h1 className="text-5xl font-extrabold text-white mt-4">

						ChetGram

					</h1>


					<p className="text-white/70 mt-2">

						Chat • Stories • Friends

					</p>


				</div>



				{/* Login Card */}


				<div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-2xl rounded-3xl shadow-2xl p-8">


					<h2 className="text-3xl font-bold text-gray-900 dark:text-white">

						Welcome Back 👋

					</h2>


					<p className="text-gray-500 dark:text-gray-400 text-sm mb-6">

						Login to continue ChetGram

					</p>




					<form
						onSubmit={handleSubmit}
						className="space-y-5"
					>


						{/* Username */}

						<div className="relative">

							<MdOutlineMarkEmailUnread
								className="absolute left-4 top-4 text-gray-400 text-xl"
							/>


							<input

								type="text"

								placeholder="Username"

								value={username}

								onChange={(e) =>
									setUsername(e.target.value)
								}


								className="w-full pl-12 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-purple-500"

								required
							/>

						</div>





						{/* Password */}


						<div className="relative">


							<MdOutlineLock
								className="absolute left-4 top-4 text-gray-400 text-xl"
							/>


							<input

								type="password"

								placeholder="Password"


								value={password}


								onChange={(e) =>
									setPassword(e.target.value)
								}


								className="w-full pl-12 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-purple-500"


								required
							/>


						</div>





						{/* Remember */}

						<div className="flex justify-between text-sm">


							<label className="flex gap-2 items-center text-gray-500 dark:text-gray-400">

								<input type="checkbox" />

								Remember me

							</label>



							<Link
								to="#"
								className="text-purple-600 font-semibold hover:underline"
							>

								Forgot?

							</Link>


						</div>





						{/* Button */}


						<Button

							type="submit"

							variant="primary"

							disabled={loading}

							className="w-full py-3 rounded-xl shadow-xl hover:scale-[1.02] transition"

						>


							{

								loading ? (

									<>

										<LoadingSpinner size="sm" />

										Signing in...

									</>

								)

									:

									"Login 🚀"

							}


						</Button>



					</form>






					{/* Signup */}


					<p className="text-center mt-6 text-gray-600 dark:text-gray-400">


						New on ChetGram?


						<Link

							to="/signup"

							className="ml-2 text-purple-600 font-bold hover:underline"

						>

							Create Account

						</Link>


					</p>



				</div>


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
