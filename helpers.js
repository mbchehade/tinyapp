function getUserByEmail(email, dataBase) {
  // Only change code below this line
  for (let user in dataBase) {
    dataBase = dataBase[user];
    if (email === dataBase['email']) {
      return user;
    }
  }
  return false;
}


module.exports = getUserByEmail;