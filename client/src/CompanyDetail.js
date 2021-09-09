import React, { useEffect, useState } from 'react';
import { JobList } from './JobList';
import { loadCompany } from './requests';

export function CompanyDetail(props) {
  const [company, setCompany] = useState(null);

  useEffect(() => {
    async function fetchCompany() {
      const {companyId} = props.match.params;
      const resCompany = await loadCompany(companyId)
      setCompany(resCompany)
    }

    fetchCompany();
  }, []);

  return company ? (
    <div>
      <h1 className="title">{company.name}</h1>
      <div className="box">{company.description}</div>
      <h1 className="title as-h5">Jobs at {company.name}</h1>
      <JobList jobs={company.jobs} />
    </div>
  ) : null;
}
