const mongoose = require("mongoose");
const { databasePassword, databaseUsername } = require("../config");
mongoose.Promise = global.Promise;

mongoose.set("useNewUrlParser", true);
mongoose
  .connect(
    `mongodb+srv://${databaseUsername}:${databasePassword}@cluster0-swx3a.mongodb.net/data?retryWrites=true&w=majority`,
    {
      useUnifiedTopology: true,
      useCreateIndex: true,
      useNewUrlParser: true
    }
  )
  .then(() => {
    console.log("DB connected");
  })
  .catch(err => console.log(err));

module.exports = mongoose;
