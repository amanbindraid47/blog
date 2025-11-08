const express = require("express");
const userRouter = require("./routes/user-routes");
const blogRouter = require("./routes/blog-routes");
const helmet = require("helmet");
require("./config/db");
const cors = require("cors");

const app = express();

app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "DELETE", "PATCH", "PUT"],
  credentials: true,
}));

// ✅ Use only express.json() — it replaces bodyParser.json()
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // for form data

// ✅ Helmet middleware
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
}));

app.set("view engine", "ejs");

// ✅ Routes
app.use("/api/users", userRouter);
app.use("/api/blogs", blogRouter);

// ✅ Start server
app.listen(5001, () => console.log("app started at 5001..."));
