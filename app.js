const express = require("express");
const https = require("https");
const bodyparser = require("body-parser");

const app = express();

app.use(bodyparser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.post("/", function (req, res) {
  console.log(req.body.cityName);

  const query = req.body.cityName;

  const apikey = "e69413fdc9aa7276f8e63c9794e63b88";
  const unit = "metric";

  const url =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    query +
    "&appid=" +
    apikey +
    "&units=" +
    unit; // made it because ur was going very long in https.grt()

  https.get(url, function (response) {
    // res was only there so here we used response because otherwise it will be confusing
    console.log(response.statusCode);

    response.on("data", function (data) {

      const weatherData = JSON.parse(data); // this will turn a JSON in some sort of string format, say the hexadecimal, or binary, or text and turn it into an actual javascript object
      const temp = weatherData.main.temp;
      const weatherDescription = weatherData.weather[0].description;
      const icon = weatherData.weather[0].icon;
      const imageURL = "https://openweathermap.org/img/wn/" + icon + "@2x.png";
      // we can't write multiple res.send() so we are using res.write()
      res.write("<p>The weather is currently " + weatherDescription + "</p>");
      res.write(
        "<h1>The temperature in " + query + " is " + temp + " degree celsius</h1>"
      );
      res.write("<img src=" + imageURL + ">");
      res.send();
      // JSON.stringify() // turn a javascript object into string
    });
  });
});

app.listen(3000, function () {
  console.log("Server is running on port 3000");
});
