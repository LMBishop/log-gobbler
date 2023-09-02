import mongoose from 'mongoose';
import config from 'config';

export const connect = async () => {
    await mongoose.connect(config.get('db'));
};

