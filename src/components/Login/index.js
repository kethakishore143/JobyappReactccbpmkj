import {Component} from 'react'
import Cookies from 'js-cookie'
import {Redirect} from 'react-router-dom'
import './index.css'

class Login extends Component {
  state = {username: '', password: '', Errormsg: ''}

  SuccessSubmit = jwtToken => {
    Cookies.set('jwt_token', jwtToken, {expires: 30})
    const {history} = this.props
    history.replace('/')
  }

  onChangeUserName = event => {
    this.setState({username: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  Submitform = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const Credentials = {username, password}
    const apiUrl = 'https://apis.ccbp.in/login'

    const options = {
      method: 'POST',
      body: JSON.stringify(Credentials),
    }

    const response = await fetch(apiUrl, options)
    const data = await response.json()
    console.log(data)

    if (response.ok) {
      this.setState({username: '', password: ''})
      this.SuccessSubmit(data.jwt_token)
    } else {
      this.setState({Errormsg: data.error_msg, username: '', password: ''})
    }
  }

  render() {
    const {Errormsg, username, password} = this.state
    const Token = Cookies.get('jwt_token')
    if (Token !== undefined) {
      return <Redirect to="/" />
    }

    return (
      <div className="login-app-container">
        <div className="Login-container">
          <div className="bg">
            <img
              src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
              alt="website logo"
              className="web-logo"
            />
            <form onSubmit={this.Submitform} className="form-container">
              <label htmlFor="userName" className="username-label">
                USERNAME
              </label>
              <input
                type="text"
                id="userName"
                onChange={this.onChangeUserName}
                placeholder="Username"
                className="input-element"
                value={username}
              />
              <label htmlFor="Password" className="password-label">
                PASSWORD
              </label>
              <input
                type="password"
                id="Password"
                onChange={this.onChangePassword}
                placeholder="Password"
                className="input-element"
                value={password}
              />
              <button type="submit" className="login-button">
                Login
              </button>
              <p className="Error-msg">{Errormsg}</p>
            </form>
          </div>
        </div>
      </div>
    )
  }
}

export default Login
