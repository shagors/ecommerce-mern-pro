const express = require("express");
const morgan = require("morgan");
const app = express();

app.use(morgan("dev"));

app.get("/test", (req,res) => {
    res.status(200).send({
        message: "api test is working fine"
    });
});

app.get("/", (req, res) => {
    res.send("Welcome to test server")
});

app.get("/products", (req, res) => {
    res.send("products are return")
});

app.listen(3001, () => {
    console.log(`Server is running 3001`);
});