const mysql = require("mysql");
const inquirer = require("inquirer");

const connection = mysql.createConnection({
    host: "localhost",
  
    port: 3306,
  
    user: "root",
  
    password: "Adeboye213$",
    database: "employees_db"
  });
  
  connection.connect(function(err) {
    if (err) throw err;
    start();
  });

function start() {
    inquirer
  .prompt({
      type: "list",
      name: "selection",
      message: "What would you like to do?",
      choices: ["View All Employees", "View Departments", "View Roles", "Add Employee", "Add Department", "Add Role", "Update An Employee", "Quit"]
  })
  .then(function(answer) {
      switch(answer.selection) {
          case "View All Employees":
              viewAllEmployees();
              break;
          case "View Departments":
              viewDepartments();
              break;
          case "View Roles":
              viewRoles();
              break;
          case "Add Employee":
              addEmployee();
              break;
          case "Add Department":
              addDepartment();
              break;
          case "Add Role":
              addRole();
              break;
          case "Update An Employee":
              updateEmployee();
              break;
          default:
              connection.end();
              break;
      }
  })
};

function viewAllEmployees() {
    var query = `SELECT e.id, e.first_name AS "First Name", e.last_name AS "Last Name", r.title, d.name AS "Department", IFNULL(r.salary, 'No Data') AS "Salary", CONCAT(m.first_name, ' ', m.last_name) AS "Manager"
    FROM employee e
    LEFT JOIN role r 
    ON r.id = e.role_id 
    LEFT JOIN department d 
    ON d.id = r.department_id
    LEFT JOIN employee m ON m.id = e.manager_id
    ORDER BY e.id;`;

    connection.query(query, function(err, res) {
        if (err) throw err;

        console.table(res)

        start();
    });
};

function viewDepartments() {
    var query = "SELECT * FROM department";

    connection.query(query, function(err, res) {
        if(err) throw err;

        console.table(res);

        start();
    });
};

function viewRoles() {
    var query = "SELECT * FROM role";

    connection.query(query, function(err, res) {
        if (err) throw err;

        console.table(res);

        start();
    });
};

function addEmployee() {
    console.log("Adding new employee...\n");

    var query = "SELECT * FROM role";
    connection.query(query, function(err, res) {
        if (err) throw err;

        inquirer
        .prompt([
            {
                name: "firstName",
                type: "input",
                message: "What is the employee's first name?"
            },
            {
                name: "lastName",
                type: "input",
                message: "What is the employee's last name?"
            },
            {
                name: "employee_role",
                type: "rawlist",
                message: "What's their role?",
                choices: function() {
                    let choiceArr = [];
                    for (let i = 0; i < res.length; i++) {
                        choiceArr.push(res[i].title)
                    }
                    return choiceArr;
                }
            }
        ])
        .then(function(answer) {

            connection.query("SELECT * FROM role WHERE ?", {title: answer.employee_role}, function (err, res) {
                if (err) throw err;

                connection.query("INSERT INTO employee SET ?", {

                    first_name: answer.firstName,
                    last_name: answer.lastName,
                    role_id: res[0].id
                });

                console.log("Employee successfully added!")

                start();
            })
        })
    })
}

function addDepartment() {
    console.log("Adding a new department!...\n");

    inquirer
      .prompt([
          {
              name: "nameOfDept",
              type: "input",
              message: "What department do you want to add?"
          }
      ])
      .then(function(answer) {
          console.log(answer);

          var query = connection.query(
              "INSERT INTO department SET ?",
              {
                  name: answer.nameOfDept
              },
              function(err, res) {
                  if(err) throw err;
                  
                  console.log(res.affectedRows + " department added!\n");

                  start();
              }
          )
      })

}

function addRole() {
    console.log("Adding a new role...\n");

    let depts = [];
  
    var query = "SELECT * FROM department";
  
    connection.query(query, function(err, res) {
        if(err) throw err;
  
        for (let i = 0; i < res.length; i++) {
            depts.push({name: res[i].name, value: res[i].id});
        }
  
        inquirer
          .prompt([
              {
                  name: "role_title",
                  type: "input",
                  message: "What role would you like to add?"
              },
              {
                  name: "salary",
                  type: "input",
                  message: "What is the salary for this role?",
                  validate: function(value) {
                    if (isNaN(value) === false) {
                      return true;
                    }
                    return false;
                  }
              },
              {
                  name: "department",
                  type: "rawlist",
                  message: "What department is this role under?",
                  choices: depts
              }
          ])
          .then(function(answer) {
              console.log(answer);

              var query = connection.query(
                  "INSERT INTO role SET ?",
                  {
                      title: answer.role_title,
                      salary: answer.salary,
                      department_id: answer.department
                  },
                  function(err, res) {
                      if(err) throw err;

                      console.log(res.affectedRows + " role added!\n")

                      start();
                  }
              )
          })
    })
}

function updateEmployee() {
    console.log("Updating a current employee's role!...\n");

}