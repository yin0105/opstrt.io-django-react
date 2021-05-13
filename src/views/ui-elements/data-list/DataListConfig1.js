import React, { Component } from "react"
import axios from "axios"
import {
  Button,
  Progress,
  UncontrolledDropdown,
  DropdownMenu,
  DropdownToggle,
  DropdownItem,
  Input
} from "reactstrap"
import DataTable from "react-data-table-component"
import classnames from "classnames"
import ReactPaginate from "react-paginate"
import {
  Edit,
  Trash,
  ChevronDown,
  Plus,
  Check,
  ChevronLeft,
  ChevronRight
} from "react-feather"
import { connect } from "react-redux"

import Sidebar from "./DataListSidebar"
import Checkbox from "../../../components/@vuexy/checkbox/CheckboxesVuexy"

import "../../../assets/scss/plugins/extensions/react-paginate.scss"
import "../../../assets/scss/pages/data-list.scss"

const chipColors = {
  "on hold": "warning",
  delivered: "success",
  pending: "primary",
  canceled: "danger"
}

const selectedStyle = {
  rows: {
    selectedHighlighStyle: {
      backgroundColor: "rgba(115,103,240,.05)",
      color: "#7367F0 !important",
      boxShadow: "0 0 1px 0 #7367F0 !important",
      "&:hover": {
        transform: "translateY(0px) !important"
      }
    }
  }
}



const CustomHeader = props => {
  return (
    <div className="data-list-header d-flex justify-content-between flex-wrap">
      <div className="actions-left d-flex flex-wrap">
        <UncontrolledDropdown className="data-list-dropdown mr-1">
          <DropdownToggle className="p-1" color="primary">
            <span className="align-middle mr-1">Actions</span>
            <ChevronDown size={15} />
          </DropdownToggle>
          <DropdownMenu tag="div" right>
            <DropdownItem tag="a">Delete</DropdownItem>
            <DropdownItem tag="a">Archive</DropdownItem>
            <DropdownItem tag="a">Print</DropdownItem>
            <DropdownItem tag="a">Export</DropdownItem>
          </DropdownMenu>
        </UncontrolledDropdown>
        <Button
          className="add-new-btn"
          color="primary"
          onClick={() => props.handleSidebar(true, true)}
          outline>
          <Plus size={15} />
          <span className="align-middle">Add New</span>
        </Button>
      </div>
      <div className="actions-right d-flex flex-wrap mt-sm-0 mt-2">
        <UncontrolledDropdown className="data-list-rows-dropdown mr-1 d-md-block d-none">
          <DropdownToggle color="" className="sort-dropdown">
            <span className="align-middle mx-50">
              {`${props.index[0]} - ${props.index[1]} of ${props.total}`}
            </span>
            <ChevronDown size={15} />
          </DropdownToggle>
          <DropdownMenu tag="div" right>
            <DropdownItem tag="a" onClick={() => props.handleRowsPerPage(4)}>
              4
            </DropdownItem>
            <DropdownItem tag="a" onClick={() => props.handleRowsPerPage(10)}>
              10
            </DropdownItem>
            <DropdownItem tag="a" onClick={() => props.handleRowsPerPage(15)}>
              15
            </DropdownItem>
            <DropdownItem tag="a" onClick={() => props.handleRowsPerPage(20)}>
              20
            </DropdownItem>
          </DropdownMenu>
        </UncontrolledDropdown>
        <div className="filter-section">
          <Input type="text" onChange={e => props.handleFilter(e)} />
        </div>
      </div>
    </div>
  )
}

class DataListConfig extends Component {





  state = {
    portfolios: [],
    portfolio_stats: [],
    stats_set: false,
    execution_set: false,
    isLoading: true,
    isStatsLoading: "",
    update_set: true,
    modal: false,
    login_state: false,
    form_value:{}
  }


  fetchArticles = (token) => {
    axios.get(`https://theopenstreet.com/api/portfolio/?token=${token}`).then(res => {
      this.setState({
        portfolios: res.data
      });
    });
  }

  executeArticles = (token, code) => {
    axios.post(`https://theopenstreet.com/api/portfoliostats/?token=${token}&action=execute`,{
      code: code
    }).then(res=>{
      this.setState({
        login_state: res.data.message
          });

      console.log(this.state.login_state);
  })
}

  componentDidMount() {
    this.fetchArticles(this.props.token);
  }

  componentDidUpdate() {
    if(this.state.update_set){
    this.fetchArticles(this.props.token);
    if (window.location.search.includes("code=")) {
      let urlParams = new URLSearchParams(window.location.search);
      let code = urlParams.get('code');
      this.executeArticles(this.props.token, code)
    }
    this.setState({
      update_set: false
    });
    }
  }

  componentWillReceiveProps(newProps) {
    if (newProps.token) {
      this.fetchArticles(newProps.token);

    }
  }

  portfolioStats = (e, item, action) => {
      console.log(item);
      let items = this.state;
      items['isStatsLoading'] = item.portfolio_name;
      this.setState({items});
      axios.get(`https://theopenstreet.com/api/matrix/?token=${this.props.token}&portfolio_name=${item.portfolio_name}&action=${action}&allocation=${item.allocation}&date_created=${item.date_created}&min_health=${item.min_health}&min_yield=${item.min_yield}&min_quality=${item.min_quality}&max_industry_rank=${item.max_industry_rank}&min_fair_value=${item.min_fair_value}&min_risk=${item.min_risk}&min_insider_rating=${item.min_insider_rating}&min_inst_rating=${item.min_inst_rating}`)
          .then(res=>{
            console.log(res.data[0]);
            this.setState({
              portfolio_stats: res.data[0],
              stats_set: true,
                });
            if(action==='execute'){

              this.setState((prevState)=>({
                execution_set: true,
                modal:!prevState.modal
                  }));
            }

          });

      }

      portfolioExecute = (e) => {
        e.preventDefault();
        console.log(this.state.form_value);
        //this.state.portfolio_stats['execute_portfolio'] = this.state.form_value
        axios.post(`https://theopenstreet.com/api/portfoliostats/?token=${this.props.token}&portfolio_name=${this.state.portfolio_stats.name}&action=execute`, {
          execute_portfolio:this.state.form_value
          })
            .then(res=>{
              this.setState({
                login_state: res.data.message
                  });
                if(!this.state.login_state){
                    window.location.href='http://auth.tdameritrade.com/oauth?client_id=BEBFCA5ZNBRXU4A60TP54AXWTEQQCHNS%40AMER.OAUTHAP&response_type=code&redirect_uri=https%3A%2F%2F127.0.0.1:3000%2Fportfolios%2F'
                }
                else{
                  this.setState((prevState)=>({
                    modal:!prevState.modal
                      }));
                }

            });




        }



  toggleModal = () => {
    this.setState(prevState => ({
      modal: !prevState.modal
    }));
  }

  handleChange = e => {
    let form_value = this.state.form_value;
    form_value[e.target.name] = e.target.value;
    this.setState({ form_value:form_value });
    // console.log(this.state)
  }



  render() {
    if(this.state.portfolios.length === 0 & this.state.isLoading===false){
      let items = this.state;
      items['isLoading'] = true;
      this.setState({items});
    }
    if(this.state.portfolios.length !== 0 & this.state.isLoading===true){
        let items = this.state;
        items['isLoading'] = false;
        this.setState({items});
    }
    return (

      <div
        className={`data-list ${"list-view"}`}>
        <DataTable
          columns={columns}
          data={value.length ? allData : data}
          pagination
          paginationServer
          paginationComponent={() => (
            <ReactPaginate
              previousLabel={<ChevronLeft size={15} />}
              nextLabel={<ChevronRight size={15} />}
              breakLabel="..."
              breakClassName="break-me"
              pageCount={totalPages}
              containerClassName="vx-pagination separated-pagination pagination-end pagination-sm mb-0 mt-2"
              activeClassName="active"

            />
          )}
          noHeader
          subHeader
          selectableRows
          responsive
          pointerOnHover
          selectableRowsHighlight
          onSelectedRowsChange={data =>
            this.setState({ selected: data.selectedRows })
          }
          customStyles={selectedStyle}
          subHeaderComponent={
            <CustomHeader
              handleSidebar={this.handleSidebar}
              handleRowsPerPage={this.handleRowsPerPage}
              rowsPerPage={rowsPerPage}
              total={totalRecords}
              index={sortIndex}
            />
          }
          sortIcon={<ChevronDown />}
          selectableRowsComponent={Checkbox}
          selectableRowsComponentProps={{
            color: "primary",
            icon: <Check className="vx-icon" size={12} />,
            label: "",
            size: "sm"
          }}
        />
        
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    token: state.auth.token
  }
}

export default connect(mapStateToProps)(DataListConfig)
