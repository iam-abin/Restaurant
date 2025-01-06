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

/**
 * Uploads an image to Cloudinary from either a Base64 string or a Multer file object.
 * @param file - A file either as a Multer File or a Base64-encoded string.
 * @returns {Promise<string>} - The secure URL of the uploaded image.
 * @throws {Error} - Throws an error if the file is invalid or upload fails.
 */
export const uploadImageOnCloudinary = async (file: Express.Multer.File | string): Promise<string> => {
    const options = { folder: 'restaurant_app_images' };
    // Determine if file is a Base64 string or Multer file, and handle accordingly
    const fileBuffer: Buffer = await getFileBuffer(file);

    // Upload the file to Cloudinary
    const uploadResponse: CloudinaryUploadResult = await uploadStreamToCloudinary(fileBuffer, options);
    return uploadResponse.secure_url;
};

/**
 * Handles uploading the file to Cloudinary using a stream.
 * @param fileBuffer - The file buffer to upload.
 * @param options - The upload options, such as the folder.
 * @returns {Promise<CloudinaryUploadResult>} - The result from Cloudinary after upload.
 */
const uploadStreamToCloudinary = (
    fileBuffer: Buffer,
    options: { folder: string },
): Promise<CloudinaryUploadResult> => {
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

/**
 * Checks if a given string is a valid Base64-encoded image string.
 * @param data - The string to check.
 * @returns {boolean} - Returns true if the string is a valid Base64 image.
 */
const isBase64Image = (data: string): boolean => {
    const base64Regex: RegExp = /^data:image\/([a-zA-Z0-9]+);base64,([^\s,]+)$/;
    return base64Regex.test(data);
};

/**
 * Returns a buffer from either a Base64-encoded string or a Multer file object.
 * @param file - The file, either a Base64 string or Multer file object.
 * @returns {Promise<Buffer>} - The file buffer.
 * @throws {Error} - Throws an error if the file is invalid.
 */
const getFileBuffer = async (file: Express.Multer.File | string): Promise<Buffer> => {
    let fileBuffer: Buffer;

    if (typeof file === 'string') {
        // Validate and decode Base64 string
        if (!isBase64Image(file)) {
            throw new Error('Invalid Base64 string');
        }
        const base64Data: string = file.split(',')[1];
        fileBuffer = Buffer.from(base64Data, 'base64');
    } else if (file && file.buffer) {
        // Use Multer file buffer
        fileBuffer = file.buffer;
    } else {
        throw new Error('Invalid file or Base64 string');
    }

    return fileBuffer;
};
