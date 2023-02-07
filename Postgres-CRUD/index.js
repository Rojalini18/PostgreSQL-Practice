const { ApolloServer } = require("apollo-server");
const { Pool, Client } = require("pg");
require("dotenv").config();

const pool = new Pool({
  user: process.env.user,
  host: process.env.host,
  database: process.env.database,
  password: process.env.password,
  port: process.env.port,
  ssl: process.env.ssl
});

// 1
const typeDefs = `
  type Query {
    getUsers: [Users]
    postUsers (id: Int, name: String, email: String) : [Users]
    deleteUsers (id: Int) : [Users]
    updateUsers (id:Int, name: String, email: String) : [Users]
    
  }

  type Users {
    id: Int
    name: String
    email: String
  }

`;

// 2
const resolvers = {
  Query: {
    // crud of users
    //get
    getUsers: (root, args, cont) => {
      return new Promise((res, rej) => {
        pool.query("SELECT * FROM users", (error, results) => {
          if (error) {
            throw error;
          }
          res(results.rows);
        });
      });
    },
    //post
    postUsers: (root, args, cont) => {
      let { name, email } = args;
      let data = [name, email];
      console.log(data);
      return new Promise((res, rej) => {
        pool.query(
          `INSERT INTO users (name, email) VALUES ($1, $2)`,
          data,
          (error, results) => {
            if (error) {
              throw error;
            }
            res([
              {
                id: "1",
                name: "kavya",
                email: "kavya@email.com",
              },
            ]);
          }
        );
      });
    },
    //update
    updateUsers: (root, args, cont) => {
      let { id, name, email } = args;
      //console.log(id)
      return new Promise((res, rej) => {
        pool.query(
          "UPDATE users SET name=($1), email=($2) WHERE id=($3)",
          [name, email, id],
          (error, results) => {
            if (error) {
              throw error;
            }
            res([
              {
                id,
                name,
                email,
              },
            ]);
          }
        );
      });
    },
    //delete
    deleteUsers: (root, args, cont) => {
      return new Promise((res, rej) => {
        const id = args.id;
        //console.log(id);
        pool.query(
          'DELETE FROM "users" WHERE id= ($1)',
          [id],
          (error, results) => {
            if (error) {
              throw error;
            }
            res([
              {
                id,
              },
            ]);
          }
        );
      });
    },
  },
};

// 3
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.listen(8080).then(({ url }) => console.log(`Server is running on ${url}`));
