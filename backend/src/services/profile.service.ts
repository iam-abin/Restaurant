import { autoInjectable } from 'tsyringe';

import { NotFoundError } from '../errors';

import { AddressRepository, ProfileRepository } from '../database/repository';
import { IAddressDocument, IProfileDocument } from '../database/model';
import { IAddress, IProfile, IUser } from '../types';
import { uploadImageOnCloudinary } from '../utils';
import mongoose from 'mongoose';

@autoInjectable()
export class ProfileService {
    constructor(
        private readonly profileRepository: ProfileRepository,
        private readonly addressRepository: AddressRepository,
    ) {}

    public async getProfile(userId: string): Promise<IProfileDocument | null> {
        const profile: IProfileDocument | null = await this.profileRepository.findByUserId(userId);
        if (!profile) throw new NotFoundError('This profile does not exist');
        return profile;
    }

    public async getUserProfiles(): Promise<IProfileDocument[]> {
        const profile: IProfileDocument[] = await this.profileRepository.find();
        return profile;
    }

    public async updateProfile(
        userId: string,
        updateData: Partial<IProfile & IUser & IAddress>,
    ): Promise<IProfileDocument | null> {
        const { city, country, address, image } = updateData;

        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            let imageUrl: string | undefined;
            if (image) {
                imageUrl = await uploadImageOnCloudinary(image);
            }

            const addressData: IAddressDocument | null = await this.addressRepository.update(
                userId,
                { userId, city, country, address },
                session,
            );

            const profile: IProfileDocument | null = await this.profileRepository.update(
                userId,
                {
                    ...updateData,
                    addressId: addressData?._id.toString()!,
                    imageUrl,
                },
                session,
            );

            // Commit the transaction
            await session.commitTransaction();
            return profile;
        } catch (error) {
            // Rollback the transaction if something goes wrong
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }
    }
}
