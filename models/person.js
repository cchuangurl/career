var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var PersonSchema = new Schema(
  {
    a05ipofvisitor:{type:String,required:false},
    a10visitor:{type:String,required:false},
    a15dateofreg:{type:Date,required:false},
    a20phoneno:{type:String,required:false},
    a25email:{type:String,required:false},
    a30address:{type:String,required:false},
    a35business:{type:String,required:false},
    a40extra:{type:String,required:false},
    a99footnote:{type:String,required:false}     
  }
);

// Virtual for person's URL
PersonSchema
.virtual('url')
.get(function () {
  return '/career/person/' + this._id;
});
PersonSchema
        .virtual('dateofreg')
        .get(function () {
        if (this.a15dateofreg!=null&&typeof(this.a15dateofreg)!="undefined"){          
            return this.a15dateofreg.getFullYear()+"/"+this.a15dateofreg.getMonth()+"/"+this.a15dateofreg.getDate();
        }
        else{
            return typeof(this.a15dateofreg);
        }
    });
PersonSchema.set("toJSON",{getters:true,virtual:true});
PersonSchema.set("toObject",{getters:true,virtual:true});
//Export model
module.exports = mongoose.model('Person', PersonSchema);