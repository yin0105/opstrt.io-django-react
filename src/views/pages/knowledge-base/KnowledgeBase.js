import React from "react"
import { Row, Col } from "reactstrap"
import Breadcrumbs from "../../../components/@vuexy/breadCrumbs/BreadCrumb"
import KnowledgeBadeMain from "./KnowledgeBaseMain"
import "../../../assets/scss/pages/knowledge-base.scss"

class KnowledgeBase extends React.Component {
  render() {
    return (
      <React.Fragment> 
        <Row>
          <Col sm="12">
            <KnowledgeBadeMain />
          </Col>
        </Row>
      </React.Fragment>
    )
  }
}

export default KnowledgeBase
