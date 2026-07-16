import { useEffect, useState } from "react";
import {
  getJobs,
  createJob,
  deleteJob,
  updateJob,
} from "../services/jobService";

function HomePage() {
  const [jobs, setJobs] = useState([]);

  const [newJob, setNewJob] = useState({
    companyName: "",
    position: "",
    status: "Applied",
  });

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    const jobsData = await getJobs();
    setJobs(jobsData);
  };

  const handleChange = (e) => {
    setNewJob({
      ...newJob,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await createJob(newJob);

    setNewJob({
      companyName: "",
      position: "",
      status: "Applied",
    });

    loadJobs();
  };

  const handleDelete = async (id) => {
    await deleteJob(id);
    loadJobs();
  };

  const handleStatusChange = async (job, newStatus) => {
    const updatedJob = {
      ...job,
      status: newStatus,
    };

    await updateJob(job.id, updatedJob);

    loadJobs();
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Job Application Tracker</h1>

      <h2>Add Job</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="companyName"
          placeholder="Company Name"
          value={newJob.companyName}
          onChange={handleChange}
          required
        />

        <br />
        <br />

        <input
          type="text"
          name="position"
          placeholder="Position"
          value={newJob.position}
          onChange={handleChange}
          required
        />

        <br />
        <br />

        <select
          name="status"
          value={newJob.status}
          onChange={handleChange}
        >
          <option value="Applied">Applied</option>
          <option value="Interview">Interview</option>
          <option value="Offer">Offer</option>
          <option value="Rejected">Rejected</option>
        </select>

        <br />
        <br />

        <button type="submit">Add Job</button>
      </form>

      <hr />

      <h2>Job List</h2>

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>ID</th>
            <th>Company</th>
            <th>Position</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {jobs.map((job) => (
            <tr key={job.id}>
              <td>{job.id}</td>
              <td>{job.companyName}</td>
              <td>{job.position}</td>

              <td>
                <select
                  value={job.status}
                  onChange={(e) =>
                    handleStatusChange(job, e.target.value)
                  }
                >
                  <option value="Applied">Applied</option>
                  <option value="Interview">Interview</option>
                  <option value="Offer">Offer</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </td>

              <td>
                <button onClick={() => handleDelete(job.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default HomePage;