const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const bcrypt = require('bcrypt');
const password = "purple-monkey-dinosaur"; // found in the req.params object
const hashedPassword = bcrypt.hashSync(password, 10);
const PORT = 8080; // default port 8080

app.set("view engine", "ejs");
app.use(cookieParser());

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));


//===================== DATABASE ===========================
const urlDatabase = {
  b6UTxQ: { 
    longURL: "https://www.tsn.ca", 
    userID: "aJ48lW" 
  },
  i3BoGr: { 
    longURL: "https://www.google.ca", 
    userID: "aJ48lW" 
  }
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
//====================== FUNCTIONS ==================================
function hashed(password){
  const hash = bcrypt.hashSync(password, 10)
  console.log(password, hash)
  return hash;
}


function lookUpEmail(email) {
  // Only change code below this line
  for (let id in users) {
    const userProfile = users[id];
    if (email === userProfile['email']) {
      return true;
    }
  }
  return false;
}

function isRegistered(email) {
  for (let user in users) {
    if (users[user]['email'] === email) {
      
      return true;
    }
  }
  return false;
}

const urlsForUser = function (id, urlDataBase) {
  const results = {};
  for (let urls in urlDataBase) {
    if (urlDataBase[urls]['userID'] === id) {
      results[urls] = urlDataBase[urls];
    }
  }
  return results;
}

//==========================================================================

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
    const userID = req.cookies['user_id'];
    let templateVars = {
      urls: urlsForUser(userID, urlDatabase),
      user: users[userID]
    };
  console.log(userID, urlDatabase)
  console.log("templateVars", templateVars);
  res.render("urls_index", templateVars);

}); // this route will render the urlDatabase and show it on the page from the template on urlindex file

app.get("/urls/new", (req, res) => {
  if (!req.cookies['user_id']){
    res.redirect('/login')
}else if (isRegistered(users[req.cookies['user_id']]['email'])) {
    let templateVars = {
      urls: urlDatabase,
      user: users[req.cookies['user_id']]
    };
    // res.redirect("/urls/new");
    res.render("urls_new", templateVars);
  } else {
    res.redirect("/login");
  }
}); 


app.get("/urls/:shortURL", (req, res) => {
  let templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
    user: users[req.cookies['user_id']]
  };
  res.render("urls_show", templateVars);
});

app.post("/urls/:shortURL/delete", (req, res) =>{
  if(!req.cookies['user_id']){
    res.send('This is not your URL!');
  } else if (req.cookies['user_id'] !== urlDatabase[req.params.shortURL]['userID']){
    res.send('This is not your URL!');
  }else{
    delete urlDatabase[req.params.shortURL];
  }
  res.redirect("/urls");
});

app.post("/urls/:shortURL", (req, res) => {
  if(!req.cookies['user_id']){
    res.send('Sorry! You can only Edit your own URLs')
  }else if (req.cookies['user_id'] !== urlDatabase[req.params.shortURL]['user_id']){
    res.send('Sorry! You can only Edit your own URLs')
  }else{
  urlDatabase[req.params.shortURL] = { 
    longURL: req.body.longURL
  }
  }
  res.redirect(`/urls/`);
});

app.post("/urls", (req, res) => {
  // console.log(req.body);
  const creatingShortUrls = generateRandomString();
  urlDatabase[creatingShortUrls] = {
    userID: req.cookies['user_id'],
    longURL: req.body.longURL
  }
  res.redirect(`/urls/${creatingShortUrls}`);
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
  if (!isRegistered(req.body.email)) {
    res.status(403);
    res.redirect("/register");
  } else {
    let userID = "";
    for (let userRandomID in users) { //for loop that finds userID from the email.
      if (users[userRandomID]['email'] === req.body.email) {
        userID = userRandomID;
      }
    }
    if (! bcrypt.compareSync(req.body.password, users[userID]['password'])) {
      res.status(403);
      res.redirect("/login");
    } else {
      res.cookie("user_id", userID);
      res.redirect("/urls/");
    }
  }
  

});

app.post('/logout', (req, res) => {
  res.clearCookie("user_id", req.body.userID);
  res.redirect('/urls/');
});

app.get('/register', (req, res) => {
  let templateVars = {
    urls: urlDatabase,
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
      password: hashed(req.body.password)//
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
    // userID: req.cookies['user_id'],
    user: users[req.cookies['user_id']]
  };
  res.render('login', templateVars);
});

//USER'S Object: to store our users data.