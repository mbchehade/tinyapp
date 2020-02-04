function getUserByEmail(email, dataBase) {
  // Only change code below this line
  for (let user in dataBase) {
    dataBase = dataBase[user];
    if (email === dataBase['email']) {
      return user;
    }else if(email !== dataBase['email']){
      return undefined;
    }
}
}


module.exports = { getUserByEmail };