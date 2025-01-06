/**
 * Omits sensitive or unnecessary fields from the document's JSON response.
 * Typically used with Mongoose document 'transform' field.
 *
 * @param doc - The Mongoose document being transformed.
 * @param ret - The plain object representing the document that will be returned as JSON.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const omitDocFields = (doc: any, ret: any) => {
    delete ret.__v;
    if (ret.password) {
        delete ret.password;
    }
    // ret.id = ret._id;
    // delete ret._id;
};
