import {getJob, getJobs} from "./db/jobs.js";
import {getCompany} from "./db/companies.js";

export const resolvers = {
    Query: {
        jobs: () => getJobs(),
        job: (_root, { id }) => getJob(id),
        company: (_root, { id }) => getCompany(id)
    },
    Job: {
        date: (job) => toIsoDate(job.createdAt),
        company: (job) => getCompany(job.companyId),
    }
};

const toIsoDate = (value) => value.slice(0, 'YYYY-MM-DD'.length);