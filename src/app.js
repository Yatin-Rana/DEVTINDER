const express = require('express'); //referencing to that exoress folder inside node modules

const app = express(); //creating an express application


app.listen(30001,()=>{
    console.log('Server is up on port 30001')
})