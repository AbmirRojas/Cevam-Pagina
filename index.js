import express from 'express';
import pg from 'pg';
import bodyParser from 'body-parser';
import ejs from 'ejs';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const port = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


app.get("/login", async (req, res) => {
  res.sendFile(path.join(__dirname, "login.html"));
});


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });