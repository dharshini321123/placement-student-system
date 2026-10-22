
import { useState, useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useNavigate
} from "react-router-dom";
import axios from "axios";
import "./index.css";

const API = "http://localhost:5000/api/students";

function Home() {
  return (
    <div className="container">
      <h1>Placement Student Skills Management System</h1>
      <p>Welcome to the Student Placement Portal</p>
      <Link to="/add">
        <button>Add Student Skills</button>
      </Link>
      <Link to="/list">
        <button>Student Skill List</button>
      </Link>
    </div>
  );
}

function AddStudent() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    rollNo: "",
    technicalSkills: "",
    aptitudeScore: "",
    communicationSkills: "Good",
    placementReady: false
  });

  function handleChange(e) {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      await axios.post(API, {
        ...form,
        aptitudeScore: Number(form.aptitudeScore)
      });

      alert("Student saved successfully!");
      navigate("/list");
    } catch (error) {
      alert("Error saving student. Check the backend server.");
      console.error(error);
    }
  }

  return (
    <div className="container">
      <h2>Add Student Skills</h2>

      <form onSubmit={handleSubmit}>
        <label>Student Name</label>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          required
        />

        <label>Roll Number</label>
        <input
          name="rollNo"
          value={form.rollNo}
          onChange={handleChange}
          required
        />

        <label>Technical Skills</label>
        <input
          name="technicalSkills"
          placeholder="Java, React, MongoDB"
          value={form.technicalSkills}
          onChange={handleChange}
        />

        <label>Aptitude Score (0-100)</label>
        <input
          type="number"
          name="aptitudeScore"
          min="0"
          max="100"
          value={form.aptitudeScore}
          onChange={handleChange}
          required
        />

        <label>Communication Skills</label>
        <select
          name="communicationSkills"
          value={form.communicationSkills}
          onChange={handleChange}
        >
          <option>Excellent</option>
          <option>Good</option>
          <option>Average</option>
        </select>

        <label>
          <input
            type="checkbox"
            name="placementReady"
            checked={form.placementReady}
            onChange={handleChange}
          />
          Placement Ready
        </label>

        <button type="submit">Save Student</button>
      </form>

      <Link to="/">Back to Home</Link>
    </div>
  );
}

function StudentList() {
  const [students, setStudents] = useState([]);

  async function loadStudents() {
    try {
      const response = await axios.get(API);
      setStudents(response.data);
    } catch (error) {
      console.error(error);
      alert("Unable to load students. Check the backend.");
    }
  }

  useEffect(() => {
    loadStudents();
  }, []);

  async function updateStudent(student) {
    const name = prompt("Enter updated student name:", student.name);

    if (name === null || !name.trim()) return;

    try {
      await axios.put(`${API}/${student._id}`, {
        name: name.trim()
      });

      alert("Student updated successfully!");
      loadStudents();
    } catch (error) {
      alert("Unable to update student.");
      console.error(error);
    }
  }

  async function deleteStudent(id) {
    if (!window.confirm("Do you want to delete this student?")) return;

    try {
      await axios.delete(`${API}/${id}`);
      alert("Student deleted successfully!");
      loadStudents();
    } catch (error) {
      alert("Unable to delete student.");
      console.error(error);
    }
  }

  return (
    <div className="container">
      <h2>Student Skill List</h2>

      {students.length === 0 ? (
        <p>No student records found. Add a student first.</p>
      ) : (
        students.map((student) => (
          <div key={student._id} className="student-item">
            <h3>{student.name}</h3>
            <p>Roll Number: {student.rollNo}</p>
            <p>Technical Skills: {student.technicalSkills}</p>
            <p>Aptitude Score: {student.aptitudeScore}</p>
            <p>Communication: {student.communicationSkills}</p>
            <p>
              Placement Ready: {student.placementReady ? "Yes" : "No"}
            </p>

            <button onClick={() => updateStudent(student)}>
              Update Name
            </button>

            <button onClick={() => deleteStudent(student._id)}>
              Delete
            </button>
          </div>
        ))
      )}

      <Link to="/add">
        <button>Add New Student</button>
      </Link>
      <br />
      <Link to="/">Back to Home</Link>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Home</Link>{" | "}
        <Link to="/add">Add Student Skills</Link>{" | "}
        <Link to="/list">Student Skill List</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/add" element={<AddStudent />} />
        <Route path="/list" element={<StudentList />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
