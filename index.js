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
app.use(express.static("node_modules/bootstrap/dist/"));

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

// Configuración de Passport antes de las rutas
passport.use(
  "local",
  new Strategy(
    { usernameField: 'email' }, // Especifica que el campo username es 'email'
    async function verify(email, password, cb) {
      try {
        console.log("Attempting login for:", email); // Debug
        const result = await db.query("SELECT * FROM usuarios WHERE correo = $1", [email]);
        
        if (result.rows.length > 0) {
          const user = result.rows[0];
          const storedHashedPassword = user.contrasena_hash;
          
          bcrypt.compare(password, storedHashedPassword, (err, valid) => {
            if (err) {
              console.error("Error comparing passwords:", err);
              return cb(err);
            } else {
              if (valid) {
                console.log("Login successful for:", email); // Debug
                return cb(null, user);
              } else {
                console.log("Invalid password for:", email); // Debug
                return cb(null, false);
              }
            }
          });
        } else {
          console.log("User not found:", email); // Debug
          return cb(null, false); // Cambiar de cb("User not found") a cb(null, false)
        }
      } catch (err) {
        console.error("Database error:", err);
        return cb(err);
      }
    }
  )
);

passport.serializeUser((user, cb) => {
  cb(null, user.id_usuario); // Usar solo el ID del usuario
});

passport.deserializeUser(async (id, cb) => {
  try {
    console.log("Deserializing user with ID:", id); // Debug
    const result = await db.query("SELECT * FROM usuarios WHERE id_usuario = $1", [id]);
    if (result.rows.length > 0) {
      cb(null, result.rows[0]);
    } else {
      console.log("User not found in deserializeUser for ID:", id); // Debug
      cb(null, false); // Cambiar a cb(null, false) en lugar de cb("User not found")
    }
  } catch (err) {
    console.error("Error deserializing user:", err);
    cb(err);
  }
});

// Rutas de la aplicacion

// Rutas get 
app.get("/login", async (req, res) => {
  res.render("login.ejs");
});

app.get("/logout", async (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error("Error during logout:", err);
      return res.status(500).send("Error logging out");
    }
    res.redirect("/login");
  });
});

app.get("/register", async (req, res) => {
  res.render("register.ejs");
});

app.get("/", async (req, res) => {
  if (req.isAuthenticated()) {
    // Renderiza la vista principal si el usuario está autenticado
    try {
      const books = await db.query("SELECT * FROM libros");

      if (books.rows.length > 0) {
        console.log(books.rows)
        res.render("index.ejs", { user: req.user, books: books.rows });
      } else {
        res.render("index.ejs", { user: req.user });
      }
    } catch (error) {
      console.error("Error retrieving books:", error);
      res.status(500).send("Internal server error");
    }
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

app.get("/settings", async (req, res) => {
  if (req.isAuthenticated()) {
    res.render("settings.ejs", { user: req.user });
  } else {
    res.redirect("/login");
  }
});

// Rutas Post
app.post("/register", async (req, res) => {
  const { fName, lName, email, password, cedula, phoneNumber, passwordConfirmation } = req.body;
  const role = 3;

  if (password === passwordConfirmation) {
    try {
      const checkResult = await db.query("SELECT * FROM usuarios WHERE correo = $1", [email]);

      if (checkResult.rows.length > 0) {
        console.log("Usuario ya existente");
        return res.render("register.ejs", { error: "El usuario ya existe" });
      } else {
        bcrypt.hash(password, saltRounds, async (err, hashedPassword) => {
          if (err) {
            console.error("Error hashing password:", err);
            return res.status(500).send("Error creating user");
          } else {
            try {
              const result = await db.query(
                "INSERT INTO usuarios (nombre, apellido, correo, contrasena_hash, cedula_identidad, numero_celular, id_rol) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
                [fName, lName, email, hashedPassword, cedula, phoneNumber, role]
              );
              const user = result.rows[0];
              
              // Asegura que el usuario tenga el campo id_usuario
              console.log("Created user:", user); // Debug
              
              req.login(user, (err) => {
                if (err) {
                  console.error("Error logging in after registration:", err);
                  return res.redirect("/login");
                }
                console.log("Registration and login successful");
                res.redirect("/");
              });
            } catch (dbErr) {
              console.error("Database error during registration:", dbErr);
              res.status(500).send("Error creating user");
            }
          }
        });
      }
    } catch (err) {
      console.error("Error during registration:", err);
      res.status(500).send("Internal server error");
    }
  } else {
    console.log("Passwords don't match");
    return res.render("register.ejs", { error: "Las contraseñas deben ser iguales" });
  }
});

app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: false
  })
);

app.post("/settings", async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect("/login");
  }

  const { fName, lName, email, password, cedula, phoneNumber } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    await db.query(
      "UPDATE usuarios SET nombre = $1, apellido = $2, correo = $3, contrasena_hash = $4, cedula_identidad = $5, numero_celular = $6 WHERE id_usuario = $7",
      [fName, lName, email, hashedPassword, cedula, phoneNumber, req.user.id_usuario]
    );
    res.redirect("/settings");
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).send("Error updating user");
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});