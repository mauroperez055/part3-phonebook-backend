const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

const url = process.env.MONGODB_URI;

console.log('connecting to', url);

mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB');
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message);
  })

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

// si solo se pasa la contraseña como argumento, conecta y muestra la lista de contactos agregados
/* if (process.argv.length === 3) {
  Person
    .find({})
    .then((result) => {
      console.log("phonebook:");
      result.forEach((person) => {
        console.log(`${person.name} ${person.number}`);
      });
    mongoose.connection.close();  
  });
} else if (process.argv.length === 5) {
  // si se pasan 4 argumentos, agrega un nuevo contacto a la agenda
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4],
  });

  person.save().then(result => {
    console.log(`added ${person.name} number ${person.number} to phonebook`);
    mongoose.connection.close();
  })
} else {
  console.log("Uso: node mongo.js <password> [<'name'> <number>]");
  mongoose.connection.close();
} */

module.exports = mongoose.model("Person", personSchema);