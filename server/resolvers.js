import {getJobs} from "./db/jobs.js";
import {getCompany} from "./db/companies.js";

export const resolvers = {
    Query: {
        jobs: () => getJobs(),
    },
    Job: {
        date: (job) => toIsoDate(job.createdAt),
        company: (job) => getCompany(job.companyId),
    }
};

const toIsoDate = (value) => value.slice(0, 'YYYY-MM-DD'.length);