import {IoSearchSharp, IoLocationSharp} from 'react-icons/io5'
import {FaStar} from 'react-icons/fa'
import {MdWork} from 'react-icons/md'
import './index.css'

const SimilarJobs = props => {
  const {SimilarJobsData} = props
  const {
    id,
    companyLogoUrl,
    employmentType,
    jobDescription,
    location,
    rating,
    title,
  } = SimilarJobsData

  return (
    <li className="Similar-job-list-container">
      <div className="company-logo-container">
        <img src={companyLogoUrl} alt="similar job company logo" />
        <div className="rating-container">
          <h1 className="job-title">{title}</h1>
          <p className="Rating">
            <FaStar className="star" /> {rating}
          </p>
        </div>
      </div>
      <h1 className="description-heading">Description</h1>
      <p className="job-description">{jobDescription}</p>
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
      </div>
    </li>
  )
}

export default SimilarJobs
