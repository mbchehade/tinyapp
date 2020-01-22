const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const PORT = 8080; // default port 8080

app.set("view engine", "ejs");
app.use(cookieParser());

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));


//this is an object called urlDatabase which has 2 properties which are keys and values. the keys are short urls and the values are long urls.
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};


app.get("/", (req, res) => {
  res.send("Hello!");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);// this is to get the server listening on a port.
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase); // this function is a GET request to get the object data in a json package. json package is used to trasmit data between server and web application.
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n")
});

app.get("/set", (req, res) => {
  const a = 1;
  res.send(`a = ${a}`);
}); //it is a GET method which requests a representation of the specified resource. this only retrives data.

app.get("/fetch", (req, res) => {
  res.send(`a = ${a}`);
});

app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase, username: req.cookies['username'] };
  console.log("templateVars", templateVars)
  res.render("urls_index", templateVars);
}); // this route will render the urlDatabase and show it on the page from the template on urlindex file

app.get("/urls/new", (req, res) => {
  let templateVars = { urls: urlDatabase, username: req.cookies['username'] };
  res.render("urls_new", templateVars);
}); // this goes to the new path and render template in urlnew.


app.get("/urls/:shortURL", (req, res) => {
  let templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL], username: req.cookies['username'] };
  res.render("urls_show", templateVars);
});

app.post("/urls/:shortURL/delete", (req, res) =>{
  delete urlDatabase[req.params.shortURL]
  res.redirect("/urls")
})

app.post("/urls/:shortURL", (req, res) => {
  console.log("marker")
  console.log(req.body)
  urlDatabase[req.params.shortURL] = req.body.longURL
  res.redirect(`/urls/`);
})

app.post("/urls", (req, res) => {
  console.log(req.body);  
  const str = generateRandomString()
  urlDatabase[str] = (req.body)["longURL"];  
  res.redirect(`/urls/${str}`)      
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params['shortURL']];
  res.redirect(`http://${longURL}`);
});

function generateRandomString() {
  const length = 6;
      return Math.round((Math.pow(36, length + 1) - Math.random() * Math.pow(36, length))).toString(36).slice(1);
    }

  app.post('/login', (req, res) => {
    res.cookie("username", req.body.username)
    res.redirect("/urls")
  });

  app.post('/logout', (req, res) => {
    res.clearCookie('username', req.body.username)
    res.redirect('/urls')
  })

