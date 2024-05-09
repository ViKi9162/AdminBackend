import fs from 'fs';
import slugify from 'slugify';
import Employee from '../Model/Employee.js';
import formidable from 'formidable';

// Function to validate email format
function validateEmail(email) {
  const re = /\S+@\S+\.\S+/;
  return re.test(String(email).toLowerCase());
}

// Function to validate numeric input
function isNumeric(value) {
  return /^\d+$/.test(value);
}

export async function createEmployee(req, res) {
  const form = new formidable.IncomingForm();

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Error parsing form data:", err);
      return res.status(500).send({
        success: false,
        error: "Internal Server Error",
        message: "Error parsing form data",
      });
    }

    try {
      const { fullName, email, mobileNo, tempa, designation, gender, courses } = fields;

      // Validation
      if (!fullName || !email || !mobileNo || !designation || !gender) {
        return res.status(400).send({ error: "Required fields are missing" });
      }

      // Validate email format
      if (!validateEmail(email)) {
        return res.status(400).send({ error: "Invalid email format" });
      }

      // Validate numeric input
      if (!isNumeric(mobileNo)) {
        return res.status(400).send({ error: "Mobile number must be numeric" });
      }

      // Email duplicate check
      const existingEmployee = await Employee.findOne({ email });
      if (existingEmployee) {
        return res.status(400).send({ error: "Email already exists" });
      }

      const newEmployee = new Employee({
        fullName,
        email,
        mobileNo,
        tempa: tempa || '',
        designation,
        gender,
        courses: courses || [],
      });

      if (files && files.image && !['image/jpeg', 'image/png'].includes(files.image.type)) {
        return res.status(400).send({ error: "Only JPG/PNG files are allowed" });
      }

      if (files && files.image && files.image.size > 1000000) {
        return res.status(400).send({ error: "Image size should be less than 1MB" });
      }

      if (files && files.image) {
        newEmployee.image.data = fs.readFileSync(files.image.path);
        newEmployee.image.contentType = files.image.type;
      }

      await newEmployee.save();

      res.status(201).send({
        success: true,
        message: "Employee created successfully",
        employee: newEmployee,
      });
    } catch (error) {
      console.error("Error in creating employee:", error);
      res.status(500).send({
        success: false,
        error: "Internal Server Error",
        message: "Error in creating employee",
      });
    }
  });
}
// controllers/employeeController.js


export async function getEmployees(req, res) {
  try {
    const employees = await Employee.find();
    res.status(200).json(employees);
  } catch (error) {
    console.error("Error in fetching employees:", error);
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
      message: "Error in fetching employees",
    });
  }
}
