import React, { useState } from "react";
import Checkbox from "../../../components/@vuexy/checkbox/CheckboxesVuexy"
import { Check } from "react-feather"
import TradingViewWidget, { Themes } from 'react-tradingview-widget';
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
import { List,Divider, Select } from 'antd';
import * as Icon from 'react-feather';
import Tour, { STATUS } from "react-joyride"
import "../../../assets/scss/plugins/extensions/react-tour.scss"
import "../../../../node_modules/video-react/dist/video-react.css";
import risk_averse from "../../../assets/img/elements/risk_averse.png";
import yield_seeker from "../../../assets/img/elements/shutterstock_1866835708-removebg-preview.png";
import value from "../../../assets/img/elements/value_seeker.png";
import all_star from "../../../assets/img/elements/all_star.png";


const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
const candlestick_patterns = {
  'CDL2CROWS':'Two Crows',
  'CDL3BLACKCROWS':'Three Black Crows',
  'CDL3INSIDE':'Three Inside Up/Down',
  'CDL3LINESTRIKE':'Three-Line Strike',
  'CDL3OUTSIDE':'Three Outside Up/Down',
  'CDL3STARSINSOUTH':'Three Stars In The South',
  'CDL3WHITESOLDIERS':'Three Advancing White Soldiers',
  'CDLABANDONEDBABY':'Abandoned Baby',
  'CDLADVANCEBLOCK':'Advance Block',
  'CDLBELTHOLD':'Belt-hold',
  'CDLBREAKAWAY':'Breakaway',
  'CDLCLOSINGMARUBOZU':'Closing Marubozu',
  'CDLCONCEALBABYSWALL':'Concealing Baby Swallow',
  'CDLCOUNTERATTACK':'Counterattack',
  'CDLDARKCLOUDCOVER':'Dark Cloud Cover',
  'CDLDOJI':'Doji',
  'CDLDOJISTAR':'Doji Star',
  'CDLDRAGONFLYDOJI':'Dragonfly Doji',
  'CDLENGULFING':'Engulfing Pattern',
  'CDLEVENINGDOJISTAR':'Evening Doji Star',
  'CDLEVENINGSTAR':'Evening Star',
  'CDLGAPSIDESIDEWHITE':'Up/Down-gap side-by-side white lines',
  'CDLGRAVESTONEDOJI':'Gravestone Doji',
  'CDLHAMMER':'Hammer',
  'CDLHANGINGMAN':'Hanging Man',
  'CDLHARAMI':'Harami Pattern',
  'CDLHARAMICROSS':'Harami Cross Pattern',
  'CDLHIGHWAVE':'High-Wave Candle',
  'CDLHIKKAKE':'Hikkake Pattern',
  'CDLHIKKAKEMOD':'Modified Hikkake Pattern',
  'CDLHOMINGPIGEON':'Homing Pigeon',
  'CDLIDENTICAL3CROWS':'Identical Three Crows',
  'CDLINNECK':'In-Neck Pattern',
  'CDLINVERTEDHAMMER':'Inverted Hammer',
  'CDLKICKING':'Kicking',
  'CDLKICKINGBYLENGTH':'Kicking - bull/bear determined by the longer marubozu',
  'CDLLADDERBOTTOM':'Ladder Bottom',
  'CDLLONGLEGGEDDOJI':'Long Legged Doji',
  'CDLLONGLINE':'Long Line Candle',
  'CDLMARUBOZU':'Marubozu',
  'CDLMATCHINGLOW':'Matching Low',
  'CDLMATHOLD':'Mat Hold',
  'CDLMORNINGDOJISTAR':'Morning Doji Star',
  'CDLMORNINGSTAR':'Morning Star',
  'CDLONNECK':'On-Neck Pattern',
  'CDLPIERCING':'Piercing Pattern',
  'CDLRICKSHAWMAN':'Rickshaw Man',
  'CDLRISEFALL3METHODS':'Rising/Falling Three Methods',
  'CDLSEPARATINGLINES':'Separating Lines',
  'CDLSHOOTINGSTAR':'Shooting Star',
  'CDLSHORTLINE':'Short Line Candle',
  'CDLSPINNINGTOP':'Spinning Top',
  'CDLSTALLEDPATTERN':'Stalled Pattern',
  'CDLSTICKSANDWICH':'Stick Sandwich',
  'CDLTAKURI':'Takuri (Dragonfly Doji with very long lower shadow)',
  'CDLTASUKIGAP':'Tasuki Gap',
  'CDLTHRUSTING':'Thrusting Pattern',
  'CDLTRISTAR':'Tristar Pattern',
  'CDLUNIQUE3RIVER':'Unique 3 River',
  'CDLUPSIDEGAP2CROWS':'Upside Gap Two Crows',
  'CDLXSIDEGAP3METHODS':'Upside/Downside Gap Three Methods'
}

const symbols = {'MMM': '3M Company',
 'ABT': 'Abbott Laboratories',
 'ABBV': 'AbbVie Inc.',
 'ABMD': 'ABIOMED Inc',
 'ACN': 'Accenture plc',
 'ATVI': 'Activision Blizzard',
 'ADBE': 'Adobe Systems Inc',
 'AMD': 'Advanced Micro Devices Inc',
 'AAP': 'Advance Auto Parts',
 'AES': 'AES Corp',
 'AFL': 'AFLAC Inc',
 'A': 'Agilent Technologies Inc',
 'APD': 'Air Products & Chemicals Inc',
 'AKAM': 'Akamai Technologies Inc',
 'ALK': 'Alaska Air Group Inc',
 'ALB': 'Albemarle Corp',
 'ARE': 'Alexandria Real Estate Equities',
 'ALXN': 'Alexion Pharmaceuticals',
 'ALGN': 'Align Technology',
 'ALLE': 'Allegion',
 'AGN': 'Allergan, plc',
 'ADS': 'Alliance Data Systems',
 'LNT': 'Alliant Energy Corp',
 'ALL': 'Allstate Corp',
 'GOOGL': 'Alphabet Inc Class A',
 'GOOG': 'Alphabet Inc Class C',
 'MO': 'Altria Group Inc',
 'AMZN': 'Amazon.com Inc.',
 'AMCR': 'Amcor plc',
 'AEE': 'Ameren Corp',
 'AAL': 'American Airlines Group',
 'AEP': 'American Electric Power',
 'AXP': 'American Express Co',
 'AIG': 'American International Group',
 'AMT': 'American Tower Corp.',
 'AWK': 'American Water Works Company Inc',
 'AMP': 'Ameriprise Financial',
 'ABC': 'AmerisourceBergen Corp',
 'AME': 'AMETEK Inc.',
 'AMGN': 'Amgen Inc.',
 'APH': 'Amphenol Corp',
 'ADI': 'Analog Devices, Inc.',
 'ANSS': 'ANSYS',
 'ANTM': 'Anthem',
 'AON': 'Aon plc',
 'AOS': 'A.O. Smith Corp',
 'APA': 'Apache Corporation',
 'AIV': 'Apartment Investment & Management',
 'AAPL': 'Apple Inc.',
 'AMAT': 'Applied Materials Inc.',
 'APTV': 'Aptiv PLC',
 'ADM': 'Archer-Daniels-Midland Co',
 'ARNC': 'Arconic Inc.',
 'ANET': 'Arista Networks',
 'AJG': 'Arthur J. Gallagher & Co.',
 'AIZ': 'Assurant',
 'ATO': 'Atmos Energy Corp',
 'T': 'AT&T Inc.',
 'ADSK': 'Autodesk Inc.',
 'ADP': 'Automatic Data Processing',
 'AZO': 'AutoZone Inc',
 'AVB': 'AvalonBay Communities, Inc.',
 'AVY': 'Avery Dennison Corp',
 'BKR': 'Baker Hughes Co',
 'BLL': 'Ball Corp',
 'BAC': 'Bank of America Corp',
 'BK': 'The Bank of New York Mellon Corp.',
 'BAX': 'Baxter International Inc.',
 'BDX': 'Becton Dickinson',
 'BRK.B': 'Berkshire Hathaway',
 'BBY': 'Best Buy Co. Inc.',
 'BIIB': 'Biogen Inc.',
 'BLK': 'BlackRock',
 'BA': 'Boeing Company',
 'BKNG': 'Booking Holdings Inc',
 'BWA': 'BorgWarner',
 'BXP': 'Boston Properties',
 'BSX': 'Boston Scientific',
 'BMY': 'Bristol-Myers Squibb',
 'AVGO': 'Broadcom Inc.',
 'BR': 'Broadridge Financial Solutions',
 'BF.B': 'Brown-Forman Corp.',
 'CHRW': 'C. H. Robinson Worldwide',
 'COG': 'Cabot Oil & Gas',
 'CDNS': 'Cadence Design Systems',
 'CPB': 'Campbell Soup',
 'COF': 'Capital One Financial',
 'CPRI': 'Capri Holdings',
 'CAH': 'Cardinal Health Inc.',
 'KMX': 'Carmax Inc',
 'CCL': 'Carnival Corp.',
 'CAT': 'Caterpillar Inc.',
 'CBOE': 'Cboe Global Markets',
 'CBRE': 'CBRE Group',
 'CDW': 'CDW',
 'CE': 'Celanese',
 'CNC': 'Centene Corporation',
 'CNP': 'CenterPoint Energy',
 'CTL': 'CenturyLink Inc',
 'CERN': 'Cerner',
 'CF': 'CF Industries Holdings Inc',
 'SCHW': 'Charles Schwab Corporation',
 'CHTR': 'Charter Communications',
 'CVX': 'Chevron Corp.',
 'CMG': 'Chipotle Mexican Grill',
 'CB': 'Chubb Limited',
 'CHD': 'Church & Dwight',
 'CI': 'CIGNA Corp.',
 'XEC': 'Cimarex Energy',
 'CINF': 'Cincinnati Financial',
 'CTAS': 'Cintas Corporation',
 'CSCO': 'Cisco Systems',
 'C': 'Citigroup Inc.',
 'CFG': 'Citizens Financial Group',
 'CTXS': 'Citrix Systems',
 'CLX': 'The Clorox Company',
 'CME': 'CME Group Inc.',
 'CMS': 'CMS Energy',
 'KO': 'Coca-Cola Company',
 'CTSH': 'Cognizant Technology Solutions',
 'CL': 'Colgate-Palmolive',
 'CMCSA': 'Comcast Corp.',
 'CMA': 'Comerica Inc.',
 'CAG': 'Conagra Brands',
 'CXO': 'Concho Resources',
 'COP': 'ConocoPhillips',
 'ED': 'Consolidated Edison',
 'STZ': 'Constellation Brands',
 'COO': 'The Cooper Companies',
 'CPRT': 'Copart Inc',
 'GLW': 'Corning Inc.',
 'CTVA': 'Corteva',
 'COST': 'Costco Wholesale Corp.',
 'COTY': 'Coty, Inc',
 'CCI': 'Crown Castle International Corp.',
 'CSX': 'CSX Corp.',
 'CMI': 'Cummins Inc.',
 'CVS': 'CVS Health',
 'DHI': 'D. R. Horton',
 'DHR': 'Danaher Corp.',
 'DRI': 'Darden Restaurants',
 'DVA': 'DaVita Inc.',
 'DE': 'Deere & Co.',
 'DAL': 'Delta Air Lines Inc.',
 'XRAY': 'Dentsply Sirona',
 'DVN': 'Devon Energy',
 'FANG': 'Diamondback Energy',
 'DLR': 'Digital Realty Trust Inc',
 'DFS': 'Discover Financial Services',
 'DISCA': 'Discovery Inc. Class A',
 'DISCK': 'Discovery Inc. Class C',
 'DISH': 'Dish Network',
 'DG': 'Dollar General',
 'DLTR': 'Dollar Tree',
 'D': 'Dominion Energy',
 'DOV': 'Dover Corp.',
 'DOW': 'Dow Inc.',
 'DTE': 'DTE Energy Co.',
 'DUK': 'Duke Energy',
 'DRE': 'Duke Realty Corp',
 'DD': 'DuPont de Nemours Inc',
 'DXC': 'DXC Technology',
 'ETFC': 'E*Trade',
 'EMN': 'Eastman Chemical',
 'ETN': 'Eaton Corporation',
 'EBAY': 'eBay Inc.',
 'ECL': 'Ecolab Inc.',
 'EIX': "Edison Int'l",
 'EW': 'Edwards Lifesciences',
 'EA': 'Electronic Arts',
 'EMR': 'Emerson Electric Company',
 'ETR': 'Entergy Corp.',
 'EOG': 'EOG Resources',
 'EFX': 'Equifax Inc.',
 'EQIX': 'Equinix',
 'EQR': 'Equity Residential',
 'ESS': 'Essex Property Trust, Inc.',
 'EL': 'Estee Lauder Cos.',
 'EVRG': 'Evergy',
 'ES': 'Eversource Energy',
 'RE': 'Everest Re Group Ltd.',
 'EXC': 'Exelon Corp.',
 'EXPE': 'Expedia Group',
 'EXPD': 'Expeditors',
 'EXR': 'Extra Space Storage',
 'XOM': 'Exxon Mobil Corp.',
 'FFIV': 'F5 Networks',
 'FB': 'Facebook, Inc.',
 'FAST': 'Fastenal Co',
 'FRT': 'Federal Realty Investment Trust',
 'FDX': 'FedEx Corporation',
 'FIS': 'Fidelity National Information Services',
 'FITB': 'Fifth Third Bancorp',
 'FE': 'FirstEnergy Corp',
 'FRC': 'First Republic Bank',
 'FISV': 'Fiserv Inc',
 'FLT': 'FleetCor Technologies Inc',
 'FLIR': 'FLIR Systems',
 'FLS': 'Flowserve Corporation',
 'FMC': 'FMC Corporation',
 'F': 'Ford Motor',
 'FTNT': 'Fortinet',
 'FTV': 'Fortive Corp',
 'FBHS': 'Fortune Brands Home & Security',
 'FOXA': 'Fox Corporation Class A',
 'FOX': 'Fox Corporation Class B',
 'BEN': 'Franklin Resources',
 'FCX': 'Freeport-McMoRan Inc.',
 'GPS': 'Gap Inc.',
 'GRMN': 'Garmin Ltd.',
 'IT': 'Gartner Inc',
 'GD': 'General Dynamics',
 'GE': 'General Electric',
 'GIS': 'General Mills',
 'GM': 'General Motors',
 'GPC': 'Genuine Parts',
 'GILD': 'Gilead Sciences',
 'GL': 'Globe Life Inc.',
 'GPN': 'Global Payments Inc.',
 'GS': 'Goldman Sachs Group',
 'GWW': 'Grainger (W.W.) Inc.',
 'HRB': 'H&R Block',
 'HAL': 'Halliburton Co.',
 'HBI': 'Hanesbrands Inc',
 'HOG': 'Harley-Davidson',
 'HIG': 'Hartford Financial Svc.Gp.',
 'HAS': 'Hasbro Inc.',
 'HCA': 'HCA Healthcare',
 'PEAK': 'Healthpeak Properties',
 'HP': 'Helmerich & Payne',
 'HSIC': 'Henry Schein',
 'HSY': 'The Hershey Company',
 'HES': 'Hess Corporation',
 'HPE': 'Hewlett Packard Enterprise',
 'HLT': 'Hilton Worldwide Holdings Inc',
 'HFC': 'HollyFrontier Corp',
 'HOLX': 'Hologic',
 'HD': 'Home Depot',
 'HON': "Honeywell Int'l Inc.",
 'HRL': 'Hormel Foods Corp.',
 'HST': 'Host Hotels & Resorts',
 'HPQ': 'HP Inc.',
 'HUM': 'Humana Inc.',
 'HBAN': 'Huntington Bancshares',
 'HII': 'Huntington Ingalls Industries',
 'IEX': 'IDEX Corporation',
 'IDXX': 'IDEXX Laboratories',
 'INFO': 'IHS Markit Ltd.',
 'ITW': 'Illinois Tool Works',
 'ILMN': 'Illumina Inc',
 'IR': 'Ingersoll-Rand PLC',
 'INTC': 'Intel Corp.',
 'ICE': 'Intercontinental Exchange',
 'IBM': 'International Business Machines',
 'INCY': 'Incyte',
 'IP': 'International Paper',
 'IPG': 'Interpublic Group',
 'IFF': 'Intl Flavors & Fragrances',
 'INTU': 'Intuit Inc.',
 'ISRG': 'Intuitive Surgical Inc.',
 'IVZ': 'Invesco Ltd.',
 'IPGP': 'IPG Photonics Corp.',
 'IQV': 'IQVIA Holdings Inc.',
 'IRM': 'Iron Mountain Incorporated',
 'JKHY': 'Jack Henry & Associates',
 'J': 'Jacobs Engineering Group',
 'JBHT': 'J. B. Hunt Transport Services',
 'SJM': 'JM Smucker',
 'JNJ': 'Johnson & Johnson',
 'JCI': 'Johnson Controls International',
 'JPM': 'JPMorgan Chase & Co.',
 'JNPR': 'Juniper Networks',
 'KSU': 'Kansas City Southern',
 'K': 'Kellogg Co.',
 'KEY': 'KeyCorp',
 'KEYS': 'Keysight Technologies',
 'KMB': 'Kimberly-Clark',
 'KIM': 'Kimco Realty',
 'KMI': 'Kinder Morgan',
 'KLAC': 'KLA Corporation',
 'KSS': "Kohl's Corp.",
 'KHC': 'Kraft Heinz Co',
 'KR': 'Kroger Co.',
 'LB': 'L Brands Inc.',
 'LHX': 'L3Harris Technologies',
 'LH': 'Laboratory Corp. of America Holding',
 'LRCX': 'Lam Research',
 'LW': 'Lamb Weston Holdings Inc',
 'LVS': 'Las Vegas Sands',
 'LEG': 'Leggett & Platt',
 'LDOS': 'Leidos Holdings',
 'LEN': 'Lennar Corp.',
 'LLY': 'Lilly (Eli) & Co.',
 'LNC': 'Lincoln National',
 'LIN': 'Linde plc',
 'LYV': 'Live Nation Entertainment',
 'LKQ': 'LKQ Corporation',
 'LMT': 'Lockheed Martin Corp.',
 'L': 'Loews Corp.',
 'LOW': "Lowe's Cos.",
 'LYB': 'LyondellBasell',
 'MTB': 'M&T Bank Corp.',
 'M': "Macy's Inc.",
 'MRO': 'Marathon Oil Corp.',
 'MPC': 'Marathon Petroleum',
 'MKTX': 'MarketAxess',
 'MAR': "Marriott Int'l.",
 'MMC': 'Marsh & McLennan',
 'MLM': 'Martin Marietta Materials',
 'MAS': 'Masco Corp.',
 'MA': 'Mastercard Inc.',
 'MKC': 'McCormick & Co.',
 'MXIM': 'Maxim Integrated Products Inc',
 'MCD': "McDonald's Corp.",
 'MCK': 'McKesson Corp.',
 'MDT': 'Medtronic plc',
 'MRK': 'Merck & Co.',
 'MET': 'MetLife Inc.',
 'MTD': 'Mettler Toledo',
 'MGM': 'MGM Resorts International',
 'MCHP': 'Microchip Technology',
 'MU': 'Micron Technology',
 'MSFT': 'Microsoft Corp.',
 'MAA': 'Mid-America Apartments',
 'MHK': 'Mohawk Industries',
 'TAP': 'Molson Coors Brewing Company',
 'MDLZ': 'Mondelez International',
 'MNST': 'Monster Beverage',
 'MCO': "Moody's Corp",
 'MS': 'Morgan Stanley',
 'MOS': 'The Mosaic Company',
 'MSI': 'Motorola Solutions Inc.',
 'MSCI': 'MSCI Inc',
 'MYL': 'Mylan N.V.',
 'NDAQ': 'Nasdaq, Inc.',
 'NOV': 'National Oilwell Varco Inc.',
 'NTAP': 'NetApp',
 'NFLX': 'Netflix Inc.',
 'NWL': 'Newell Brands',
 'NEM': 'Newmont Goldcorp',
 'NWSA': 'News Corp. Class A',
 'NWS': 'News Corp. Class B',
 'NEE': 'NextEra Energy',
 'NLSN': 'Nielsen Holdings',
 'NKE': 'Nike',
 'NI': 'NiSource Inc.',
 'NBL': 'Noble Energy Inc',
 'JWN': 'Nordstrom',
 'NSC': 'Norfolk Southern Corp.',
 'NTRS': 'Northern Trust Corp.',
 'NOC': 'Northrop Grumman',
 'NLOK': 'NortonLifeLock',
 'NCLH': 'Norwegian Cruise Line Holdings',
 'NRG': 'NRG Energy',
 'NUE': 'Nucor Corp.',
 'NVDA': 'Nvidia Corporation',
 'NVR': 'NVR Inc',
 'ORLY': "O'Reilly Automotive",
 'OXY': 'Occidental Petroleum',
 'ODFL': 'Old Dominion Freight Line',
 'OMC': 'Omnicom Group',
 'OKE': 'ONEOK',
 'ORCL': 'Oracle Corp.',
 'PCAR': 'PACCAR Inc.',
 'PKG': 'Packaging Corporation of America',
 'PH': 'Parker-Hannifin',
 'PAYX': 'Paychex Inc.',
 'PYPL': 'PayPal',
 'PNR': 'Pentair plc',
 'PBCT': "People's United Financial",
 'PEP': 'PepsiCo Inc.',
 'PKI': 'PerkinElmer',
 'PRGO': 'Perrigo',
 'PFE': 'Pfizer Inc.',
 'PM': 'Philip Morris International',
 'PSX': 'Phillips 66',
 'PNW': 'Pinnacle West Capital',
 'PXD': 'Pioneer Natural Resources',
 'PNC': 'PNC Financial Services',
 'PPG': 'PPG Industries',
 'PPL': 'PPL Corp.',
 'PFG': 'Principal Financial Group',
 'PG': 'Procter & Gamble',
 'PGR': 'Progressive Corp.',
 'PLD': 'Prologis',
 'PRU': 'Prudential Financial',
 'PEG': 'Public Serv. Enterprise Inc.',
 'PSA': 'Public Storage',
 'PHM': 'Pulte Homes Inc.',
 'PVH': 'PVH Corp.',
 'QRVO': 'Qorvo',
 'PWR': 'Quanta Services Inc.',
 'QCOM': 'QUALCOMM Inc.',
 'DGX': 'Quest Diagnostics',
 'RL': 'Ralph Lauren Corporation',
 'RJF': 'Raymond James Financial Inc.',
 'RTN': 'Raytheon Co.',
 'O': 'Realty Income Corporation',
 'REG': 'Regency Centers Corporation',
 'REGN': 'Regeneron Pharmaceuticals',
 'RF': 'Regions Financial Corp.',
 'RSG': 'Republic Services Inc',
 'RMD': 'ResMed',
 'RHI': 'Robert Half International',
 'ROK': 'Rockwell Automation Inc.',
 'ROL': 'Rollins Inc.',
 'ROP': 'Roper Technologies',
 'ROST': 'Ross Stores',
 'RCL': 'Royal Caribbean Cruises Ltd',
 'SPGI': 'S&P Global, Inc.',
 'CRM': 'Salesforce.com',
 'SBAC': 'SBA Communications',
 'SLB': 'Schlumberger Ltd.',
 'STX': 'Seagate Technology',
 'SEE': 'Sealed Air',
 'SRE': 'Sempra Energy',
 'NOW': 'ServiceNow',
 'SHW': 'Sherwin-Williams',
 'SPG': 'Simon Property Group Inc',
 'SWKS': 'Skyworks Solutions',
 'SLG': 'SL Green Realty',
 'SNA': 'Snap-on',
 'SO': 'Southern Co.',
 'LUV': 'Southwest Airlines',
 'SWK': 'Stanley Black & Decker',
 'SBUX': 'Starbucks Corp.',
 'STT': 'State Street Corp.',
 'STE': 'STERIS plc',
 'SYK': 'Stryker Corp.',
 'SIVB': 'SVB Financial',
 'SYF': 'Synchrony Financial',
 'SNPS': 'Synopsys Inc.',
 'SYY': 'Sysco Corp.',
 'TMUS': 'T-Mobile US',
 'TROW': 'T. Rowe Price Group',
 'TTWO': 'Take-Two Interactive',
 'TPR': 'Tapestry, Inc.',
 'TGT': 'Target Corp.',
 'TEL': 'TE Connectivity Ltd.',
 'FTI': 'TechnipFMC',
 'TFX': 'Teleflex',
 'TXN': 'Texas Instruments',
 'TXT': 'Textron Inc.',
 'TMO': 'Thermo Fisher Scientific',
 'TIF': 'Tiffany & Co.',
 'TJX': 'TJX Companies Inc.',
 'TSCO': 'Tractor Supply Company',
 'TDG': 'TransDigm Group',
 'TRV': 'The Travelers Companies Inc.',
 'TFC': 'Truist Financial',
 'TWTR': 'Twitter, Inc.',
 'TSN': 'Tyson Foods',
 'UDR': 'UDR, Inc.',
 'ULTA': 'Ulta Beauty',
 'USB': 'U.S. Bancorp',
 'UAA': 'Under Armour Class A',
 'UA': 'Under Armour Class C',
 'UNP': 'Union Pacific Corp',
 'UAL': 'United Airlines Holdings',
 'UNH': 'United Health Group Inc.',
 'UPS': 'United Parcel Service',
 'URI': 'United Rentals, Inc.',
 'UTX': 'United Technologies',
 'UHS': 'Universal Health Services, Inc.',
 'UNM': 'Unum Group',
 'VFC': 'V.F. Corp.',
 'VLO': 'Valero Energy',
 'VAR': 'Varian Medical Systems',
 'VTR': 'Ventas Inc',
 'VRSN': 'Verisign Inc.',
 'VRSK': 'Verisk Analytics',
 'VZ': 'Verizon Communications',
 'VRTX': 'Vertex Pharmaceuticals Inc',
 'VIAC': 'ViacomCBS',
 'V': 'Visa Inc.',
 'VNO': 'Vornado Realty Trust',
 'VMC': 'Vulcan Materials',
 'WRB': 'W. R. Berkley Corporation',
 'WAB': 'Wabtec Corporation',
 'WMT': 'Walmart',
 'WBA': 'Walgreens Boots Alliance',
 'DIS': 'The Walt Disney Company',
 'WM': 'Waste Management Inc.',
 'WAT': 'Waters Corporation',
 'WEC': 'Wec Energy Group Inc',
 'WCG': 'WellCare',
 'WFC': 'Wells Fargo',
 'WELL': 'Welltower Inc.',
 'WDC': 'Western Digital',
 'WU': 'Western Union Co',
 'WRK': 'WestRock',
 'WY': 'Weyerhaeuser',
 'WHR': 'Whirlpool Corp.',
 'WMB': 'Williams Cos.',
 'WLTW': 'Willis Towers Watson',
 'WYNN': 'Wynn Resorts Ltd',
 'XEL': 'Xcel Energy Inc',
 'XRX': 'Xerox',
 'XLNX': 'Xilinx',
 'XYL': 'Xylem Inc.',
 'YUM': 'Yum! Brands Inc',
 'ZBRA': 'Zebra Technologies',
 'ZBH': 'Zimmer Biomet Holdings',
 'ZION': 'Zions Bancorp',
 'ZTS': 'Zoetis'}
 
 const { Option } = Select;

  const children = [];
  Object.keys(candlestick_patterns).map((key, index) => ( 
    children.push(<Option key={key}>{candlestick_patterns[key]}</Option>))
  )

  const symbol_children = [];
  Object.keys(symbols).map((key, index) => ( 
    symbol_children.push(<Option key={key}>{symbols[key]}</Option>))
  )


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

const params = {
  "colorTheme": "dark",
  "dateRange": "12M",
  "showChart": true,
  "locale": "en",
  "largeChartUrl": "",
  "isTransparent": false,
  "showSymbolLogo": true,
  "width": "400",
  "height": "660",
  "plotLineColorGrowing": "rgba(25, 118, 210, 1)",
  "plotLineColorFalling": "rgba(25, 118, 210, 1)",
  "gridLineColor": "rgba(42, 46, 57, 1)",
  "scaleFontColor": "rgba(120, 123, 134, 1)",
  "belowLineFillColorGrowing": "rgba(33, 150, 243, 0.12)",
  "belowLineFillColorFalling": "rgba(33, 150, 243, 0.12)",
  "symbolActiveColor": "rgba(33, 150, 243, 0.12)",
  "tabs": [
    {
      "title": "Indices",
      "symbols": [
        {
          "s": "FOREXCOM:SPXUSD",
          "d": "S&P 500"
        },
        {
          "s": "FOREXCOM:NSXUSD",
          "d": "Nasdaq 100"
        },
        {
          "s": "FOREXCOM:DJI",
          "d": "Dow 30"
        },
        {
          "s": "INDEX:NKY",
          "d": "Nikkei 225"
        },
        {
          "s": "INDEX:DEU30",
          "d": "DAX Index"
        },
        {
          "s": "FOREXCOM:UKXGBP",
          "d": "FTSE 100"
        }
      ],
      "originalTitle": "Indices"
    },
    {
      "title": "Commodities",
      "symbols": [
        {
          "s": "CME_MINI:ES1!",
          "d": "S&P 500"
        },
        {
          "s": "CME:6E1!",
          "d": "Euro"
        },
        {
          "s": "COMEX:GC1!",
          "d": "Gold"
        },
        {
          "s": "NYMEX:CL1!",
          "d": "Crude Oil"
        },
        {
          "s": "NYMEX:NG1!",
          "d": "Natural Gas"
        },
        {
          "s": "CBOT:ZC1!",
          "d": "Corn"
        }
      ],
      "originalTitle": "Commodities"
    },
    {
      "title": "Bonds",
      "symbols": [
        {
          "s": "CME:GE1!",
          "d": "Eurodollar"
        },
        {
          "s": "CBOT:ZB1!",
          "d": "T-Bond"
        },
        {
          "s": "CBOT:UB1!",
          "d": "Ultra T-Bond"
        },
        {
          "s": "EUREX:FGBL1!",
          "d": "Euro Bund"
        },
        {
          "s": "EUREX:FBTP1!",
          "d": "Euro BTP"
        },
        {
          "s": "EUREX:FGBM1!",
          "d": "Euro BOBL"
        }
      ],
      "originalTitle": "Bonds"
    },
    {
      "title": "Forex",
      "symbols": [
        {
          "s": "FX:EURUSD"
        },
        {
          "s": "FX:GBPUSD"
        },
        {
          "s": "FX:USDJPY"
        },
        {
          "s": "FX:USDCHF"
        },
        {
          "s": "FX:AUDUSD"
        },
        {
          "s": "FX:USDCAD"
        }
      ],
      "originalTitle": "Forex"
    }
  ]
}

const getCountryName = (countryCode) => {
  if (isoCountries.hasOwnProperty(countryCode)) {
      return isoCountries[countryCode];
  } else {
      return countryCode;
  }
}
class AggridTable extends React.Component {
  state = {
    error_state: false,
    strategy_applied:'',
    patterns: [],
    ticker:"",
    rowData: [],
    paginationPageSize: 20,
    name: "",
    docs: [],
    allocation: "",
    basicPicker: "",
    currenPageSize: "",
    getPageSize: "",
    isLoading: true,
    isPostLoading: true,
    searchText: '',
    company_health: "0",
    company_yield: "0",
    fair_value_score: "0",
    company_quality: "0",
    risk_score: "0",
    industry:"",
    industry_rank: "100",
    net_value_executed_pct: "0",
    net_holding_pct: "0",
    isTouropen: false,
    defaultColDef: {
      sortable: true,
      editable: false,
      resizable: true,
      suppressMenu: true
    },
    columnDefs: [
      {
        headerName: "Ticker",
        field: "ticker",
        width: 150,
        cellRenderer: function (params) {
          let keyData = params.value;
          let newLink = `<a href="/articleview/${keyData}">${keyData}</a>`;
          return newLink;
        },
        filter: false,
        checkboxSelection:true
        
      },
      {
        headerName: "Name",
        field: "ticker_name",
        filter: true,
        filterParams: {
          filterOptions: [
            'contains'
          ],
          suppressAndOrCondition: true,
        },
        width: 200,
        // pinned: window.innerWidth > 992 ? "left" : false
      },
      {
        headerName: "Industry",
        field: "industry",
        filter: true,
        filterParams: {
          filterOptions: [
            'contains'
          ],
          suppressAndOrCondition: true,
        },
        width: 300,
        // pinned: window.innerWidth > 992 ? "left" : false
      },
      {
        headerName: "Health Rating",
        field: "company_health",
        filter: "agNumberColumnFilter",
        filterParams: {
          filterOptions: [
            'greaterThan'
          ],
          suppressAndOrCondition: true,
        },
        width: 200
      },
      {
        headerName: "Yield Rating",
        field: "company_yield",
        filter: "agNumberColumnFilter",
        filterParams: {
          filterOptions: [
            'greaterThan'
          ],
          suppressAndOrCondition: true,
        },
        width: 140
      },
      {
        headerName: "Quality Rating",
        field: "company_quality",
        filter: "agNumberColumnFilter",
        filterParams: {
          filterOptions: [
            'greaterThan'
          ],
          suppressAndOrCondition: true,
        },
        width: 200
      },
      {
        headerName: "Industry Rank",
        field: "industry_rank",
        filter: "agNumberColumnFilter",
        filterParams: {
          filterOptions: [
            'lessThan'
          ],
          suppressAndOrCondition: true,
        },
        width: 180
      },
      {
        headerName: "Fair Value Rating",
        field: "fair_value_score",
        filter: "agNumberColumnFilter",
        filterParams: {
          filterOptions: [
            'greaterThan'
          ],
          suppressAndOrCondition: true,
        },
        width: 200
      },
      {
        headerName: "Risk Rating",
        field: "risk_score",
        filter: "agNumberColumnFilter",
        filterParams: {
          filterOptions: [
            'greaterThan'
          ],
          suppressAndOrCondition: true,
        },
        width: 140
      },
      {
        headerName: "Insider Rating",
        field: "net_value_executed_pct",
        filter: "agNumberColumnFilter",
        filterParams: {
          filterOptions: [
            'greaterThan'
          ],
          suppressAndOrCondition: true,
        },
        width: 200
      },
      {
        headerName: "Institutional Rating",
        field: "net_holding_pct",
        filter: "agNumberColumnFilter",
        filterParams: {
          filterOptions: [
            'greaterThan'
          ],
          suppressAndOrCondition: true,
        },
        width: 200
      },
    ]
  }

  toggleModal = () => {
    this.setState(prevState => ({
      error_state: !prevState.error_state
    }));
  }

  startTour = () => {
    this.setState({
      isTouropen: true
    })
  }

  fetchArticles = () => {
    axios.get('https://openstreet.io/api/matrix/?action=search')
      .then(res => {
        // console.log(res.data);
        let items = this.state;
        items['rowData'] = items['rowData'].concat(res.data);
        this.setState({ items });

      });
    let today = new Date();
    today.setDate(today.getDate() - 20);
    today = today.toISOString().slice(0, 10);
    axios.get(`https://openstreet.io/api/matrix/?action=news`)
      .then(res => {
        let sorted = res.data['hits']
        this.setState({ docs: sorted });
      
      });
    
  }


  componentDidMount() {
    if (document.getElementById("chart")) {
      const script = document.createElement('script');
      script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-tickers.js'
      script.async = true;
      script.innerHTML = JSON.stringify({
        "symbols": [{
          "proName": "OANDA:SPX500USD",
          "title": "S&P 500"
        }, {
          "proName": "OANDA:NAS100USD",
          "title": "Nasdaq 100"
        }, {
          "proName": "FX_IDC:INRUSD",
          "title": "INR/USD"
        }, {
          "proName": "BITSTAMP:BTCUSD",
          "title": "BTC/USD"
        }, {
          "proName": "BITSTAMP:ETHUSD",
          "title": "ETH/USD"
        }],
        "colorTheme": "dark",
        "isTransparent": true,
        "displayMode": "adaptive",
        "locale": "en"
      });

    document.getElementById("chart").appendChild(script);
    }
   
    this.fetchArticles();
  }

  componentWillReceiveProps(newProps) {
    if (newProps.token) {
      this.fetchArticles();
    }
  }


  onGridReady = params => {
    this.gridApi = params.api
    this.gridColumnApi = params.columnApi
    this.setState({
      currenPageSize: this.gridApi.paginationGetCurrentPage() + 1,
      getPageSize: this.gridApi.paginationGetPageSize(),
      totalPages: this.gridApi.paginationGetTotalPages()
    })
  }

  updateSearchQuery = val => {
    this.gridApi.setQuickFilter(val)
  }

  filterSize = val => {
    if (this.gridApi) {
      this.gridApi.paginationSetPageSize(Number(val))
      this.setState({
        currenPageSize: val,
        getPageSize: val
      })
    }
  }
  filter = (params) => {
    var model = this.gridApi.getFilterModel();
    let items = this.state;
    items['company_health'] = "0";
    items['fair_value_score'] = "0";
    items['company_yield'] = "0";
    items['company_quality'] = "0";
    items['risk_score'] = "0";
    items['industry'] = "";
    items['industry_rank'] = "100";
    items['net_value_executed_pct'] = "0";
    items['net_holding_pct'] = "0";
    for (const field in model) {
      items[`${field}`] = `${model[field].filter}`;
    }
    this.setState({ items });
    this.setState({ applied:'' });
  }

  appleAllStar = () => {
    let items = this.state;
    items['ticker'] = 'AAPL';
    items['holding_period'] = 20;
    items['patterns'] = ['CDLDOJI','CDLENGULFING','CDLHANGINGMAN','CDLHAMMER'];
    this.setState({ items });
    this.setState({ strategy_applied:'Apple-All' });
  }

  microsoftAllStar = () => {
    let items = this.state;
    items['ticker'] = 'MSFT';
    items['holding_period'] = 20;
    items['patterns'] = ['CDLENGULFING','CDL2CROWS'];
    this.setState({ items });
    this.setState({ strategy_applied:'Microsoft-All' });
  }

  adobeAllStar = () => {
    let items = this.state;
    items['ticker'] = 'ADBE';
    items['holding_period'] = 20;
    items['patterns'] = ['CDLENGULFING', 'CDLMORNINGSTAR'];
    this.setState({ items });
    this.setState({ strategy_applied:'Adobe-All' });
  }

  allStar = () => {
    let items = this.state;
    items['company_health'] = "80";
    items['fair_value_score'] = "0";
    items['company_yield'] = "0";
    items['company_quality'] = "90";
    items['risk_score'] = "0";
    items['industry'] = "";
    items['industry_rank'] = "100";
    items['net_value_executed_pct'] = "0";
    items['net_holding_pct'] = "0";
    this.setState({ items });
    this.setState({ applied:'All' });
  }

  riskAverse = () => {
    let items = this.state;
    items['company_health'] = "0";
    items['fair_value_score'] = "0";
    items['company_yield'] = "0";
    items['company_quality'] = "80";
    items['risk_score'] = "16";
    items['industry'] = "";
    items['industry_rank'] = "100";
    items['net_value_executed_pct'] = "0";
    items['net_holding_pct'] = "0";
    this.setState({ items });
    this.setState({ applied:'Risk' });
  }

  yieldSeeker = () => {
    let items = this.state;
    items['company_health'] = "0";
    items['fair_value_score'] = "0";
    items['company_yield'] = "99";
    items['company_quality'] = "0";
    items['risk_score'] = "0";
    items['industry'] = "";
    items['industry_rank'] = "100";
    items['net_value_executed_pct'] = "0";
    items['net_holding_pct'] = "0";
    this.setState({ items });
    this.setState({ applied:'Yield' });
  }

  valueSeeker = () => {
    let items = this.state;
    items['company_health'] = "30";
    items['fair_value_score'] = "11";
    items['company_yield'] = "0";
    items['company_quality'] = "0";
    items['risk_score'] = "0";
    items['industry'] = "";
    items['industry_rank'] = "100";
    items['net_value_executed_pct'] = "0";
    items['net_holding_pct'] = "0";
    this.setState({ items });
    this.setState({ applied:'Value' });
  }

  resetFilter = () => {
    let items = this.state;
    items['company_health'] = "0";
    items['fair_value_score'] = "0";
    items['company_yield'] = "0";
    items['company_quality'] = "0";
    items['risk_score'] = "0";
    items['industry'] = "";
    items['industry_rank'] = "100";
    items['net_value_executed_pct'] = "0";
    items['net_holding_pct'] = "0";
    this.setState({ items });
    this.setState({ applied:'' });
  }

  strategyResetFilter = () => {
    let items = this.state;
    items['patterns'] = [];
    items['ticker'] = '';
    items['holding_period'] = 200;
    this.setState({ items });
    this.setState({ strategy_applied:'' });
  }
  

  handleChangePattern = e => {
    console.log(e)
    this.setState({ patterns: e })
    // console.log(this.state)
  }

  handleChangeTicker = e => {
    this.setState({ ticker: e })
    // console.log(this.state)
  }

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value })
    // console.log(this.state)
  }

  handleSubmitStrategy = event => {
    
    event.preventDefault();
    axios.post(`https://openstreet.io/api/strategies/?token=${localStorage.getItem('token')}`, {
    ticker: this.state.ticker,
    strategy_name: this.state.name,
    allocation: this.state.allocation,
    patterns: this.state.patterns,
    holding_period: this.state.holding_period
  }).then(res => {
      console.log(res);
      this.props.history.push('/strategies/');  
      })
    .catch(err => {
    if (err.response) {
      console.log(err.response)
      this.setState({ error_state: true })
    }
      })}

  handleSubmit = event => {
    event.preventDefault();
    let selectedNodes = this.gridApi.getSelectedNodes();
	  let selectedData = selectedNodes.map(node => node.data);
    console.log(selectedData);
    if(selectedData.length!==0)
    {
      if(this.state.basicPicker.length>0){
        axios.post(`https://openstreet.io/api/portfolio/?token=${localStorage.getItem('token')}`, {
        custom_portfolio: true,
        portfolio_name: this.state.name,
        allocation: this.state.allocation,
        date_created: this.state.basicPicker[0].toISOString().split('T')[0],
        portfolio: selectedData
      }).then(res => {
        this.props.history.push('/portfolios/');
      })
    .catch(err => {
    if (err.response) {
      console.log(err.response)
      this.setState({ error_state: true })
    }
      })}
      else{
        this.setState({ error_state: true })
  
      }

    
  }else{
    if(this.state.basicPicker.length>0){
      axios.post(`https://openstreet.io/api/portfolio/?token=${localStorage.getItem('token')}`, {
      custom_portfolio: false,  
      portfolio_name: this.state.name,
        allocation: this.state.allocation,
        date_created: this.state.basicPicker[0].toISOString().split('T')[0],
        min_health: parseInt(this.state.company_health),
        min_yield: parseInt(this.state.company_yield),
        min_fair_value:parseInt(this.state.fair_value_score),
        min_quality: parseInt(this.state.company_quality),
        min_risk:parseInt(this.state.risk_score),
        max_industry_rank: parseInt(this.state.industry_rank),
        min_insider_rating:parseInt(this.state.net_value_executed_pct),
        min_inst_rating: parseInt(this.state.net_holding_pct),
        industry: this.state.industry,
      }).then(res => {  
        this.props.history.push('/portfolios/');
      })
    .catch(err => {
    if (err.response) {
      console.log(err.response)
      this.setState({ error_state: true })
    } 
})
    }else{
      this.setState({ error_state: true })

    }
    
  } 
  }
  render() {
    if (!this.props.token) {
      return <Redirect to="/login" />;
    }
    const { rowData, columnDefs, defaultColDef, basicPicker } = this.state;
    if (this.state.rowData.length === 0 & this.state.isLoading === false) {
      let items = this.state;
      items['isLoading'] = true;
      this.setState({ items });
    }
    if (this.state.rowData.length !== 0 & this.state.isLoading === true) {
      let items = this.state;
      items['isLoading'] = false;
      this.setState({ items });
    }
    if (this.state.docs.length === 0 & this.state.isPostLoading === false) {
      this.setState({isPostLoading: true});
    }
    if (this.state.docs.length !== 0 & this.state.isPostLoading === true) {
      this.setState({isPostLoading: false})
    }
    const steps = [
      {
        target: ".ag-header-row:first-child> :first-child",
        content: "Ticker - Click on ticker to navigate to stock research report.",
        disableBeacon: true
      },
      {
        target: ".ag-header-row:first-child> :nth-child(3)",
        content: "Generate Portfolio - Enter Filter Parameters to apply rules on the stock universe.",
        disableBeacon: true
      },
      {
        target: "[name=name]",
        content: "Generate Portfolio - Portfolio Name: Enter a name for the portfolio",
        disableBeacon: false
      },
      {
        target: "#allocation",
        content: "Generate Portfolio - Allocation: Enter an amount to allocate to the portfolio",
        disableBeacon: true
      },
      {
        target: "[placeholder=yyyy-mm-dd]",
        content: "Generate Portfolio - Effective Date: Enter a date on which you would like to apply the rules",
        disableBeacon: true
      },
      {
        target: ".applybtn",
        content: "Generate Portfolio - Hit Apply Rules to add the filter parameters to the portfolio rule list.",
        disableBeacon: true
      },
      {
        target: ".navbar-nav li:nth-child(2)",
        content: "Portfolios - View and track your portfolios in this tab",
        disableBeacon: true
      }
    ]
    return (
      <React.Fragment>
         
        { 
        this.state.error_state ?

        <Modal
        isOpen={this.state.error_state}
        toggle={this.toggleModal}
        className="modal-dialog-centered"
      >
          <ModalHeader toggle={this.toggleModal}>Error</ModalHeader>
          <ModalBody>
            
            An error occured during the operation. Please make amends and try again.
          </ModalBody>
          <ModalFooter>
            <Button color='primary' onClick={this.toggleModal}>
              Dismiss
            </Button>
          </ModalFooter>
        </Modal>
        :
        <div/>
       }
        <Row>
          <Col sm="12">
            <Tour
              disableOverlay
              steps={steps}
              run={this.state.isTouropen}
              continuous={true}
              showSkipButton={true}
              floaterProps={{ disableAnimation: true }}
              callback={data => {
                if ([STATUS.FINISHED, STATUS.SKIPPED].includes(data.status)) {
                  this.setState({ isTouropen: false })
                }
              }}
            />
            <Card>
              <CardBody>
                <Button color="primary" outline onClick={this.startTour}>
                  Start Tour
                </Button>
              </CardBody>
            </Card>
            
          </Col>
        </Row>
        <Card>
        <div id="chart"> </div>
        </Card>
        <Divider/>

        <List
          // itemLayout="horizontal"
           grid={{
      gutter: 16,
      xs: 1,
      sm: 2,
      md: 2,
      lg: 3,
      xl: 3,
      xxl: 3,
    }}
          size="small"
          pagination={{
            onChange: page => {
              console.log(page);
            },
            pageSize: 3,
          }}
          dataSource={this.state.docs}

          renderItem={item => (
            <Card style={{marginLeft: 20, marginRight: 20}}>
              <CardImg
                className="img-fluid mb-2"
                src={item.imageUrl}
                alt="card image cap"
              />
                <Container>
                  <Row>
                    
                    <Col>
                      <a href={item.url}><h3>{item.title}</h3></a>
                      <Row>
                        <Col lg="5" sm="5" md="5" style={{paddingTop: 5}}>
                          <Icon.Clock size={15} style={{color: "white"}}/>
                          <label>{new Date(item.pubDate).toString().substring(4, 15)}</label>
                        </Col>
                        <Col lg="5" sm="5" style={{paddingTop: 5}}>
                          <Icon.User size={15} style={{color: "white"}}/>
                          <label>{item.authors[0]}</label>
                        </Col>
                        <Col lg="5" sm="5" style={{paddingTop: 5}}>
                          <Icon.Globe size={15} style={{color: "white"}}/>
                          <label>{getCountryName(item.country.toUpperCase())}</label>
                        </Col>
                        <Col lg="5" sm="5">
                          <img src={`https://www.google.com/s2/favicons?domain=${item.source}`} alt="No Image"/>
                          <label>{item.source.toUpperCase()}</label>
                        </Col>
                      </Row>
                      <Divider />
                      <p>{item.content.substring(0, 250)}...</p>
                    </Col>
                  </Row>
                
                </Container>
            </Card>
          )}
        />
        <Divider/>
        <Row>
        
        <Col sm="4" lg="3" sm="12">
        <Card >
             
             <CardImg
               className="img-fluid mb-2"
               src={all_star}
               alt="card image cap"
             />
               <CardBody>
             <h3>All Star Investor</h3>
             
             <span>This profile is for investors who like stocks that have strong fundamentals and are preferred by institutions. This profile weighs heavily on health of the company.</span>
             <div className="card-btns d-flex justify-content-between mt-2">
               {
                 this.state.applied==="All" ?
                 <Button outline onClick={this.resetFilter} color='primary'>
                 Applied!
               </Button>
                 :
               <Button.Ripple onClick={this.allStar} color='primary'>
                 Apply Profile
               </Button.Ripple>
              }
             </div>
             </CardBody>
           </Card>
            </Col>
            <Col sm="4" lg="3" sm="12">
            <Card >
             
             <CardImg
               className="img-fluid mb-2"
               src={value}
               alt="card image cap"
             />
               <CardBody>
             <h3>The Value Seeker</h3>
             
             <span>This profile is for investors who like stocks that are undervalued in the market, have strong fundamentals and a steady cash stream.</span>
             <div className="card-btns d-flex justify-content-between mt-2">
               {
                 this.state.applied==="Value" ?
                 <Button outline onClick={this.resetFilter} color='primary'>
                 Applied!
               </Button>
                 :
               <Button.Ripple onClick={this.valueSeeker} color='primary'>
                 Apply Profile
               </Button.Ripple>
              }
             </div>
             </CardBody>
           </Card>
            </Col>
            <Col sm="4" lg="3" sm="12">
            <Card >
             
             <CardImg
               className="img-fluid mb-2"
               src={yield_seeker}
               alt="card image cap"
             />
               <CardBody>
             <h3>The Yield Seeker</h3>
             
             <span>This profile is for investors who like stocks that have a steady income through dividends and have tons of free cash flow.</span>
             <div className="card-btns d-flex justify-content-between mt-2">
               {
                 this.state.applied==="Yield" ?
                 <Button outline onClick={this.resetFilter} color='primary'>
                 Applied!
               </Button>
                 :
               <Button.Ripple onClick={this.yieldSeeker} color='primary'>
                 Apply Profile
               </Button.Ripple>
              }
             </div>
             </CardBody>
           </Card>
            </Col>
            
            <Col sm="4" lg="3" sm="12">
            
           <Card >
             
              <CardImg
                className="img-fluid mb-2"
                src={risk_averse}
                alt="card image cap"
              />
                <CardBody>
              <h3>The Risk Averse Investor</h3>
              
              <span>This profile is for investors who don't like to take too much risk and prefer securities that have low levels of debt and are much more efficient.</span>
              <div className="card-btns d-flex justify-content-between mt-2">
              {
                 this.state.applied==="Risk" ?
                 <Button outline onClick={this.resetFilter} color='primary'>
                 Applied!
               </Button>
                 :
               <Button.Ripple onClick={this.riskAverse} color='primary'>
                 Apply Profile
               </Button.Ripple>
              }
               
              </div>
              </CardBody>
            </Card>
            
            </Col>
            
            </Row>
            <Divider/>
        <Card style={{marginTop: 15}}>

          <CardHeader id="portgen">
            <CardTitle>
              <h4 style={{paddingBottom: 15}}>Portfolio Generation</h4>
            </CardTitle>

          </CardHeader>

          <CardBody>
            <Form onSubmit={this.handleSubmit}>
              <FormGroup row>
                <Col md="4">
                  <span>Portfolio Name</span>
                </Col>
                <Col md="6">
                  <Input
                    required
                    type="text"
                    name="name"
                    id="name"
                    onChange={this.handleChange}

                  />
                </Col>
              </FormGroup>

              <FormGroup row>
                <Col md="4">
                  <span>Allocation</span>
                </Col>
                <Col md="6">
                  <Input
                    //  ref="sdf"
                    required
                    type="text"
                    name="allocation"
                    id="allocation"
                    onChange={this.handleChange}

                  />
                </Col>
              </FormGroup>

              <FormGroup row>
                <Col md="4">
                  <span>Effective Date</span>
                </Col>
                <Col md="6">
                  <Flatpickr
                    className="form-control"
                    value={basicPicker}
                    placeholder="yyyy-mm-dd"
                    onChange={date => {
                      this.setState({ basicPicker: date });
                    }}
                    options={{maxDate: new Date().fp_incr(-1) }}
                  />
                </Col>
              </FormGroup>

              <FormGroup row>
                <Col md={{ size: 8, offset: 4 }}>
                  <Button.Ripple
                    color="primary"
                    type="submit"
                    className="mr-1 mb-1 applybtn"
                  >
                    Apply Rules
                  </Button.Ripple>
                  <Button.Ripple
                    outline
                    color="warning"
                    type="reset"
                    className="mb-1"
                  >
                    Reset
                  </Button.Ripple>
                </Col>
              </FormGroup>
            </Form>
          </CardBody>
          </Card>
          
        
        
        <Card className="overflow-hidden agGrid-card">
        <CardTitle>
              <h4 style={{paddingTop: 20, paddingLeft: 20}}>Stock Ratings Matrix</h4>
            </CardTitle>
          
            
            
            <CardBody className="py-0">
              {this.state.rowData === null ? null : (
                <div className="ag-theme-material w-100 my-2 ag-grid-table">
                  <div className="d-flex flex-wrap justify-content-between align-items-center">
                    <div className="mb-1">
                      <UncontrolledDropdown className="p-1 ag-dropdown">
                        <DropdownToggle tag="div">
                          {this.gridApi
                            ? this.state.currenPageSize
                            : "" * this.state.getPageSize -
                            (this.state.getPageSize - 1)}{" "}
                        -{" "}
                          {this.state.rowData.length -
                            this.state.currenPageSize * this.state.getPageSize >
                            0
                            ? this.state.currenPageSize * this.state.getPageSize
                            : this.state.rowData.length}{" "}
                        of {this.state.rowData.length}
                          <ChevronDown className="ml-50" size={15} />
                        </DropdownToggle>
                        <DropdownMenu right>
                          <DropdownItem
                            tag="div"
                            onClick={() => this.filterSize(20)}
                          >
                            20
                        </DropdownItem>
                          <DropdownItem
                            tag="div"
                            onClick={() => this.filterSize(50)}
                          >
                            50
                        </DropdownItem>
                          <DropdownItem
                            tag="div"
                            onClick={() => this.filterSize(100)}
                          >
                            100
                        </DropdownItem>
                          <DropdownItem
                            tag="div"
                            onClick={() => this.filterSize(134)}
                          >
                            134
                        </DropdownItem>
                        </DropdownMenu>
                      </UncontrolledDropdown>
                    </div>
                    <div className="d-flex flex-wrap justify-content-between mb-1">
                      <div className="table-input mr-1">
                        <Input
                          placeholder="search..."
                          onChange={e => this.updateSearchQuery(e.target.value)}
                          value={this.state.value}
                        />
                      </div>
                      
                    </div>
                  </div>
                  
                  <ContextLayout.Consumer>
                    {context => (
                      <AgGridReact
                      
                      selectableRows
                        gridOptions={{}}
                        rowSelection="multiple"
                        defaultColDef={defaultColDef}
                        columnDefs={columnDefs}
                        rowData={rowData}
                        onGridReady={this.onGridReady}
                        colResizeDefault={"shift"}
                        animateRows={true}
                        floatingFilter={true}
                        onFilterChanged={this.filter}
                        pagination={true}
                        paginationPageSize={this.state.paginationPageSize}
                        pivotPanelShow="always"
                        enableRtl={context.state.direction === "rtl"}
                      />
                    )}
                  </ContextLayout.Consumer>
                  
                </div>
              )}
            </CardBody>
        </Card>
        <Row>
        <Col lg="4">
        <Card >
             
            
               <CardBody>
             <h3>Apple Technical Strategy</h3>
             
             <span>This strategy applies Doji, Engulfing, Hanging Man and Hammer Patterns on Apple with a max holding period of 20 days.</span>
             <div className="card-btns d-flex justify-content-between mt-2">
               {
                 this.state.strategy_applied==="Apple-All" ?
                 <Button outline onClick={this.strategyResetFilter} color='primary'>
                 Applied!
               </Button>
                 :
               <Button.Ripple onClick={this.appleAllStar} color='primary'>
                 Apply Profile
               </Button.Ripple>
              }
             </div>
             </CardBody>
           </Card>
            </Col>
            <Col lg="4">
        <Card >
             
            
               <CardBody>
             <h3>Adobe Technical Strategy</h3>
             
             <span>This strategy applies Engulfing and Morning Star Patterns on Adobe with a max holding period of 20 days.</span>
             <div className="card-btns d-flex justify-content-between mt-2">
               {
                 this.state.strategy_applied==="Adobe-All" ?
                 <Button outline onClick={this.strategyResetFilter} color='primary'>
                 Applied!
               </Button>
                 :
               <Button.Ripple onClick={this.adobeAllStar} color='primary'>
                 Apply Profile
               </Button.Ripple>
              }
             </div>
             </CardBody>
           </Card>
            </Col>
            <Col lg="4">
        <Card >
             
            
               <CardBody>
             <h3>Microsoft Technical Strategy</h3>
             
             <span>This strategy applies Engulfing and Two Crows Patterns on Microsoft with a max holding period of 20 days.</span>
             <div className="card-btns d-flex justify-content-between mt-2">
               {
                 this.state.strategy_applied==="Microsoft-All" ?
                 <Button outline onClick={this.strategyResetFilter} color='primary'>
                 Applied!
               </Button>
                 :
               <Button.Ripple onClick={this.microsoftAllStar} color='primary'>
                 Apply Profile
               </Button.Ripple>
              }
             </div>
             </CardBody>
           </Card>
            </Col>
            </Row>
        <Card style={{marginTop: 15}}>

<CardHeader id="portgen">
  <CardTitle>
    <h4 style={{paddingBottom: 15}}>Strategy Generation</h4>
  </CardTitle>

</CardHeader>

<CardBody>
  <Form onSubmit={this.handleSubmitStrategy}>
    <FormGroup row>
      <Col md="4">
        <span>Strategy Name</span>
      </Col>
      <Col md="6">
        <Input
          required
          type="text"
          name="name"
          id="name"
          onChange={this.handleChange}

        />
      </Col>
    </FormGroup>

    <FormGroup row>
      <Col md="4">
        <span>Allocation</span>
      </Col>
      <Col md="6">
        <Input
          //  ref="sdf"
          required
          type="text"
          name="allocation"
          id="allocation"
          onChange={this.handleChange}

        />
      </Col>
    </FormGroup>
    { this.state.strategy_applied===''? 
     <div>
    <FormGroup row>
      <Col md="4">
        <span>Max Holding Period</span>
      </Col>
      <Col md="6">
        <Input
          //  ref="sdf"
          type="text"
          name="holding_period"
          id="holding_period"
          onChange={this.handleChange}

        />
      </Col>
    </FormGroup>
              
              
           
              <FormGroup row>
      <Col md="4">
        <span>Ticker</span>
      </Col>
      <Col md="6">
      <Select
        style={{ width: '100%' }}
        placeholder="Please select"
        onChange={this.handleChangeTicker}
      >
        {symbol_children}
      </Select>
      </Col>
    </FormGroup>


    <FormGroup row>
      <Col md="4">
        <span>Pattern</span>
      </Col>
      <Col md="6">
      <Select
        mode="multiple"
        allowClear
        style={{ width: '100%' }}
        placeholder="Please select"
        onChange={this.handleChangePattern}
      >
        {children}
      </Select>
      </Col>
    </FormGroup>


            </div>
            :
            <div/>
            }
    

    <FormGroup row>
      <Col md={{ size: 8, offset: 4 }}>
        <Button.Ripple
          color="primary"
          type="submit"
          className="mr-1 mb-1 applybtn"
        >
          Apply Rules
        </Button.Ripple>
        <Button.Ripple
          outline
          color="warning"
          type="reset"
          className="mb-1"
        >
          Reset
        </Button.Ripple>
      </Col>
    </FormGroup>
  </Form>
</CardBody>
</Card>
  <Divider/>
      </React.Fragment>
    )
  }
}

const mapStatetoProps = state => {
  return {
    token: state.auth.token
  }
}


export default connect(mapStatetoProps)(AggridTable);


