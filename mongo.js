const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("give password as argument");
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://maurodb:${password}@cluster0.p4bfxiy.mongodb.net/phonebook? 
  retryWrites=true&w=majority&appName=Cluster0`;

mongoose.set("strictQuery", false);

mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personSchema);

// si solo se pasa la contraseña como argumento, conecta y muestra la lista de contactos agregados
if (process.argv.length === 3) {
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
  console.log("Uso: node mongo.js <password> [<name> <number>]");
  mongoose.connection.close();
}
