const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const nodemailer = require("nodemailer")
const PublicKey = "pk_live_6hl3S7R3PKC0nX7eTvOFpP8L00cZ3kO1x5"
const SecretKey = "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"
const stripe = require("stripe")(SecretKey)
const bodyParser = require("body-parser")// declare the app settings
app.use(bodyParser())


app.use(express.static("./public/"))
app.set("views", "./public/")
app.set("view engine", "ejs")

app.get("/", (req, res) => {
    res.render("home");
})

app.get("/events", (req, res) =>{
  res.render("events")
})

app.get("/donate", (req, res) => {
    res.render("donation", {
        stripePublicKey: PublicKey
    })
})

app.get("/home", (req, res) => {
    res.redirect("/")
})

app.get("/contact", (req, res) => {
    res.render("contact",  {
        success: ""
      })
})


app.post("/contact", (req, res) => {
    var data = req.body
    var name = data.username
    var surname = data.surname
    var address = data.address
    var message = data.message
    nodemailer.createTestAccount((err, account) => {
      var transporter = nodemailer.createTransport({
        service:"gmail",
        auth: {
          user: "progressemuan223@gmail.com",
          pass: "Jukilo22J"
        }
      })
  
      var mailOptions = {
        from: address, // sender address
        to: 'vineyarofgod@gmail.com', // list of receivers
        subject: ` I am ${name} ${surname}`, // Subject line
        html: `<p>${message}</p>`// plain text body
      }
  
      transporter.sendMail(mailOptions, function (err, info) {
        if(err)
          console.log(err)
        else
          console.log(info)
      })
      res.render("contact", {
        success: "Your Message has been sent"
      })
    })
  })
  
app.post("/donate", (req, res) => {
    var amount = req.body.amount
    console.log("donation of " + amount)
    stripe.charges.create({
      amount: amount,
      source: req.body.stripeTokenid,
      currency: "eur"
    }).then(() => {
      console.log("Succesfully Donated")
      res.json({
        Message: "Succesfully Donated"
      })
    }).catch(() => {
      console.log("Payment Failed")
      res.status(500).end()
    })
  })

app.listen(PORT, (e) =>{
    if (e) throw e
    console.log("Server is running on port " + PORT)
})