import { ClientSession } from 'mongoose';
import { IAddressDocument, AddressModel } from '../model';
import { IAddress, IProfile } from '../../types';

export class AddressRepository {
    async findById(addressId: string): Promise<IAddressDocument | null> {
        return await AddressModel.findById(addressId);
    }

    async findByUserId(userId: string): Promise<IAddressDocument | null> {
        return await AddressModel.findOne({ userId });
    }

    async update(
        userId: string,
        updateData: Partial<IAddress>,
        session?: ClientSession,
    ): Promise<IAddressDocument | null> {
        return await AddressModel.findOneAndUpdate({ userId }, updateData, {
            session,
            upsert: true,
            new: true,
        });
    }
}
