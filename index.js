import express from 'express';
import pg from 'pg';
import bodyParser from 'body-parser';
import ejs from 'ejs';
import bcrypt from 'bcrypt';
import passport from 'passport';
import { Strategy } from 'passport-local';
import session from 'express-session';
import env from 'dotenv';


// Detalles de la sesion

const app = express();
const port = 3000;
const saltRounds = 11;
env.config();

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

// Dependencias de sesion y paso de datos

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(passport.initialize());
app.use(passport.session());

// Configuracion de la base de datos


const db = new pg.Client({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});
db.connect();


// Rutas de la aplicacion

// Rutas get 

app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error("Error during logout:", err);
      return res.status(500).send("Error logging out");
    }
    res.redirect("/login");
  });
});

app.get("/register", (req, res) => {
  res.render("register.ejs");
});

app.get("/books", (req, res) => {
  if (req.isAuthenticated()) {
    // Renderiza la vista principal si el usuario está autenticado
    books = db.query("SELECT * FROM libros");

    res.render("main.ejs", { user: req.user, books: books.rows });
  } else {
    res.redirect("/login");
  }
});

app.get("/book/:id/units", async (req, res) => {
  if (req.isAuthenticated()) {
    try {
      const bookId = req.params.id;
      const units = await db.query("SELECT * FROM unidades WHERE id_libro = $1", [bookId]);

      res.render("units.ejs", { user: req.user, units: units.rows });
    } catch (error) {
      console.error("Error retrieving units:", error);
      res.status(500).send("Internal server error");
    }
  } else {
    res.redirect("/login");
  }
});

app.get("/settings", (req, res) => {
  res.render("settings", { user: req.user });
});

// Rutas Post

app.post("/register", async (req, res) => {
  const { fName, lName, email, password, cedula, phoneNumber, role } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    await db.query(
      "INSERT INTO usuarios (nombre, apellido, correo, contrasena_hash, cedula_identidad, numero_celular, id_rol) VALUES ($1, $2, $3, $4, $5, $6, (SELECT id_rol FROM roles WHERE nombre_rol = $7))",
      [fName, lName, email, hashedPassword, cedula, phoneNumber, role]
    );
    res.redirect("/login");
  } catch (err) {
    console.error("Error inserting user:", err);
    res.status(500).send("Error registering user");
  }
});

app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/books",
    failureRedirect: "/login",
  })
);

app.post("/settings", async (req, res) => {
  const { fName, lName, email, password, cedula, phoneNumber } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    await db.query(
      "UPDATE usuarios SET nombre = $1, apellido = $2, correo = $3, contrasena_hash = $4, cedula_identidad = $5, numero_celular = $6 WHERE id_usuario = $7",
      [fName, lName, email, hashedPassword, cedula, phoneNumber, req.user.id]
    );
    res.redirect("/settings");
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).send("Error updating user");
  }
});

passport.use(
  "local",
  new Strategy(async function verify(email, password, cb) {
    try {
      const result = await db.query("SELECT * FROM usuarios WHERE email = $1 ", [
        email,
      ]);
      if (result.rows.length > 0) {
        const user = result.rows[0];
        const storedHashedPassword = user.password;
        bcrypt.compare(password, storedHashedPassword, (err, valid) => {
          if (err) {
            console.error("Error comparing passwords:", err);
            return cb(err);
          } else {
            if (valid) {
              return cb(null, user);
            } else {
              return cb(null, false);
            }
          }
        });
      } else {
        return cb("User not found");
      }
    } catch (err) {
      console.log(err);
    }
  })
);

passport.serializeUser((user, cb) => {
  cb(null, user);
});

passport.deserializeUser((user, cb) => {
  cb(null, user);
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });