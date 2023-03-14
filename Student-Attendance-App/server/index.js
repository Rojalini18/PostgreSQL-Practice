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

    getClass: [Class]
    postClass(class_name: Int): [Class]
    updateClass (id:Int, class_name: Int) : [Class]
    deleteClass (id: Int) : [Class]

    getTeachers: [Teachers]
    postTeachers(name: String, phone: Int, class: Int): [Teachers]
    updateTeachers (id:Int, name: String, phone: Int, class: Int) : [Teachers]
    deleteTeachers (id: Int) : [Teachers]

    getAttendance: [Attendance]
    postAttendance(student_id: Int, date: String, status: String, class: Int): [Attendance]
    updateAttendance (id:Int, student_id: Int, date: String, status: String, class: Int) : [Attendance]
    deleteAttendance (id: Int) : [Attendance]

    filterStdAttendance(student_id: Int): [Attendance]
    filterClsAttendance(class_name: Int) : [Class]
  }

  type Students {
    id: Int
    name: String
    email: String
    parent_name: String
    phone: Int
    class: Int
  }

  type Class {
    id: Int
    class_name: Int
  }

  type Teachers {
    id: Int
    name: String
    phone: Int
    class: Int
  }

  type Attendance {
    id: Int
    student_id: Int
    date: String
    status: String
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
    // crud of class
    //get
    getClass: (root, args, cont) => {
      return new Promise((res, rej) => {
        pool.query("SELECT * FROM class", (error, results) => {
          if (error) {
            throw error;
          }
          res(results.rows);
        });
      });
    },
    //post
    postClass: (root, args, cont) => {
      //console.log(args)
      return new Promise((res, rej) => {
        pool.query(
          `INSERT INTO class (class_name) VALUES ($1)`,
          [args.class_name],
          (error, results) => {
            if (error) {
              throw error;
            }
            res([
              {
                class_name: args.class_name,
              },
            ]);
          }
        );
      });
    },
    //update
    updateClass: (root, args, cont) => {
      //console.log(args)
      return new Promise((res, rej) => {
        pool.query(
          "UPDATE class SET class_name=($1) WHERE id=($2)",
          [args.class_name, args.id],
          (error, results) => {
            if (error) {
              throw error;
            }
            res([
              {
                class_name: args.class_name,
              },
            ]);
          }
        );
      });
    },
    //delete
    deleteClass: (root, args, cont) => {
      return new Promise((res, rej) => {
        const id = args.id;
        //console.log(id);
        pool.query(
          'DELETE FROM "class" WHERE id= ($1)',
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
    // crud of teachers
    //get
    getTeachers: (root, args, cont) => {
      return new Promise((res, rej) => {
        pool.query("SELECT * FROM teachers", (error, results) => {
          if (error) {
            throw error;
          }
          res(results.rows);
        });
      });
    },
    //post
    postTeachers: (root, args, cont) => {
      //console.log(args)
      return new Promise((res, rej) => {
        pool.query(
          `INSERT INTO teachers (name, phone, class) VALUES ($1, $2, $3)`,
          [args.name, args.phone, args.class],
          (error, results) => {
            if (error) {
              throw error;
            }
            res([
              {
                name: args.name,
                phone: args.phone,
                class: args.class,
              },
            ]);
          }
        );
      });
    },
    //update
    updateTeachers: (root, args, cont) => {
      //console.log(args)
      return new Promise((res, rej) => {
        pool.query(
          "UPDATE teachers SET name=($1), phone=($2), class=($3) WHERE id=($4)",
          [args.name, args.phone, args.class, args.id],
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
    deleteTeachers: (root, args, cont) => {
      return new Promise((res, rej) => {
        const id = args.id;
        //console.log(id);
        pool.query(
          'DELETE FROM "teachers" WHERE id= ($1)',
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
    // crud of attendance
    //get
    getAttendance: (root, args, cont) => {
      return new Promise((res, rej) => {
        pool.query("SELECT * FROM attendance", (error, results) => {
          if (error) {
            throw error;
          }
          res(results.rows);
        });
      });
    },
    //post
    postAttendance: (root, args, cont) => {
      //console.log(args)
      return new Promise((res, rej) => {
        pool.query(
          `INSERT INTO attendance (student_id, date, status, class) VALUES ($1, $2, $3, $4)`,
          [args.student_id, args.date, args.status, args.class],
          (error, results) => {
            if (error) {
              throw error;
            }
            res([
              {
                student_id: args.student_id,
                date: args.date,
                status: args.status,
                class: args.class,
              },
            ]);
          }
        );
      });
    },
    //update
    updateAttendance: (root, args, cont) => {
      //console.log(args)
      return new Promise((res, rej) => {
        pool.query(
          "UPDATE attendance SET student_id=($1), date=($2), status=($3), class=($4) WHERE id=($5)",
          [args.student_id, args.date, args.status, args.class, args.id],
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
    deleteAttendance: (root, args, cont) => {
      return new Promise((res, rej) => {
        const id = args.id;
        //console.log(id);
        pool.query(
          'DELETE FROM "attendance" WHERE id= ($1)',
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

    //filter perticular student attendance
    filterStdAttendance: (root, args, cont) => {
      return new Promise((res, rej) => {
        let { student_id } = args
        console.log(args.student_id);
        pool.query(
          `SELECT * FROM attendance WHERE student_id = ${student_id}`,
          (error, results) => {
            if (error) {
              throw error;
            }
            //console.log(results);
            res(results.rows);
          }
        );
      });
    },
    //filter perticular class attendance
    filterClsAttendance: (root, args, cont) => {
      return new Promise((res, rej) => {
        let { class_name } = args
        console.log(args.class_name);
        pool.query(
          `SELECT * FROM class WHERE class_name = ${class_name}`,
          (error, results) => {
            if (error) {
              throw error;
            }
            //console.log(results);
            res(results.rows);
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

server.listen(4000).then(({ url }) => console.log(`Server is running on ${url}`));

