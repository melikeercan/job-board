import JobList from '../components/JobList';
import { jobs } from '../lib/fake-data';
import {getJobs} from "../lib/graphql/queries";
import {useEffect, useState} from "react";


function HomePage() {
    const [jobs, setJobs] = useState([]);
    console.log('HomePage Jobs', jobs);
    useEffect(() => {
        getJobs().then((jobs) => setJobs(jobs));
    }, []);
  return (
    <div>
      <h1 className="title">
        Job Board
      </h1>
      <JobList jobs={jobs} />
    </div>
  );
}

export default HomePage;
