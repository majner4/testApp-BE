const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config({ path: "constants.env" });

require("./models/User");
require("./models/UserInfo");
require("./models/UploadFile");
require("./models/UserNews");

const app = express();
if (process.env.NODE_ENV !== "production") {
  app.options(
    "*",
    cors({ origin: "http://localhost:3000", optionsSuccessStatus: 200 })
  );

  app.use(cors({ origin: "http://localhost:3000", optionsSuccessStatus: 200 }));
}

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGO_DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running at: http://localhost:${PORT}/`);
});

require("./routes/userRoutes")(app);
require("./routes/userInfoRoutes")(app);
require("./routes/uploadFileRoutes")(app);
require("./routes/userNewsRoutes")(app);

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));

  const path = require("path");
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}
