import * as React from 'react';
import { Table, Spin, Divider, List, Space } from 'antd';
import { PlaidLink } from 'react-plaid-link';
import Chart from '../../charts/apex/lightweight'
import { Redirect } from "react-router-dom";
import {
  Card,
  Button,
  Col,
  Row,
  CardHeader,
  CardTitle,
  CardBody,
  Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    FormGroup,
    Label,
    Input,
    Spinner,
    Form
} from "reactstrap"
import DataTable from "react-data-table-component"
import {
  ChevronDown,
  Check,
  ChevronLeft,
  ChevronRight
} from "react-feather"
import ReactPaginate from "react-paginate"
import { LoadingOutlined, ShopOutlined, YuqueOutlined, RiseOutlined, HeartOutlined, DollarOutlined,StarOutlined, ExperimentOutlined, FireOutlined } from '@ant-design/icons';
import axios from 'axios';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import StatisticsCard from "../../../components/@vuexy/statisticsCard/StatisticsCard"
import StatisticsCard2 from "../../../components/@vuexy/statisticsCard/StatisticsCard2"
import {DollarSign, PenTool, Heart, Activity, Percent, Monitor,
  UserCheck,
  Mail,
  Eye,
  MessageSquare,
  ShoppingBag,
  Smile,
  Truck,
  Cpu,
  Server,
  AlertOctagon} from "react-feather"
import GoalOverview from "./Percent"
import ApexAreaCharts from "../../charts/apex/ApexAreaCharts"
import Checkbox from "../../../components/@vuexy/checkbox/CheckboxesVuexy"
import "../../../assets/scss/plugins/extensions/react-paginate.scss"
import "../../../assets/scss/pages/data-list.scss"
import StatisticsCards_v2 from '../../../components/@vuexy/statisticsCard/StatisticsCard2';

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
const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
const IconText = ({ icon, text }) => (
  <Space>
    {React.createElement(icon)}
    {text}
  </Space>
);
let $primary = "#7367F0",
  $success = "#28C76F",
  $danger = "#EA5455",
  $warning = "#FF9F43",
  $info = "#00cfe8",
  $label_color_light = "#dae1e7"

let themeColors = [$primary, $success, $danger, $warning, $info]

const order_columns = [
  {
    name: 'Order Id',
    selector: 'orderId',
    sortable:true,
    grow:3
  },
  {
      name: 'Session',
      selector: 'session',
      grow:3
  },
  {
      name: 'Duration',
      selector: 'duration',
        
  },
  {
    name: 'Order Type',
    selector: 'orderType',
    sortable:true
  },
  {
    name: 'Symbol',
    selector: 'symbol',
    sortable:true
},
{
  name: 'Instruction',
  selector: 'instruction',
  sortable:true,
  grow:3
},
  {
    name: 'Quantity',
    selector: 'quantity',
    sortable:true
    
},
{
  name: 'Filled Quantity',
  selector: 'filledQuantity',
  sortable:true
},
{
  name: 'Status',
  selector: 'status',
  sortable:true,
  grow:3
},
{
  name: 'Entered Time',
  selector: 'enteredTime',
  sortable:true,
  grow:3
},


  ];

const columns = [
  {
      name: 'Ticker',
      selector: 'ticker',
      cell: (row) => <Link to={`/articleview/${row.ticker}/`}>{row.ticker}</Link>,
  },
  {
      name: 'Name',
      selector: 'ticker_name',
      grow:3
  },
  {
    name: 'Weight (%)',
    selector: 'weight',
    sortable:true
  },
  {
    name: 'Shares',
    selector: 'shares',
    sortable:true
},
{
  name: 'Entry Price',
  selector: 'entry_price',
  sortable:true
},
  {
    name: 'Current Price',
    selector: 'current_price',
    sortable:true
},
{
  name: 'Allocation',
  selector: 'current_allocation',
  sortable:true
},
{
  name: 'Change',
  selector: 'change',
  sortable:true
},


  ];





class PortfolioList extends React.Component{


  state = {
    error_state: false,
    orders:[],
    portfolios: [],
    portfolio_stats: [],
    stats_set: false,
    execution_set: false,
    isLoading: true,
    isStatsLoading: "",
    update_set: true,
    modal: false,
    login_state: false,
    form_value:{},
    isExecuteLoading: false,
    executeButton:0
  }

  handleOnSuccess(public_token, metadata) {
    // send token to client server
    axios.post("/auth/public_token", {
      public_token: public_token
    });
  }

  handleOnExit() {
    // handle the case when your user exits Link
    // For the sake of this tutorial, we're not going to be doing anything here.
  }

  fetchArticles = (token) => {
    axios.get(`https://openstreet.io/api/portfolio/?token=${token}`).then(res => {
      this.setState({
        portfolios: res.data
      });
    }).catch(err => {
      
        console.log(err.response)
        this.setState({ error_state: true })
      });
  }

  executeArticles = (token, code) => {
    axios.post(`https://openstreet.io/api/portfoliostats/?token=${token}&action=connect`,{
      code: code
    }).then(res=>{
      this.setState({
        login_state: res.data.message
          });
  }).catch(err => {
    
      console.log(err.response)
      this.setState({ error_state: true })
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

  portfolioStats = (e, item, action, exec_flag) => {

      let items = this.state;
      items['isStatsLoading'] = item.portfolio_name;
      this.setState({items});
      axios.get(`https://openstreet.io/api/matrix/?token=${this.props.token}&portfolio_name=${item.portfolio_name}&action=${action}&allocation=${item.allocation}&date_created=${item.date_created}&min_health=${item.min_health}&min_yield=${item.min_yield}&min_quality=${item.min_quality}&max_industry_rank=${item.max_industry_rank}&min_fair_value=${item.min_fair_value}&min_risk=${item.min_risk}&min_insider_rating=${item.min_insider_rating}&min_inst_rating=${item.min_inst_rating}&industry=${item.industry}`)
          .then(res=>{
            console.log(JSON.parse(res.data[0].pf_stats));
            let arr = JSON.stringify(res.data[0].portfolio_wealth_graph);
            arr = arr.split('"date":').join('"time":').split('"portfolio_wealth":').join('"value":')
            let updatedJson = JSON.parse( arr );
            console.log(updatedJson);
            if(res.data[0].portfolio_constituents.length!==0)
            {
            this.setState({
              portfolio_stats: res.data[0],
              pf_stats: JSON.parse(res.data[0].pf_stats)[0],
              stats_set: true,
              update_set:true,
              isStatsLoading:"",
              areaSeries:[{data:updatedJson}]
                });
            if(action==='execute'){

              this.setState((prevState)=>({
                execution_set: true,
                modal:!prevState.modal,
                update_set:true,
                executeButton:0
                  }));
            }
            if((action==='rebalance')){
              if(exec_flag){
              this.setState((prevState)=>({
                execution_set:false,
                rebalance_set: true,
                modal:!prevState.modal,
                update_set:true,
                executeButton:0
                  }));
                }
                else{
                  this.setState({
                    update_set:true
                      });
                    }
                }

          }
          else{
          this.setState({
            isStatsLoading:"",  
            error_state: true
              });
            }
          }).catch(err => {
            
              console.log(err.response)
              this.setState({ error_state: true })
            }) ;

      }
    

      portfolioExit = (e, item) => {
        e.preventDefault();
        //this.state.portfolio_stats['execute_portfolio'] = this.state.form_value
        axios.post(`https://openstreet.io/api/portfoliostats/?token=${this.props.token}&portfolio_name=${item.portfolio_name}&action=exit`)
            .then(res=>{
              this.setState({
                login_state: res.data.message,
                orders: res.data.orders,
                update_set:true
                  });
            }).catch(err => {
              
                console.log(err.response)
                this.setState({ error_state: true })
              });


        }

      portfolioDelete = (e, item, action) => {
        axios.get(`https://openstreet.io/api/portfolio/?token=${this.props.token}&portfolio_name=${item.portfolio_name}&action=delete`).then(res=>{
          this.setState({
            update_set: true,
              });
        }).catch(err => {
          
            console.log(err.response)
            this.setState({ error_state: true })
          });
        }

      portfolioSync = (e, item) => {
        e.preventDefault();
        //this.state.portfolio_stats['execute_portfolio'] = this.state.form_value
        axios.post(`https://openstreet.io/api/portfoliostats/?token=${this.props.token}&portfolio_name=${item.portfolio_name}&action=sync`)
            .then(res=>{
              this.setState({
                login_state: res.data.message
                  });
            }).catch(err => {
              
                console.log(err.response)
                this.setState({ error_state: true })
              } );


        }

      portfolioExecute = (e) => {
        e.preventDefault();
        
        this.setState((prevState)=>({
          isExecuteLoading: true,
          executeButton: prevState.executeButton+1
            }));
          if(this.state.executeButton===0){
        //this.state.portfolio_stats['execute_portfolio'] = this.state.form_value
        axios.post(`https://openstreet.io/api/portfoliostats/?token=${this.props.token}&portfolio_name=${this.state.portfolio_stats.name}&action=execute`, {
          execute_portfolio:this.state.form_value
          })
            .then(res=>{
              this.setState({
                login_state: res.data.message,
                orders: res.data.orders
                  });
                if(!this.state.login_state){
                    window.location.href='http://auth.tdameritrade.com/oauth?client_id=BEBFCA5ZNBRXU4A60TP54AXWTEQQCHNS%40AMER.OAUTHAP&response_type=code&redirect_uri=https%3A%2F%2Ftheopenstreet.com%2Fportfolios%2F'
                }
                else{
                  this.setState((prevState)=>({
                    modal:!prevState.modal,
                    isExecuteLoading: false,
                    update_set:true
                      }));
                }
            }).catch(err => {
             
                console.log(err.response)
                this.setState({ error_state: true })
              });

            }
        }

        portfolioRebalance = (e) => {
          e.preventDefault();
          this.setState((prevState)=>({
            isExecuteLoading: true,
            executeButton: prevState.executeButton+1
              }));
          //this.state.portfolio_stats['execute_portfolio'] = this.state.form_value
          if(this.state.executeButton===0){
          axios.post(`https://openstreet.io/api/portfoliostats/?token=${this.props.token}&portfolio_name=${this.state.portfolio_stats.name}&action=rebalance`, {
            execute_portfolio:this.state.form_value
            })
              .then(res=>{
                this.setState({
                  login_state: res.data.message,
                  orders: res.data.orders
                    });
                  if(!this.state.login_state){
                      window.location.href='http://auth.tdameritrade.com/oauth?client_id=BEBFCA5ZNBRXU4A60TP54AXWTEQQCHNS%40AMER.OAUTHAP&response_type=code&redirect_uri=https%3A%2F%2Ftheopenstreet.com%2Fportfolios%2F'
                  }
                  else{
                    this.setState((prevState)=>({
                      modal:!prevState.modal,
                      isExecuteLoading: false,
                      update_set:true
                        }));
                  }
              }).catch(err => {
                
                  console.log(err.response)
                  this.setState({ error_state: true })
                }) ;
            }
  
          }

        portfolioConnect = (e) => {
          e.preventDefault();
          //this.state.portfolio_stats['execute_portfolio'] = this.state.form_value
          axios.post(`https://openstreet.io/api/portfoliostats/?token=${this.props.token}&action=connect`)
              .then(res=>{
                this.setState({
                  login_state: res.data.message,
                    });
                  if(!this.state.login_state){
                      window.location.href='http://auth.tdameritrade.com/oauth?client_id=BEBFCA5ZNBRXU4A60TP54AXWTEQQCHNS%40AMER.OAUTHAP&response_type=code&redirect_uri=https%3A%2F%2Ftheopenstreet.com%2Fportfolios%2F'
                  }
              }).catch(err => {
                
                  console.log(err.response)
                  this.setState({ error_state: true })
                }) ;
  
  
          }

  toggleError = () => {
    this.setState(prevState => ({
      error_state: !prevState.error_state
    }));
  }

  toggleModal = () => {
    this.setState(prevState => ({
      modal: !prevState.modal,
      isExecuteLoading: false,
    }));
  }

  handleChange = e => {
    let form_value = this.state.form_value;
    form_value[e.target.name] = e.target.value;
    this.setState({ form_value:form_value });
    // console.log(this.state)
  }

  componentDidCatch(error, info) {
    // Display fallback UI
    console.log(error);
    this.setState({ error_state: true });
    // You can also log the error to an error reporting service
  }
//<ApexAreaCharts themeColors={themeColors} data={this.state.portfolio_stats.portfolio_wealth_graph} second={0} title={`Wealth Graph: ${this.state.portfolio_stats.name}`}/>
render(){
  if (!this.props.token) {
    return <Redirect to="/login" />;
  }
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
      
      

      <div>
       
       { 
        this.state.error_state ?

        <Modal
        isOpen={this.state.error_state}
        toggle={this.toggleError}
        className="modal-dialog-centered"
      >
          <ModalHeader toggle={this.toggleError}>Error</ModalHeader>
          <ModalBody>
            
            An error occured during the operation. Please try again.
          </ModalBody>
          <ModalFooter>
            <Button color='primary' onClick={this.toggleError}>
              Dismiss
            </Button>
          </ModalFooter>
        </Modal>
        :
        <div>
        {
          this.state.login_state ? 
          <div/>
          :
            <Card>
              <CardBody>
                <Button color="primary" onClick={this.portfolioConnect}>
                  Connect Brokerage
                </Button>
              </CardBody>
            </Card>
          
          

        }
        {
        this.state.orders.length===0 ? 
        <div />
        :
        <div
        className={`data-list ${"list-view"}`}>
        <DataTable
          columns={order_columns}
          data={this.state.orders}
          pagination
          noHeader
          subHeader
          responsive
          pointerOnHover
          customStyles={selectedStyle}
          sortIcon={<ChevronDown />}
        />
        </div>
          
        }
        <Modal
        isOpen={this.state.modal}
        toggle={this.toggleModal}
        className="modal-dialog-centered"
      >
        <ModalHeader toggle={this.toggleModal}>
          Orders
        </ModalHeader>
        { this.state.execution_set ?
          <Form onSubmit={this.portfolioExecute}>
            <ModalBody>

            {

              this.state.execution_set ?
              this.state.portfolio_stats.portfolio_constituents.map((item, i) => (

            <FormGroup>
              <Label for={`${item.ticker_name}${i}`}>{item.ticker_name}</Label>
              <Input
                onChange={this.handleChange}
                type="number"
                name={item.ticker_name}
                id={item.ticker_name}
                defaultValue={item.shares}
              />
            </FormGroup>))
            :
            <div/>
            }

            </ModalBody>

            <ModalFooter>
            <FormGroup>
            {
              this.state.isExecuteLoading ?
              <Spinner color="primary" size="lg"/>
            :

            <Button color="success" type="submit">
              Execute with TD Ameritrade
            </Button>
            }
            {" "}
            </FormGroup>
            <FormGroup>
            <Button outline color="primary" onClick={this.toggleModal}>
              Cancel
            </Button>
            </FormGroup>
            </ModalFooter>
            </Form>
          :
          <Form onSubmit={this.portfolioRebalance}>
             <ModalBody>

              {

                this.state.rebalance_set ?
                this.state.portfolio_stats.portfolio_constituents.map((item, i) => (

              <FormGroup>
                <Label for={`${item.ticker_name}${i}`}>{item.ticker_name}</Label>
                <Input
                  onChange={this.handleChange}
                  type="number"
                  name={item.ticker_name}
                  id={item.ticker_name}
                  defaultValue={item.shares}
                />
              </FormGroup>))
              :
              <div/>
              }

              </ModalBody>

              <ModalFooter>
              <FormGroup>
              {
                this.state.isExecuteLoading ?
                <Spinner color="primary" size="lg"/>
              :

              <Button color="success" type="submit">
                Execute with TD Ameritrade
              </Button>
              }
              {" "}
              </FormGroup>
              <FormGroup>
              <Button outline color="primary" onClick={this.toggleModal}>
                Cancel
              </Button>
              </FormGroup>
              </ModalFooter>
              </Form>
        }
       
      </Modal>
      <Divider />

      {

        this.state.stats_set  ?

          <div className="site-card-wrapper">
            <Row gutter={16}>
            <Col lg="5" sm="12">
            <Row gutter={20}>
            <Col lg="6" sm="12">
              <StatisticsCard
                hideChart
                iconBg="warning"
                icon={<DollarSign className="warning" size={22} />}
                stat={this.state.portfolio_stats.portfolio_allocation}
                statTitle="Net Value"
              />
            </Col>
            <Col lg="6" sm="12">
              <StatisticsCard
                hideChart
                iconBg="success"
                icon={<DollarSign className="success" size={22} />}
                stat={this.state.portfolio_stats.portfolio_change}
                statTitle="Change"
              />
            </Col>
            
            <Col lg="6" sm="12">
              <StatisticsCard
                hideChart
                iconBg="primary"
                icon={<Percent className="primary" size={22} />}
                stat={this.state.pf_stats["Annual return"]}
                statTitle="Historical Return"
              />
            </Col>
            <Col lg="6" sm="12">
              <StatisticsCard
                hideChart
                iconBg="danger"
                icon={<Percent className="danger" size={22} />}
                stat={this.state.pf_stats["Annual volatility"]}
                statTitle="Historical Risk"
              />
            </Col>
          
          <Col lg="6" sm="12">
            <StatisticsCard
              hideChart
              iconBg="success"
              icon={<Activity className="success" size={22} />}
              stat={this.state.pf_stats["Sharpe ratio"]}
              statTitle="Sharpe Ratio"
            />
          </Col>
          <Col lg="6" sm="12">
            <StatisticsCard
              hideChart
              iconBg="danger"
              icon={<Percent className="danger" size={22} />}
              stat={this.state.pf_stats["Max drawdown"]}
              statTitle="Max Drawdown"
            />
          </Col>
          
            <Col lg="6" sm="12">
            <StatisticsCard
              hideChart
              iconBg="success"
              icon={<Activity className="success" size={22} />}
              stat={this.state.pf_stats["Sortino ratio"]}
              statTitle="Sortino Ratio"
            />
            </Col>
            <Col lg="6" sm="12">
            <StatisticsCard
              hideChart
              iconBg="warning"  
              icon={<Activity className="warning" size={22} />}
              stat={this.state.pf_stats['Calmar ratio']}
              statTitle="Calmar Ratio"
            />
          </Col>
          
          
         
          <Col lg="6" sm="12">
            <StatisticsCard
              hideChart
              iconBg="success"
              icon={<Activity className="success" size={22} />}
              stat={this.state.pf_stats["Alpha"]}
              statTitle="Alpha"
            />
          </Col>
          
          <Col lg="6" sm="12">
            <StatisticsCard
              hideChart
              iconBg="warning"
              icon={<Heart className="warning" size={22} />}
              stat={this.state.pf_stats['Beta']}
              statTitle="Beta"
            />
          </Col>
          
          <Col lg="6" sm="12">
            <StatisticsCard
              hideChart
              iconBg="warning"
              icon={<Activity className="warning" size={22} />}
              stat={this.state.pf_stats["Stability"]}
              statTitle="R^2"
            />
          </Col>
          <Col lg="6" sm="12">
            <StatisticsCard
              hideChart
              iconBg="warning"
              icon={<Heart className="warning" size={22} />}
              stat={this.state.portfolio_stats.portfolio_industry_rank}
              statTitle="Aggregate Industry Rank"
            />
            </Col>
            <Col lg="6" sm="12">
            <StatisticsCard
              hideChart
              iconBg="primary"
              icon={<PenTool className="primary" size={22} />}
              stat={this.state.portfolio_stats.portfolio_fair_value}
              statTitle="Fair Value Rating"
            />
            </Col>
            <Col lg="6" sm="12">
            <StatisticsCard
              hideChart
              iconBg="danger"
              icon={<PenTool className="danger" size={22} />}
              stat={this.state.portfolio_stats.portfolio_risk}
              statTitle="Aggregate Risk Rating"
            />
            

            </Col>

          </Row>
          </Col>
          
          <Col lg="7" sm="12">
            <Col>
          <Card>
          <Chart legend="Portfolio Wealth Graph" darkTheme={true} areaSeries={this.state.areaSeries} autoWidth height={420} />
          </Card>
          </Col>
          <Divider />
          <Col>
          <Card>
            <CardHeader>
              <CardTitle>Constituents: {this.state.portfolio_stats.name}</CardTitle>
            </CardHeader>
            <CardBody>
              <DataTable  columns ={columns} data= {this.state.portfolio_stats.portfolio_constituents} scroll={{ x: 100 }} noHeader pagination />
            </CardBody>
          </Card>

          </Col>
         <Divider/>
         <Row>
          <Col lg="5" sm="12">
              <GoalOverview strokeColor="#b9c3cd" success="#28C76F" title="Portfolio Health" percent={this.state.portfolio_stats.portfolio_health}/>
            </Col>
            <Col lg="5" sm="12">
              <GoalOverview strokeColor="#b9c3cd" success="#28C76F" title="Portfolio Yield" percent={this.state.portfolio_stats.portfolio_yield}/>
            </Col>
            
            <Col lg="5" sm="12">
              <GoalOverview strokeColor="#b9c3cd" success="#28C76F" title="Portfolio Quality" percent={this.state.portfolio_stats.portfolio_quality}/>
              </Col>
            <Col lg="5" sm="12">
              <GoalOverview strokeColor="#b9c3cd" success="#28C76F" title="Insider Rating" percent={this.state.portfolio_stats.portfolio_insider_rating}/>
            </Col>
            <Col lg="5" sm="12">
              <GoalOverview strokeColor="#b9c3cd" success="#28C76F" title="Institutional Rating" percent={this.state.portfolio_stats.portfolio_inst_rating}/>
            </Col>
            
            </Row>
          </Col>
          <Divider/>
          
          
          </Row>
          <Divider />
          <div>




    <List
    
    grid={{
      gutter: 16,
      xs: 1,
      sm: 2,
      md: 2,
      lg: 3,
      xl: 3,
      xxl: 3,
    }}
    itemLayout="vertical"
      size="small"
      pagination={{
        onChange: page => {
          console.log(page);
        },
        pageSize: 6,
      }}
      dataSource={this.state.portfolios}

      renderItem={item => (
        <Col md="12">
        <Card style={{paddingTop: 20}}>
        { item.custom_portfolio===true ?
        <List.Item
        key={item.portfolio_name}>
                  <List.Item.Meta
              title={<a style={{fontSize: 20, color:"white"}}>{item.portfolio_name}</a>}
              

            />
            <Row>
            <StatisticsCard2
              hideChart
              iconBg="success"
              icon={<DollarSign className="success" size={22} />}
              stat={item.allocation}
              statTitle="Allocation"
            />
            <StatisticsCard2
              hideChart
              iconBg="warning"
              icon={<Activity className="warning" size={22} />}
              stat={item.date_created}
              statTitle="Effective Date"
            />
            {
              item.industry!==""?
            <StatisticsCard2
              hideChart
              iconBg="warning"
              icon={<PenTool className="warning" size={22} />}
              stat={item.industry}
              statTitle="Industry Filter"
            />
          :
          <div/>
          }
            </Row>
         <Button outline color="primary" onClick={(e)=> this.portfolioStats(e,item, "compute")}>Track Portfolio</Button>
         
            <Space/>
            {
              item.execute_code===1
              ?
              <div style={{
                padding: 2,
              }}>
            
            <Button.Ripple color="success" onClick={(e)=> this.portfolioSync(e,item)}>Sync</Button.Ripple>
           
             <Button.Ripple  style={{
              margin: '0 5px',
            }} color="danger" onClick={(e)=> this.portfolioExit(e,item)}>Exit</Button.Ripple>
             </div>
            :
            <div style={{
              padding: 2,
            }}>
            <Button color="danger" onClick={(e)=> this.portfolioDelete(e, item)}>Delete</Button>
            {
              this.state.login_state===true ?
            <Button.Ripple  style={{
              margin: '0 5px',
            }} color="success" onClick={(e)=> this.portfolioStats(e,item,"execute",true)}>Execute</Button.Ripple>
            
            :
            <div/>
            }
            </div>
          }
          
          { this.state.isStatsLoading===item.portfolio_name  ?

          <Spinner color="primary"/>
            :
            <div/>
          }
          
        </List.Item>
      
        :
        <List.Item
          key={item.portfolio_name}
          actions={[
            <div><IconText icon={HeartOutlined}  key="1" /><p>{item.min_health}</p></div>,
            <div ><IconText icon={DollarOutlined}  key="2" /><p>{item.min_yield}</p></div>,
            <div ><IconText icon={ExperimentOutlined}  key="3" /><p>{item.min_quality}</p></div>,
            <div ><IconText icon={StarOutlined}  key="4" /><p>{item.min_fair_value}</p></div>,
            <div ><IconText icon={RiseOutlined}  key="5" /><p>{item.max_industry_rank}</p></div>,
            <div ><IconText icon={FireOutlined}  key="6" /><p>{item.min_risk}</p></div>,
            <div ><IconText icon={YuqueOutlined}  key="7" /><p>{item.min_insider_rating}</p></div>,
            <div ><IconText icon={ShopOutlined}  key="8" /><p>{item.min_inst_rating}</p></div>

          ]}
        >
          
          <List.Item.Meta
              title={<a style={{fontSize: 20, color:"white"}}>{item.portfolio_name}</a>}
              

            />
           <Row>
            <StatisticsCard2
              hideChart
              iconBg="success"
              icon={<DollarSign className="success" size={22} />}
              stat={item.allocation}
              statTitle="Allocation"
            />
            <StatisticsCard2
              hideChart
              iconBg="warning"
              icon={<Activity className="warning" size={22} />}
              stat={item.date_created}
              statTitle="Effective Date"
            />
            {
              item.industry!==""?
            <StatisticsCard2
              hideChart
              iconBg="warning"
              icon={<PenTool className="warning" size={22} />}
              stat={item.industry}
              statTitle="Industry Filter"
            />
          :
          <div/>
          }
            </Row>
         <Button outline color="primary" onClick={(e)=> this.portfolioStats(e,item, "compute")}>Track Portfolio</Button>
         
            <Space/>
            {
              item.execute_code===1
              ?
              <div style={{
                padding: 2,
              }}>
            <Button.Ripple color="success" onClick={(e)=> this.portfolioStats(e,item, "rebalance",true)}>Rebalance</Button.Ripple>

            <Button.Ripple  style={{
              margin: '0 5px',
            }} color="success" onClick={(e)=> this.portfolioSync(e,item)}>Sync</Button.Ripple>
           
             <Button.Ripple  style={{
              margin: '5 5px',
            }} color="danger" onClick={(e)=> this.portfolioExit(e,item)}>Exit</Button.Ripple>
             </div>
            :
            <div style={{
              padding: 2,
            }}>
            <Button color="danger" onClick={(e)=> this.portfolioDelete(e, item)}>Delete</Button>
            <Button style={{
              margin: '0 5px',
            }} outline color="warning" onClick={(e)=> this.portfolioStats(e,item, "rebalance",false)}>Apply Rules</Button>
            {
              this.state.login_state===true ?
            <Button.Ripple  style={{
              margin: '5 5px',
            }} color="success" onClick={(e)=> this.portfolioStats(e,item,"execute",true)}>Execute</Button.Ripple>
            
            :
            <div/>
            }
            </div>
          }
          
          { this.state.isStatsLoading===item.portfolio_name  ?

          <Spinner color="primary"/>
            :
            <div/>
          }
          
        </List.Item>
        }
        </Card>
        </Col>
      )}
    />
    </div>
          </div>
        :
        
          <div>

        
    <List
    grid={{
      gutter: 16,
      xs: 1,
      sm: 2,
      md: 2,
      lg: 3,
      xl: 3,
      xxl: 3,
    }}
      itemLayout="vertical"
      size="small"
      pagination={{
        onChange: page => {
          console.log(page);
        },
        pageSize: 6,
      }}
      dataSource={this.state.portfolios}

      renderItem={item => (
        <Col md="12">
        <Card style={{paddingTop: 20}}>
        { item.custom_portfolio===true ?
        <List.Item
        key={item.portfolio_name}>
           <List.Item.Meta
              title={<a style={{fontSize: 20, color:"white"}}>{item.portfolio_name}</a>}
              
            />
            <Row>
            <StatisticsCard2
              hideChart
              iconBg="success"
              icon={<DollarSign className="success" size={22} />}
              stat={item.allocation}
              statTitle="Allocation"
            />
            <StatisticsCard2
              hideChart
              iconBg="warning"
              icon={<Activity className="warning" size={22} />}
              stat={item.date_created}
              statTitle="Effective Date"
            />
           {
              item.industry!==""?
            <StatisticsCard2
              hideChart
              iconBg="warning"
              icon={<PenTool className="warning" size={22} />}
              stat={item.industry}
              statTitle="Industry Filter"
            />
          :
          <div/>
          }
            </Row>
            <Button outline color="primary" onClick={(e)=> this.portfolioStats(e,item, "compute", false)}>Track Portfolio</Button>
            <Space/>
            {
              item.execute_code===1
              ?
              <div style={{
                padding: 2,
              }}>
            <Button.Ripple color="success" onClick={(e)=> this.portfolioSync(e,item)}>Sync</Button.Ripple>
           
             <Button.Ripple  style={{
              margin: '0 5px',
            }} color="danger" onClick={(e)=> this.portfolioExit(e,item)}>Exit</Button.Ripple>
            </div>
            :
            <div style={{
              padding: 2,
            }}>
            <Button color="danger" onClick={(e)=> this.portfolioDelete(e, item)}>Delete</Button>
            {
              this.state.login_state===true ?
            <Button.Ripple  style={{
              margin: '0 5px',
            }} color="success" onClick={(e)=> this.portfolioStats(e,item,"execute",true)}>Execute</Button.Ripple>
            
            :
            <div/>
            }
            </div>
          }
          <Space/>
            { this.state.isStatsLoading===item.portfolio_name  ?

              <Spinner color="primary"/>
              :
              <div/>
            }
          </List.Item>
          :
          <List.Item
            key={item.portfolio_name}
            actions={[
              <div><IconText icon={HeartOutlined}  key="1" /><p>{item.min_health}</p></div>,
              <div ><IconText icon={DollarOutlined}  key="2" /><p>{item.min_yield}</p></div>,
              <div ><IconText icon={ExperimentOutlined}  key="3" /><p>{item.min_quality}</p></div>,
              <div ><IconText icon={StarOutlined}  key="4" /><p>{item.min_fair_value}</p></div>,
              <div ><IconText icon={RiseOutlined}  key="5" /><p>{item.max_industry_rank}</p></div>,
              <div ><IconText icon={FireOutlined}  key="6" /><p>{item.min_risk}</p></div>,
              <div ><IconText icon={YuqueOutlined}  key="7" /><p>{item.min_insider_rating}</p></div>,
              <div ><IconText icon={ShopOutlined}  key="8" /><p>{item.min_inst_rating}</p></div>

            ]}
          >
            <List.Item.Meta
              title={<a style={{fontSize: 20, color:"white"}}>{item.portfolio_name}</a>}
              
            />
            <Row>
            <StatisticsCard2
              hideChart
              iconBg="success"
              icon={<DollarSign className="success" size={22} />}
              stat={item.allocation}
              statTitle="Allocation"
            />
            <StatisticsCard2
              hideChart
              iconBg="warning"
              icon={<Activity className="warning" size={22} />}
              stat={item.date_created}
              statTitle="Effective Date"
            />
            
            {
              item.industry!==""?
            <StatisticsCard2
              hideChart
              iconBg="warning"
              icon={<PenTool className="warning" size={22} />}
              stat={item.industry}
              statTitle="Industry Filter"
            />
          :
          <div/>
          }
          
            </Row>
            <Button outline color="primary" onClick={(e)=> this.portfolioStats(e,item, "compute", false)}>Track Portfolio</Button>
            <Space/>
            {
              item.execute_code===1
              ?
              <div style={{
                padding: 2,
              }}>
            <Button.Ripple  color="success" onClick={(e)=> this.portfolioStats(e,item, "rebalance",true)}>Rebalance</Button.Ripple>
            <Button.Ripple  style={{
              margin: '0 5px',
            }} color="success" onClick={(e)=> this.portfolioSync(e,item)}>Sync</Button.Ripple>
           
             <Button.Ripple  style={{
              margin: '5 5px',
            }} color="danger" onClick={(e)=> this.portfolioExit(e,item)}>Exit</Button.Ripple>
            </div>
            :
            <div style={{
              padding: 2,
            }}>
            <Button color="danger" onClick={(e)=> this.portfolioDelete(e, item)}>Delete</Button>
            <Button style={{
              margin: '0 5px',
            }} outline color="warning" onClick={(e)=> this.portfolioStats(e,item, "rebalance",false)}>Apply Rules</Button>
            {
              this.state.login_state===true ?
            <Button.Ripple  style={{
              margin: '5 5px',
            }} color="success" onClick={(e)=> this.portfolioStats(e,item,"execute",true)}>Execute</Button.Ripple>
            
            :
            <div/>
            }
            </div>
          }
          <Space/>
            { this.state.isStatsLoading===item.portfolio_name  ?

              <Spinner color="primary"/>
              :
              <div/>
            }
          </List.Item>
        }
        </Card>
        </Col>
      )}
    />
    </div>
    }

    <Divider/>
    <Col lg="3" sm="3">
    <Card>
      <CardBody>
    <IconText icon={HeartOutlined}  key="1"/><p>Min Health</p>
        <IconText icon={DollarOutlined}  key="2" /><p>Min Yield</p>
        <IconText icon={ExperimentOutlined}  key="3" /><p>Min Quality</p>
        <IconText icon={StarOutlined}  key="4" /><p>Min Fair Value</p>
        <IconText icon={RiseOutlined}  key="5" /><p>Max Industry Rank</p>
        <IconText icon={FireOutlined}  key="6" /><p>Min Risk</p>
        <IconText icon={YuqueOutlined}  key="7" /><p>Min Insider Rating</p>
        <IconText icon={ShopOutlined}  key="8" /><p>Min Institutional Rating</p>
        </CardBody>
    </Card>
    </Col>
   
    </div>
       }
        
    
    </div>
    




);
    }
    }
const mapStatetoProps = state =>{
  return{
    token: state.auth.token
  }
}

export default connect(mapStatetoProps)(PortfolioList);


