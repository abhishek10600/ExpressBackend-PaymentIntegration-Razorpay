require("dotenv").config();
const express = require("express");
const Razorpay = require("razorpay");

const app = express();

//middlewares
app.use(express.static("./public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.get("/", (req, res) => {
    res.sendFile("index.html");
})

//this route is only responsible for detecting the amount and process the payment. Other checks on the payment must be done before sending it to orders
app.post("/order", async (req, res) => {
    const amount = req.body.amount;
    const instance = new Razorpay(
        {
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        }
    )
    const options = {
        amount: amount * 100,
        currency: "INR",
        receipt: "receipt#1",
    }
    const myOrder = await instance.orders.create(options);

    res.status(200).json({
        success: true,
        amount,
        order: myOrder
    })
})

app.listen(process.env.PORT, () => {
    console.log(`App running at port ${process.env.PORT}`);
})