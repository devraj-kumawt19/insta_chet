// Button Components
export const Button = ({
	children,
	variant = "primary",
	size = "md",
	className = "",
	disabled = false,
	...props
}) => {
	const variantStyles = {
		primary:
			"bg-gradient-to-r from-primary-600 to-primary-700 text-white hover:from-primary-700 hover:to-primary-800 shadow-lg hover:shadow-xl",
		secondary:
			"bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-50 border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-700",
		ghost:
			"text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20",
		outline:
			"border-2 border-primary-600 dark:border-primary-400 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20",
		danger:
			"bg-red-600 text-white hover:bg-red-700 shadow-lg hover:shadow-xl",
		success:
			"bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg hover:shadow-xl",
	};

	const sizeStyles = {
		sm: "px-3 py-1.5 text-xs font-semibold rounded-md",
		md: "px-4 py-2.5 text-sm font-semibold rounded-lg",
		lg: "px-6 py-3 text-base font-semibold rounded-lg",
		xl: "px-8 py-3.5 text-lg font-bold rounded-xl",
	};

	return (
		<button
			className={`inline-flex items-center justify-center transition-all duration-200 ease-smooth focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-dark-bg disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
			disabled={disabled}
			{...props}
		>
			{children}
		</button>
	);
};

// Card Component
export const Card = ({ children, className = "", hover = false, ...props }) => {
	return (
		<div
			className={`glass-card ${hover ? "glass-card-hover" : ""} p-4 sm:p-6 ${className}`}
			{...props}
		>
			{children}
		</div>
	);
};

// Badge Component
export const Badge = ({ children, variant = "primary", className = "", ...props }) => {
	const variants = {
		primary:
			"bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-800",
		secondary:
			"bg-secondary-100 dark:bg-secondary-900/30 text-secondary-700 dark:text-secondary-300 border border-secondary-200 dark:border-secondary-800",
		success:
			"bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800",
		warning:
			"bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800",
		danger:
			"bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800",
	};

	return (
		<span
			className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${variants[variant]} ${className}`}
			{...props}
		>
			{children}
		</span>
	);
};

// Avatar Component
export const Avatar = ({ src, alt = "Avatar", size = "md", status = null, className = "" }) => {
	const sizeStyles = {
		sm: "w-8 h-8",
		md: "w-10 h-10",
		lg: "w-16 h-16",
		xl: "w-24 h-24",
	};

	return (
		<div className={`relative ${sizeStyles[size]}`}>
			<img
				src={src}
				alt={alt}
				className={`w-full h-full rounded-full object-cover border-2 border-primary-300 dark:border-primary-700 ${className}`}
			/>
			{status && (
				<div
					className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-dark-surface ${
						status === "online"
							? "bg-emerald-500 shadow-lg shadow-emerald-500/50"
							: "bg-neutral-400"
					}`}
				/>
			)}
		</div>
	);
};

// Input Component
export const Input = ({ label, error = "", className = "", ...props }) => {
	return (
		<div className="w-full">
			{label && (
				<label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
					{label}
				</label>
			)}
			<input
				className={`input-modern ${error ? "border-red-500 focus:ring-red-500" : ""} ${className}`}
				{...props}
			/>
			{error && <p className="mt-1 text-xs text-red-500 font-medium">{error}</p>}
		</div>
	);
};

// Textarea Component
export const Textarea = ({ label, error = "", className = "", ...props }) => {
	return (
		<div className="w-full">
			{label && (
				<label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
					{label}
				</label>
			)}
			<textarea
				className={`input-modern resize-none ${error ? "border-red-500 focus:ring-red-500" : ""} ${className}`}
				{...props}
			/>
			{error && <p className="mt-1 text-xs text-red-500 font-medium">{error}</p>}
		</div>
	);
};

// Loading Spinner Component
export const LoadingSpinner = ({ size = "md", className = "" }) => {
	const sizes = {
		sm: "w-4 h-4",
		md: "w-6 h-6",
		lg: "w-8 h-8",
		xl: "w-12 h-12",
	};

	return (
		<div
			className={`inline-block border-2 border-primary-200 dark:border-primary-800 border-t-primary-600 dark:border-t-primary-400 rounded-full animate-spin ${sizes[size]} ${className}`}
		/>
	);
};

// Skeleton Loader Component
export const SkeletonLoader = ({ count = 1, height = "h-4", className = "" }) => {
	return (
		<>
			{[...Array(count)].map((_, i) => (
				<div
					key={i}
					className={`${height} rounded-lg bg-gradient-to-r from-neutral-200 to-neutral-300 dark:from-neutral-700 dark:to-neutral-600 skeleton-loading mb-3 ${className}`}
				/>
			))}
		</>
	);
};

// Status Badge Component
export const StatusBadge = ({ status = "offline", className = "" }) => {
	const statusStyles = {
		online: "bg-emerald-500 shadow-lg shadow-emerald-500/50",
		offline: "bg-neutral-400",
		away: "bg-amber-500 shadow-lg shadow-amber-500/50",
		busy: "bg-red-500 shadow-lg shadow-red-500/50",
	};

	return (
		<div
			className={`w-3 h-3 rounded-full ${statusStyles[status]} ${className}`}
		/>
	);
};

// Divider Component
export const Divider = ({ className = "" }) => {
	return (
		<div className={`h-px bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent ${className}`} />
	);
};

// Tooltip Component
export const Tooltip = ({ children, text, position = "top", className = "" }) => {
	const positions = {
		top: "bottom-full mb-2 left-1/2 transform -translate-x-1/2",
		bottom: "top-full mt-2 left-1/2 transform -translate-x-1/2",
		left: "right-full mr-2 top-1/2 transform -translate-y-1/2",
		right: "left-full ml-2 top-1/2 transform -translate-y-1/2",
	};

	return (
		<div className="relative group">
			{children}
			<div
				className={`absolute ${positions[position]} opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none ${className}`}
			>
				<div className="glass-card px-3 py-2 text-xs font-semibold text-neutral-900 dark:text-neutral-50 whitespace-nowrap">
					{text}
				</div>
			</div>
		</div>
	);
};

// Section Container
export const Section = ({ children, className = "", title = "", subtitle = "" }) => {
	return (
		<div className={`py-6 ${className}`}>
			{title && (
				<div className="mb-6">
					<h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50">
						{title}
					</h2>
					{subtitle && (
						<p className="mt-2 text-neutral-600 dark:text-neutral-400">{subtitle}</p>
					)}
				</div>
			)}
			{children}
		</div>
	);
};

// Modal Component
export const Modal = ({ isOpen, onClose, title, children, className = "" }) => {
	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
			{/* Backdrop */}
			<div
				className="absolute inset-0 bg-black/50 backdrop-blur-sm"
				onClick={onClose}
			/>
			{/* Modal Content */}
			<Card className={`relative max-w-md w-full max-h-screen overflow-y-auto ${className}`}>
				{title && (
					<div className="flex items-center justify-between mb-6 pb-4 border-b border-neutral-200 dark:border-neutral-700">
						<h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-50">
							{title}
						</h3>
						<button
							onClick={onClose}
							className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
						>
							<span className="text-2xl">&times;</span>
						</button>
					</div>
				)}
				{children}
			</Card>
		</div>
	);
};

// Empty State Component
export const EmptyState = ({ icon = "📭", title, description, action = null }) => {
	return (
		<div className="flex flex-col items-center justify-center py-12 px-4 text-center">
			<div className="text-6xl mb-4">{icon}</div>
			<h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-50 mb-2">
				{title}
			</h3>
			<p className="text-neutral-600 dark:text-neutral-400 mb-6">{description}</p>
			{action && action}
		</div>
	);
};
