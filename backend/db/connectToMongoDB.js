import mongoose from "mongoose";

const connectToMongoDB = async () => {
	try {
		console.log("URI =", process.env.MONGO_DB_URI);

		await mongoose.connect(process.env.MONGO_DB_URI);

		console.log("Connected to MongoDB");
	} catch (error) {
		console.error("Error connecting to MongoDB:", error.message);
		
		// Enhanced error diagnostics
		if (error.message.includes("authentication failed")) {
			console.error("\n⚠️  AUTHENTICATION ERROR - Check these:");
			console.error("1. MongoDB Atlas IP Whitelist - Add your IP address");
			console.error("2. Username & Password - Verify in Database Access section");
			console.error("3. Database User Permissions - Should have 'readWrite' role");
			console.error("4. Special Characters in Password - Should be URL-encoded");
		}
		
		if (error.message.includes("ENOTFOUND")) {
			console.error("\n⚠️  CONNECTION ERROR - Cannot reach MongoDB:");
			console.error("1. Check your internet connection");
			console.error("2. Verify MongoDB URI is correct");
		}
		
		process.exit(1);
	}
};

export default connectToMongoDB;