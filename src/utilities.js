function testRandomGenerator(times){
  let counter = 0;
  Array(times).fill().forEach( (element) => {
    if (chooseRandomCustomerID() > 50 || chooseRandomCustomerID() < 1) {
      console.log("OH SHIT")
    } else {
      console.log(1)
    }
    // counter++
    // console.log(counter, chooseRandomCustomerID())
  })
  console.log("It worked!")
}