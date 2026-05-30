import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create uploads folder if it doesn't exist
const uploadsDir = path.join(__dirname, "../../frontend/public/uploads");
if (!fs.existsSync(uploadsDir)) {
	fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, uploadsDir);
	},
	filename: (req, file, cb) => {
		const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
		cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
	},
});

const fileFilter = (req, file, cb) => {
	const allowedImageMimes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
	const allowedVideoMimes = ["video/mp4", "video/mpeg", "video/quicktime", "video/x-msvideo"];
	
	if (allowedImageMimes.includes(file.mimetype) || allowedVideoMimes.includes(file.mimetype)) {
		cb(null, true);
	} else {
		cb(new Error("Only image and video files are allowed"));
	}
};

export const upload = multer({
	storage: storage,
	fileFilter: fileFilter,
	limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit for videos
});
