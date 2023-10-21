const mongoose = require('mongoose');
const { Schema } = mongoose;

const profileSchema = new Schema(
{
    id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    },
    email: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    instagram: {
        type: String,
        required: true,
    },
    youtube: {
        type: String,
        required: true,
    },

},
{ timestamps: true }
);

const profile = mongoose.model('profile', profileSchema);
profile.createIndexes();
module.exports = profile;
