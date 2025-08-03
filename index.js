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

      function getStudents(allUsers) {
        return allUsers.filter(user => user.id_rol === 3);
      }

      function getTeachers(allUsers) {
        return allUsers.filter(user => user.id_rol === 2);
      }

      function getAdmins(allUsers) {
        return allUsers.filter(user => user.id_rol === 1);
      }


      const allModules = await db.query("SELECT * FROM contenidos");
      const numOfModules = allModules.rows.length;

      const allUsers = await db.query("SELECT * FROM usuarios");
      

      const allStudents = getStudents(allUsers.rows);
      const allTeachers = getTeachers(allUsers.rows);
      const allAdmins = getAdmins(allUsers.rows);
      
      
      const userRole = getUserRole(userRoleId);

      res.render("recursos.ejs", { 
        user: req.user, 
        role: userRole, 
        students: allStudents, 
        teachers: allTeachers,
        admins: allAdmins,
        numModules: numOfModules
      });
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
    const books = await db.query("SELECT * FROM libros ORDER BY id_libro");
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
      JOIN archivos tm ON ca.id_archivo = tm.id_archivo
      WHERE ca.id_contenido = $1
    `, [idModulo]);

    res.json(resultado.rows);
  } catch (error) {
    console.error("Error al obtener los enlaces:", error);
    res.status(500).send("Error interno del servidor");
  }
});

app.get("/api/announcements", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM anuncios ORDER BY id_mensaje DESC");
    const anuncios = result.rows;
    
    res.json(anuncios);
  } catch (error) {
    res.status(500).send("Error al obtener los anuncios: ", error);
  }
});

app.get("/api/users", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM usuarios ORDER BY id_usuario");
    const users = result.rows;

    res.json(users);
  } catch (error) {
    res.status(500).send("Error al obtener los usuarios", error);
  }
});

app.get("/api/modules", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM contenidos ORDER BY id_contenido");
    const modules = result.rows;

    res.json(modules);
  } catch (error) {
    res.status(500).send("Error al obtener los usuarios", error);
  }
});

app.get("/api/module/:id/exercises", async (req, res) => {
  const moduleId = req.params.id;

  try {
    const result = await db.query(
      "SELECT * FROM ejercicios WHERE id_contenido = $1",
      [moduleId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error al obtener ejercicios:", err);
    res.status(500).json({ error: "Error al obtener ejercicios" });
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
      const ejercicios = [];

      // Archivos
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

      // Insertar módulo
      const resultadoContenido = await db.query(
        `INSERT INTO contenidos (
          titulo, id_libro, descripcion, contenido_texto, url_recurso, id_tipo_contenido
        ) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id_contenido`,
        [title, book, description, content, videoURL, contentType]
      );

      const id_contenido = resultadoContenido.rows[0].id_contenido;

      // Insertar archivos
      for (const archivo of archivos) {
        const resultadoArchivo = await db.query(
          `INSERT INTO archivos (
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

      // Recolectar ejercicios
      for (let i = 1; i <= 10; i++) {
        const pregunta = req.body[`pregunta${i}`];
        const a = req.body[`opcion_a${i}`];
        const b = req.body[`opcion_b${i}`];
        const c = req.body[`opcion_c${i}`];
        const d = req.body[`opcion_d${i}`];
        const correcta = req.body[`respuesta_correcta${i}`];

        if (pregunta && a && b && c && d && correcta) {
          ejercicios.push({ pregunta, a, b, c, d, correcta });
        }
      }

      // Insertar ejercicios
      for (const ejercicio of ejercicios) {
        await db.query(
          `INSERT INTO ejercicios (
            id_contenido, pregunta, opcion_a, opcion_b, opcion_c, opcion_d, respuesta_correcta
          ) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [
            id_contenido,
            ejercicio.pregunta.trim(),
            ejercicio.a.trim(),
            ejercicio.b.trim(),
            ejercicio.c.trim(),
            ejercicio.d.trim(),
            ejercicio.correcta.trim()
          ]
        );
      }

      res.redirect("/");

    } catch (error) {
      console.error("Error al guardar contenido, archivos o ejercicios:", error);
      res.status(500).send("Error interno del servidor");
    }
  } else {
    res.redirect("/login");
  }
});




app.post("/announcements", async (req, res) => {
  if (req.isAuthenticated()) {
    try {
      const { notificationTitle, notificationMessage } = req.body;
      const usuarioId = req.user.id_usuario;

      await db.query(
        "INSERT INTO anuncios (titulo, mensaje, id_usuario) VALUES ($1, $2, $3)", 
        [notificationTitle, notificationMessage, usuarioId]
      );

      res.redirect("/");

    } catch (error) {
      console.error("Error al crear el anuncio:", error);
      res.status(500).send("Error interno del servidor")
    }
  }
});

// Ruta para actualizar anuncio
app.post("/updateAnnouncement/:id", async (req, res) => {
  if (req.isAuthenticated()) {
    try {
      const { notificationTitle, notificationMessage } = req.body;
      const anuncioId = req.params.id;
      const usuarioId = req.user.id_usuario;

      // Verificar que el anuncio pertenece al usuario autenticado
      const anuncioExistente = await db.query(
        "SELECT id_usuario FROM anuncios WHERE id_mensaje = $1", 
        [anuncioId]
      );

      if (anuncioExistente.rows.length === 0) {
        return res.status(404).send("Anuncio no encontrado");
      }

      if (anuncioExistente.rows[0].id_usuario !== usuarioId) {
        return res.status(403).send("No tienes permisos para actualizar este anuncio");
      }

      // Actualizar el anuncio
      await db.query(
        "UPDATE anuncios SET titulo = $1, mensaje = $2 WHERE id_mensaje = $3", 
        [notificationTitle, notificationMessage, anuncioId]
      );

      res.redirect("/");

    } catch (error) {
      console.error("Error al actualizar el anuncio:", error);
      res.status(500).send("Error interno del servidor");
    }
  } else {
    res.redirect("/login");
  }
});

// Ruta para eliminar anuncio
app.post("/deleteAnnouncement/:id", async (req, res) => {
  if (req.isAuthenticated()) {
    try {
      const anuncioId = req.params.id;
      const usuarioId = req.user.id_usuario;

      // Verificar que el anuncio pertenece al usuario autenticado
      const anuncioExistente = await db.query(
        "SELECT id_usuario FROM anuncios WHERE id_mensaje = $1", 
        [anuncioId]
      );

      if (anuncioExistente.rows.length === 0) {
        return res.status(404).send("Anuncio no encontrado");
      }

      if (anuncioExistente.rows[0].id_usuario !== usuarioId) {
        return res.status(403).send("No tienes permisos para eliminar este anuncio");
      }

      // Eliminar el anuncio
      await db.query("DELETE FROM anuncios WHERE id_mensaje = $1", [anuncioId]);

      res.redirect("/");

    } catch (error) {
      console.error("Error al eliminar el anuncio:", error);
      res.status(500).send("Error interno del servidor");
    }
  } else {
    res.redirect("/login");
  }
});

// Ruta para obtener un anuncio específico (útil para formularios de edición)
app.get("/getAnnouncement/:id", async (req, res) => {
  if (req.isAuthenticated()) {
    try {
      const anuncioId = req.params.id;
      const usuarioId = req.user.id_usuario;

      const resultado = await db.query(
        "SELECT * FROM anuncios WHERE id_mensaje = $1 AND id_usuario = $2", 
        [anuncioId, usuarioId]
      );

      if (resultado.rows.length === 0) {
        return res.status(404).json({ error: "Anuncio no encontrado" });
      }

      res.json(resultado.rows[0]);

    } catch (error) {
      console.error("Error al obtener el anuncio:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  } else {
    res.status(401).json({ error: "No autenticado" });
  }
});

app.post("/updateBook/:id", async (req, res) => {
  const bookId = req.params.id;
  const { nombre_libro, descripcion } = req.body;

  try {
    await db.query(
      "UPDATE libros SET nombre_libro = $1, descripcion = $2 WHERE id_libro = $3",
      [nombre_libro, descripcion, bookId]
    );
    res.redirect("/");
  } catch (error) {
    console.error("Error al actualizar libro:", error);
    res.status(500).send("Error al actualizar libro");
  }
});

app.post("/deleteBook/:id", async (req, res) => {
  const bookId = req.params.id;

  try {
    // 1. Obtener contenidos del libro
    const contenidoResult = await db.query(
      "SELECT id_contenido FROM contenidos WHERE id_libro = $1",
      [bookId]
    );
    const contenidos = contenidoResult.rows;

    for (const contenido of contenidos) {
      const contenidoId = contenido.id_contenido;

      // 2. Obtener archivos asociados a ese contenido
      const archivoResult = await db.query(
        "SELECT id_archivo FROM contenido_archivos WHERE id_contenido = $1",
        [contenidoId]
      );
      const archivos = archivoResult.rows;

      // 3. Eliminar relaciones contenido_archivos
      await db.query(
        "DELETE FROM contenido_archivos WHERE id_contenido = $1",
        [contenidoId]
      );

      // 4. Eliminar archivos asociados (si existen)
      for (const archivo of archivos) {
        await db.query(
          "DELETE FROM archivos WHERE id_archivo = $1",
          [archivo.id_archivo]
        );
      }

      // 5. Eliminar el contenido
      await db.query("DELETE FROM contenidos WHERE id_contenido = $1", [
        contenidoId,
      ]);
    }

    // 6. Finalmente, eliminar el libro
    await db.query("DELETE FROM libros WHERE id_libro = $1", [bookId]);

    res.redirect("/");
  } catch (error) {
    console.error("Error al eliminar libro y sus contenidos:", error);
    res.status(500).send("Error al eliminar libro");
  }
});

app.post("/updateUser/:id", async (req, res) => {
  const userId = req.params.id;
  const { nombre, apellido, correo, id_rol } = req.body;

  try {
    await db.query(
      "UPDATE usuarios SET nombre = $1, apellido = $2, correo = $3, id_rol = $4 WHERE id_usuario = $5",
      [nombre, apellido, correo, id_rol, userId]
    );
    res.redirect("/");
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    res.status(500).send("Error al actualizar usuario");
  }
});

app.post("/updateModule/:id", async (req, res) => {
  const moduleId = req.params.id;
  const { title, descripcion, content } = req.body;

  try {
    await db.query(
      "UPDATE contenidos SET titulo = $1, descripcion = $2, contenido_texto = $3 WHERE id_contenido = $4",
      [title, descripcion, content, moduleId]
    );
    res.redirect("/");
  } catch (error) {
    console.error("Error al actualizar modulo:", error);
    res.status(500).send("Error al actualizar modulo");
  }
});

app.post("/deleteUser/:id", async (req, res) => {
  const userId = req.params.id;

  try {
    // Iniciar una transacción para asegurar que ambas operaciones se completen
    await db.query("BEGIN");

    // Eliminar en orden para respetar las dependencias de claves foráneas
    
    // 1. Eliminar anuncios del usuario
    await db.query("DELETE FROM anuncios WHERE id_usuario = $1", [userId]);
    
    // 2. Eliminar relaciones profesor-estudiante donde el usuario es profesor
    await db.query("DELETE FROM profesores_estudiantes WHERE id_usuario_profesor = $1", [userId]);
    
    // 3. Eliminar relaciones profesor-estudiante donde el usuario es estudiante
    await db.query("DELETE FROM profesores_estudiantes WHERE id_usuario_estudiante = $1", [userId]);
    
    // 4. Eliminar asignaciones de libros al estudiante
    await db.query("DELETE FROM estudiantes_libros WHERE id_usuario_estudiante = $1", [userId]);
    
    // 5. Finalmente eliminar el usuario
    await db.query("DELETE FROM usuarios WHERE id_usuario = $1", [userId]);

    // Confirmar la transacción
    await db.query("COMMIT");

    res.redirect("/"); 
  } catch (error) {
    // Si hay error, revertir la transacción
    await db.query("ROLLBACK");
    console.error("Error al eliminar usuario:", error);
    res.status(500).send("Error al eliminar usuario");
  }
});

app.post("/deleteModule/:id", async (req, res) => {
  const moduleId = req.params.id;

  try {
    // 1. Obtener archivos relacionados al módulo
    const archivoResult = await db.query(
      "SELECT id_archivo FROM contenido_archivos WHERE id_contenido = $1",
      [moduleId]
    );
    const archivos = archivoResult.rows;

    // 2. Eliminar relaciones en contenido_archivos
    await db.query(
      "DELETE FROM contenido_archivos WHERE id_contenido = $1",
      [moduleId]
    );

    // 3. Eliminar archivos asociados
    for (const archivo of archivos) {
      await db.query(
        "DELETE FROM archivos WHERE id_archivo = $1",
        [archivo.id_archivo]
      );
    }

    // 4. Eliminar el contenido (módulo)
    await db.query("DELETE FROM contenidos WHERE id_contenido = $1", [moduleId]);

    res.redirect("/");
  } catch (error) {
    console.error("Error al eliminar módulo:", error);
    res.status(500).send("Error al eliminar módulo");
  }
});




app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});