var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var PostSchema = new Schema(
  {
    a05posttype:{type:String,required:false},
    a10poster:{type:Schema.Types.ObjectID,required:false},
    a15postdate:{type:Date,required:false},
    a20posttitle:{type:String,required:true},
    a25postcontent:{type:String,required:false},
    a30reader:{type:String,required:false},
    a35showtype:{type:String,required:false},
    a40datetodown:{type:Date,required:false},             
    a99footnote:{type:String,required:false}
  }
);

// Virtual for post's URL
PostSchema
.virtual('url')
.get(function () {
  return '/career/post/' + this._id;
});
PostSchema.set("toJSON",{getters:true,virtual:true});
PostSchema.set("toObject",{getters:true,virtual:true});
//Export model
module.exports = mongoose.model('Post', PostSchema);
