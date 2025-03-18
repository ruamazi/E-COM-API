import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
 {
  name: {
   type: String,
   required: true,
   trim: true,
  },
  email: {
   type: String,
   required: true,
   unique: true,
   trim: true,
   match: [
    /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
    "Please fill a valid email address",
   ],
  },
  password: {
   type: String,
   required: true,
   minlength: 6,
  },
  role: {
   type: String,
   enum: ["customer", "admin"],
   default: "customer",
  },
 },
 { timestamps: true }
);

userSchema.pre("save", async function (next) {
 try {
  if (!this.isModified("password")) {
   return next();
  }
  const hashed = await bcrypt.hash(this.password, 10);
  this.password = hashed;
  return next();
 } catch (err) {
  return next(err);
 }
});

userSchema.methods.comparePassword = async function (candidatePassword, next) {
 try {
  const isMatch = await bcrypt.compare(candidatePassword, this.password);
  return isMatch;
 } catch (err) {
  return next(err);
 }
};

const User = mongoose.model("User", userSchema);

export default User;
