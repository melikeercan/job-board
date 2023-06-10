import { useParams } from 'react-router';
import {useEffect, useState} from "react";
import {getCompany} from "../lib/graphql/queries";
import JobList from "../components/JobList";

function CompanyPage() {
    const { companyId } = useParams();
    const [state, setState] = useState({
        company: null,
        loading: true,
        error: false,
        errorMessage: ''
    });

    useEffect(() => {
        (async () => {
            try {
                const company = await getCompany(companyId);
                setState({ company, loading: false, error: false, errorMessage: '' });
            } catch (err) {
                setState({ company: null, loading: false, error: true, errorMessage: err.message });
            };
        })();
    }, [companyId]);
    const { company, loading, error, errorMessage } = state;

    if(loading) {
        return <div>Loading</div>
    } else if(error) {
        return <div className="has-text-danger">Data Unavailable {errorMessage}</div>
    }
  return (
    <div>
      <h1 className="title">
        {company.name}
      </h1>
      <div className="box">
        {company.description}
      </div>
        <h2 className="title">
            Jobs at {company.name}
        </h2>
        <JobList jobs={company.jobs}/>
    </div>
  );
}

export default CompanyPage;
