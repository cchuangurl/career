var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var TermSchema = new Schema(
  {
    a05project:{type:String,required:false},
    a10database:{type:String,required:false},
    a15model:{type:String,required:false},
    a20field:{type:String,required:false},
    a25code:{type:String,required:false},
    a30mean:{type:String,required:false},
    a99footnote:{type:String,required:false}
  }
);

// Virtual for term's URL
TermSchema
.virtual('url')
.get(function () {
  return '/career/term/' + this._id;
});
TermSchema.set("toJSON",{getters:true,virtual:true});
TermSchema.set("toObject",{getters:true,virtual:true});
//Export model
module.exports = mongoose.model('Term', TermSchema);
