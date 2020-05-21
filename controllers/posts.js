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
    res.status(200).send({...value,link:`${id}`})
    return ;
  })
}))
router.post('/',(req,res)=>connection.connect(function(){
  const title = req.body.title;
  const content = req.body.content;
  connection.query("INSERT INTO posts(title,content) Values (?,?,?)",[title,content],function(err,result,fields){
    if(err) throw err;
    res.status(201).send({...result})


    return ;

  })
}))
router.get('/',(req,res)=>connection.connect(function() {
  connection.query("SELECT * FROM posts", function (err, result, fields) {
    if (err) throw err;
  
    
  
    const data = JSON.parse(JSON.stringify(result))

    data.forEach(element=>element.links = element.id);

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
  const title = req.body.title;
  const content = req.body.content;
  connection.query('UPDATE posts SET title = ?, content = ? WHERE id = ?',[title,content,id],function(err,result,fields){
    if(err) throw err;
    res.send(result);
    return ;
  })
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