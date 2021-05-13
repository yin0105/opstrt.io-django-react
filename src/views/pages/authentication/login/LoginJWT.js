import React from "react"
import { withRouter } from "react-router-dom"
import {
  CardBody, Modal,
  Button,
  ModalHeader,
  ModalBody,
  ModalFooter, FormGroup, Form, Input, Label
} from "reactstrap"
import Checkbox from "../../../../components/@vuexy/checkbox/CheckboxesVuexy"
import { User, Lock, Check } from "react-feather"
import * as actions from "../../../../redux/actions/auth/loginActions"
import { connect } from "react-redux"
import { history } from "../../../../history"

class LoginJWT extends React.Component {
  state = {
    username: "",
    password: "",
    remember: false,
    error_msg: "",
    error: false
  }

  componentDidMount() {
    if (localStorage.remember) {
      this.setState({
        username: localStorage.username,
        password: localStorage.password,
        remember: localStorage.remember
      })
    }

  }

  handleLogin = async e => {
    e.preventDefault()
    if (this.state.remember) {
      localStorage.username = this.state.username;
      localStorage.password = this.state.password;
      localStorage.remember = this.state.remember;
    }

    this.props.onAuth(this.state.username, this.state.password).then(res => {
      if (res && res.type == 'AUTH_FAIL') {
        this.setState({ hasError: true, error_msg: res.error });
      } else {
        this.setState({ hasError: false, error_msg: '' });
      }
    }).catch(err => {
      console.log(err)
    });
  }

  handleRemember = e => {
    this.setState({ remember: e.target.checked })
  }

  toggleModal = () => {
    this.setState(prevState => ({
      hasError: !prevState.hasError
    }));
  }


  render() {
    return (
      <React.Fragment>

        <Modal
          isOpen={this.state.hasError}
          toggle={this.toggleModal}
          className="modal-dialog-centered"
        >
          <ModalHeader toggle={this.toggleModal}>Error</ModalHeader>
          <ModalBody>

            {this.state.error_msg}
          </ModalBody>
          <ModalFooter>
            <Button color='primary' onClick={this.toggleModal}>
              Dismiss
            </Button>
          </ModalFooter>
        </Modal>

        <CardBody className="pt-1">
          <Form action="/" onSubmit={this.handleLogin}>
            <FormGroup className="form-label-group position-relative has-icon-left">
              <Input
                type="username"
                placeholder="Username"
                value={this.state.username}
                onChange={e => this.setState({ username: e.target.value })}
                required
              />
              <div className="form-control-position">
                <User size={15} />
              </div>
              <Label>Username</Label>
            </FormGroup>
            <FormGroup className="form-label-group position-relative has-icon-left">
              <Input
                type="password"
                placeholder="Password"
                value={this.state.password}
                onChange={e => this.setState({ password: e.target.value })}
                required
              />
              <div className="form-control-position">
                <Lock size={15} />
              </div>
              <Label>Password</Label>
            </FormGroup>
            <FormGroup className="d-flex justify-content-between align-items-center">
              <Checkbox
                color="primary"
                icon={<Check className="vx-icon" size={16} />}
                label="Remember me"
                defaultChecked={this.state.remember}
                onChange={this.handleRemember}
              />
              <div className="float-right">
                {/* <Link to="/pages/forgot-password">Forgot Password?</Link> */}
              </div>
            </FormGroup>
            <div className="d-flex justify-content-between">
              <Button.Ripple
                color="primary"
                outline
                onClick={() => {
                  history.push("/register")
                }}
              >
                Register
              </Button.Ripple>
              <Button.Ripple color="primary" type="submit">
                Login
              </Button.Ripple>
            </div>
          </Form>
        </CardBody>

      </React.Fragment>
    )
  }
}
const mapStateToProps = state => {
  return {
    values: state
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onAuth: async (username, password) => await dispatch(actions.authLogin(username, password))
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(LoginJWT))
