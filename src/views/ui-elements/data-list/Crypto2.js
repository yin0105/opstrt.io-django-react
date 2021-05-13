import * as React from 'react';
import { Table, Spin, Divider, List, Space } from 'antd';
import { PlaidLink } from 'react-plaid-link';
import Chart from '../../charts/apex/lightweight'
import { Redirect } from "react-router-dom";
import {
  Card,
  CardImg,
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
import {DollarSign, PenTool, Heart, Activity, Percent} from "react-feather"
import GoalOverview from "./Percent"
import ApexAreaCharts from "../../charts/apex/ApexAreaCharts"
import Checkbox from "../../../components/@vuexy/checkbox/CheckboxesVuexy"
import "../../../assets/scss/plugins/extensions/react-paginate.scss"
import "../../../assets/scss/pages/data-list.scss"
import TradingViewWidget, { Themes } from 'react-tradingview-widget';
import risk_averse from "../../../assets/img/elements/risk_averse.png";
import yield_seeker from "../../../assets/img/elements/shutterstock_1866835708-removebg-preview.png";
import value from "../../../assets/img/elements/value_seeker.png";
import all_star from "../../../assets/img/elements/all_star.png";

class Crypto extends React.Component{

  state = {
    allocation:0,
    mm_bot:false,
    ss_bot:false,
    pt_bot:false,
    rd_bot: false,
    isStatsLoading: false,
  }


  strategyBacktest = (e, name) => {
    let items = this.state;
    items['isStatsLoading'] = name;
    this.setState({items});
    axios.get(`http://127.0.0.1:8000/api/crypto/?token=${this.props.token}&strategy_name=${name}&action=backtest&allocation=${this.state.allocation}`)
        .then(res=>{
           this.setState({
            pf_stats: res.data.stats[0],
            stats_set: true,
            isStatsLoading:"",
            areaSeries:[{data:res.data.wealth_graph}]
             });
          
        }).catch(err => {
          if (err.response) {
            console.log(err.response)
            this.setState({ error_state: true, isStatsLoading:"", })
          }
          });

    }


  strategyLive = (e, name) => {
    if(this.state.allocation!==0){
    axios.post(`http://127.0.0.1:8000/api/crypto/?token=${this.props.token}`, {
      strategy_name: name,
      allocation: this.state.allocation,
    }).then(res => {
      console.log(res);
      this.setState({ update_set: true })
      })
    .catch(err => {
    if (err.response) {
      console.log(err.response)
      this.setState({ error_state: true })
    }
      })
    }}
    
  strategyDelete = (e, name) => {
    axios.get(`http://127.0.0.1:8000/api/crypto/?token=${this.props.token}&strategy_name=${name}&action=delete`).then(res=>{
      this.setState({
        update_set: true,
          });
    }).catch(err => {
      
        console.log(err.response)
        this.setState({ error_state: true })
      });
    }

  
  fetchArticles = (token) => {
      axios.get(`http://127.0.0.1:8000/api/crypto/?token=${token}`).then(res => {
        this.setState({
          strategies: res.data
        });
        this.setState({
          mm_bot:false,
          ss_bot:false,
          pt_bot:false,
          rd_bot: false
        })
        for (var i = 0; i < this.state.strategies.length; i++) {
          let strategy = this.state.strategies[i];
          this.setState({
            [strategy.strategy_name]: true
          });
      }
        console.log(this.state);
      }).catch(err => {
        
          console.log(err.response)
          this.setState({ error_state: true })
        });
    }

  componentDidUpdate() {
      if(this.state.update_set){
      this.fetchArticles(this.props.token);
      
      this.setState({
        update_set: false
      });
      }
    }

  componentDidMount() {
      this.fetchArticles(this.props.token);
    }

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value })
    // console.log(this.state)
  }

  render(){
    if (!this.props.token) {
      return <Redirect to="/login" />;
    }
    
    return (
      <div>
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
  </Col>
  </Row>

  </div>
  :
  <div/>
            }
  <Row>
  <Col sm="4" lg="3" sm="12">
        <Card >
             
             <CardImg
               className="img-fluid mb-2"
               src={all_star}
               alt="card image cap"
             />
               <CardBody>
             <h3>Passive Market Maker Bot</h3>
             
             <span>This Bot is for investors who like to trade infrequently and allocate larger quantity per trade. The Bot limits trades to high confidence signals only.</span>
             <div className="card-btns d-flex justify-content-between mt-2">
               {
                 this.state.mm_bot ?
                 <div>
                  
                 <Button  onClick={this.resetFilter} color='success'>
                Sync
               </Button>
               <Button style={{
              margin: '0 5px',
            }} onClick={e => this.strategyDelete(e, 'mm_bot')} color='danger'>
                Exit
              </Button>
              </div>
                 :
                 
                 <div>
                   
                    <Col md="12">
        <Input
          //  ref="sdf"
          required
          type="text"
          name="allocation"
          id="allocation"
          placeholder="Allocation"
          onChange={this.handleChange}

        />
      </Col><p/><Col>
               <Button.Ripple onClick={e => this.strategyLive(e, 'mm_bot')} color='success'>
                 Go Live
               </Button.Ripple>
               <Button.Ripple outline style={{
              margin: '0 5px',
            }} onClick={e => this.strategyBacktest(e, 'mm_bot')} color='primary'>
               Backtest
             </Button.Ripple>
             
             <Space/>
            { this.state.isStatsLoading==='mm_bot'  ?

              <Spinner color="primary"/>
              :
              <div/>
            }
            </Col>
             </div>
              }
              
             </div>
             </CardBody>
           </Card>
            </Col>
            <Col sm="4" lg="3" sm="12">
        <Card >
             
             <CardImg
               className="img-fluid mb-2"
               src={all_star}
               alt="card image cap"
             />
               <CardBody>
             <h3>Agressive Signal Seeker Bot</h3>
             
             <span>This Bot is for investors who like to trade more frequently and allocate limited quantity per trade. The Bot analyzes high and medium confidence signals for trading.</span>
             <div className="card-btns d-flex justify-content-between mt-2">
               
               {
                 this.state.ss_bot ?
                 <div>
                  
                 <Button  onClick={this.resetFilter} color='success'>
                Sync
               </Button>
               <Button style={{
              margin: '0 5px',
            }}  onClick={e => this.strategyDelete(e, 'ss_bot')} color='danger'>
                Exit
              </Button>
              </div>
                 :
                 <div>
                   
                    <Col md="12">
        <Input
          //  ref="sdf"
          required
          type="text"
          name="allocation"
          id="allocation"
          placeholder="Allocation"
          onChange={this.handleChange}

        />
      </Col><p/><Col>
               <Button.Ripple onClick={e => this.strategyLive(e, 'ss_bot')} color='success'>
                 Go Live
               </Button.Ripple>
               <Button.Ripple outline style={{
              margin: '0 5px',
            }} onClick={e => this.strategyBacktest(e, 'ss_bot')} color='primary'>
               Backtest
             </Button.Ripple>
            
             <Space/>
            { this.state.isStatsLoading==='ss_bot'  ?

              <Spinner color="primary"/>
              :
              <div/>
            }
             </Col>
             </div>
              }
             </div>
             </CardBody>
           </Card>
            </Col>
            <Col sm="4" lg="3" sm="12">
        <Card >
             
             <CardImg
               className="img-fluid mb-2"
               src={all_star}
               alt="card image cap"
             />
               <CardBody>
             <h3>Pairs Trader Bot</h3>
             
             <span>This Bot is for investors who like to trade in pairs and wait for moments when the assets go in and out of correlation. The Bot limits trades to BTC ETH pair.</span>
             <div className="card-btns d-flex justify-content-between mt-2">
             
               {
                 this.state.pt_bot ?
                 <div>
                   
                 <Button  onClick={this.resetFilter} color='success'>
                Sync
               </Button>
               <Button style={{
              margin: '0 5px',
            }}  onClick={e => this.strategyDelete(e, 'pt_bot')} color='danger'>
                Exit
              </Button>
              </div>
                 :
                 <div>
                 <Col md="12">
     <Input
       //  ref="sdf"
       required
       type="text"
       name="allocation"
       id="allocation"
       placeholder="Allocation"
       onChange={this.handleChange}

     />
   </Col><p/><Col>
            <Button.Ripple onClick={e => this.strategyLive(e, 'pt_bot')} color='success'>
              Go Live
            </Button.Ripple>
            <Button.Ripple outline style={{
           margin: '0 5px',
         }} onClick={e => this.strategyBacktest(e, 'pt_bot')} color='primary'>
            Backtest
          </Button.Ripple>
          
          <Space/>
            { this.state.isStatsLoading==='pt_bot'  ?

              <Spinner color="primary"/>
              :
              <div/>
            }
            </Col>
             </div>
             
              }
              
             </div>
             </CardBody>
           </Card>
            </Col>
            <Col sm="4" lg="3" sm="12">
        <Card >
             
             <CardImg
               className="img-fluid mb-2"
               src={all_star}
               alt="card image cap"
             />
               <CardBody>
             <h3>Regime Detector AI Bot</h3>
             
             <span>This Bot detects the trading regime and chooses the best strategy given that regime. The Bot analyzes signals across the board.</span>
             <div className="card-btns d-flex justify-content-between mt-2">
               
               {
                 this.state.rd_bot ?
                 <div>
                 <Button  onClick={this.resetFilter} color='success'>
                Sync
               </Button>
               <Button style={{
              margin: '0 5px',
            }}  onClick={e => this.strategyDelete(e, 'rd_bot')} color='danger'>
                Exit
              </Button>
              </div>
                 :
                 <div>
                    <Col md="12">
        <Input
          //  ref="sdf"
          required
          type="text"
          name="allocation"
          id="allocation"
          placeholder="Allocation"
          onChange={this.handleChange}

        />
      </Col><p/><Col>
               <Button.Ripple onClick={e => this.strategyLive(e, 'rd_bot')} color='success'>
                 Go Live
               </Button.Ripple>
               <Button.Ripple outline style={{
              margin: '0 5px',
            }} onClick={e => this.strategyBacktest(e, 'rd_bot')} color='primary'>
               Backtest
             </Button.Ripple>
             
             <Space/>
            { this.state.isStatsLoading==='rd_bot'  ?

              <Spinner color="primary"/>
              :
              <div/>
            }
            </Col>
             </div>
              }
             </div>
             </CardBody>
           </Card>
            </Col>
            </Row>


           
  </div>
    )}
    }

const mapStatetoProps = state =>{
  return{
    token: state.auth.token
  }
}
    
    export default connect(mapStatetoProps)(Crypto);