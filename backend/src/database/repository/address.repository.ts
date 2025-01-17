import { ClientSession } from 'mongoose';
import { singleton } from 'tsyringe';
import { IAddressDocument, AddressModel } from '../model';
import { IAddress } from '../../types';

@singleton()
export class AddressRepository {
    findAddressByUserId = async (userId: string): Promise<IAddressDocument | null> => {
        return await AddressModel.findOne({ userId });
    };

    updateAddress = async (
        userId: string,
        updateData: Partial<IAddress>,
        session?: ClientSession,
    ): Promise<IAddressDocument | null> => {
        return await AddressModel.findOneAndUpdate({ userId }, updateData, {
            session,
            upsert: true,
            new: true,
        });
    };
}
