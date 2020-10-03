USE employees_db;

INSERT INTO department (name)
VALUES ("Business Development"), ("Engineering"), ("Legal"), ("Finance");

INSERT INTO role (title, salary, department_id)
VALUES ("Business Development Manager", 100000.00, 1), ("Business Development Lead", 80000.00, 1), ("Head of Engineering", 130000.00, 2), ("Lead Engineer", 240000.00, 2), ("Legal Operations Manager", 450000.00, 3), ("Legal Team Lead", 340000.00, 3), ("Finance Manager", 300000.00, 4), ("Accountant", 200000.00, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Adeboye", "Adu", 1, NULL), ("Donald", "Trump", 2, 1), ("Angelina", "Jolie", 3, NULL), ("Las", "Lagerback", 4, 3), ("Anita", "Brown", 5, NULL), ("Lolu", "Akins", 6, 5), ("Kendrick", "Lamar", 7, NULL), ("Angie", "Brown", 8, 7);
