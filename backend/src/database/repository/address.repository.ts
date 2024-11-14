import { ClientSession } from 'mongoose';
import { IAddressDocument, AddressModel } from '../model';
import { IAddress, IProfile } from '../../types';

export class AddressRepository {
    async create(addressData: Pick<IAddress, 'userId'>, session?: ClientSession): Promise<IAddressDocument> {
        const address: IAddressDocument[] = await AddressModel.create([addressData], { session });
        return address[0];
    }

    async findById(addressId: string): Promise<IAddressDocument | null> {
        return await AddressModel.findById(addressId);
    }

    async update(addressId: string, updateData: Partial<IAddress>): Promise<IAddressDocument | null> {
        return await AddressModel.findByIdAndUpdate(addressId, updateData, { new: true });
    }
}
