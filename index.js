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
      const userRoleId = req.user.id_rol;
      
      function getUserRole (userRoleId) {
        let userRole = "";
          if (userRoleId === 1) {
          userRole = "admin";
        } else if (userRoleId === 2) {
           userRole = "teacher";
        } else if (userRoleId === 3) {
          userRole = "student";
        }
        return userRole
      }
      
      const userRole = getUserRole(userRoleId);

      res.render("recursos.ejs", { user: req.user, role: userRole });
    } catch (error) {
      console.error("Error retrieving books:", error);
      res.status(500).send("Internal server error");
    }
  } else {
    res.redirect("/login");
  }
});

app.get("/api/books", async (req, res) => {
  try {
    const books = await db.query("SELECT * FROM libros");
    res.json(books.rows);
  } catch (error) {
    res.status(500).json({ error: "Error retrieving books" });
  }
});

app.get("/api/book/:id/modules", async (req, res) => {
  if (req.isAuthenticated()) {
    try {
      const bookId = req.params.id;
      const modules = await db.query("SELECT * FROM contenidos WHERE id_libro = $1", [bookId]);

      res.json(modules.rows);
    } catch (error) {
      console.error("Error retrieving modules:", error);
      res.status(500).send("Internal server error");
    }
  } else {
    res.redirect("/login");
  }
});

app.get("/api/module/:id", async (req, res) => {
  if (req.isAuthenticated()) {
    try {
      const moduleId = req.params.id;
      const module = await db.query("SELECT * FROM contenidos WHERE id_contenido = $1", [moduleId]);

      res.json(module.rows);
    } catch (error) {
      console.error("Error retrieving module:", error);
      res.status(500).send("Internal server error");
    }
  } else {
    res.redirect("/login");
  }
});

app.get("/api/module/:id/type", async (req, res) => {
  if (req.isAuthenticated()) {
    try {
      const typeId = req.params.id;
      const type = await db.query("SELECT * FROM tipos_contenido WHERE id_tipo_contenido = $1", [typeId]);
      
      res.json(type.rows[0]);
    } catch (error) {
      console.error("Error retrieving type", error);
      res.status(500).send("Internal server error");
    }
  } else {
    res.redirect("/login");
  }
});

app.get("/modulo/:id/links", async (req, res) => {
  const idModulo = req.params.id;

  try {
    const resultado = await db.query(`
      SELECT tm.link_archivo, tm.nombre_archivo, tm.tamano_archivo
      FROM contenido_archivos ca
      JOIN tipos_material tm ON ca.id_archivo = tm.id_archivo
      WHERE ca.id_contenido = $1
    `, [idModulo]);

    res.json(resultado.rows);
  } catch (error) {
    console.error("Error al obtener los enlaces:", error);
    res.status(500).send("Error interno del servidor");
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

app.post("/createModule", async (req, res) => {
  if (req.isAuthenticated()) {
    const { title, book, description, content, videoURL, contentType } = req.body;

    try {
      const archivos = [];

      // Recolectar hasta 10 conjuntos de datos del formulario
      for (let i = 1; i <= 10; i++) {
        const enlace = req.body[`file${i}`];
        const nombre = req.body[`nombre${i}`];
        const tamano = req.body[`tamano${i}`];

        if (enlace && enlace.trim() !== "") {
          archivos.push({
            link: enlace.trim(),
            nombre: nombre?.trim() || null,
            tamano: tamano ? parseFloat(tamano) : null,
          });
        }
      }

      // Insertar contenido principal
      const resultadoContenido = await db.query(
        `INSERT INTO contenidos (
          titulo, id_libro, descripcion, contenido_texto, url_recurso, id_tipo_contenido
        ) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id_contenido`,
        [title, book, description, content, videoURL, contentType]
      );

      const id_contenido = resultadoContenido.rows[0].id_contenido;

      // Insertar cada archivo con nombre y tamaño, y vincular al contenido
      for (const archivo of archivos) {
        const resultadoArchivo = await db.query(
          `INSERT INTO tipos_material (
            link_archivo, nombre_archivo, tamano_archivo
          ) VALUES ($1, $2, $3) RETURNING id_archivo`,
          [archivo.link, archivo.nombre, archivo.tamano]
        );

        const id_archivo = resultadoArchivo.rows[0].id_archivo;

        await db.query(
          "INSERT INTO contenido_archivos (id_contenido, id_archivo) VALUES ($1, $2)",
          [id_contenido, id_archivo]
        );
      }

      res.redirect("/");

    } catch (error) {
      console.error("Error al guardar contenido y archivos:", error);
      res.status(500).send("Error interno del servidor");
    }
  }
});

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