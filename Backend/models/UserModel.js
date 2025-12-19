import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    first_name: { type: String, required: true, trim: true },
    last_name: { type: String, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    phonenumber: { type: String, trim: true },

    roleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
      required: true
    }
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
