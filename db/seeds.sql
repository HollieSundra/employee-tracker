INSERT INTO departments (department_name)
VALUES ("Client Facing"),
       ("Back End Operations"),
       ("Support"),
       ("Security"),
       ("Development");

INSERT INTO roles (title, salary, department_id)
VALUES ("Manager", 185000.65, 5),
       ("Lead", 165000.84, 4),
       ("Principal", 158250.22, 3),
       ("Senior", 125850.32, 2),
       ("JR", 95600.23, 1);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ("Kevin", "Waler", 5, NULL),
       ("Amy", "Meeks", 3, 2),
       ("Cassy", "Bell", 1, 1),
       ("John", "Donn", 4, 2),
       ("Kyle", "Walter", 3, 1),
       ("Bill", "Marks", 1, 2),
       ("Susan", "Wallace", 2, 1);

