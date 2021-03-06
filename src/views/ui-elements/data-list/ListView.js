import React from "react"
import { Row, Col } from "reactstrap"
import Breadcrumbs from "../../../components/@vuexy/breadCrumbs/BreadCrumb"
import ListViewConfig from "./DataListConfig"
import { connect } from "react-redux"
import {Redirect} from "react-router-dom"
class ListView extends React.Component {
  render() {
    if (!this.props.token) {
      return <Redirect to="/login" />;
    }
    return (
      <React.Fragment>
        <Row>
          <Col sm="12">
            <ListViewConfig />
          </Col>
        </Row>
      </React.Fragment>
    )
  }
}
const mapStateToProps = state => {
  return {
    token : state.auth.token
  }
}
export default connect(mapStateToProps)(ListView)
