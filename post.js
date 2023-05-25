var express = require("express");
var app = express();

var axios = require("axios");

app.use(express.json());

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

var server = app.listen(8000, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log("Example app listening at http://%s:%s", host, port);
});
