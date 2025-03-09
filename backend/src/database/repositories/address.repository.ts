import { ClientSession } from 'mongoose';
import { singleton } from 'tsyringe';
import { IAddressDocument, AddressModel } from '../models';
import { IAddress } from '../../types';

@singleton()
export class AddressRepository {
    findAddressByUserId = async (
        userId: string,
        session?: ClientSession | null,
    ): Promise<IAddressDocument | null> => {
        return await AddressModel.findOne({ userId }).session(session!).lean<IAddressDocument | null>();
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
