var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var Set_infoSchema = new Schema(
  {
    a05archive_url:{type:String,required:false},
    a10unitID:{type:String,required:false},
    a15data_volume:{type:Number,required:false},
    a20skip:{type:Number,required:false},
    a25filter:{type:String,required:false},
    a30order:{type:String,required:false},
    a35dataset_name:{type:String,required:false},
    a40describe:{type:String,required:false},
    a45date_of_get:{type:String,required:false},
    a50filename_part:{type:String,required:false},
    a55preventer:{type:String,required:false},
    a99footnote:{type:String,required:false}
  }
);

// Virtual for set_info's URL
Set_infoSchema
.virtual('url')
.get(function () {
  return '/career/set_info/' + this._id;
});
Set_infoSchema.set("toJSON",{getters:true,virtual:true});
Set_infoSchema.set("toObject",{getters:true,virtual:true});
//Export model
module.exports = mongoose.model('Set_info', Set_infoSchema);