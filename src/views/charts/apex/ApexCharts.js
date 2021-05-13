import React from "react";
import { connect } from "react-redux";
import axios from "axios";
import Report from "./Report";
import { Redirect } from "react-router-dom";
import GoalOverview from "../../ui-elements/data-list/Percent"
import ApexAreaCharts from "./ApexAreaCharts"
import AreaCharts from "./AreaCharts"
import AreaCharts1 from "./AreaCharts1"
import DataTable from "react-data-table-component"
import { Table, Divider, Statistic, Progress } from 'antd';
import { ChevronDown } from "react-feather";
import Chart from "./lightweight";
import {
  Card,
  Container,
  Col,
  Row,
  CardHeader,
  CardTitle,
  CardBody,
  CardImg,
  UncontrolledButtonDropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  Spinner,
  Modal,
  Button,
    ModalHeader,
    ModalBody,
    ModalFooter,
} from "reactstrap";

const columns = [
  {
    name: 'Filing Date',
    selector: 'filingdate',
    render: (text) => <a>{text}</a>,
    grow:3
  },
  {
    name: 'Officer Title',
    selector: 'officertitle',
    grow:5

  },
  {
    name: 'Security Title',
    selector: 'securitytitle',
    grow:5

  },
  {
    name: 'Exercise Price',
    selector: 'priceexercisable',

  },
  {
    name: 'Expiration Date',
    selector: 'expirationdate',

  },

  {
    name: 'Transaction Price ',
    selector: 'transactionpricepershare',
    sortable: true
  },
  {
    name: 'Transaction Value ($ Mn)',
    selector: 'transactionvalue',
    sortable: true
  }
];

const inst_columns= [
  {
    name: 'Calendar Date',
    selector: 'calendardate',
    render: (text) => <a>{text}</a>,
    grow:3
  },
  {
    name: 'Investor Name',
    selector: 'investorname',
    grow:5

  },
  {
    name: 'Security Type',
    selector: 'securitytype',
    grow:3

  },
  {
    name: 'Price ',
    selector: 'price',
    sortable: true
  },
    {
      name: 'Net Value ($ Mn)',
      selector: 'value',
      sortable: true
    }
  ]

  const net_inst_columns =[
    {
      name: 'Calendar Date',
      selector: 'calendardate',
      render: (text) => <a>{text}</a>,
    },
    {
      name: 'Security Type',
      selector: 'securitytype',
      grow:3

    },
      {
        name: 'Net Value ($ Mn)',
        selector: 'value',
        sortable: true
      }
    ]
/*

  const sell_config = {
    data: props.sell_value,
    height: 400,
    xField: 'filingdate',
    yField: 'transactionvalue',
    point: {
    size: 3,
    shape: 'circle',
    },
  };
  <Card title="Insider Buy">
    <Area  data: props.buy_value
    height: 400
    xField: 'filingdate'
    yField: 'transactionvalue'
    point: {
    size: 3,
    shape: 'circle',
    } />
    </Card>
    <Divider></Divider>
    <Card title="Insider Sell">
    <Area  {...sell_config} />
    </Card>
  */
let $primary = "#7367F0",
  $success = "#28C76F",
  $danger = "#EA5455",
  $warning = "#FF9F43",
  $info = "#00cfe8",
  $label_color_light = "#dae1e7"

let themeColors = [$primary, $success, $danger, $warning, $info]

class ApexCharts extends React.Component {
  state = {
    options: {
      alignLabels: true,
      timeScale: {
        rightOffset: 12,
        barSpacing: 3,
        fixLeftEdge: true,
        lockVisibleTimeRangeOnResize: true,
        rightBarStaysOnScroll: true,
        borderVisible: false,
        borderColor: "#fff000",
        visible: true,
        timeVisible: true,
        secondsVisible: false
      }
    },
    price:0,
    articles: [],
    docs: [],
    buy_value: [],
    sell_value: [],
    top10_buys: [],
    top10_sells: [],
    net_inst_by_date: [],
    top10_inst: [],
    net_inst_value: [],
    wealth_graph: [],
    isPostLoading: true,
    areaSeries:[{data:[]}],
    loading: true
  }
  getShares = (net_inst_by_date) => {
    let net_inst_by_date_shr = []
      for (let i=0;i<net_inst_by_date.length;i++){
          if(net_inst_by_date[i].securitytype==="SHR"){
          net_inst_by_date_shr.push(net_inst_by_date[i]);
        }

      }
      return net_inst_by_date_shr

  }

   renameKey = ( obj, oldKey, newKey ) =>{
    obj[newKey] = obj[oldKey];
    delete obj[oldKey];
  }

  fetchArticles = () => {
    const articleID = this.props.match.params.articleID;
    axios.get(`https://openstreet.io/api/matrix/${articleID}/`)
      .then(res => {
        let arr = JSON.stringify(res.data.wealth_graph);
        arr = arr.split('"date":').join('"time":').split('"performance":').join('"value":')
        let updatedJson = JSON.parse( arr );
        console.log(updatedJson);


        this.setState({
          articles: res.data,
          wealth_graph: (res.data.wealth_graph),
          buy_value: (res.data.buy_value),
          sell_value: (res.data.sell_value),
          top10_buys: (res.data.top10_buys),
          top10_sells: (res.data.top10_sells),
          net_inst_by_date: this.getShares(res.data.net_inst_by_date),
          top10_inst: (res.data.top10_inst),
          net_inst_value: (res.data.net_inst_value),
          loading:false,
        });
        
      });

      axios.get(`https://openstreet.io/api/matrix/?action=prices&ticker=${articleID}`)
      .then(res => {
        console.log(res.data.prices);
        this.setState({ areaSeries: [{data:res.data.prices}],
        price: res.data.last_price});
      });
      
  }
  toggleModal = () => {
    this.setState(prevState => ({
      loading: !prevState.loading
    }));
  }

  componentDidMount() {
    //this.setState({loading: true});
    
    this.fetchArticles();
  }

  //componentDidUpdate(){
  //  if (this.state.buy_value.length !== 0 & this.state.loading === true) {
  //    this.setState({loading: false})
  //  }
  //}
  //<ApexAreaCharts themeColors={themeColors} data={this.state.wealth_graph} second="1" title="Wealth Graph" />
//<AreaCharts themeColors={themeColors} data={this.state.buy_value} columns={'calendardate','value'} title="Insider Buy" />
  render() {
    if (!this.props.token) {
      return <Redirect to="/login" />;
    }

    if (this.state.docs.length === 0 & this.state.isPostLoading === false) {
      this.setState({isPostLoading: true});
    }
    if (this.state.docs.length !== 0 & this.state.isPostLoading === true) {
      this.setState({isPostLoading: false})
    }
    console.log(this.state.areaSeries['data'])

    return (
    <React.Fragment>
       
      { 
        this.state.loading ?
        <div style={{display: 'flex',  justifyContent:'center', alignItems:'center', height: '20vh'}}>
           
        <span><Spinner color="primary" size="sm"/> Loading Stock Research Report </span>
        </div>
        :
        
        <div className="site-card-wrapper">
        
        <Row>
          <Col lg="4" sm="12">
            <Card>
              <CardHeader>
                <CardTitle>
                  {this.state.articles.ticker_name}
                </CardTitle>
              </CardHeader><hr />
              <CardBody>
                <Statistic value={this.state.price} />
              </CardBody>
            </Card>
          </Col>
        </Row>

        <Divider />
       
        <Chart legend="Wealth Graph" options={this.state.options} darkTheme={true} areaSeries={this.state.areaSeries} autoWidth height={320} />
        
        <Divider/>
        
      
       
        <Divider></Divider>
        <Row gutter={16}>
          <Col lg="4" sm="12">
            <Card>
              <CardBody>
                <GoalOverview strokeColor="#b9c3cd" success="#28C76F" title="Company Health" percent={this.state.articles.company_health} />
                <Divider />
                <Row gutter={20}>
                  <Col span={12}>
                    <p>5 Yr Revenue Growth (%)</p>
                    <Statistic value={this.state.articles.rev_growth} />
                  </Col>

                  <Col span={12}>
                    <p>Revenue Growth Uncertainty (%)</p>
                    <Statistic value={this.state.articles.rev_uncertainty} />
                  </Col>
                  <Divider />
                  <Col span={12}>
                    <p>5 Yr Average Profit Margin (%)</p>
                    <Statistic value={this.state.articles.profit_margin} />
                  </Col>
                  <Col span={12}>
                    <p>5 Yr Average Market Share Growth (%)</p>
                    <Statistic value={this.state.articles.market_share_growth} />
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
          <Col lg="4" sm="12">
            <Card><CardBody>
            <GoalOverview  strokeColor="#b9c3cd" success="#28C76F" title="Company Yield" percent={this.state.articles.company_yield} />
              <Divider />
              <Row gutter={20}>
                <Col span={12}>
                  <p>5 Yr Average Dividend Yield (%)</p>
                  <Statistic value={this.state.articles.dividend_yield} />
                </Col>

                <Col span={12}>
                  <p>5 Yr Average Earnings Yield (%)</p>
                  <Statistic value={this.state.articles.earnings_yield} />
                </Col>
                <Divider />
                <Col span={12}>
                  <p>5 Yr Average Payout Ratio (%)</p>
                  <Statistic value={this.state.articles.payout_ratio} />
                </Col>
                <Col span={12}>
                  <p>5 Yr Average Free Cash Flow ($bn)</p>
                  <Statistic value={this.state.articles.free_cash_flow} />
                </Col>
              </Row>
              </CardBody></Card>
          </Col>
          <Col lg="4" sm="12">
            <Card><CardBody>
            <GoalOverview strokeColor="#b9c3cd" success="#28C76F" title="Company Quality" percent={this.state.articles.company_quality} />
            <Divider />
            <Row gutter={20}>
              <Col span={12}>
                <p>5 Yr Average Debt/Equity</p>
                <Statistic value={this.state.articles.debt_to_equity} />
              </Col>

              <Col span={12}>
                <p>5 Yr Average Return on Invested Capital (%)</p>
                <Statistic  value={this.state.articles.return_on_invested_capital} />
              </Col>
              <Divider />
              <Col span={12}>
                <p>5 Yr Average Growth in ROE (%)</p>
                <Statistic  value={this.state.articles.roe_growth} />
              </Col>
              <Col span={12}>
                <p>ROE Growth Uncertainty (%)</p>
                <Statistic value={this.state.articles.roe_uncertainty} />
              </Col>
            </Row>
            </CardBody></Card>
          </Col>
        </Row>
        <Divider></Divider>
        <Row gutter={16}>
          <Col lg="4" sm="12">
            <Card>
              <CardHeader>
                <CardTitle>
                  Fair Value
                </CardTitle>
              </CardHeader>
              <CardBody>
                <p>Fair Value Rating ( / 20)</p>
              <Statistic value={this.state.articles.fair_value_score} />
              <Divider></Divider>
              <Row gutter={20}>
                <Col span={12}>
                  <p>Fair Value by Dividend Discount Model ($)</p>
                  <Statistic value={this.state.articles.fair_value_ddm} />
                </Col>

                <Col span={12}>
                  <p>Fair Value by Free Cash Flow Model ($)</p>
                  <Statistic value={this.state.articles.fair_value_fcf} />
                </Col>
              </Row>
              </CardBody>
            </Card>
          </Col>
          <Col lg="4" sm="12">
            <Card>
              <CardHeader>
                <CardTitle>
                  Industry Rank: {this.state.articles.industry}
                </CardTitle>
              </CardHeader>
              <CardBody>
              <Statistic value={this.state.articles.industry_rank} />
              <Divider />
              <Row gutter={20}>
                <Col span={12}>
                  <p>Profitability Rank</p>
                  <Statistic  value={this.state.articles.profitability_rank} />
                </Col>

                <Col span={12}>
                  <p>Value Rank</p>
                  <Statistic value={this.state.articles.value_rank} />
                </Col>
                <Divider />
                <Col span={24}>
                  <p>Quality Rank</p>
                  <Statistic value={this.state.articles.quality_rank} />
                </Col>
              </Row>
              </CardBody>
            </Card>
          </Col>
          <Col lg="4" sm="12">
            <Card>
              <CardHeader>
                <CardTitle>Market Risk</CardTitle>
              </CardHeader>
              <CardBody>
                <p>Risk Rating ( / 30)</p>
              <Statistic value={this.state.articles.risk_score} />
              <Divider />
              <Row gutter={20}>
                <Col span={12}>
                  <p>Annualized Volatility (%)</p>
                  <Statistic value={this.state.articles.vol} />
                </Col>
                <Col span={12}>
                  <p>Max Drawdown (%)</p>
                  <Statistic value={this.state.articles.max_drawdown} />
                </Col>
                <Divider />
                <Col span={24}>
                  <p>Correlation with Market</p>
                  <Statistic value={this.state.articles.correl} />
                </Col>
              </Row>
              </CardBody>
            </Card>
          </Col>

          <Divider />
          <Col sm="5" lg="3">
            <Card>
              <CardHeader>
                <CardTitle>Insider Rating</CardTitle>
              </CardHeader>
              <CardBody>
              <GoalOverview strokeColor="#b9c3cd" success="#28C76F" percent={this.state.articles.net_value_executed_pct} />
              </CardBody>
            </Card>
          </Col>
          <Divider></Divider>
          <Col sm="12" lg="5">
          <AreaCharts themeColors={themeColors} data={this.state.buy_value} columns={'calendardate','value'} title="Insider Buy" />

          
          </Col>

          <Col sm="12" lg="7">
            <Card>
              <CardHeader>
                <CardTitle>
                  Top 10 Insider Trades Buy
                </CardTitle>
              </CardHeader>
              <CardBody>
              <DataTable data={this.state.top10_buys}
                columns={columns} scroll={{ x: 1500 }} noHeader
              /></CardBody>
              </Card>
          </Col>

          <Divider />
          <Col sm="12" lg="5">
            <AreaCharts themeColors={themeColors} data={this.state.sell_value} title="Insider Sell" />
          </Col>

          <Col sm="12" lg="7">
            <Card>
              <CardHeader>
                <CardTitle>Top 10 Insider Trades Sell</CardTitle>
              </CardHeader>
              <CardBody>
              <DataTable data={this.state.top10_sells}
                columns={columns} scroll={{ x: 1500 }} noHeader
              />
              </CardBody>
              </Card>
          </Col>
          <Divider></Divider>
            <Col sm="5" lg="3">
            <Card>
              <CardHeader>
                <CardTitle>Institutional Rating</CardTitle>
              </CardHeader>
              <CardBody>
              <GoalOverview strokeColor="#b9c3cd" success="#28C76F" percent={this.state.articles.net_holding_pct} />
              </CardBody>
            </Card>
          </Col>


      <Divider />
      <Col sm="12" lg="7">
    <Card title="Net Institutional Holdings">
    <CardHeader>
                <CardTitle>Net Institutional Holdings</CardTitle>
              </CardHeader>
              <CardBody>
      <DataTable  data= {this.state.net_inst_value}
      columns={net_inst_columns} scroll={{ x: 100 }} noHeader
 /></CardBody></Card>
    </Col>
    <Col sm="12" lg="5">
    <AreaCharts1 themeColors={themeColors} data={this.state.net_inst_by_date} title="Net Institutional Share Holdings by Date" />
    </Col>
    <Divider />
    <Col sm="20" lg="10">
    <Card>
            <CardHeader>
                <CardTitle>Top 10 Institutional Holdings</CardTitle>
              </CardHeader>
      <CardBody>
      <DataTable  data= {this.state.top10_inst}
      columns={inst_columns} scroll={{ x: 1500 }} noHeader
 /></CardBody></Card>
 </Col>
        </Row>

      </div>
      
        }
      
        
        
        
    </React.Fragment>
    );
  }

}

const mapStatetoProps = state => {
  return {
    token: state.auth.token
  }
}


export default connect(mapStatetoProps)(ApexCharts);
