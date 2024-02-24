import Cookies from 'js-cookie'
import {withRouter, Link} from 'react-router-dom'
import './index.css'

const Header = props => {
  const onClicklogout = () => {
    Cookies.remove('jwt_token')
    const {history} = props
    history.replace('/login')
  }

  return (
    <nav className="nav-container">
      <Link to="/">
        <img
          src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
          alt="website logo"
        />
      </Link>
      <ul className="nav-items">
        <Link to="/">
          <li className="nav-items-list">Home</li>
        </Link>
        <Link to="/jobs">
          <li className="nav-items-list">Jobs</li>
        </Link>
      </ul>
      <li>
        <button type="button" className="logout-button" onClick={onClicklogout}>
          Logout
        </button>
      </li>
    </nav>
  )
}

export default withRouter(Header)
