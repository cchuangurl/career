var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var KnowledgeSchema = new Schema(
  {
    a05domain:{type:String,required:false},
    a15describe:{type:String,required:false},
    a20filename:{type:String,required:false},
    a25alias:{type:String,required:false},
    a30explicit:{type:String,required:false},
    a35category:{type:String,required:false},
    a40course:{type:String,required:false},
    a50date:{type:Date,required:false},
    a55reveal:{type:String,required:false},
    a60is4download:{type:Boolean,required:false},
    a99footnote:{type:String,required:false}
  }
);

// Virtual for knowledge's URL
KnowledgeSchema
.virtual('url')
.get(function () {
  return '/career/knowledge/' + this._id;
});
KnowledgeSchema.set("toJSON",{getters:true,virtual:true});
KnowledgeSchema.set("toObject",{getters:true,virtual:true});
//Export model
module.exports = mongoose.model('Knowledge', KnowledgeSchema);
