// This function is used in transform field of mongoose document helps to omit some data from json response

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const omitDocFields = (doc: any, ret: any) => {
    delete ret.__v;
    if (ret.password) {
        delete ret.password;
    }
};
