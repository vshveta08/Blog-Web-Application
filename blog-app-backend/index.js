const express = require("express");
const app = express();
const cors = require("cors");
const { PORT } = require("./config/index");
const connectDB = require("./config/connectDb");
const routes = require("./routes/index");
const allowedOrigins = ['http://localhost:5173', 'https://blog-web-application-psi.vercel.app'];

const corsOrigin = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Allow credentials such as cookies
};
app.use(cors(corsOrigin));
// app.use(cors());
app.use(express.json());

// set router
app.use("/api", routes);

const start = async () => {
  try {
    await connectDB();
    console.log("db connected...");

    app.listen(PORT, () => {
      console.log(`server connected on ${PORT} port.`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
