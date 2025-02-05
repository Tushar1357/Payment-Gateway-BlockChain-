const express = require("express");
const addressRouter = require('./routers/generate_address')
const OwnerRouter = require('./routers/addOwner')
const bodyParser = require('body-parser')
const checkBalance = require('./balanceChecker/main')
const http = require('http')
const {setupServer} = require('./socket/main')
const cors = require('cors')

const app = express();
const server = http.createServer(app)

setupServer(server)
const PORT = process.env.PORT || 3001;

app.get("/",(req , res) => {
  res.json({
    message: "Invalid Request",
    status: "fail"
  })
})
app.use(cors({
  origin: "http://localhost:3000"
}))
app.use(bodyParser.json())
app.use("/generate-address",addressRouter)
app.use("/add-owner",OwnerRouter)


server.listen(PORT, () => {
  console.log(`Server listening at port : ${PORT}`);
});

checkBalance()