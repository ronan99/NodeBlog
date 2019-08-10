const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require('../models/Categorias')
require('../models/Posts')
const Categoria = mongoose.model('categorias')
const Post = mongoose.model('posts')
router.get('/',(req,res)=>{
    res.render("admin/index")
})

router.get('/categorias',(req,res)=>{
    Categoria.find().sort({date:'desc'}).then((categorias)=>{
        res.render('admin/categorias',{categorias:categorias})
    }).catch((err)=>{
        req.flash('error_msg',"Houve um erro ao listar as categorias.")
        res.redirect("/admin")
    })
    
})

router.get('/categorias/add',(req,res)=>{
    res.render('admin/addcategorias')
})

router.post('/categorias/nova',(req,res)=>{
    var erros=[]
    if(!req.body.nome || typeof(req.body.nome)== undefined || req.body.nome ==null){
        erros.push({text:'Nome inválido!'})
    }

    if(!req.body.slug || typeof(req.body.slug)== undefined || req.body.slug ==null){
        erros.push({text:'Slug inválido!'})
    }
    if(req.body.nome.length <= 2){
        erros.push({text:'Nome muito pequeno.'})
    }
    if(erros.length > 0){
        res.render('admin/addcategorias',{erros:erros})
    }else{
        req.body.nome = req.body.nome.charAt(0).toUpperCase() + req.body.nome.slice(1)
        const novaCategoria = {
            nome : req.body.nome,
            slug: req.body.slug
        }
        new Categoria(novaCategoria).save().then(()=>{
            console.log('categoria salva com sucesso')
            req.flash('success_msg','Categoria criada com Sucesso!')
            res.redirect('/admin/categorias')
        }).catch((err)=>{
            console.log("Erro ao salvar Categoria")
            req.flash('error_msg','Houve um erro ao salvar a categoria.')
            res.redirect('/admin')
        })
    }

    
})

router.get('/categorias/edit/:id',(req,res)=>{
    Categoria.findOne({_id:req.params.id}).then((categoria)=>{
        res.render('admin/editcategorias',{categoria:categoria})
    }).catch((err)=>{
        req.flash('error_msg','Esta categoria não existe')
        res.redirect('/admin/categorias')
    })
    
})

router.post('/categorias/edit',(req,res)=>{
    Categoria.findOne({_id:req.body.id}).then((categoria)=>{
        var erros=[]
        if(!req.body.nome || typeof(req.body.nome)== undefined || req.body.nome ==null){
            erros.push({text:'Nome inválido!'})
        }else
        if(!req.body.slug || typeof(req.body.slug)== undefined || req.body.slug ==null){
            erros.push({text:'Slug inválido!'})
        }else
        if(req.body.nome.length <= 2){
            erros.push({text:'Nome muito pequeno.'})
        }
        if(erros.length > 0){

            req.flash('error_msg',erros[0].text)
            res.redirect('/admin/categorias')

        }else{
            categoria.nome = req.body.nome
            categoria.slug = req.body.slug
            categoria.save().then(()=>{
                req.flash("success_msg","Categoria editada com sucesso!")
                res.redirect('/admin/categorias')
            }).catch((err)=>{
                req.flash('error_msg',"Houve um erro interno ao editar a categoria.")
                res.redirect('/admin/categorias')
            })
        
        }

    }).catch((err)=>{
        req.flash("error_msg","Categoria não encontrada")
        res.redirect('/admin/categorias')
    })
})
router.post('/categorias/delete',(req,res)=>{
    Categoria.remove({_id:req.body.id}).then(()=>{
        req.flash('success_msg','Categoria deletada!')
        res.redirect('/admin/categorias')
    }).catch((err)=>{
        req.flash('Houve um erro ao deletar a Categoria.')
        res.redirect('/admin/categorias')
    })
})
router.get('/posts', (req,res) =>{
    Post.find().populate('categoria').sort({date:'desc'}).then((posts)=>{
        res.render('admin/posts',{posts:posts})
    }).catch((err)=>{
        req.flash("error_msg","Houve um erro ao listar as Postagens.")
        res.redirect('/admin')
    })

})

router.get('/posts/add',(req,res)=>{
    Categoria.find().then((categorias)=>{
        res.render('admin/addposts',{categorias:categorias})
    }).catch((err)=>{
        req.flash('error_msg','Houve um erro ao carregar o formulário.')
        res.redirect('/admin/posts')
    })
   
})


router.post('/posts/addpost',(req,res)=>{
    var erros=[]

    if(req.body.categoria =='0'){
        erros.push({text:'Categoria inválida, registre uma categoria'})
    }

    if(erros.length>0){
        req.render('admin/addpost',{error:erros})
    }else{
        const newPost = {
            titulo: req.body.titulo,
            descricao : req.body.descricao,
            conteudo: req.body.conteudo,
            categoria:req.body.categoria,
            slug:req.body.slug
        }
        new Post(newPost).save().then(()=>{
            req.flash('success_msg','Postagem criada com sucesso.')
            res.redirect('/admin/posts')
        }).catch((err)=>{
            req.flash('error_msg',"Houve um erro ao salvar a postagem.")
            res.redirect('/admin/posts')
        })
    }
})

router.get('/posts/edit/:id',(req,res)=>{
    Post.findOne({_id:req.params.id}).then((post)=>{
        Categoria.find().then((categorias)=>{
            res.render('admin/editposts',{categorias:categorias, post:post})

        }).catch((err)=>{
            req.flash('error_msg',"Houve um erro ao listar as categorias.")
            res.redirect('/admin/posts')
        })

    }).catch((err)=>{
        req.flash('error_msg',"Houve um erro ao carregar o formulário.")
        res.redirect('/admin/posts')
    })
    
})

router.post('/post/edit',(req,res)=>{
    Post.findOne({_id:req.body.id}).then((post)=>{
        post.titulo = req.body.titulo
        post.slug = req.body.slug
        post.descricao = req.body.descricao
        post.conteudo = req.body.conteudo
        post.categoria = req.body.categoria
        post.save().then(()=>{
            req.flash('success_msg','Postagem editada com sucesso!')
            res.redirect('/admin/posts')
        }).catch((err)=>{
            req.flash('error_msg','Erro interno')
            res.redirect('/admin/posts')
        })
    }).catch((err)=>{
        req.flash('error_msg','Houve um erro ao editar a postagem.')
        res.redirect('/admin/posts')
    })

})
module.exports = router