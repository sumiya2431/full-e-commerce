const { Client } = require("pg");

const client = new Client({
    user: "postgres",
    host: "localhost",
    database: "e-commerce",
    password: "sumiyangel", 
    port: 5432,
});

client.connect();

module.exports = { client };
