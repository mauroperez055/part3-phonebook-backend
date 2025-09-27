require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const Person = require("./models/person");

// creamos una app de express
const app = express();

// MIDDLEWARES GENERALES

// Middleware para servir archivos estáticos desde la carpeta "dist"
app.use(express.static("dist"));

// Middleware para parsear el cuerpo de las solicitudes como JSON
app.use(express.json());

// Configuración de morgan para registrar las solicitudes HTTP
morgan.token("body", (request) => {
  return request.method === "POST" ? JSON.stringify(request.body) : " ";
});
// Uso de morgan con el formato personalizado
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

// RUTAS

// Ruta raíz que devuelve un mensaje HTML
app.get("/", (request, response) => {
  response.send(
    "<h1>Agenda Telefónica Backend</h1><p>La API está disponible en /api/persons</p>"
  );
});

// Ruta para obtener todas las personas en formato JSON
app.get("/api/persons", (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons);
  });
});

// Ruta para obtener información sobre el número de personas y la fecha actual
app.get("/info", (request, response) => {
  Person.countDocuments({}).then((count) => {
    response.send(
      `<p>Phonebook has info for ${count} people</p><p> ${new Date()}</p>`
    );
  });
});

// Ruta para obtener una persona por su ID
app.get("/api/persons/:id", (request, response) => {
  Person.findById(request.params.id).then((person) => {
    if (person) {
      response.json(person);
    } else {
      response.status(404).end();
    }
  });
});

// Ruta para agregar una nueva persona
app.post("/api/persons", (request, response) => {
  const body = request.body;
  console.log(body);

  if (!body.name || !body.number) {
    return response.status(404).json({
      error: "name or number is missing",
    });
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person.save().then((savedPerson) => {
    response.json(savedPerson);
  });
});

// Ruta para eliminar una persona por su ID
app.delete("/api/persons/:id", (request, response) => {
  Person.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end();
    })
    .catch((error) => {
      console.log(error);
      response.status(400).send({ error: "malformatted id" });
    });
});

//aca iria una ruta para actualizar un contacto

// MIDDLEWARE PARA MANEJO DE ERRORES

// Middleware para capturar solicitudes a rutas no definidas
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};
// Uso del middleware para manejar rutas no definidas
app.use(unknownEndpoint);


// INICIAR SERVIDOR
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
