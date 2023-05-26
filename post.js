const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const dotEnv = require("dotenv");
dotEnv.config();

const app = express();
var axios = require("axios");
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(cors());

app.post("/", function (req, res) {
  Points = req.body["Total Point Of All"];
  Parent_Points = Points / 2;

  Phone = req.body["Parent Number"];
  if (Phone === null) {
    res.send("Parent number is empty").status(400);
  }
  var config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `https://rest.gohighlevel.com/v1/contacts/lookup?phone=+237${Phone}`,
    headers: {
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2NhdGlvbl9pZCI6IlhEd3NXM0Fkc3I5YTZ4U3RmdWozIiwiY29tcGFueV9pZCI6Ikw0bkdZYkdrbFdFc3NuYmt2dmZrIiwidmVyc2lvbiI6MSwiaWF0IjoxNjg0MjYwNzE3MzU1LCJzdWIiOiJ1c2VyX2lkIn0.UzTAIQ3ql7fH6aSPo-oTKJYk8uBu5l9eLtdENlMelro",
    },
  };

  axios(config)
    .then(function (response) {
      var data = {
        phone: `${response.data.contacts[0].phone}`,
        customField: {
          "6RsaroTiTYuPdG3LISRk": `${
            response.data.contacts[0].customField[2].value + Parent_Points
          }`,
        },
      };

      var update = {
        method: "put",
        maxBodyLength: Infinity,
        url: `https://rest.gohighlevel.com/v1/contacts/${response.data.contacts[0].id}`,
        headers: {
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2NhdGlvbl9pZCI6IlhEd3NXM0Fkc3I5YTZ4U3RmdWozIiwiY29tcGFueV9pZCI6Ikw0bkdZYkdrbFdFc3NuYmt2dmZrIiwidmVyc2lvbiI6MSwiaWF0IjoxNjg0MjYwNzE3MzU1LCJzdWIiOiJ1c2VyX2lkIn0.UzTAIQ3ql7fH6aSPo-oTKJYk8uBu5l9eLtdENlMelro",
        },
        data: data,
      };

      axios(update)
        .then(function (response) {
          console.log(JSON.stringify(response.data));
        })
        .catch(function (error) {
          console.log(error);
        });

      console.log(JSON.stringify(response.data));
    })
    .catch(function (error) {
      console.log(error);
    });
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;