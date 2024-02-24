import {Link} from 'react-router-dom'
import Header from '../Header'

import './index.css'

const Home = () => (
  <div>
    <div className="Home-container">
      <Header />
      <div>
        <h1 className="home-heading">Find The Job That Fits Your Life </h1>
        <p className="home-description">
          Millions of people are searching for jobs, salary information, company
          reviews, Find the job that fits your abilities and potential
        </p>
        <div>
          <Link to="/jobs">
            <button type="button" className="Find-jobs-button">
              Find Jobs
            </button>
          </Link>
        </div>
      </div>
    </div>
  </div>
)

export default Home
