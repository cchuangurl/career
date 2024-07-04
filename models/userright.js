var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var UserrightSchema = new Schema(
  {
    a05group:{type:String,required:true},
    a10operation:{type:String,required:false},
    a15storage:{type:Number,required:false},
    a20scope:{type:String,required:false},
    a25access:{type:String,required:false},
    a30dboperate:{type:String,required:false},
    a99footnote:{type:String,required:false}
  }
);

// Virtual for userright's URL
UserrightSchema
.virtual('url')
.get(function () {
  return '/career/userright/' + this._id;
});
UserrightSchema.set("toJSON",{getters:true,virtual:true});
UserrightSchema.set("toObject",{getters:true,virtual:true});
//Export model
module.exports = mongoose.model('Userright', UserrightSchema);
