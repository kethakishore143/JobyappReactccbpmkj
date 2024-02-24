import {Component} from 'react'

import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {FaStar, FaExternalLinkAlt} from 'react-icons/fa'
import {IoLocationSharp} from 'react-icons/io5'
import {MdWork} from 'react-icons/md'
import Skills from '../Skills'
import SimilarJobs from '../SimilarJobs'
import Header from '../Header'

import './index.css'

const SpecificApicontentStatus = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  isprocessing: 'PROCESSING',
}

class JobItemDetails extends Component {
  state = {
    specificjobData: [],
    similarjobData: [],
    jobskills: [],
    Lifeatcompany: [],
    SpecificApiStatus: SpecificApicontentStatus.initial,
  }

  componentDidMount() {
    this.getSpecificJobData()
  }

  getSpecificJobData = async () => {
    this.setState({SpecificApiStatus: SpecificApicontentStatus.isprocessing})
    const Token = Cookies.get('jwt_token')
    const {match} = this.props
    const {params} = match
    const {id} = params

    const JobDataUrl = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      method: 'GET',
      headers: {Authorization: `Bearer ${Token}`},
    }
    const response = await fetch(JobDataUrl, options)
    const data = await response.json()

    if (response.ok === true) {
      const updatedData = {
        id: data.job_details.id,
        companyLogoUrl: data.job_details.company_logo_url,
        companyWebsiteUrl: data.job_details.company_website_url,
        employmentType: data.job_details.employment_type,
        jobDescription: data.job_details.job_description,
        lifeAtCompany: data.job_details.life_at_company,
        location: data.job_details.location,
        packagePerAnnum: data.job_details.package_per_annum,
        rating: data.job_details.rating,
        title: data.job_details.title,
      }

      const updatedSimilarJobData = data.similar_jobs.map(eachJobData => ({
        id: eachJobData.id,
        companyLogoUrl: eachJobData.company_logo_url,
        employmentType: eachJobData.employment_type,
        jobDescription: eachJobData.job_description,
        location: eachJobData.location,
        rating: eachJobData.rating,
        title: eachJobData.title,
      }))

      const updatedSkills = data.job_details.skills.map(eachSkill => ({
        imageUrl: eachSkill.image_url,
        name: eachSkill.name,
      }))

      const updatedLifeAtCompany = {
        Description: data.job_details.life_at_company.description,
        LifeImgUrl: data.job_details.life_at_company.image_url,
      }

      this.setState(
        {
          specificjobData: updatedData,
          similarjobData: updatedSimilarJobData,
          jobskills: updatedSkills,
          Lifeatcompany: updatedLifeAtCompany,
          SpecificApiStatus: SpecificApicontentStatus.success,
        },
        this.renderSpecificJobData,
      )
    } else {
      this.setState({SpecificApiStatus: SpecificApicontentStatus.failure})
    }
  }

  renderSpecificJobData = () => {
    const {specificjobData, jobskills, Lifeatcompany} = this.state
    const {
      id,
      companyLogoUrl,
      companyWebsiteUrl,
      employmentType,
      jobDescription,
      location,
      packagePerAnnum,
      rating,
      title,
    } = specificjobData

    const {Description, LifeImgUrl} = Lifeatcompany

    return (
      <div>
        <div>
          <div className="company-logo-container">
            <img src={companyLogoUrl} alt="job details company logo" />
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
          <div className="Discription-container">
            <h1 className="description-heading">Description</h1>
            <a href={companyWebsiteUrl} className="visit-link">
              Visit <FaExternalLinkAlt className="visit-link" />
            </a>
          </div>

          <p className="job-description">{jobDescription}</p>
        </div>
        <div>
          <h1 className="skills-heading">Skills</h1>
          <ul className="skills-list-items">
            {jobskills.map(eachskill => (
              <Skills SkillsData={eachskill} key={eachskill.name} />
            ))}
          </ul>
          <div className="Life-at-company-container">
            <div>
              <h1 className="Life-heading">Life at Company</h1>
              <p className="company-life-description">{Description}</p>
            </div>
            <img
              src={LifeImgUrl}
              alt="life at company"
              className="life-company-img"
            />
          </div>
        </div>
      </div>
    )
  }

  renderSimilarJobs = () => {
    const {similarjobData} = this.state
    return (
      <ul className="similar-job-items">
        {similarjobData.map(eachJob => (
          <SimilarJobs SimilarJobsData={eachJob} key={eachJob.id} />
        ))}
      </ul>
    )
  }

  onClickRetrybtn = () => {
    this.getSpecificJobData()
  }

  SpecificjobDataFailureView = () => (
    <div className="Job-failure-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for</p>
      <button type="button" onClick={this.onClickRetrybtn}>
        Retry
      </button>
    </div>
  )

  SpecificJobDataLoadingView = () => (
    <div className="Specific-loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderSpecificView = () => {
    const {SpecificApiStatus} = this.state
    switch (SpecificApiStatus) {
      case SpecificApicontentStatus.success:
        return (
          <div>
            <div className="specific-job-container">
              {this.renderSpecificJobData()}
            </div>
            <h1 className="similarjobs-heading">Similar Jobs</h1>
            {this.renderSimilarJobs()}
          </div>
        )
      case SpecificApicontentStatus.failure:
        return this.SpecificjobDataFailureView()

      case SpecificApicontentStatus.isprocessing:
        return this.SpecificJobDataLoadingView()

      default:
        return null
    }
  }

  render() {
    const {jobskills} = this.state
    console.log(jobskills)
    return (
      <div className="job-item-Details-container">
        <Header />
        {this.renderSpecificView()}
      </div>
    )
  }
}

export default JobItemDetails
