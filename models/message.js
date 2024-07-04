var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var MessageSchema = new Schema(
  {
    a05ipofwriter:{type:String,required:false},
    a10writer:{type:String,required:false},
    a15dateofmsg:{type:Date,required:true},
    a20titleofmsg:{type:String,required:false},
    a25message:{type:String,required:false},
    a30codelast:{type:Schema.Types.ObjectID,required:false},
    a35codethis:{type:String,required:false},
    a40responsor:{type:Schema.Types.ObjectID,required:false},
    a45response:{type:String,required:false},
    a50followact:{type:String,required:false},
    a99footnote:{type:String,required:false}      
  }
);

// Virtual for message's URL
MessageSchema
.virtual('url')
.get(function () {
  return '/career/message/' + this._id;
});
MessageSchema
        .virtual('dateofmsg')
        .get(function () {
           if(this.a15dateofmsg!=null&&typeof(this.a15dateofmsg)){
        return this.a15dateofmsg.getFullYear()+"/"+this.a15dateofmsg.getMonth()+"/"+this.a15dateofmsg.getDate();
    }
    else{
        return typeof(this.a15dateofmsg);
    }
    });
MessageSchema.set("toJSON",{getters:true,virtual:true});
MessageSchema.set("toObject",{getters:true,virtual:true});
//Export model
module.exports = mongoose.model('Message', MessageSchema);