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

export const uploadImageOnCloudinary = async (file: Express.Multer.File): Promise<string> => {
    const options = { folder: 'restaurant_app_images' };

    const uploadStreamToCloudinary = (): Promise<CloudinaryUploadResult> => {
        return new Promise((resolve, reject) => {
            const uploadStream: UploadStream = cloudinary.uploader.upload_stream(
                options,
                (error: UploadApiErrorResponse | undefined, result: CloudinaryUploadResult | undefined) => {
                    if (error) {
                        console.error('Cloudinary upload error:', error);
                        reject(error);
                    } else if (result) {
                        resolve(result);
                    } else {
                        reject(new Error('Upload failed with no result.'));
                    }
                },
            );

            streamifier.createReadStream(file.buffer).pipe(uploadStream);
        });
    };

    const uploadResponse = await uploadStreamToCloudinary();
    return uploadResponse.secure_url;
};
