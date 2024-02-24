import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import './index.css'

const ProfileApiContentStatus = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  is_processing: 'PROCESSING',
}

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

class ProfileAndFilterJobs extends Component {
  state = {
    profileData: [],
    InitialEmloymentTypeList: employmentTypesList,
    InitialSalaryRangeList: salaryRangesList,
    profileApiStatus: ProfileApiContentStatus.initial,
  }

  componentDidMount() {
    this.getprofileData()
  }

  getprofileData = async () => {
    const {profileApiStatus} = this.state
    this.setState({profileApiStatus: ProfileApiContentStatus.is_processing})

    const token = Cookies.get('jwt_token')
    const profileApiurl = 'https://apis.ccbp.in/profile'
    const options = {
      method: 'GET',
      headers: {Authorization: `Bearer ${token}`},
    }
    const response = await fetch(profileApiurl, options)
    const fetchedData = await response.json()
    if (response.ok === true) {
      const updatedProfileData = {
        name: fetchedData.profile_details.name,
        profileImageUrl: fetchedData.profile_details.profile_image_url,
        shortBio: fetchedData.profile_details.short_bio,
      }

      this.setState({
        profileData: updatedProfileData,
        profileApiStatus: ProfileApiContentStatus.success,
      })
    } else {
      this.setState({profileApiStatus: ProfileApiContentStatus.failure})
    }
  }

  renderProfileDetails = () => {
    const {profileData} = this.state
    const {name, profileImageUrl, shortBio} = profileData
    return (
      <div className="Profile-container">
        <img src={profileImageUrl} alt="profile" />
        <h1 className="profile-name">{name}</h1>
        <p className="short-biodata">{shortBio}</p>
      </div>
    )
  }

  isSelected = event => {
    const {filterjobDetails} = this.props
    if (event.target.checked) {
      filterjobDetails(event.target.value)
    } else {
      const Salary = ''
      filterjobDetails(Salary)
    }
  }

  isChecked = event => {
    const {EmpTypeFilter} = this.props
    if (event.target.checked) {
      EmpTypeFilter(event.target.value)
      console.log(event.target.value)
    } else {
      const Type = ''
      EmpTypeFilter(Type)
    }
  }

  renderEmploymentTypeFilter = eachEMPType => {
    const {label, employmentTypeId} = eachEMPType
    return (
      <li>
        <input
          type="checkbox"
          value={employmentTypeId}
          id={label}
          onChange={this.isChecked}
        />
        <label htmlFor={label} className="EmploymentType-label">
          {label}
        </label>
      </li>
    )
  }

  renderSalaryRangeFilter = eachSalaryRange => {
    const {salaryRangeId, label} = eachSalaryRange
    return (
      <li>
        <input
          type="radio"
          value={salaryRangeId}
          id={label}
          onChange={this.isSelected}
        />
        <label htmlFor={label} className="salary-range-label">
          {label}
        </label>
      </li>
    )
  }

  onClickRetrybtn = () => {
    this.getprofileData()
  }

  ProfileFailureView = () => (
    <div className="Profile-Failure-view">
      <button type="button" onClick={this.onClickRetrybtn}>
        Retry
      </button>
    </div>
  )

  renderProfileView = () => {
    const {profileApiStatus} = this.state
    switch (profileApiStatus) {
      case ProfileApiContentStatus.success:
        return this.renderProfileDetails()

      case ProfileApiContentStatus.failure:
        return this.ProfileFailureView()
      case ProfileApiContentStatus.is_processing:
        return this.profileLoadingView()

      default:
        return null
    }
  }

  profileLoadingView = () => (
    <div className="profile-loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  render() {
    const {filterjobDetails} = this.props
    const {InitialEmloymentTypeList, InitialSalaryRangeList} = this.state
    return (
      <div className="filter-job-container">
        {this.renderProfileView()}
        <div>
          <hr />
        </div>
        <h1 className="type-of-employment-heading">Type of Employment</h1>
        <ul>
          {InitialEmloymentTypeList.map(eachEMPType =>
            this.renderEmploymentTypeFilter(eachEMPType),
          )}
        </ul>
        <div>
          <hr />
        </div>
        <h1 className="Salary-range-heading">Salary Range</h1>
        <ul>
          {InitialSalaryRangeList.map(eachSalaryRange =>
            this.renderSalaryRangeFilter(eachSalaryRange),
          )}
        </ul>
      </div>
    )
  }
}

export default ProfileAndFilterJobs
