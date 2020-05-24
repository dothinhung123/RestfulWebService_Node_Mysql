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
    res.status(201).send({...result})


    return ;

  })
}))
router.get('/',(req,res)=>connection.connect(function() {
    connection.query("SELECT * FROM comments", function (err, result, fields) {
      if (err) throw err;
    
      // for(let i= 0 ;i<result.length;i++){
      //   const inisiateValue = result[i]
      //   console.log(result[i])
      //   const data = [{...inisiateValue,link:result[i].id}]
      //   const value = {
      //     data:data,
      //     total_count:data.length,
      //     limit:10,
      //     pagination: {
      //       first_page: "/comments?page=1",
      //       last_page: "/comments?page=1",
      //       co
      mment:1
      //      }
           

      //   }
    
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
  router.put('/:id',(req,res)=>connection.connect(function(){
    const id = req.params.id;
    const comment = req.body.comment;
    const post_id = req.body.post_id;
    connection.query('UPDATE comments SET comment = ?, post_id= ? WHERE id = ?',[comment, post_id,id],function(err,result,fields){
      if(err) throw err;
      res.send(result);
      return ;
    })
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