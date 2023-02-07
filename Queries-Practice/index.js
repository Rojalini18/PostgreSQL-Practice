const { ApolloServer } = require("apollo-server");
const { Pool, Client } = require("pg");
require('dotenv').config()

const pool = new Pool({
  user: process.env.user,
  host: process.env.host,
  database: process.env.database,
  password: process.env.password,
  port: process.env.port,
  ssl: process.env.ssl,
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
    postTeachers(name: String, phone: Int, class: Int, subject:String): [Teachers]
    updateTeachers (id:Int, name: String, phone: Int, class: Int, subject:String) : [Teachers]
    deleteTeachers (id: Int) : [Teachers]

    getAttendance: [Attendance]
    postAttendance(student_id: Int, date: String, status: String, class: Int): [Attendance]
    updateAttendance (id:Int, student_id: Int, date: String, status: String, class: Int) : [Attendance]
    deleteAttendance (id: Int) : [Attendance]

    filterStdAttendance(student_id: Int): [Attendance]
    filterClsAttendance(class_name: Int) : [Class]


    findClsAttendance(class_name: Int) : [Class]
    stdBlongToClass(class_id:Int, id:Int):[Students]
    studentPresDate(date: String) : [Attendance]
    studentAttCount(class: Int, date: String): [Attendance]
    attBetweenPresent: [Attendance]
    studentNameCountwithA: [Students]
    studentNameCountwithHZ: [Students]
    getTopFiveAttendance(id: Int, class_name: Int): [Class]
    getRes30to70(class:Int, exam_id: Int):[Result]
    getResLessThan30: [Result]
    getTopTenResults(student_id: Int):[Result]
    topFiveOfClass(class: Int): [Students]
  }

  type Students {
    id: Int
    name: String
    email: String
    parent_name: String
    phone: Int
    class: Int
    letter: String
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
    subject: String
  }

  type Attendance {
    id: Int
    student_id: Int
    date: String
    status: String
    class: Int
    count:Int
  }

  type Subject{
    id: Int
    class_id: Int
    subject_name: String
  }

  type Exams{
    id: Int
    class_id: Int
    exam_name: String
  }

  type Result{
    id: Int
    student_id: Int
    exam_id: Int
    grade: String
    subject_id: Int
    marks: Int
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
          `INSERT INTO teachers (name, phone, class, subject) VALUES ($1, $2, $3, $4)`,
          [args.name, args.phone, args.class, args.subject],
          (error, results) => {
            if (error) {
              throw error;
            }
            res([
              {
                name: args.name,
                phone: args.phone,
                class: args.class,
                subject: args.subject,
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
          "UPDATE teachers SET name=($1), phone=($2), class=($3), subject=($4) WHERE id=($5)",
          [args.name, args.phone, args.class, args.subject, args.id],
          (error, results) => {
            if (error) {
              throw error;
            }
            res([
              {
                name: args.name,
                phone: args.phone,
                class: args.class,
                subject: args.subject,
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
        let { student_id } = args;
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
        let { class_name } = args;
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
    //task--------------------------------------------------------------------------------->

    //1.list of students who belongs to class x
    findClsAttendance: (root, args, cont) => {
      return new Promise((res, rej) => {
        let { class_name } = args;
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

    //2.list of students who belongs to class x and assigned to teacher x
    stdBlongToClass: (root, args, cont) => {
      return new Promise((res, rej) => {
        let { class_name } = args;
        console.log(args.class_name);
        pool.query(
          `SELECT students.name FROM students JOIN teachers ON teachers.id=1
          JOIN class ON class.id=1 WHERE teachers.class=class.id AND students.class=teachers.class`,
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

    //3.list of students present between the dates x and y for the class x
    studentPresDate: (root, args, cont) => {
      return new Promise((res, rej) => {
        pool.query(
          `SELECT * FROM attendance WHERE date BETWEEN ($1) AND ($2)`,
          [args.start, args.end],
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

    //4.count of students who belongs to class x and were present on date x
    studentAttCount: (root, args, cont) => {
      return new Promise((res, rej) => {
        pool.query(
          `SELECT COUNT(id) FROM attendance WHERE class = ($1) AND date =($2) AND status= ($3)`,
          [+args.class, args.date, "present"],
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
    //5.count of students whose attendance has been taken by teacher x and were present between the dates x and y
    attBetweenPresent: (root, args, cont) => {
      return new Promise((res, rej) => {
        pool.query(
          `SELECT COUNT(attendance.student_name) FROM attendance JOIN teachers ON teachers.id=3
          WHERE teachers.class=attendance.class AND attendance.date BETWEEN '"11/11/2020"' AND '"13/11/2020"' 
          AND attendance.status='Present'`,
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

    //6.Top 5 students who have the best attendance in the class x
    getTopFiveAttendance: (root, args, cont) => {
      return new Promise((res, rej) => {
        pool.query(
          `SELECT * FROM class ORDER BY marks DESC  LIMIT ($1)`,
          [5],
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

    //7.List of all students whose names start with letter a
    studentNameCountwithA: (root, args, cont) => {
      return new Promise((res, rej) => {
        pool.query(
          `SELECT * FROM students WHERE name LIKE ($1)`,
          ["a%"],
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

    //8.List of all students whose names have letter H n Z in them
    studentNameCountwithHZ: (root, args, cont) => {
      return new Promise((res, rej) => {
        pool.query(
          `SELECT * FROM students WHERE name LIKE ($1) AND name LIKE ($2) `,
          ["%H%", "%Z%"],
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

    //12.List of all Students whose marks are between 30 to 70 for class x and exam y
    getRes30to70: (root, args, cont) => {
      return new Promise((res, rej) => {
        pool.query(
          `SELECT result.marks, students.name FROM result JOIN students ON students.class=1 
          WHERE result.exam_id=1 AND result.marks BETWEEN 30 AND 70 AND students.id=result.student_id`,
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

    //13.Count of students who have failed (i.e scored below 35) for exam x and class y
    getResLessThan30: (root, args, cont) => {
      return new Promise((res, rej) => {
        pool.query(
          `SELECT result.marks, students.name FROM result JOIN students ON students.class=1 
          WHERE result.exam_id=1 AND result.marks < 30 AND students.id=result.student_id`,
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

    //14.Top 10 students who have scored the maximum marks for subject x across all classes
    getTopTenResults: (root, args, cont) => {
      return new Promise((res, rej) => {
        pool.query(
          `SELECT * FROM result ORDER BY marks DESC  LIMIT ($1)`,
          [10],
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

    //15.Rank the top 5 students for the class x based on their marks
    topFiveOfClass: (root, args, cont) => {
      return new Promise((res, rej) => {
        pool.query(
          `SELECT result.marks, students.name FROM result JOIN students ON ($2)=students.class WHERE students.id=result.student_id  
          ORDER BY result.marks DESC LIMIT ($2)`,
          [args.id, 5],
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

server
  .listen(5000)
  .then(({ url }) => console.log(`Server is running on ${url}`));
