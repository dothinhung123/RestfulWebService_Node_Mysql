const express = require('express');
const http = require('http');
const app = express();
const posts = require('./controllers/posts')
const comments=require('./controllers/comments')
app.get('/',(req,res)=>{
    res.redirect('/posts')
})
app.use("/posts",posts)
app.use("/comments",comments)
const port = process.env.PORT || 3000;
const server = http.createServer(app)
server.listen(port,()=>{
    console.log(`Sever is listening on the port ${port}`)
})