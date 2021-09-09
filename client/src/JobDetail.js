import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { loadJob } from './requests';

export function JobDetail(props) {
  const [job, setJob] = useState(null);

    useEffect(() => {
      async function fetchJob() {
        const {jobId} = props.match.params;
        const resJob = await loadJob(jobId)
        setJob(resJob)
      }

      fetchJob();
    }, []);

    return job ? (
      <div>
        <h1 className="title">{job.title}</h1>
        <h2 className="subtitle">
          <Link to={`/companies/${job.company.id}`}>{job.company.name}</Link>
        </h2>
        <div className="box">{job.description}</div>
      </div>
    ) : (<div>Loading...</div>);
  }

