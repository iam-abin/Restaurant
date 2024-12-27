import { Request } from 'express';
import multer, { Multer, StorageEngine } from 'multer';
import path from 'path';

const storage: StorageEngine = multer.memoryStorage(); // Store in memory instead of public folder

const limits = { fileSize: 10 * 1024 * 1024 }; // 10 MB limit (adjust as needed)

const allowedImageFormats: string[] = ['.jpg', '.jpeg', '.png'];

// eslint-disable-next-line  @typescript-eslint/no-explicit-any
const fileFilter = (req: Request, file: Express.Multer.File, cb: any) => {
    const extension = path.extname(file.originalname).toLowerCase();
    const mimeType = file.mimetype;

    if (!allowedImageFormats.includes(extension) || !mimeType.startsWith('image/')) {
        cb(new Error(`${extension} is unsupported file type! Only jpeg, jgp, and png are allowed.`), false);
        return;
    }
    cb(null, true);
};

const multerUpload: Multer = multer({
    storage,
    limits,
    fileFilter,
});

export { multerUpload };
