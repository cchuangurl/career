var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var UserSchema = new Schema(
  {
    a05status:{type:String,required:true},
    a10infoID:{type:Schema.Types.ObjectID,required:false},
    a15account:{type:String,required:true},
    a20password:{type:String,required:false},
    a25group:{type:String,required:false},
    a99footnote:{type:String,required:false}
  }
);

// Virtual for user's URL
UserSchema
.virtual('url')
.get(function () {
  return '/career/user/' + this._id;
});
UserSchema.set("toJSON",{getters:true,virtual:true});
UserSchema.set("toObject",{getters:true,virtual:true});
//Export model
module.exports = mongoose.model('User', UserSchema);
