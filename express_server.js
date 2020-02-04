const express = require("express");
const app = express();
const bcrypt = require('bcrypt');
const password = "purple-monkey-dinosaur"; // found in the req.params object
const hashedPassword = bcrypt.hashSync(password, 10);
const cookieSession = require('cookie-session');
const { getUserByEmail } = require('./helpers');
const PORT = 8080; // default port 8080

app.set("view engine", "ejs");


app.use(cookieSession({
  name: 'session',
  keys: ["adafgasdgfjhsdafgsdgfliwuegfbhjsdbusdhvhsdvhjsdvhajsgfbcuawsngfuxo"],
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));

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
const generateRandomString = function() {
  const length = 6;
  return Math.round((Math.pow(36, length + 1) - Math.random() * Math.pow(36, length))).toString(36).slice(1);
};


const hashed = function(password) {
  const hash = bcrypt.hashSync(password, 10);
  console.log(password, hash);
  return hash;
};

const isRegistered = function(userId) {
  const user = users[userId];
  if (user) {
    return true;
  }

  return false;
};

const urlsForUser = function(id, urlDataBase) {
  const results = {};
  for (let urls in urlDataBase) {
    if (urlDataBase[urls]['userID'] === id) {
      results[urls] = urlDataBase[urls];
    }
  }
  return results;
};

//==========================================================================

app.get("/", (req, res) => {
  res.redirect("/login")
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});


app.get("/urls", (req, res) => {
  const userID = req.session.user_id;
  console.log(userID)
  let templateVars = {
    urls: urlsForUser(userID, urlDatabase),
    user: users[userID] 
  };
  if(!isRegistered(req.session.user_id)){
  res.redirect("/login")
  }else{
    res.render("urls_index", templateVars);
  }

});

app.get("/urls/new", (req, res) => {
  if (!isRegistered(req.session.user_id)) {
    res.redirect('/login');
  } else if (isRegistered(req.session.user_id)) {
    let templateVars = {
      urls: urlDatabase,
      user: users[req.session['user_id']]
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
    longURL: urlDatabase[req.params.shortURL]['longURL'],
    user: users[req.session['user_id']]
  };
  res.render("urls_show", templateVars);
});

app.post("/urls/:shortURL/delete", (req, res) =>{
  if (!isRegistered(req.session.user_id)) {
    res.send('This is not your URL!');
  } else if (req.session.user_id !== urlDatabase[req.params.shortURL]['userID']) {
    res.send('This is not your URL!');
  } else {
    delete urlDatabase[req.params.shortURL];
  }
  res.redirect("/urls");
});

app.post("/urls/:shortURL", (req, res) => {
  if (!isRegistered(req.session.user_id)) {
    res.send('Sorry! You have to login');
    console.log('cookie not being found');
  } else if (req.session.user_id !== urlDatabase[req.params.shortURL]['userID']) {
    res.send('Sorry! You can only Edit your own URLs');
    console.log('researching for cookie here');
  } else {
    urlDatabase[req.params.shortURL]['longURL'] = req.body.longURL;

  }
  res.redirect(`/urls/`);
});

app.post("/urls", (req, res) => {
  // console.log(req.body);
  const creatingShortUrls = generateRandomString();
  urlDatabase[creatingShortUrls] = {
    userID: req.session.user_id,
    longURL: req.body.longURL
  };
  res.redirect(`/urls/${creatingShortUrls}`);
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL]['longURL'];
  if (longURL.includes('http://') || longURL.includes('https://')){
    res.redirect(`${longURL}`)
  }
  res.redirect(`http://${longURL}`);
});



app.post('/login', (req, res) => {
  if (!getUserByEmail(req.body.email)) {
    res.status(403);
    res.redirect("/register");
  } else {
    let userID = "";
    for (let userRandomID in users) { 
      if (users[userRandomID]['email'] === req.body.email) {
        userID = userRandomID;
      }
    }
    if (! bcrypt.compareSync(req.body.password, users[userID]['password'])) {
      res.status(403);
      res.redirect("/login");
    } else {
      req.session.user_id = userID;
      res.redirect("/urls/");
    }
  }
  

});

app.post('/logout', (req, res) => {
  req.session = null;
  res.status(200).redirect('/urls/');
});

app.get('/register', (req, res) => {
  let templateVars = {
    urls: urlDatabase,
    user: users[req.session['user_id']]
  };
  res.render("registration", templateVars);
});

  
    
app.post('/register', (req, res) => {
  if (req.body.email === "" || req.body.password === "") {
    res.status(400).send('Email or password are missing');
  } else if (getUserByEmail(req.body.email)) {
    res.status(400);
  } else {
    //register the user
    const createRandomID = generateRandomString();
    users[createRandomID] = {
      id: createRandomID,
      email: req.body.email,
      password: hashed(req.body.password)//
    };
    req.session.user_id = createRandomID;
    req.session.email = req.body.email;  
    res.redirect('/urls');
  }
});

app.get('/login', (req, res) => { 
  let templateVars = {
    urls: urlDatabase,
    user: users[req.session['user_id']]
  };
  res.render('login', templateVars);
});

