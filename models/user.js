import mongoose from 'mongoose';
import passportLocalMongoose from 'passport-local-mongoose';

mongoose.set("useFindAndModify", false);

const UserSchema = new mongoose.Schema({
    email: String,
    firstName: String,
    lastName: String,
    password: String,
    isAdmin: Boolean
});

UserSchema.plugin(passportLocalMongoose);

export default mongoose.model("User", UserSchema);