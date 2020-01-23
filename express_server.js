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

const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};

function lookUpEmail(email) {
  // Only change code below this line
  for (let id in users) {
    const userProfile = users[id];
    if (email === userProfile['email']) {
      return true;
    }
  }
  return false;
  // return email
}

function isRegistered(email){
  for(let user in users){
    if(users[user]['email'] === email){
      return true;
    }
  }
  return false;
}

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
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/set", (req, res) => {
  const a = 1;
  res.send(`a = ${a}`);
}); //it is a GET method which requests a representation of the specified resource. this only retrives data.

app.get("/fetch", (req, res) => {
  res.send(`a = ${a}`);
});

app.get("/urls", (req, res) => {
  const userId = req.cookies['user_id']
  let templateVars = { 
    urls: urlDatabase, 
    user: users[userId]
   };
  console.log("templateVars", templateVars);
  res.render("urls_index", templateVars);
}); // this route will render the urlDatabase and show it on the page from the template on urlindex file

app.get("/urls/new", (req, res) => {
  let templateVars = { 
    urls: urlDatabase, 
    user: users[req.cookies['user_id']] 
  };
  res.render("urls_new", templateVars);
}); // this goes to the new path and render template in urlnew.


app.get("/urls/:shortURL", (req, res) => {
  let templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL], userId: req.cookies['user_id'] };
  res.render("urls_show", templateVars);
});

app.post("/urls/:shortURL/delete", (req, res) =>{
  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls");
});

app.post("/urls/:shortURL", (req, res) => {
  urlDatabase[req.params.shortURL] = req.body.longURL;
  res.redirect(`/urls/`);
});

app.post("/urls", (req, res) => {
  // console.log(req.body);
  const str = generateRandomString();
  urlDatabase[str] = (req.body)["longURL"];
  res.redirect(`/urls/${str}`);
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
  if(!isRegistered(req.body.email)){
    res.status(403)
    res.redirect("/register")
  }else{
    let userId = "";
    for (let userRandomID in users) {
      if (users[userRandomID]['email'] === req.body.email) {
        userId = userRandomID;
      }
  }
  
    if (req.body.password !== users[userId]['password']) {
    res.status(403);
    res.redirect("/login")
  }else {
    
    res.cookie("user_id", userId);
    res.redirect("/urls");
    }
   }
  

});

app.post('/logout', (req, res) => {
  res.clearCookie("user_id", req.body.userId);
  res.redirect('/urls');
});

app.get('/register', (req, res) => {
  let templateVars = { 
    urls: urlDatabase, 
    // userId: req.cookies['user_id'],
    user: users[req.cookies['user_id']] 
  };
  res.render("registration", templateVars);
});

  
    
app.post('/register', (req, res) => {
  if (req.body.email === "" || req.body.password === "") {
    res.status(400).send('Email or password are missing');
  } else if (lookUpEmail(req.body.email)) {
    res.status(400);
  } else {
    //register the user
    const createRandomID = generateRandomString();
    users[createRandomID] = {
      id: createRandomID,
      email: req.body.email,
      password: req.body.password//
    };
    // res.cookie('user_id', users[createRandomID]['id']);
    res.cookie('user_id', createRandomID);
    // console.log(users);
    res.redirect('/urls');
  }
});

app.get('/login', (req, res) => {
  let templateVars = {
    urls: urlDatabase,
    // userId: req.cookies['user_id'],
    user: users[req.cookies['user_id']]
  };
  res.render('login', templateVars)
});

//USER'S Object: to store our users data.