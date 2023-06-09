export const resolvers = {
    Query: {
        jobs: () => {

            return [
                {
                    id: '1',
                    title: 'Software Engineer',
                    description: 'Awesome job',
                },
                {
                    id: '2',
                    title: 'Senior Software Engineer',
                    description: 'More Awesome job',
                },

            ]
        }
    }
};