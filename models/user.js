var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, lowercase: true, trim: true, unique: false },
    password: { type: String, select: false },
    mobile: { type: String },
    address: { type: String },
    type: { type: String },
    country: { type: String },
    currency: { type: String, default: "PKR" },
    city: { type: String },
    state: { type: String },
    isVerified: { type: String },
    username: { type: String },
    buisnessName: { type: String, default: "" },
    alternateContact: { type: String },
    isBlocked: { type: Boolean, default: false },
    smsVerification: { type: Boolean, default: false },
    emailVerfication: { type: Boolean, default: false },
    connections: {
        type: Array, default: []
    },
    isAdmin: { type: Boolean, default: false },
    reason: { type: String, default: "" },
    isDeleted: { type: Boolean, default: false },
    profilePicUrl: { type: String },
    careOf: { type: String, default: "" },
    customerType: { type: String },
    nic: { type: String },
    ntn: { type: String },
    nicScan: { type: String, default: "" },
    code: { type: String },
    rate: { type: Number, default: 590 },
    credit: { type: Number, default: 0 },
    ntnStatus: { type: String },
    strn: { type: String, default: "" }
});

UserSchema.pre('save', function (next) {
    var user = this;
    if (this.isModified('password') || this.New) {
        bcrypt.genSalt(10, function (err, salt) {
            if (err) {
                return next(err);
            }
            else {
                bcrypt.hash(user.password, salt, null, function (err, hash) {
                    if (err) {
                        next(err);
                    } else {
                        user.password = hash;
                        next();
                    }
                });
            }
        });
    } else {
        return next();
    }
});

UserSchema.methods.comparePassword = function (pw, cb) {
    bcrypt.compare(pw, this.password, function (err, isMatch) {
        if (err) {
            return cb(err);
        } else {
            cb(null, isMatch);
        }
    });
};



module.exports = mongoose.model('User', UserSchema);
