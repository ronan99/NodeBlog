const mongoose = require('mongoose')
const Schema = mongoose.Schema;


const Post = new Schema({
    titulo :{
        type:'String',
        required:true
    },
    slug:{
        type:'String',
        required:true
    },
    descricao:{
        type:'String',
        required:true
    },
    categoria:{
        type:Schema.Types.ObjectId,
        ref:'categorias',
        required:true
    },
    conteudo:{
        type: 'String',
        required:true
    },
    date:{
        type:'date',
        default: Date.now()
    }
})
mongoose.model("posts",Post)