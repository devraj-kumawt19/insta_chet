import React from "react";
import { motion } from "framer-motion";

const PostSkeleton = () => {
	return (
		<motion.div
			animate={{ opacity: [0.6, 1, 0.6] }}
			transition={{ duration: 1.5, repeat: Infinity }}
			className="bg-white dark:bg-neutral-900 rounded-2xl shadow-sm border border-neutral-200 dark:border-neutral-800 overflow-hidden mb-6"
		>
			{/* Header */}
			<div className="px-4 py-3 flex items-center gap-3 border-b border-neutral-200 dark:border-neutral-800">
				<div className="w-12 h-12 rounded-full bg-neutral-300 dark:bg-neutral-700" />
				<div className="flex-1 space-y-2">
					<div className="h-4 bg-neutral-300 dark:bg-neutral-700 rounded w-24" />
					<div className="h-3 bg-neutral-200 dark:bg-neutral-800 rounded w-16" />
				</div>
			</div>

			{/* Image */}
			<div className="w-full aspect-square bg-neutral-300 dark:bg-neutral-800" />

			{/* Actions */}
			<div className="px-4 py-3 flex gap-4 border-b border-neutral-200 dark:border-neutral-800">
				<div className="w-8 h-8 rounded-lg bg-neutral-300 dark:bg-neutral-700" />
				<div className="w-8 h-8 rounded-lg bg-neutral-300 dark:bg-neutral-700" />
				<div className="w-8 h-8 rounded-lg bg-neutral-300 dark:bg-neutral-700" />
			</div>

			{/* Caption */}
			<div className="px-4 py-3 space-y-2">
				<div className="h-4 bg-neutral-300 dark:bg-neutral-700 rounded w-full" />
				<div className="h-4 bg-neutral-300 dark:bg-neutral-700 rounded w-3/4" />
			</div>
		</motion.div>
	);
};

const StorySkeleton = () => {
	return (
		<motion.div
			animate={{ opacity: [0.6, 1, 0.6] }}
			transition={{ duration: 1.5, repeat: Infinity }}
			className="flex flex-col items-center gap-2 flex-shrink-0"
		>
			<div className="w-20 h-20 rounded-full bg-neutral-300 dark:bg-neutral-700" />
			<div className="h-3 bg-neutral-300 dark:bg-neutral-700 rounded w-16" />
		</motion.div>
	);
};

const StoriesSkeletonLoader = () => {
	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.5 }}
			className="bg-white dark:bg-neutral-900 rounded-2xl shadow-sm border border-neutral-200 dark:border-neutral-800 p-4 mb-6 overflow-hidden"
		>
			<div className="flex gap-4 overflow-x-auto pb-2">
				{[...Array(5)].map((_, index) => (
					<StorySkeleton key={index} />
				))}
			</div>
		</motion.div>
	);
};

const ProfileCardSkeleton = () => {
	return (
		<motion.div
			animate={{ opacity: [0.6, 1, 0.6] }}
			transition={{ duration: 1.5, repeat: Infinity }}
			className="bg-white dark:bg-neutral-900 rounded-2xl shadow-sm border border-neutral-200 dark:border-neutral-800 overflow-hidden p-6"
		>
			{/* Header */}
			<div className="flex items-start justify-between mb-6">
				<div className="w-24 h-24 rounded-full bg-neutral-300 dark:bg-neutral-700" />
				<div className="flex gap-2">
					<div className="px-6 py-2 bg-neutral-300 dark:bg-neutral-700 rounded-lg w-32 h-10" />
					<div className="w-10 h-10 rounded-lg bg-neutral-300 dark:bg-neutral-700" />
				</div>
			</div>

			{/* Info */}
			<div className="mb-6 space-y-2">
				<div className="h-6 bg-neutral-300 dark:bg-neutral-700 rounded w-32" />
				<div className="h-4 bg-neutral-300 dark:bg-neutral-700 rounded w-24" />
				<div className="h-4 bg-neutral-300 dark:bg-neutral-700 rounded w-full" />
			</div>

			{/* Stats */}
			<div className="grid grid-cols-3 gap-4 py-6 border-t border-b border-neutral-200 dark:border-neutral-800">
				{[...Array(3)].map((_, index) => (
					<div key={index} className="text-center space-y-2">
						<div className="h-6 bg-neutral-300 dark:bg-neutral-700 rounded" />
						<div className="h-3 bg-neutral-300 dark:bg-neutral-700 rounded w-12 mx-auto" />
					</div>
				))}
			</div>
		</motion.div>
	);
};

export {
	PostSkeleton,
	StorySkeleton,
	StoriesSkeletonLoader,
	ProfileCardSkeleton,
};
