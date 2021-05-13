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
import { CreditCard } from "react-feather"
import ReactPaginate from "react-paginate"
import { LoadingOutlined, ShopOutlined, YuqueOutlined, RiseOutlined, HeartOutlined, DollarOutlined,StarOutlined, ExperimentOutlined, FireOutlined } from '@ant-design/icons';
import axios from 'axios';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import StatisticsCard from "../../../components/@vuexy/statisticsCard/StatisticsCard"
import {DollarSign, PenTool, Heart, Activity, Percent} from "react-feather"
import GoalOverview from "./Percent"
import ApexAreaCharts from "../../charts/apex/ApexAreaCharts"
import Checkbox from "../../../components/@vuexy/checkbox/CheckboxesVuexy"
import "../../../assets/scss/plugins/extensions/react-paginate.scss"
import "../../../assets/scss/pages/data-list.scss"

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
    name: 'Date',
    selector: 'Date',
    sortable:true
  },
  {
    name: 'Position',
    selector: 'position',
    sortable:true
},
{
  name: 'Entry/Exit Price',
  selector: 'Close',
  sortable:true
},

  ];





class Strategies extends React.Component{


  state = {
    error_state: false,
    orders:[],
    strategies: [],
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
    axios.get(`https://openstreet.io/api/strategies/?token=${token}`).then(res => {
      this.setState({
        strategies: res.data
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
    
      strategyBacktest = (e, item) => {

        let items = this.state;
        items['isStatsLoading'] = item.strategy_name;
        this.setState({items});
        axios.get(`https://openstreet.io/api/strategies/?token=${this.props.token}&strategy_name=${item.strategy_name}&action=backtest&allocation=${item.allocation}`)
            .then(res=>{
              console.log(res.data.orders)
               this.setState({
                pf_stats: res.data.stats[0],
                trades: res.data.orders,
                stats_set: true,
                isStatsLoading:"",
                areaSeries:[{data:res.data.wealth_graph}]
                 });
              
            }).catch(err => {
              
                console.log(err.response)
                this.setState({ error_state: true })
              });
  
        }

      strategyLive = (e, item) => {

          let items = this.state;
          items['isStatsLoading'] = item.strategy_name;
          this.setState({items});
          axios.get(`https://openstreet.io/api/strategies/?token=${this.props.token}&strategy_name=${item.strategy_name}&action=golive&allocation=${item.allocation}`)
              .then(res=>{
                console.log(res.data.is_live)
                
                this.setState({ update_set:true, isStatsLoading: "" })
              }).catch(err => {
                
                  console.log(err.response)
                  this.setState({ error_state: true })
                });
    
          }  


      strategyExit = (e, item) => {
        e.preventDefault();
        //this.state.portfolio_stats['execute_portfolio'] = this.state.form_value
        axios.get(`https://openstreet.io/api/strategies/?token=${this.props.token}&strategy_name=${item.strategy_name}&action=exit`)
            .then(res=>{
              this.setState({
                login_state: res.data.message,
                update_set:true
                  });
            }).catch(err => {
              
                console.log(err.response)
                this.setState({ error_state: true })
              });


        }

      strategyDelete = (e, item) => {
        axios.get(`https://openstreet.io/api/strategies/?token=${this.props.token}&strategy_name=${item.strategy_name}&action=delete`).then(res=>{
          this.setState({
            update_set: true,
              });
        }).catch(err => {
          
            console.log(err.response)
            this.setState({ error_state: true })
          });
        }

      strategySync = (e, item) => {
        e.preventDefault();
        //this.state.portfolio_stats['execute_portfolio'] = this.state.form_value
        axios.get(`https://openstreet.io/api/strategies/?token=${this.props.token}&strategy_name=${item.strategy_name}&action=sync`)
            .then(res=>{
              this.setState({
                login_state: res.data.message
                  });
            }).catch(err => {
              
                console.log(err.response)
                this.setState({ error_state: true })
              } );


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
    if(this.state.strategies.length === 0 & this.state.isLoading===false){
      let items = this.state;
      items['isLoading'] = true;
      this.setState({items});
    }
    if(this.state.strategies.length !== 0 & this.state.isLoading===true){
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
          
        

          </Row>
          </Col>
          
          <Col lg="7" sm="12">
            <Col>
          <Card>
          <Chart legend="Strategy Wealth Graph" darkTheme={true} areaSeries={this.state.areaSeries} autoWidth height={420} />
          </Card>
          </Col>
          <Col>
          <Card>
            <CardBody>
          <DataTable  columns ={columns} data= {this.state.trades} scroll={{ x: 100 }} noHeader pagination />
          </CardBody>
          </Card>
          </Col>
          </Col>
          </Row>
          <Divider />

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
      dataSource={this.state.strategies}

      renderItem={item => (
        <Col md="12">
        <Card style={{paddingTop: 20}}>
        { item.custom_portfolio===true ?
        <List.Item
        key={item.strategy_name}>
           <List.Item.Meta
              title={<a style={{fontSize: 20, color:"white"}}>{item.strategy_name}</a>}
              
            />
            <Row>
            <StatisticsCard
              hideChart
              iconBg="success"
              icon={<DollarSign className="success" size={22} />}
              stat={item.allocation}
              statTitle="Allocation"
            />
            <StatisticsCard
              hideChart
              iconBg="warning"
              icon={<Activity className="warning" size={22} />}
              stat={item.ticker}
              statTitle="Ticker"
            />
            {
              item.holding_period?
              <StatisticsCard
              hideChart
              iconBg="warning"
              icon={<PenTool className="warning" size={22} />}
              stat={item.holding_period}
              statTitle="Max Holding Period"
            />
          :
          <div/>
          }
            
            </Row>
          <Button outline color="primary" onClick={(e)=> this.strategyBacktest(e, item)}>Backtest</Button>
            <Space/>
            {
              item.is_live
              ?
              <div style={{
                padding: 2,
              }}>
            <Button.Ripple color="success" onClick={(e)=> this.strategySync(e,item)}>Sync</Button.Ripple>
           
             <Button.Ripple  style={{
              margin: '0 5px',
            }} color="danger" onClick={(e)=> this.strategyExit(e,item)}>Exit</Button.Ripple>
            </div>
            :
            <div style={{
              padding: 2,
            }}>
            <Button color="danger" onClick={(e)=> this.strategyDelete(e, item)}>Delete</Button>
            {
              this.state.login_state===true ?
            <Button.Ripple  style={{
              margin: '5 5px',
            }} color="success" onClick={(e)=> this.strategyLive(e,item)}>Go Live</Button.Ripple>
            
            :
            <div/>
            }
            </div>
          }
          <Space/>
            { this.state.isStatsLoading===item.strategy_name  ?

              <Spinner color="primary"/>
              :
              <div/>
            }
          </List.Item>
          :
          <List.Item
            key={item.strategy_name}
          
          >
            <List.Item.Meta
              title={<a style={{fontSize: 20, color:"white"}}>{item.strategy_name}</a>}
              
            />
            <Row>
            <StatisticsCard
              hideChart
              iconBg="success"
              icon={<DollarSign className="success" size={22} />}
              stat={item.allocation}
              statTitle="Allocation"
            />
            <StatisticsCard
              hideChart
              iconBg="warning"
              icon={<Activity className="warning" size={22} />}
              stat={item.ticker}
              statTitle="Ticker"
            />
            {
              item.holding_period?
              <StatisticsCard
              hideChart
              iconBg="warning"
              icon={<PenTool className="warning" size={22} />}
              stat={item.holding_period}
              statTitle="Max Holding Period"
            />
          :
          <div/>
          }
            </Row>
            <Button outline color="primary" onClick={(e)=> this.strategyBacktest(e, item)}>Backtest</Button>
            <Space/>
            {
              item.is_live
              ?
              <div style={{
                padding: 2,
              }}>
            <Button.Ripple color="success" onClick={(e)=> this.strategySync(e,item)}>Sync</Button.Ripple>
           
             <Button.Ripple  style={{
              margin: '0 5px',
            }} color="danger" onClick={(e)=> this.strategyExit(e,item)}>Exit</Button.Ripple>
            </div>
            :
            <div style={{
              padding: 2,
            }}>
            <Button color="danger" onClick={(e)=> this.strategyDelete(e, item)}>Delete</Button>
            {
              this.state.login_state===true ?
            <Button.Ripple  style={{
              margin: '0 5px',
            }} color="success" onClick={(e)=> this.strategyLive(e,item)}>Go Live</Button.Ripple>
            
            :
            <div/>
            }
            </div>
          }
          <Space/>
            { this.state.isStatsLoading===item.strategy_name  ?

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
      dataSource={this.state.strategies}

      renderItem={item => (
        <Col md="12">
        <Card style={{paddingTop: 20}}>
        { item.custom_portfolio===true ?
        <List.Item
        key={item.strategy_name}>
           <List.Item.Meta
              title={<a style={{fontSize: 20, color:"white"}}>{item.strategy_name}</a>}
             
            />
            <Row>
            <StatisticsCard
              hideChart
              iconBg="success"
              icon={<DollarSign className="success" size={22} />}
              stat={item.allocation}
              statTitle="Allocation"
            />
            <StatisticsCard
              hideChart
              iconBg="warning"
              icon={<Activity className="warning" size={22} />}
              stat={item.ticker}
              statTitle="Ticker"
            />
            {
              item.holding_period?
              <StatisticsCard
              hideChart
              iconBg="warning"
              icon={<PenTool className="warning" size={22} />}
              stat={item.holding_period}
              statTitle="Max Holding Period"
            />
          :
          <div/>
          }
            </Row>
            
          <Button outline color="primary" onClick={(e)=> this.strategyBacktest(e, item)}>Backtest</Button>
            <Space/>
            {
              item.is_live
              ?
              <div style={{
                padding: 2,
              }}>
            <Button.Ripple color="success" onClick={(e)=> this.strategySync(e,item)}>Sync</Button.Ripple>
           
             <Button.Ripple  style={{
              margin: '0 5px',
            }} color="danger" onClick={(e)=> this.strategyExit(e,item)}>Exit</Button.Ripple>
            </div>
            :
            <div style={{
              padding: 2,
            }}>
            <Button color="danger" onClick={(e)=> this.strategyDelete(e, item)}>Delete</Button>
            {
              this.state.login_state===true ?
            <Button.Ripple  style={{
              margin: '0 5px',
            }} color="success" onClick={(e)=> this.strategyLive(e,item)}>Go Live</Button.Ripple>
            
            :
            <div/>
            }
            </div>
          }
          <Space/>
            { this.state.isStatsLoading===item.strategy_name  ?

              <Spinner color="primary"/>
              :
              <div/>
            }
          </List.Item>
          :
          <List.Item
            key={item.strategy_name}
          
          >
            <List.Item.Meta
              title={<a style={{fontSize: 20, color:"white"}}>{item.strategy_name}</a>}
            />
            <Row>
            <StatisticsCard
              hideChart
              iconBg="success"
              icon={<DollarSign className="success" size={22} />}
              stat={item.allocation}
              statTitle="Allocation"
            />
            <StatisticsCard
              hideChart
              iconBg="warning"
              icon={<Activity className="warning" size={22} />}
              stat={item.ticker}
              statTitle="Ticker"
            />
           {
              item.holding_period?
              <StatisticsCard
              hideChart
              iconBg="warning"
              icon={<PenTool className="warning" size={22} />}
              stat={item.holding_period}
              statTitle="Max Holding Period"
            />
          :
          <div/>
          }
            </Row>
            <Button outline color="primary" onClick={(e)=> this.strategyBacktest(e, item)}>Backtest</Button>
            <Space/>
            {
              item.is_live
              ?
              <div style={{
                padding: 2,
              }}>
            <Button.Ripple color="success" onClick={(e)=> this.strategySync(e,item)}>Sync</Button.Ripple>
           
             <Button.Ripple  style={{
              margin: '0 5px',
            }} color="danger" onClick={(e)=> this.strategyExit(e,item)}>Exit</Button.Ripple>
            </div>
            :
            <div style={{
              padding: 2,
            }}>
            <Button color="danger" onClick={(e)=> this.strategyDelete(e, item)}>Delete</Button>
            {
              this.state.login_state===true ?
            <Button.Ripple  style={{
              margin: '0 5px',
            }} color="success" onClick={(e)=> this.strategyLive(e,item)}>Go Live</Button.Ripple>
            
            :
            <div/>
            }
            </div>
          }
          <Space/>
            { this.state.isStatsLoading===item.strategy_name  ?

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

export default connect(mapStatetoProps)(Strategies);


