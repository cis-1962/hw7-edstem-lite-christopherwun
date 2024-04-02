// The User model should base on the schema with the following attributes

// username which is of type String (username is the unique identifier)
// password which is of type String

import mongoose from 'mongoose';
const { Schema } = mongoose;

interface IUser {
  username: string;
  password: string;
}

const userSchema = new Schema<IUser>({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const User = mongoose.model('User', userSchema);

export default User;