import { BiLogOut } from "react-icons/bi";
import useLogout from "../../hooks/useLogout";
import { Button, LoadingSpinner } from "../ui/UIComponents";

const LogoutButton = () => {
	const { loading, logout } = useLogout();

	return (
		<Button
			onClick={logout}
			disabled={loading}
			variant="danger"
			size="md"
			className="w-full flex items-center justify-center gap-2"
		>
			{loading ? (
				<>
					<LoadingSpinner size="sm" />
					<span>Logging out...</span>
				</>
			) : (
				<>
					<BiLogOut className="text-lg" />
					<span>Logout</span>
				</>
			)}
		</Button>
	);
};

export default LogoutButton;
