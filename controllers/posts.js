const express = require('express');
const bodyParser = require('body-parser');

const router = express.Router();
const connection = require('../config/Connection')
// parse requests of content-type - application/x-www-form-urlencoded
router.use(bodyParser.urlencoded({ extended: true }))
// parse requests of content-type - application/json
router.use(bodyParser.json())
router.get('/:id',(req,res)=>connection.connect(function(){
  
  const id = req.params.id;
  connection.query("SELECT * FROM posts where id=?",id,function(err,result,fields){
    if(err) throw err;

    const value = result[0]
    res.status(200).send({...value,link:`/posts/${id}`})
    return ;
  })
}))
router.post('/',(req,res)=>connection.connect(function(){
  const title = req.body.title;
  const content = req.body.content;
  connection.query("INSERT INTO posts(title,content) Values (?,?)",[title,content],function(err,result,fields){
    if(err) throw err;
    
    res.status(201).redirect(`/posts/${result.insertId}`)

    return ;

  })
}))
router.get('/',(req,res)=>connection.connect(function() {
  connection.query("SELECT * FROM posts", function (err, result, fields) {
    if (err) throw err;
  
    
  
    const data = JSON.parse(JSON.stringify(result))

    data.forEach(element=>element.links = `/posts/${element.id}`);

    const value = {
      data:data,
      limit:10,
      pagination: {
        first_page: "/comments?page=1",
        last_page: "/comments?page=1",
        comment:1
       }
       

    }

      
      res.status(200).json(value);

     return;

    }
    // console.log(JSON.parse(result))
   
   

  );
}))
router.get('/:post_id/comments',(req,res)=>connection.connect(function(){
  const post_id = req.params.post_id;
  connection.query("SELECT * from comments where post_id",[post_id],function(err,result,fields){
    if(err) throw err;
    res.send(result);
  })
}))
router.patch('/:id',(req,res)=>connection.connect(function(){
  const id = req.params.id;
  const title = req.query.title;
  const content = req.query.content;
  if(title!=null && content==null){
    connection.query('UPDATE posts SET title = ? WHERE id = ?',[title,id],function(err,result,fields){
      if(err) throw err;
      res.status(200).redirect(`/posts/${id}`)
      return ;
    })
     
  }
  else if(title==null && content !=null){
    connection.query('UPDATE posts SET content = ? WHERE id = ?',[content,id],function(err,result,fields){
      if(err) throw err;
      res.status(200).redirect(`/posts/${id}`)
      return ;
    })
  }
  else if(title!=null && content!=null){
    connection.query('UPDATE posts SET title = ? ,content = ? WHERE id = ?',[title,content,id],function(err,result,fields){
      if(err) throw err;
      res.status(200).redirect(`/posts/${id}`)
      return ;
    })
 
  }
 
}))
router.delete("/:id",(req,res)=>connection.connect(function(){
  const id = req.params.id;
  connection.query("DELETE FROM posts WHERE id = ?", [id], function (err, result){
    if(err) throw err;
    const data ={
      sucess:"True",
      delete_id : id
    }
    res.status(200).send(data)
    return;
  
  } )


}))
  module.exports = router