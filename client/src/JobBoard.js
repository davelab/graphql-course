import React, {useState, useEffect} from 'react';
import {loadJobs} from './requests';
import { JobList } from './JobList';

export const JobBoard = () => {
    const [jobs, setJobs] = useState([]);

    useEffect(() => {
      async function fetchJobs() {
        const jobs = await loadJobs()
        setJobs(jobs)
      }
  
      fetchJobs();
    }, []);

    return (
      <div>
        <h1 className="title">Job Board</h1>
        <JobList jobs={jobs} />
      </div>
    );
}

