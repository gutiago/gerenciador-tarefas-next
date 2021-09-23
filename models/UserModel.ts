import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: { type: String, required: [true, '* Required field'] },
    email: { type: String, required: [true, '* Required field'] },
    password: { type: String, required: [true, '* Required field'] },
});

export const UserModel = mongoose.models.users || mongoose.model('users', UserSchema);