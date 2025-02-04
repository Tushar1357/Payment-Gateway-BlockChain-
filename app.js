const express = require("express");
const addressRouter = require('./routers/generate_address')

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/",(req , res) => {
  res.json({
    message: "Invalid Request",
    status: "fail"
  })
})

app.use("/generate-address",addressRouter)


app.listen(PORT, () => {
  console.log(`Server listening at port : ${PORT}`);
});
