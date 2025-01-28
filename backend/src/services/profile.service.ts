import { autoInjectable } from 'tsyringe';
import { NotFoundError } from '../errors';
import { AddressRepository, ProfileRepository, UserRepository } from '../database/repository';
import { IAddressDocument, IProfileDocument } from '../database/model';
import { IAddress, IProfile, IProfilesData, ISearchProfileData, IUser } from '../types';
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
        private readonly userRepository: UserRepository,
    ) {}

    public getProfile = async (userId: string): Promise<IProfileDocument | null> => {
        const profile: IProfileDocument | null = await this.profileRepository.findProfileByUserId(userId);
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

    public searchProfileByName = async (
        searchText: string,
        page: number,
        limit: number,
    ): Promise<ISearchProfileData> => {
        const skip: number = getPaginationSkipValue(page, limit);

        const { profiles, totalCount } = await this.profileRepository.searchProfileByName(
            searchText,
            skip,
            limit,
        );

        const numberOfPages: number = getPaginationTotalNumberOfPages(totalCount, limit);
        return { profiles, numberOfPages };
    };

    public updateProfile = async (
        userId: string,
        updateData: Partial<Pick<IUser, 'name' | 'phone'> & IAddress & Pick<IProfile, 'image'>>,
    ): Promise<IProfileDocument | null> => {
        const { name, phone, city, country, address, image } = updateData;

        return executeTransaction(async (session) => {
            let imageUrl: string | undefined;
            if (image) {
                imageUrl = await uploadImageOnCloudinary(image);
            }

            await this.userRepository.updateUser(userId, { name, phone }, session);

            const addressData: IAddressDocument | null = await this.addressRepository.updateAddress(
                userId,
                { userId, city, country, address },
                session,
            );

            const profile: IProfileDocument | null = await this.profileRepository.updateProfile(
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
