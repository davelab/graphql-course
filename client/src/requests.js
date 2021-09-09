import { getAccessToken, isLoggedIn } from "./auth";
import gql from 'graphql-tag';
import {ApolloClient, HttpLink, InMemoryCache, ApolloLink} from 'apollo-boost';

const endpointURL = 'http://localhost:9000/graphql';

const authLink = new ApolloLink((operation, forward) => {
  if (isLoggedIn()) {
    operation.setContext({
      headers: {
        'Authorization': `Bearer ${getAccessToken()}`
      }
    })
  }
  return forward(operation);
})

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: ApolloLink.from([
    authLink,
    new HttpLink({uri: endpointURL })
  ])
});

const jobDetailFragment = gql`
  fragment JobDetail on Job {
    id
    title
    description
    company {
      id
      name
    }
  }
`

const jobQuery = gql`query JobQuery($id: ID!) {
  job(id: $id) {
    ...JobDetail
  }
  ${jobDetailFragment}
}`

const jobsQuery = gql`query JobsQuery {
  jobs {
    id,
    title
    company {
      id
      name
    }
  }
}`

const companyQuery = gql`query CompanyQuery($companyId: ID!) {
  company(id: $companyId) {
    name
    description
    jobs {
      id
      title
    }
  } 
}`

const createJobMutation =  gql`mutation CreateJobMutation($createJobInput: CreateJobInput) {
  job: createJob(input: $createJobInput) {
    id
    title
    description
    company {
      id
      name
    }
  }
}`

export async function loadJobs() {      
  const {data: {jobs}} = await client.query({query: jobsQuery, fetchPolicy: 'no-cache'});
  return jobs;
}

export async function loadJob(id) {
  const {data: {job}} = await client.query({query: jobQuery, variables: {id}});
  return job;
}

export async function loadCompany(id) {
  const {data: {company}} = await client.query({query: companyQuery, variables: {companyId: id}});
  return company;
}



export async function createJob(createJobInput) {
  const {data: {job}} = await client.mutate({
    mutation: createJobMutation, 
    variables: {createJobInput},
    update: (cache, {data}) => {
      cache.writeQuery({
        query: jobQuery, 
        variables: {id: data.job.id}, 
        data
      })
    }
  });

  return job;
}
