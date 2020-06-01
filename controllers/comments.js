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
  connection.query("SELECT * FROM comments where id=?",id,function(err,result,fields){
    if(err) throw err;

    const value = result[0]
    res.status(200).send({...value,link:`/posts/${id}`})

    return ;
   
  })
}))
router.post('/',(req,res)=>connection.connect(function(){
  const comment = req.body.comment
  const post_id = req.body.post_id;
  connection.query("INSERT INTO comments(comment,post_id) Values (?,?)",[comment,post_id],function(err,result,fields){
    if(err) throw err;
    res.status(201).redirect(`/comments/${result.insertId}`)



    return ;

  })
}))
router.get('/',(req,res)=>connection.connect(function() {
    connection.query("SELECT * FROM comments", function (err, result, fields) {
      if (err) throw err;
    
     
    
      const data = JSON.parse(JSON.stringify(result))

      data.forEach(element=>element.links = `/comments/${element.id}`);
  
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
  router.patch('/:id',(req,res)=>connection.connect(function(){
    const id = req.params.id;
    const comment = req.query.comment;
    if(comment!=null){
      connection.query('UPDATE comments SET comment = ? WHERE id = ?',[comment,id],function(err,result,fields){
        if(err) throw err;
        res.status(200).redirect(`/comments/${id}`)
        return ;
      })
    }
  }))
  router.delete("/:id",(req,res)=>connection.connect(function(){
    const id = req.params.id;
    connection.query("DELETE FROM comments WHERE id = ?", [id], function (err, result){
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