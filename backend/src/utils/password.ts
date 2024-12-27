import bcrypt from 'bcryptjs';

export const generateHashedPassword = async (password: string): Promise<string> => {
    const salt: string = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};

export const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
    return await bcrypt.compare(password, hashedPassword);
};
