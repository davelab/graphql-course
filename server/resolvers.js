const { jobs, companies } = require("./db")

const Query = {
  company: (root, {id}) => companies.get(id),
  job: (root, {id}) => jobs.get(id),
  jobs: () => jobs.list()
}

const Mutation = {
  createJob: (root, {input}, {user}) => {
    if (!user) {
      throw new Error('unauthorized');
    }
    const id = jobs.create({...input, companyId: user.companyId});   
    return jobs.get(id);
  }
}

const Job = {
   company: (job) => companies.get(job.companyId)
}

const Company = {
  jobs: (company) => jobs.list().filter((job) => job.companyId === company.id)
}

module.exports = {
 Query,
 Mutation,
 Job,
 Company
}