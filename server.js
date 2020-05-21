const express = require('express');
const app = express();
const posts = require('./controllers/posts')
const comments=require('./controllers/comments')
app.use("/posts",posts)
app.use("/comments",comments)
const port = 3000;
app.listen(port,()=>{
    console.log('open in port 3000')
})