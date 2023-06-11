import {ApolloClient, concat, InMemoryCache, gql, createHttpLink, ApolloLink} from "@apollo/client";
import {getAccessToken} from "../auth";

const httpLink = createHttpLink({
    uri: 'http://localhost:9000/graphql',
});

const authLink = new ApolloLink((operation, forward) => {
    const accessToken = getAccessToken();
    if (accessToken) {
        operation.setContext({
            headers: {
                authorization: `Bearer ${accessToken}`
            }
        })
    }
    return forward(operation);
});

const apolloClient = new ApolloClient({
    link: concat(authLink, httpLink),
    cache : new InMemoryCache(),
    defaultOptions: {
        query: {
            fetchPolicy: 'network-only',
        },
        watchQuery: {
            fetchPolicy: 'network-only',
        }
    }
});

export async function getJobs() {
    const query = gql`
        query Jobs {
            jobs {
                id
                title
                date
                company {
                    id
                    name
                    description
                }
                description
            }
        }`;
    const result = await apolloClient.query({query});
    const { data } = result;
    return data.jobs;
}

const JobDetailFragment = gql`
    fragment JobDetail on Job {
        id
        title
        date
        description
        company {
            id
            name
            description
        }
    }`;

const jobByIdQuery = gql`
    query JobById($id: ID!) {
        job(id: $id) {
            ...JobDetail
        }
    }
    ${JobDetailFragment}
`;

export async function getJob(id) {
    const result = await apolloClient.query({query: jobByIdQuery, variables: { id }});
    const { data } = result;
    return data.job;
}

export async function getCompany(id) {
    const query = gql`
        query CompanyById($id: ID!) {
            company(id: $id) {
                id
                name
                description
                jobs {
                    id
                    title
                    date
                }
            }
        }`;
    const result = await apolloClient.query({query, variables: { id }});
    const { data } = result;
    return data.company;
}

export async function createJob({ title, description }) {
    const mutation = gql`
        mutation CreateJob($input: CreateJobInput!) {
            job: createJob(input: $input) {
                ...JobDetail
            }
        }
        ${JobDetailFragment}
    `;

    const { data } = await apolloClient.mutate({
        mutation,
        variables: {input: {title, description}},
        update: (cache, {data}) => {
            console.log(cache);
            console.log(data);
            cache.writeQuery({
                query: jobByIdQuery,
                variables: {id: data.job.id},
                data
            });
        }
    });
    return data.job;
}