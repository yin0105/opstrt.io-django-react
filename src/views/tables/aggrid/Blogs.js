import React, { useState } from "react";
import {
  Card,
  CardImg,
  CardBody,
  CardHeader,
  CardTitle,
  Input,
  Button,
  UncontrolledDropdown,
  UncontrolledButtonDropdown,
  DropdownMenu,
  Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
  DropdownItem,
  DropdownToggle,
  Col,
  FormGroup,
  Form,
  Spinner,
  Container,
  Row
} from "reactstrap";
import { Player } from 'video-react';
import { AgGridReact } from "ag-grid-react";
import { ContextLayout } from "../../../utility/context/Layout";
import { ChevronDown } from "react-feather";
import axios from "axios";
import "../../../assets/scss/plugins/tables/_agGridStyleOverride.scss";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/light.css";
import "../../../assets/scss/plugins/forms/flatpickr/flatpickr.scss"
import { LoadingOutlined } from '@ant-design/icons';
import { List,Divider } from 'antd';
import * as Icon from 'react-feather';
import Tour, { STATUS } from "react-joyride"
import "../../../assets/scss/plugins/extensions/react-tour.scss"
import "../../../../node_modules/video-react/dist/video-react.css";


class Blogs extends React.Component {

  render() {
    
    return (
      <React.Fragment>
        <Row>
        <Col lg="4" md="6" sm="12">
          <Card>
            <CardImg
              top
              className="img-fluid"
              src="https://s3.amazonaws.com/static.contentres.com/site/templates/global/img/assets/largethumb/1055-largethumb-a.jpg"
              alt="card image cap"
            />
            <CardBody>
              <h5><a href="http://www.library-messages.com/fc29dd93-3982-4c9e-9714-47973be4011a/resource-center/retirement/risk-tolerance-whats-your-style">RISK TOLERANCE: WHAT’S YOUR STYLE?</a></h5>
              
              <span>Learn about what risk tolerance really means in this helpful and insightful video.</span>
              
            </CardBody>
          </Card>
        </Col>
        <Col lg="4" md="6" sm="12">
          <Card>
          <CardImg
              top
                className="img-fluid"
                src="https://s3.amazonaws.com/static.contentres.com/site/templates/global/img/assets/largethumb/247-largethumb-a.jpg"
                alt="card image cap"
              />
            <CardBody>
              
               <h5><a href="http://www.library-messages.com/fc29dd93-3982-4c9e-9714-47973be4011a/resource-center/investment/should-you-invest-in-exchange-traded-funds">SHOULD YOU INVEST IN EXCHANGE TRADED FUNDS?</a></h5>

              <span>There are hundreds of ETFs available. Should you invest in them?</span>
            </CardBody>
          </Card>
        </Col>
        <Col lg="4" md="12">
          <Card>
          <CardImg
              top
               className="img-fluid"
                src="https://s3.amazonaws.com/static.contentres.com/site/templates/global/img/assets/largethumb/237-largethumb-a.jpg"
                alt="card image cap"
              />
            <CardBody>
              
              <h5><a href="http://www.library-messages.com/fc29dd93-3982-4c9e-9714-47973be4011a/resource-center/investment/what-smart-investors-know">WHAT SMART INVESTORS KNOW</a></h5>

              <span>Savvy investors take the time to separate emotion from fact.</span>
              
            </CardBody>
          </Card>
        </Col>
      </Row>
        
           
            </React.Fragment>
    );
  }
}



export default Blogs;
