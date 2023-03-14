const { ApolloServer } = require("apollo-server");
const { Pool, Client } = require("pg");

const pool = new Pool({
  user: "student_attendance_user",
  host: "dpg-cevpgecgqg4cnphobkt0-a.oregon-postgres.render.com",
  database: "student_attendance",
  password: "zWASg2klC6Zi55AEmjHi9LvfVUwqn2EA",
  port: 5432,
  ssl: true,
});

// 1
const typeDefs = `
  type Query {
    getStudents: [Students]
    postStudents(name: String, email: String, phone: Int, parent_name: String, class: Int): [Students]
    updateStudents (id:Int, name: String, email: String, phone: Int, parent_name: String, class: Int) : [Students]
    deleteStudents (id: Int) : [Students]

    
  }

  type Students {
    id: Int
    name: String
    email: String
    parent_name: String
    phone: Int
    class: Int
  }

`;

// 2
const resolvers = {
  Query: {
    // crud of students
    //get
    getStudents: (root, args, cont) => {
      return new Promise((res, rej) => {
        pool.query("SELECT * FROM students", (error, results) => {
          if (error) {
            throw error;
          }
          res(results.rows);
        });
      });
    },
    //post
    postStudents: (root, args, cont) => {
      //console.log(args)
      return new Promise((res, rej) => {
        pool.query(
          `INSERT INTO students (name, email, parent_name, phone, class) VALUES ($1, $2, $3, $4, $5)`,
          [args.name, args.email, args.parent_name, args.phone, args.class],
          (error, results) => {
            if (error) {
              throw error;
            }
            res([
              {
                name: args.name,
                email: args.email,
                parent_name: args.parent_name,
                phone: args.phone,
                class: args.class,
              },
            ]);
          }
        );
      });
    },
    //update
    updateStudents: (root, args, cont) => {
      //console.log(args)
      return new Promise((res, rej) => {
        pool.query(
          "UPDATE students SET name=($1), email=($2), parent_name=($3), class=($4), phone=($5) WHERE id=($6)",
          [
            args.name,
            args.email,
            args.parent_name,
            args.class,
            args.phone,
            args.id,
          ],
          (error, results) => {
            if (error) {
              throw error;
            }
            res([
              {
                name: args.name,
              },
            ]);
          }
        );
      });
    },
    //delete
    deleteStudents: (root, args, cont) => {
      return new Promise((res, rej) => {
        const id = args.id;
        //console.log(id);
        pool.query(
          'DELETE FROM "students" WHERE id= ($1)',
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

server
  .listen(4000)
  .then(({ url }) => console.log(`Server is running on ${url}`));
