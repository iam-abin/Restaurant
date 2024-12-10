import mongoose, { Document, Schema } from 'mongoose';
import { generateHashedPassword, omitDocFields } from '../../utils';
import { ISignup, IUser } from '../../types';
import { ROLES_CONSTANTS } from '../../utils';

export interface IUserDocument extends Document, IUser {
    _id: Schema.Types.ObjectId;
}

const userSchema = new Schema<IUserDocument>(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        phone: {
            type: Number,
            trim: true,
        },
        password: {
            type: String,
        },
        googleId: {
            type: String,
        },
        role: {
            type: String,
            required: true,
            enum: [ROLES_CONSTANTS.ADMIN, ROLES_CONSTANTS.RESTAURANT, ROLES_CONSTANTS.USER],
        },
        isVerified: {
            type: Boolean,
            required: true,
            default: false,
        },
        isBlocked: {
            type: Boolean,
            required: true,
            default: false,
        },
    },
    {
        timestamps: true,
        toJSON: {
            transform: omitDocFields,
        },
    },
);

// To hash password before saving the user to db
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    try {
        if (!this.password) next(); // google auth has no password
        const hashedPassword: string = await generateHashedPassword(this.password!);
        this.password = hashedPassword;
        next();
    } catch (error: unknown) {
        next(error as Error);
    }
});

// To hash password before saving the updated password to db
userSchema.pre('findOneAndUpdate', async function (next) {
    const update = this.getUpdate() as Partial<ISignup>;
    if (update?.email || update?.role) {
        delete update.email;
        delete update.role;
    }

    if (!update.password) return next();

    try {
        const hashedPassword: string = await generateHashedPassword(update.password);
        this.setUpdate({ ...update, password: hashedPassword });
        next();
    } catch (error: unknown) {
        next(error as Error);
    }
});

export const UserModel = mongoose.model<IUserDocument>('User', userSchema);
