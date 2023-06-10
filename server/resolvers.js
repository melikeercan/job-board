import {createJob, deleteJob, getJob, getJobs, getJobsByCompany, updateJob} from "./db/jobs.js";
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

    Mutation: {
        createJob: async (_root, { input: {title, description} }, {user}) => {
            console.log("user", user);
            if(!user) {
                throw unauthorizedError('You must be logged in to create a job');
            }
            const companyId = user.companyId;
            return createJob({companyId, title, description});
        },
        deleteJob: async (_root, { id }, {user}) => {
            console.log("user", user);
            if(!user) {
                throw unauthorizedError('You must be logged in to delete a job');
            }
            const companyId = user.companyId;
            const job = await deleteJob(id, companyId)
            if(!job) {
                throw notFoundError('Job not found', id);
            }
            return job;
        },
        updateJob: async (_root, { input: {id, title, description} }, {user}) => {
            console.log("user", user);
            if(!user) {
                throw unauthorizedError('You must be logged in to update a job');
            }
            const companyId = user.companyId;
            const job = await updateJob({id, title, description, companyId});
            if(!job) {
                throw notFoundError('Job not found', id);
            }
            return job;
        }
    }
};

const toIsoDate = (value) => value.slice(0, 'YYYY-MM-DD'.length);

const notFoundError = (message, id) => {
    return new GraphQLError(message + ': ' + id, {extensions: {code: "NOT_FOUND"}});
}

const unauthorizedError = (message) => {
    return new GraphQLError(message, {extensions: {code: "UNAUTHORIZED"}});
}