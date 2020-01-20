//this file is to keep of all the URLs and their shortened forms. we pass the URL data to urls_index.ejs.

//this file contains an object called urlDatabase, which we use to track all the URLs and their shortened forms. this is the data we eant to show on the URLs page. therefore we need to pass along the urlDatabase to the template.

const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

app.set("view engine", "ejs");//This tells the Express app to use EJS as its templating engine
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n")
});

app.get("/set", (req, res) => {
  const a = 1;
  res.send(`a = ${a}`);
});

app.get("/fetch", (req, res) => {
  res.send(`a = ${a}`);
});

app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});


