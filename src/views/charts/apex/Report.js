import React from 'react';
import { Table, Divider, Statistic, Progress } from 'antd';
import {
  Card,
  CardImg,
  Container,
  Col,
  Row,
  CardHeader,
  CardTitle,
  CardBody,
  Spinner,

} from "reactstrap"
import { List } from "antd";
import * as Icon from 'react-feather';
import axios from "axios";
import GoalOverview from "../../ui-elements/data-list/Percent"
import ApexAreaCharts from "./ApexAreaCharts"
import AreaCharts from "./AreaCharts"
import AreaCharts1 from "./AreaCharts1"
import DataTable from "react-data-table-component"
const isoCountries = {
  'AF' : 'Afghanistan',
  'AX' : 'Aland Islands',
  'AL' : 'Albania',
  'DZ' : 'Algeria',
  'AS' : 'American Samoa',
  'AD' : 'Andorra',
  'AO' : 'Angola',
  'AI' : 'Anguilla',
  'AQ' : 'Antarctica',
  'AG' : 'Antigua And Barbuda',
  'AR' : 'Argentina',
  'AM' : 'Armenia',
  'AW' : 'Aruba',
  'AU' : 'Australia',
  'AT' : 'Austria',
  'AZ' : 'Azerbaijan',
  'BS' : 'Bahamas',
  'BH' : 'Bahrain',
  'BD' : 'Bangladesh',
  'BB' : 'Barbados',
  'BY' : 'Belarus',
  'BE' : 'Belgium',
  'BZ' : 'Belize',
  'BJ' : 'Benin',
  'BM' : 'Bermuda',
  'BT' : 'Bhutan',
  'BO' : 'Bolivia',
  'BA' : 'Bosnia And Herzegovina',
  'BW' : 'Botswana',
  'BV' : 'Bouvet Island',
  'BR' : 'Brazil',
  'IO' : 'British Indian Ocean Territory',
  'BN' : 'Brunei Darussalam',
  'BG' : 'Bulgaria',
  'BF' : 'Burkina Faso',
  'BI' : 'Burundi',
  'KH' : 'Cambodia',
  'CM' : 'Cameroon',
  'CA' : 'Canada',
  'CV' : 'Cape Verde',
  'KY' : 'Cayman Islands',
  'CF' : 'Central African Republic',
  'TD' : 'Chad',
  'CL' : 'Chile',
  'CN' : 'China',
  'CX' : 'Christmas Island',
  'CC' : 'Cocos (Keeling) Islands',
  'CO' : 'Colombia',
  'KM' : 'Comoros',
  'CG' : 'Congo',
  'CD' : 'Congo, Democratic Republic',
  'CK' : 'Cook Islands',
  'CR' : 'Costa Rica',
  'CI' : 'Cote D\'Ivoire',
  'HR' : 'Croatia',
  'CU' : 'Cuba',
  'CY' : 'Cyprus',
  'CZ' : 'Czech Republic',
  'DK' : 'Denmark',
  'DJ' : 'Djibouti',
  'DM' : 'Dominica',
  'DO' : 'Dominican Republic',
  'EC' : 'Ecuador',
  'EG' : 'Egypt',
  'SV' : 'El Salvador',
  'GQ' : 'Equatorial Guinea',
  'ER' : 'Eritrea',
  'EE' : 'Estonia',
  'ET' : 'Ethiopia',
  'FK' : 'Falkland Islands (Malvinas)',
  'FO' : 'Faroe Islands',
  'FJ' : 'Fiji',
  'FI' : 'Finland',
  'FR' : 'France',
  'GF' : 'French Guiana',
  'PF' : 'French Polynesia',
  'TF' : 'French Southern Territories',
  'GA' : 'Gabon',
  'GM' : 'Gambia',
  'GE' : 'Georgia',
  'DE' : 'Germany',
  'GH' : 'Ghana',
  'GI' : 'Gibraltar',
  'GR' : 'Greece',
  'GL' : 'Greenland',
  'GD' : 'Grenada',
  'GP' : 'Guadeloupe',
  'GU' : 'Guam',
  'GT' : 'Guatemala',
  'GG' : 'Guernsey',
  'GN' : 'Guinea',
  'GW' : 'Guinea-Bissau',
  'GY' : 'Guyana',
  'HT' : 'Haiti',
  'HM' : 'Heard Island & Mcdonald Islands',
  'VA' : 'Holy See (Vatican City State)',
  'HN' : 'Honduras',
  'HK' : 'Hong Kong',
  'HU' : 'Hungary',
  'IS' : 'Iceland',
  'IN' : 'India',
  'ID' : 'Indonesia',
  'IR' : 'Iran, Islamic Republic Of',
  'IQ' : 'Iraq',
  'IE' : 'Ireland',
  'IM' : 'Isle Of Man',
  'IL' : 'Israel',
  'IT' : 'Italy',
  'JM' : 'Jamaica',
  'JP' : 'Japan',
  'JE' : 'Jersey',
  'JO' : 'Jordan',
  'KZ' : 'Kazakhstan',
  'KE' : 'Kenya',
  'KI' : 'Kiribati',
  'KR' : 'Korea',
  'KW' : 'Kuwait',
  'KG' : 'Kyrgyzstan',
  'LA' : 'Lao People\'s Democratic Republic',
  'LV' : 'Latvia',
  'LB' : 'Lebanon',
  'LS' : 'Lesotho',
  'LR' : 'Liberia',
  'LY' : 'Libyan Arab Jamahiriya',
  'LI' : 'Liechtenstein',
  'LT' : 'Lithuania',
  'LU' : 'Luxembourg',
  'MO' : 'Macao',
  'MK' : 'Macedonia',
  'MG' : 'Madagascar',
  'MW' : 'Malawi',
  'MY' : 'Malaysia',
  'MV' : 'Maldives',
  'ML' : 'Mali',
  'MT' : 'Malta',
  'MH' : 'Marshall Islands',
  'MQ' : 'Martinique',
  'MR' : 'Mauritania',
  'MU' : 'Mauritius',
  'YT' : 'Mayotte',
  'MX' : 'Mexico',
  'FM' : 'Micronesia, Federated States Of',
  'MD' : 'Moldova',
  'MC' : 'Monaco',
  'MN' : 'Mongolia',
  'ME' : 'Montenegro',
  'MS' : 'Montserrat',
  'MA' : 'Morocco',
  'MZ' : 'Mozambique',
  'MM' : 'Myanmar',
  'NA' : 'Namibia',
  'NR' : 'Nauru',
  'NP' : 'Nepal',
  'NL' : 'Netherlands',
  'AN' : 'Netherlands Antilles',
  'NC' : 'New Caledonia',
  'NZ' : 'New Zealand',
  'NI' : 'Nicaragua',
  'NE' : 'Niger',
  'NG' : 'Nigeria',
  'NU' : 'Niue',
  'NF' : 'Norfolk Island',
  'MP' : 'Northern Mariana Islands',
  'NO' : 'Norway',
  'OM' : 'Oman',
  'PK' : 'Pakistan',
  'PW' : 'Palau',
  'PS' : 'Palestinian Territory, Occupied',
  'PA' : 'Panama',
  'PG' : 'Papua New Guinea',
  'PY' : 'Paraguay',
  'PE' : 'Peru',
  'PH' : 'Philippines',
  'PN' : 'Pitcairn',
  'PL' : 'Poland',
  'PT' : 'Portugal',
  'PR' : 'Puerto Rico',
  'QA' : 'Qatar',
  'RE' : 'Reunion',
  'RO' : 'Romania',
  'RU' : 'Russian Federation',
  'RW' : 'Rwanda',
  'BL' : 'Saint Barthelemy',
  'SH' : 'Saint Helena',
  'KN' : 'Saint Kitts And Nevis',
  'LC' : 'Saint Lucia',
  'MF' : 'Saint Martin',
  'PM' : 'Saint Pierre And Miquelon',
  'VC' : 'Saint Vincent And Grenadines',
  'WS' : 'Samoa',
  'SM' : 'San Marino',
  'ST' : 'Sao Tome And Principe',
  'SA' : 'Saudi Arabia',
  'SN' : 'Senegal',
  'RS' : 'Serbia',
  'SC' : 'Seychelles',
  'SL' : 'Sierra Leone',
  'SG' : 'Singapore',
  'SK' : 'Slovakia',
  'SI' : 'Slovenia',
  'SB' : 'Solomon Islands',
  'SO' : 'Somalia',
  'ZA' : 'South Africa',
  'GS' : 'South Georgia And Sandwich Isl.',
  'ES' : 'Spain',
  'LK' : 'Sri Lanka',
  'SD' : 'Sudan',
  'SR' : 'Suriname',
  'SJ' : 'Svalbard And Jan Mayen',
  'SZ' : 'Swaziland',
  'SE' : 'Sweden',
  'CH' : 'Switzerland',
  'SY' : 'Syrian Arab Republic',
  'TW' : 'Taiwan',
  'TJ' : 'Tajikistan',
  'TZ' : 'Tanzania',
  'TH' : 'Thailand',
  'TL' : 'Timor-Leste',
  'TG' : 'Togo',
  'TK' : 'Tokelau',
  'TO' : 'Tonga',
  'TT' : 'Trinidad And Tobago',
  'TN' : 'Tunisia',
  'TR' : 'Turkey',
  'TM' : 'Turkmenistan',
  'TC' : 'Turks And Caicos Islands',
  'TV' : 'Tuvalu',
  'UG' : 'Uganda',
  'UA' : 'Ukraine',
  'AE' : 'United Arab Emirates',
  'GB' : 'United Kingdom',
  'US' : 'United States',
  'UM' : 'United States Outlying Islands',
  'UY' : 'Uruguay',
  'UZ' : 'Uzbekistan',
  'VU' : 'Vanuatu',
  'VE' : 'Venezuela',
  'VN' : 'Viet Nam',
  'VG' : 'Virgin Islands, British',
  'VI' : 'Virgin Islands, U.S.',
  'WF' : 'Wallis And Futuna',
  'EH' : 'Western Sahara',
  'YE' : 'Yemen',
  'ZM' : 'Zambia',
  'ZW' : 'Zimbabwe'
};

const getCountryName = (countryCode) => {
  if (isoCountries.hasOwnProperty(countryCode)) {
      return isoCountries[countryCode];
  } else {
      return countryCode;
  }
}
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
class Report extends React.Component {
  state = {
    docs: [],
  }
  fetchPosts = (props) => {
    let today = new Date();
    today.setDate(today.getDate() - 200);
    today = today.toISOString().slice(0, 10);
    axios.get(`http://api.datanews.io/v1/news?source=wsj.com&size=100&apiKey=08qu938b4y5v8dem2w521v76v&q=${encodeURI(props.data.ticker_name)}&from=${today}&sortBy=date&language=en&country=US`)
    .then(res => {
      let sorted = res.data['hits']
      this.setState({...this.state, docs: sorted });
      console.log(this.state.docs)
    });
  }

  

  componentWillReceiveProps(newProps) {
    this.fetchPosts(newProps);
    
  }
  render() {
    console.log(this.props.data);
    return (

      <div className="site-card-wrapper">
        
        <Row>
          <Col lg="4" sm="12">
            <Card>
              <CardHeader>
                <CardTitle>
                  {this.props.data.ticker_name}
                </CardTitle>
              </CardHeader><hr />
              <CardBody>
                <Statistic value={this.props.data.price} />
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Divider />
        <ApexAreaCharts themeColors={themeColors} data={this.props.wealth_graph} second="1" title="Wealth Graph" />
        <Divider></Divider>
        <Row gutter={16}>
          <Col lg="4" sm="12">
            <Card>
              <CardBody>
                <GoalOverview strokeColor="#b9c3cd" success="#28C76F" title="Company Health" percent={this.props.data.company_health} />
                <Divider />
                <Row gutter={20}>
                  <Col span={12}>
                    <p>5 Yr Revenue Growth (%)</p>
                    <Statistic value={this.props.data.rev_growth} />
                  </Col>

                  <Col span={12}>
                    <p>Revenue Growth Uncertainty (%)</p>
                    <Statistic value={this.props.data.rev_uncertainty} />
                  </Col>
                  <Divider />
                  <Col span={12}>
                    <p>5 Yr Average Profit Margin (%)</p>
                    <Statistic value={this.props.data.profit_margin} />
                  </Col>
                  <Col span={12}>
                    <p>5 Yr Average Market Share Growth (%)</p>
                    <Statistic value={this.props.data.market_share_growth} />
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
          <Col lg="4" sm="12">
            <Card><CardBody>
            <GoalOverview  strokeColor="#b9c3cd" success="#28C76F" title="Company Yield" percent={this.props.data.company_yield} />
              <Divider />
              <Row gutter={20}>
                <Col span={12}>
                  <p>5 Yr Average Dividend Yield (%)</p>
                  <Statistic value={this.props.data.dividend_yield} />
                </Col>

                <Col span={12}>
                  <p>5 Yr Average Earnings Yield (%)</p>
                  <Statistic value={this.props.data.earnings_yield} />
                </Col>
                <Divider />
                <Col span={12}>
                  <p>5 Yr Average Payout Ratio (%)</p>
                  <Statistic value={this.props.data.payout_ratio} />
                </Col>
                <Col span={12}>
                  <p>5 Yr Average Free Cash Flow ($bn)</p>
                  <Statistic value={this.props.data.free_cash_flow} />
                </Col>
              </Row>
              </CardBody></Card>
          </Col>
          <Col lg="4" sm="12">
            <Card><CardBody>
            <GoalOverview strokeColor="#b9c3cd" success="#28C76F" title="Company Quality" percent={this.props.data.company_quality} />
            <Divider />
            <Row gutter={20}>
              <Col span={12}>
                <p>5 Yr Average Debt/Equity (%)</p>
                <Statistic value={this.props.data.debt_to_equity} />
              </Col>

              <Col span={12}>
                <p>5 Yr Average Return on Invested Capital (%)</p>
                <Statistic  value={this.props.data.return_on_invested_capital} />
              </Col>
              <Divider />
              <Col span={12}>
                <p>5 Yr Average Growth in ROE (%)</p>
                <Statistic  value={this.props.data.roe_growth} />
              </Col>
              <Col span={12}>
                <p>ROE Growth Uncertainty (%)</p>
                <Statistic value={this.props.data.roe_uncertainty} />
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
              <Statistic value={this.props.data.fair_value_score} />
              <Divider></Divider>
              <Row gutter={20}>
                <Col span={12}>
                  <p>Fair Value by Dividend Discount Model ($)</p>
                  <Statistic value={this.props.data.fair_value_ddm} />
                </Col>

                <Col span={12}>
                  <p>Fair Value by Dividend Discount Model ($)</p>
                  <Statistic value={this.props.data.fair_value_fcf} />
                </Col>
              </Row>
              </CardBody>
            </Card>
          </Col>
          <Col lg="4" sm="12">
            <Card>
              <CardHeader>
                <CardTitle>
                  Industry Rank
                </CardTitle>
              </CardHeader>
              <CardBody>
              <Statistic value={this.props.data.industry_rank} />
              <Divider />
              <Row gutter={20}>
                <Col span={12}>
                  <p>Profitability Rank</p>
                  <Statistic  value={this.props.data.profitability_rank} />
                </Col>

                <Col span={12}>
                  <p>Value Rank</p>
                  <Statistic value={this.props.data.value_rank} />
                </Col>
                <Divider />
                <Col span={24}>
                  <p>Quality Rank</p>
                  <Statistic value={this.props.data.quality_rank} />
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
              <Statistic value={this.props.data.risk_score} />
              <Divider />
              <Row gutter={20}>
                <Col span={12}>
                  <p>Annualized Volatility (%)</p>
                  <Statistic value={this.props.data.vol} />
                </Col>
                <Col span={12}>
                  <p>Max Drawdown (%)</p>
                  <Statistic value={this.props.data.max_drawdown} />
                </Col>
                <Divider />
                <Col span={24}>
                  <p>Correlation with Market</p>
                  <Statistic value={this.props.data.correl} />
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
              <GoalOverview strokeColor="#b9c3cd" success="#28C76F" percent={this.props.data.net_value_executed_pct} />
              </CardBody>
            </Card>
          </Col>
          <Divider></Divider>
          <Col sm="12" lg="5">
            <AreaCharts themeColors={themeColors} data={this.props.buy_value} columns={'calendardate','value'} title="Insider Buy" />
          </Col>

          <Col sm="12" lg="7">
            <Card>
              <CardHeader>
                <CardTitle>
                  Top 10 Insider Trades Buy
                </CardTitle>
              </CardHeader>
              <CardBody>
              <DataTable data={this.props.top10_buys}
                columns={columns} scroll={{ x: 1500 }} noHeader
              /></CardBody>
              </Card>
          </Col>

          <Divider />
          <Col sm="12" lg="5">
            <AreaCharts themeColors={themeColors} data={this.props.sell_value} title="Insider Sell" />
          </Col>

          <Col sm="12" lg="7">
            <Card>
              <CardHeader>
                <CardTitle>Top 10 Insider Trades Sell</CardTitle>
              </CardHeader>
              <CardBody>
              <DataTable data={this.props.top10_sells}
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
              <GoalOverview strokeColor="#b9c3cd" success="#28C76F" percent={this.props.data.net_holding_pct} />
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
      <DataTable  data= {this.props.net_inst_value}
      columns={net_inst_columns} scroll={{ x: 100 }} noHeader
 /></CardBody></Card>
    </Col>
    <Col sm="12" lg="5">
    <AreaCharts1 themeColors={themeColors} data={this.props.net_inst_by_date} title="Net Institutional Share Holdings by Date" />
    </Col>
    <Divider />
    <Col sm="20" lg="10">
    <Card>
            <CardHeader>
                <CardTitle>Top 10 Institutional Holdings</CardTitle>
              </CardHeader>
      <CardBody>
      <DataTable  data= {this.props.top10_inst}
      columns={inst_columns} scroll={{ x: 1500 }} noHeader
 /></CardBody></Card>
 </Col>
        </Row>

      </div>

    );
  }
}


export default Report;
