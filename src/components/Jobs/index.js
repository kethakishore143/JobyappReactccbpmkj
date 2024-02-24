import {Component} from 'react'
import Cookies from 'js-cookie'
import {Link} from 'react-router-dom'
import Loader from 'react-loader-spinner'
import {BsSearch} from 'react-icons/bs'
import {FaStar} from 'react-icons/fa'
import {IoLocationSharp} from 'react-icons/io5'
import {MdWork} from 'react-icons/md'
import Header from '../Header'
import JobItemDetails from '../JobItemDetails'
import ProfileAndFilterJobs from '../ProfileAndFilterJobs'

import './index.css'

const apiContentStatus = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  is_processing: 'PROCESSING',
}

class Jobs extends Component {
  state = {
    jobsList: [],
    searchInput: '',
    employmentType: '',
    salaryRange: '',
    apiStatus: apiContentStatus.initial,
  }

  componentDidMount() {
    this.getJobDeatails()
  }

  getJobDeatails = async () => {
    const {searchInput, salaryRange, employmentType} = this.state
    this.setState({apiStatus: apiContentStatus.is_processing})
    const token = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/jobs?employment_type=${employmentType}&minimum_package=${salaryRange}&search=${searchInput.toLowerCase()}`
    const options = {
      method: 'GET',
      headers: {Authorization: `Bearer ${token}`},
    }

    const response = await fetch(apiUrl, options)
    const fetchedData = await response.json()
    if (response.ok === true) {
      const updatedData = fetchedData.jobs.map(eachjobData => ({
        companyLogoUrl: eachjobData.company_logo_url,
        employmentType: eachjobData.employment_type,
        id: eachjobData.id,
        jobDescription: eachjobData.job_description,
        location: eachjobData.location,
        packagePerAnnum: eachjobData.package_per_annum,
        rating: eachjobData.rating,
        title: eachjobData.title,
      }))
      this.setState({
        jobsList: updatedData,
        apiStatus: apiContentStatus.success,
      })
    } else {
      this.setState({apiStatus: apiContentStatus.failure})
    }
  }

  renderJobDetails = JobDetails => {
    const {jobsList} = this.state

    const {
      companyLogoUrl,
      employmentType,
      id,
      jobDescription,
      location,
      packagePerAnnum,
      rating,
      title,
    } = JobDetails
    return (
      <div className="job-container">
        <Link to={`/jobs/${id}`}>
          <div className="company-logo-container">
            <img src={companyLogoUrl} alt="company logo" />
            <div className="rating-container">
              <h1 className="job-title">{title}</h1>
              <p className="Rating">
                <FaStar className="star" /> {rating}
              </p>
            </div>
          </div>
          <div className="location-package-container">
            <div className="location-container">
              <p className="location">
                <IoLocationSharp /> {location}
              </p>

              <p className="Employment-Type">
                <MdWork className="Brifcase" />
                {employmentType}
              </p>
            </div>
            <p className="package">{packagePerAnnum}</p>
          </div>
          <div>
            <hr className="border-line" />
          </div>
          <h1 className="description-heading">Description</h1>
          <p className="job-description">{jobDescription}</p>
        </Link>
      </div>
    )
  }

  SearchinputElement = event => {
    this.setState({searchInput: event.target.value}, this.getJobDeatails)
  }

  SalaryRangeFilter = SalaryRange => {
    const {salaryRange} = this.state
    this.setState({salaryRange: SalaryRange}, this.getJobDeatails)
  }

  EmploymentTypeFilter = EmpType => {
    const {employmentType} = this.state
    this.setState({employmentType: EmpType}, this.getJobDeatails)
  }

  LoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  onClickRetry = () => {
    this.getJobDeatails()
  }

  FailureView = () => (
    <div className="Failure-view">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for</p>
      <button type="button" onClick={this.onClickRetry}>
        Retry
      </button>
    </div>
  )

  NodataView = () => (
    <div className="Failure-view">
      <img
        src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
        alt="no jobs"
      />
      <h1>No Jobs Found</h1>
      <p>We could not find any jobs. Try other filters</p>
      <button type="button" onClick={this.onClickRetry}>
        Retry
      </button>
    </div>
  )

  renderView = () => {
    const {apiStatus, jobsList} = this.state
    const shouldShowJobsList = jobsList.length > 0
    switch (apiStatus) {
      case apiContentStatus.success:
        return shouldShowJobsList ? (
          <ul>{jobsList.map(eachItem => this.renderJobDetails(eachItem))}</ul>
        ) : (
          this.NodataView()
        )
      case apiContentStatus.failure:
        return this.FailureView()
      case apiContentStatus.is_processing:
        return this.LoadingView()
      default:
        return null
    }
  }

  onClicksearch = () => {
    this.getJobDeatails()
  }

  render() {
    const {jobsList, searchInput} = this.state
    console.log(jobsList)
    return (
      <div className="jobs-search-container">
        <Header />
        <div className="job-search-filter-container">
          <ul className="profile-container">
            <ProfileAndFilterJobs
              filterjobDetails={this.SalaryRangeFilter}
              EmpTypeFilter={this.EmploymentTypeFilter}
            />
          </ul>
          <div className="Fs">
            <div className="input-search-box">
              <input
                type="search"
                placeholder="Search"
                className="search-element"
                onChange={this.SearchinputElement}
                value={searchInput}
              />

              <button
                type="button"
                data-testid="searchButton"
                className="search-button"
                onClick={this.onClicksearch}
              >
                `<BsSearch className="search-icon" />`
              </button>
            </div>
            <div>{this.renderView()}</div>
          </div>
        </div>
      </div>
    )
  }
}

export default Jobs
