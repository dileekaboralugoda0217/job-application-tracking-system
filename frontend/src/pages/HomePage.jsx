import { useEffect, useState } from "react";
import {
  getJobs,
  createJob,
  updateJob,
  deleteJob,
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
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this job?"
    );

    if (!confirmDelete) return;

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

  const totalJobs = jobs.length;
  const appliedJobs = jobs.filter(
    (job) => job.status === "Applied"
  ).length;

  const interviewJobs = jobs.filter(
    (job) => job.status === "Interview"
  ).length;

  const offerJobs = jobs.filter(
    (job) => job.status === "Offer"
  ).length;

  const rejectedJobs = jobs.filter(
    (job) => job.status === "Rejected"
  ).length;

  const getBadgeClass = (status) => {
    switch (status) {
      case "Applied":
        return "bg-warning";
      case "Interview":
        return "bg-primary";
      case "Offer":
        return "bg-success";
      case "Rejected":
        return "bg-danger";
      default:
        return "bg-secondary";
    }
  };

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">
        Job Application Tracker
      </h1>

      {/* Dashboard Cards */}
      <div className="row mb-4">
        <div className="col-md-2">
          <div className="card text-center">
            <div className="card-body">
              <h5>Total</h5>
              <h2>{totalJobs}</h2>
            </div>
          </div>
        </div>

        <div className="col-md-2">
          <div className="card text-center">
            <div className="card-body">
              <h5>Applied</h5>
              <h2>{appliedJobs}</h2>
            </div>
          </div>
        </div>

        <div className="col-md-2">
          <div className="card text-center">
            <div className="card-body">
              <h5>Interview</h5>
              <h2>{interviewJobs}</h2>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card text-center">
            <div className="card-body">
              <h5>Offers</h5>
              <h2>{offerJobs}</h2>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card text-center">
            <div className="card-body">
              <h5>Rejected</h5>
              <h2>{rejectedJobs}</h2>
            </div>
          </div>
        </div>
      </div>

      {/* Add Job Form */}
      <div className="card mb-4">
        <div className="card-body">
          <h3>Add New Job</h3>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                name="companyName"
                placeholder="Company Name"
                value={newJob.companyName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                name="position"
                placeholder="Position"
                value={newJob.position}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <select
                className="form-select"
                name="status"
                value={newJob.status}
                onChange={handleChange}
              >
                <option value="Applied">Applied</option>
                <option value="Interview">Interview</option>
                <option value="Offer">Offer</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>

            <button type="submit" className="btn btn-success">
              Add Job
            </button>
          </form>
        </div>
      </div>

      {/* Job List */}
      <div className="card">
        <div className="card-body">
          <h3>Job List</h3>

          <table className="table table-striped table-hover">
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
                    <span
                      className={`badge ${getBadgeClass(
                        job.status
                      )}`}
                    >
                      {job.status}
                    </span>

                    <select
                      className="form-select mt-2"
                      value={job.status}
                      onChange={(e) =>
                        handleStatusChange(
                          job,
                          e.target.value
                        )
                      }
                    >
                      <option value="Applied">Applied</option>
                      <option value="Interview">Interview</option>
                      <option value="Offer">Offer</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </td>

                  <td>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(job.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      </div>
    </div>
  );
}

export default HomePage;