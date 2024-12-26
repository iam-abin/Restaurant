import streamifier from 'streamifier';
import { UploadApiErrorResponse, UploadStream } from 'cloudinary';
import { cloudinary } from '../config/cloudinary';

type CloudinaryUploadResult = {
    public_id: string;
    secure_url: string;
};

export interface IFileData {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    size: number;
    buffer: Buffer;
}

export const uploadImageOnCloudinary = async (file: Express.Multer.File | string): Promise<string> => {
    const options = { folder: 'restaurant_app_images' };

    const uploadStreamToCloudinary = (fileBuffer: Buffer): Promise<CloudinaryUploadResult> => {
        return new Promise((resolve, reject) => {
            const uploadStream: UploadStream = cloudinary.uploader.upload_stream(
                options,
                (error: UploadApiErrorResponse | undefined, result: CloudinaryUploadResult | undefined) => {
                    if (error) {
                        reject(error);
                    } else if (result) {
                        resolve(result);
                    } else {
                        reject(new Error('Upload failed with no result.'));
                    }
                },
            );

            streamifier.createReadStream(fileBuffer).pipe(uploadStream);
        });
    };

    // If the file is a string (Base64 encoded), convert it to a Buffer
    if (typeof file === 'string') {
        const matches = file.match(/^data:image\/([a-zA-Z0-9]+);base64,([^\s,]+)$/);
        if (matches && matches.length === 3) {
            // Base64 string: Convert it to a Buffer
            const base64Data = matches[2];
            const buffer = Buffer.from(base64Data, 'base64');
            const uploadResponse = await uploadStreamToCloudinary(buffer);
            return uploadResponse.secure_url;
        } else {
            throw new Error('Invalid Base64 string');
        }
    }

    // If the file is an object (file uploaded via Multer), use its buffer
    if (file && file.buffer) {
        const uploadResponse = await uploadStreamToCloudinary(file.buffer);
        return uploadResponse.secure_url;
    }

    throw new Error('Invalid file or Base64 string');
};
