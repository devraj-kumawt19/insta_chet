import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MdLightMode, MdDarkMode } from "react-icons/md";

const ThemeToggle = () => {
	const [isDark, setIsDark] = useState(false);

	useEffect(() => {
		// Check if user prefers dark mode
		const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
		const savedTheme = localStorage.getItem("theme");
		
		const shouldBeDark = savedTheme ? savedTheme === "dark" : prefersDark;
		setIsDark(shouldBeDark);
		
		if (shouldBeDark) {
			document.documentElement.classList.add("dark");
		} else {
			document.documentElement.classList.remove("dark");
		}
	}, []);

	const toggleTheme = () => {
		const newTheme = !isDark;
		setIsDark(newTheme);
		
		if (newTheme) {
			document.documentElement.classList.add("dark");
			localStorage.setItem("theme", "dark");
		} else {
			document.documentElement.classList.remove("dark");
			localStorage.setItem("theme", "light");
		}
	};

	return (
		<motion.button
			whileHover={{ scale: 1.1 }}
			whileTap={{ scale: 0.95 }}
			onClick={toggleTheme}
			className="relative w-12 h-12 rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors flex items-center justify-center"
		>
			<motion.div
				initial={false}
				animate={{ rotate: isDark ? 180 : 0, scale: isDark ? 1 : 1 }}
				transition={{ type: "spring", stiffness: 200, damping: 15 }}
			>
				{isDark ? (
					<MdDarkMode className="text-2xl text-yellow-400" />
				) : (
					<MdLightMode className="text-2xl text-amber-500" />
				)}
			</motion.div>
		</motion.button>
	);
};

export default ThemeToggle;
