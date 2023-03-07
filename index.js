//const express = require('express');
// Import and require mysql2
const db = require('./config/connection.js');
const inquirer = require("inquirer");

// const PORT = process.env.PORT || 3001;
//const app = express();
const { exit } = require("process");
// Express middleware
// app.use(express.urlencoded({ extended: false }));
// app.use(express.json());


//Connecting to database


//Pull up startscreen to make selection
function startScreen() {
    inquirer.prompt({
        type: "list",
        name: "beginingOption",
        message: "What would you like to do?",
        choices: [
            "View All Employees",
            "View by Department",
            "Create Role",
            "Create Employee",
            "Update Employee Role",
            "Exit"
        ],
    })

//Swtich method to navaigate the startscreen and get to selected area
 .then((response) => {
    console.log(response);
    switch (response.beginingOption) {
        case "View All Employees":
            allEmployees();
            break;
        case "View by Department":
            byDepartment();
            break;
        case "Create Role":
            createRole();
            break;
        case "Create Employee":
            createEmployee();
            break;
        case "Update Employee Role":
            updateEmployee();
            break;
        default:
            exit();
            break;
    }
})
    .catch((err) => {
        if(err) throw err;
    })
};
//View by all employees
const allEmployees = () => {
    const sql = `SELECT employee.first_name, employee.last_name, role.title, department.department_name, role.salary
    FROM employee 
    LEFT JOIN role ON employee.role_id = role.id
    LEFT JOIN department ON role.department_id = department.id`;

    db.query(sql, (err, rows) => {
        if(err) throw err;
        console.log(`\n`);
        console.log('Viewing All Employees: ');
        console.log(`\n`);
        console.log(rows);
        console.table(rows[0]);
        startScreen();
    })
};
// // View by all Departments
const byDepartment = () => {
    const sql = `SELECT department.department_name, employee.first_name, employee.last_name, role.title, role.salary
    FROM employee 
    LEFT JOIN role ON employee.role_id = role.id
    LEFT JOIN department ON role.department_id = department.id`; 

    db.query(sql, (err, rows) => {
        if(err) throw err;
        console.log(`\n`);
        console.log('Viewing Employees by Department: ');
        console.log(`\n`);
        console.log(rows);
        startScreen();
    })
};
// //Create a new role
const createRole = () => {
    const sql = `SELECT * FROM department`;

    db.query(sql, async (err, rows) => {
        if(err) throw err;
        rows = rows.map(row => {
            return {
                key: row.id,
                value: row.department_name,
            }
        });
    const answers = await inquirer.prompt([
            {
                type: "input",
                name: "roleTitle",
                message: "What is the title of the role being created?",
            },
            {
                type: "input",
                name: "roleSalary",
                message: "What is the salary for the role being created?",
            },
            {
                type: "list",
                name: "roleDepartment",
                message: "What department is the role being created for?",
                choices: rows,
            },
        ]);

        const departmentID = rows.find(row => row.value === answers.roleDepartment).key;
        const sqlInsert = `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`;
        db.query(sqlInsert, [answers.roleTitle, answers.roleSalary, departmentID], (err, rows) => {
            if(err) throw err;
            console.log('\n');
            console.log('Role has been created.');
            console.log(`\n`);
            db.query(`SELECT * FROM role`, (err, rows) => {
                if (err) throw err;
                console.table(rows);
                startScreen();
            });
        });
    });
};
const getRoles = () => {
    return new Promise((resolve, reject) => {
      const sql = `SELECT * FROM role`;
  
      db.query(sql, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          const roles = rows.map(row => {
            return {
              key: row.id,
              value: row.title,
            };
          });
          resolve(roles);
        }
      });
    });
  };
// // Create new Employee
const createEmployee = async () => {
    const sql = `SELECT * FROM employee`;
    const roles = await getRoles();

    db.query(sql, async (err, rows) => {
        if(err) throw err;
        rows = rows.map(row => {
            return {
                key: row.id,
                value: row.id,
            }
        });
    const answers = await inquirer.prompt([
            {
                type: "input",
                name: "employeeFirstName",
                message: "What is the employee's first name?",
            },
            {
                type: "input",
                name: "employeeLastName",
                message: "What is the employee's last name?",
            },
            {
                type: "input",
                name: "employeeSalary",
                message: "What is the salary for the role being created?",
            },
        ]);

        const sqlInsert = `INSERT INTO employee (first_name, last_name, salary) VALUES (?, ?, ?)`;
        db.query(sqlInsert, [answers.employeeFirstName, answers.employeeLastName, answers.employeeSalary], (err) => {
            if(err) throw err;
            console.log('\n');
            console.log('Employee has been created.');
            console.log(`\n`);
            db.query(`SELECT * FROM employee`, (err, rows) => {
                if (err) throw err;
                console.table(rows);
                startScreen();
            });
        });
    });
}

// //Update Employee
const updateEmployee = () => {
    const sql = `SELECT * FROM employee`;

    db.query(sql, async (err, rows) => {
        if (err) throw err;
     const employees = rows.map((row) => ({
                name: `${row.first_name} ${row.last_name}`,
                value: row.id,
        }));
    const roles = await getRoles(); 
     const answers = await inquirer.prompt([
            {
                type: "list",
                name: "employeeId",
                message: "Whick employee would you like to update?",
                choices: roles,
            },
            {
                type: "list",
                name: "roleId",
                message: "What is the employee's new role?",
                choices: employees,
            },
           
        ])
        const employeeId = employees.find(employee => employee.value === answers.employeeId).key;
        const roleId = roles.find(role => role.value === answers.roleId).key;
        const sqlUpdate = `UPDATE employee SET role_id = ? WHERE id = ?`;
        db.query(sqlUpdate, [roleId, employeeId], (err, result) =>{
            if(err) throw err;
            console.log('\n');
        console.log('Employee has been updated.');
        console.log(`\n`);
        console.table();
        startScreen();
        }); 
        
    });
    
}

startScreen();

