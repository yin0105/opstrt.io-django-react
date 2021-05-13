import React from "react"
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
import { ChevronsRight, ChevronsLeft } from "react-feather"
import Breadcrumbs from "../../../components/@vuexy/breadCrumbs/BreadCrumb"
import img1 from "../../../assets/img/pages/kb-article.jpg"
import "../../../assets/scss/pages/knowledge-base.scss"
import { categories } from "./cardData"

class Question extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      category: categories.filter(e => e.id == this.props.match.params.categoryId)[0],
      questionId: this.props.match.params.questionId
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleNext = this.handleNext.bind(this);
    this.handlePrev = this.handlePrev.bind(this);
  }

  handleChange(e) {
    this.setState({ questionId: e });
  }

  handleNext(e) {
    for (var i = 0; i < this.state.category.questions.length; i++) {
      if (Number(this.state.category.questions[i]['qid']) === Number(this.state.questionId)) {
        if (i < this.state.category.questions.length - 1) {
          this.setState({ questionId: this.state.category.questions[i + 1]['qid'] });
        }
      }
    }
  }

  handlePrev(e) {
    for (var i = 0; i < this.state.category.questions.length; i++) {
      if (Number(this.state.category.questions[i]['qid']) === Number(this.state.questionId)) {
        if (i > 0) {
          this.setState({ questionId: this.state.category.questions[i - 1]['qid'] });
        }
      }
    }
  }

  render() {
    return (
      <React.Fragment>
        
        <Row>
          <Col lg="3" md="5" sm="12">
            <Card>
              <CardHeader>
                <CardTitle>Related Questions</CardTitle>
              </CardHeader>
              <CardBody className="knowledge-base-category">
                <ListGroup flush>
                  {this.state.category.questions.filter(e => e.qid != this.state.questionId).map(item => {
                    return (
                      <ListGroupItem key={item.qid} tag="a" href="#" onClick={e => this.handleChange(item.qid)}>
                        {item.question}
                      </ListGroupItem>
                    )
                  }
                  )}
                </ListGroup>
              </CardBody>
            </Card>
          </Col>
          <Col lg="9" md="7" sm="12">
            <Card>
              <CardHeader>
                <h1>{this.state.category.questions.filter(e => e.qid == this.state.questionId)[0].question}</h1>
                <p>Last updated on 10 Dec 2018</p>
              </CardHeader>
              <CardBody>
                <p>
                  {this.state.category.questions.filter(e => e.qid == this.state.questionId)[0].answer}
                </p>
                {
                  this.state.category.questions.filter(e => e.qid == this.state.questionId)[0].subanswers &&
                  this.state.category.questions.filter(e => e.qid == this.state.questionId)[0].subanswers.map(
                    aitem => {
                      return (
                        <p>• {aitem}</p>
                      )
                    }
                  )
                }
 
                <div className="d-flex justify-content-between mt-2">
                  <Link to="#" onClick={this.handlePrev}>
                    <ChevronsLeft size={15} />
                    <span className="align-middle">Previous Article</span>
                  </Link>
                  <Link to="#" onClick={this.handleNext}>
                    <span className="align-middle">Next Article</span>
                    <ChevronsRight size={15} />
                  </Link>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </React.Fragment>
    )
  }
}
export default Question
