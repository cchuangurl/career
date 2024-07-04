var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var PublishSchema = new Schema(
  {
    a05knowledgeID:{type:Schema.Types.ObjectID,required:false},
    a10coauthor:{type:Array,required:false},
    a15year:{type:Date,required:false},
    a20title:{type:String,required:false},
    a25book:{type:String,required:false},
    a30collection:{type:String,required:false},
    a35editor:{type:String,required:false},
    a40part:{type:Number,required:false},
    a45volumn:{type:Number,required:false},
    a50issue:{type:Number,required:false},
    a55startpage:{type:Number,required:false},
    a60endpage:{type:Number,required:false},
    a65publisher:{type:String,required:false},
    a70website:{type:String,required:false},
    a75city:{type:String,required:false},
    a99footnote:{type:String,required:false}
  }
);

// Virtual for publish's URL
PublishSchema
.virtual('url')
.get(function () {
  return '/career/publish/' + this._id;
});
PublishSchema.set("toJSON",{getters:true,virtual:true});
PublishSchema.set("toObject",{getters:true,virtual:true});
//Export model
module.exports = mongoose.model('Publish', PublishSchema);
