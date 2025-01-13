import { autoInjectable } from 'tsyringe';
import { NotFoundError } from '../errors';
import { AddressRepository, ProfileRepository } from '../database/repository';
import { IAddressDocument, IProfileDocument } from '../database/model';
import { IAddress, IProfile, IProfilesData, IUser } from '../types';
import {
    executeTransaction,
    getPaginationSkipValue,
    getPaginationTotalNumberOfPages,
    uploadImageOnCloudinary,
} from '../utils';

@autoInjectable()
export class ProfileService {
    constructor(
        private readonly profileRepository: ProfileRepository,
        private readonly addressRepository: AddressRepository,
    ) {}

    public getProfile = async (userId: string): Promise<IProfileDocument | null> => {
        const profile: IProfileDocument | null = await this.profileRepository.findByUserId(userId);
        if (!profile) throw new NotFoundError('This profile does not exist');
        return profile;
    };

    public getUserProfiles = async (page: number, limit: number): Promise<IProfilesData> => {
        const skip: number = getPaginationSkipValue(page, limit);

        const [profiles, profilesCount]: [IProfileDocument[], number] = await Promise.all([
            this.profileRepository.findProfiles(skip, limit),
            this.profileRepository.countProfiles(),
        ]);

        const numberOfPages: number = getPaginationTotalNumberOfPages(profilesCount, limit);
        return { profiles, numberOfPages };
    };

    public updateProfile = async (
        userId: string,
        updateData: Partial<IProfile & IUser & IAddress>,
    ): Promise<IProfileDocument | null> => {
        const { city, country, address, image } = updateData;

        return executeTransaction(async (session) => {
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
                    addressId: addressData?._id.toString(),
                    imageUrl,
                },
                session,
            );

            return profile;
        });
    };
}
