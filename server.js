//const express = require('express');
// Import and require mysql2
const mysql = require('mysql2');
const inquirer = require("inquirer");

// const PORT = process.env.PORT || 3001;
//const app = express();

// Express middleware
// app.use(express.urlencoded({ extended: false }));
// app.use(express.json());


// Connecting to database
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    },
    console.log(`Connected to the employees_db database.`)
);

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
        case "Update Employee":
            updateEmployee();
            break;
        default:
            exit();
            break;
    }
});
}
//View by all employees
const allEmployees = () => {
    const sql = `SELECT employee.first_name, employee.last_name, role.title, department.department_name, role.salary
    FROM employee LEFT JOIN role ON employee.role_id = role.id
    LEFT JOIN department ON rold.department_id = department.id`;

    db.query(sql, (err, rows) => {
        if(err) throw err;
        console.log(`\n`);
        console.log('Viewing All Employees: ');
        console.log(`\n`);
        console.log(rows);
        console.table(rows);
        employeePrompt();
    })
};
// View by all Departments
const byDepartment = () => {
    const sql = `SELECT department.department_name, employee.first_name, employee.last_name, role.title, role.salary
    FROM employee LEFT JOIN role ON employee.role_id = role.id
    LEFT JOIN department ON role.department_id = department.id`;

    db.query(sql, (err, rows) => {
        if(err) throw err;
        console.log(`\n`);
        console.log('Viewing Employees by Department: ');
        console.log(`\n`);
        console.log(rows);
        employeePrompt();
    })
};
//Create a new role
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
        await inquirer.prompt([
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
    });
}
// Create new Employee
const createEmployee = () => {
    const sql = `SELECT * FROM department`;

    db.query(sql, async (err, rows) => {
        if (err) throw err;
        rows = rows.map(row => {
            return {
                key: row.id,
                value: row.department_name,
            }
        });
        await inquirer.prompt([
            {
                type: "input",
                name: "firstName",
                message: "What is the employee's first name?",
            },
            {
                type: "input",
                name: "lastName",
                message: "What is the employee's last name?",
            },
            {
                type: "input",
                name: "role",
                message: "What is the employee's role?",
            },
            {
                type: "input",
                name: "manager",
                message: "What is the employee's manager?",
            },
        ]);
    })
}

//Update Employee
const updateEmployee = () => {
    const sql = `UPDATE FROM employees WHERE manager_id = ?`;

    db.query(sql, async (err, rows) => {
        if (err) throw err;
        rows = rows.map(row => {
            return {
                key: row.id,
                value: row.department_name,
            }
        });
        await inquirer.prompt([
            {
                type: "list",
                name: "employeeName",
                message: "What is the name of the employee that you want to update?",
                choices: rows,
            },
            {
                type: "input",
                name: "updatedRole",
                message: "What is the updated role for this employee?"
            },
           
        ]);
    })
}

startScreen();

