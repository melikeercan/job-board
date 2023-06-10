import { getJob, getJobs, getJobsByCompany } from "./db/jobs.js";
import {getCompany} from "./db/companies.js";
import { GraphQLError} from "graphql";

export const resolvers = {
    Query: {
        jobs: () => getJobs(),
        job: async (_root, { id }) => {
            const job = await getJob(id);
            if(!job) {
                throw notFoundError('Job not found', id);
            }
            return job;
        },
        company: async (_root, { id }) => {
            const company = await getCompany(id);
            if(!company) {
                throw notFoundError('Company not found', id);
            }
            return company;
        }
    },
    Job: {
        date: (job) => toIsoDate(job.createdAt),
        company: (job) => getCompany(job.companyId),
    },
    Company: {
        jobs: (company) => getJobsByCompany(company.id),
    },
};

const toIsoDate = (value) => value.slice(0, 'YYYY-MM-DD'.length);

const notFoundError = (message, id) => {
    return new GraphQLError(message + ': ' + id, {extensions: {code: "NOT_FOUND"}});
}