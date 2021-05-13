import React, { useEffect } from "react"
import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  Row,
  Col,
  ListGroup,
  ListGroupItem
} from "reactstrap"
import { Link } from "react-router-dom"
import Breadcrumbs from "../../../components/@vuexy/breadCrumbs/BreadCrumb"
import "../../../assets/scss/pages/knowledge-base.scss"
import { categories } from "./cardData"

class KBCategory extends React.Component {

  render() {
    return (
      <React.Fragment>
        
        <Row>
          
          {categories.filter(e => e.did == this.props.match.params.categoryId).map(item => {
            return (
              <Col lg="4" md="6" sm="12" key={item.id}>
                <Card>
                  <CardHeader>
                    <CardTitle>{item.title}</CardTitle>
                  </CardHeader>
                  <CardBody className="knowledge-base-category">
                    <ListGroup flush>
                      {item.questions.map(qitem => {
                        return (
                          <ListGroupItem key={qitem.qid}>
                            <Link to={"/pages/knowledge-base/category/questions/" + item.id + "/" + qitem.qid}>{qitem.question}</Link>
                          </ListGroupItem>
                        )
                      }
                      )}
                    </ListGroup>
                  </CardBody>
                </Card>
              </Col>
            )
          })
          }
        </Row>
      </React.Fragment>
    )
  }
}
export default KBCategory
