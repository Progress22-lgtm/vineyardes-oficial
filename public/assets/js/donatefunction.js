
var stripe_donate = document.getElementById("donate-button")

var container = document.getElementById("select-amount")

var donate = document.getElementById("donate-accepted")

var money_input = document.getElementById("money-inputted")

var cancel  = document.getElementById("donate-canceled")

cancel.addEventListener("click", () =>{
    container.style.visibility = "hidden"
})
stripe_donate.addEventListener("click", () => {
    container.style.visibility = "visible"
    
})

donate.addEventListener("click", () => {
    var x = money_input.value
    if(isNaN(x)){
        alert("Please Write The Amount Of Money")
    }else{
        var choosedMoney = parseInt(money_input.value)
        var RealchoosedMoney = choosedMoney * 100
        var stripeHandler = StripeCheckout.configure({
          key: stripePublicKey,
          locale: "en",
          token: function(token){
            console.log("")
            fetch("/donate", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
              },
              body: JSON.stringify({
                stripeTokenid: token.id,
                amount: choosedMoney
              })
            }).then((res) => {
              return res.json()
            }).then((data) => {
              alert(data.Message)
            }).catch((error) => {
              console.error(error)
            })
          }
        })
        stripeHandler.open({
          amount: parseInt(RealchoosedMoney)
        })
    }
    
})