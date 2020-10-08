import mongoose from 'mongoose';
import passportLocalMongoose from 'passport-local-mongoose';

mongoose.set("useFindAndModify", false);

const UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    // firstName: String,
    // lastName: String,
    isAdmin: {type: Boolean, default: false}
});

UserSchema.plugin(passportLocalMongoose);

export default mongoose.model("User", UserSchema);