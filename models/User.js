import mongoose from 'mongoose'; 

const UserSchema = new mongoose.Schema(
  {
    firstname: { type: String },
    lastname: { type: String },
    username: { type: String },
    email: {
      type: String,
      required: true,
      max: 50,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['admin', 'user'], 
      default: 'public',
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);
export default User;
