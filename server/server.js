import express from "express";
import userRouter from "./routes/user-routes.js";
import blogRouter from "./routes/blog-routes.js";
import helmet from "helmet";
import "./config/db.js";
import cors from "cors";
import http from "http";
import https from "https";

const app = express();

app.use(cors());

//setting helmet middleware
app.use(helmet(
  {
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  }
));

app.set("view engine", "ejs");
app.use(express.json());

app.use("/api/users", userRouter);
app.use("/api/blogs", blogRouter);

app.use("/api", (req, res, next) => {
  res.send("hello");
});

// Image proxy to avoid hotlinking/CORS issues for external image URLs
app.get('/images/proxy', (req, res) => {
  const imageUrl = req.query.url;
  if (!imageUrl) return res.status(400).send('Missing url param');
  let parsed;
  try {
    parsed = new URL(imageUrl);
  } catch (e) {
    return res.status(400).send('Invalid URL');
  }

  const client = parsed.protocol === 'https:' ? https : http;
  const request = client.get(imageUrl, (imageRes) => {
    if (imageRes.statusCode && imageRes.statusCode >= 400) {
      res.status(imageRes.statusCode).send('Failed to fetch image');
      return;
    }
    const contentType = imageRes.headers['content-type'] || 'image/jpeg';
    res.setHeader('Content-Type', contentType);
    imageRes.pipe(res);
  });

  request.on('error', (err) => {
    console.error('Image proxy error:', err.message);
    res.status(500).send('Error fetching image');
  });
});

//define port

app.listen(5001, () => console.log("app started at 5001..."));
