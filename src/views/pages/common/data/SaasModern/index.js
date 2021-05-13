import Process1 from '../../assets/image/saasModern/process-1.svg';
import Process2 from '../../assets/image/saasModern/process-2.svg';
import Process3 from '../../assets/image/saasModern/process-3.svg';

import FeatureIcon1 from '../../assets/image/saasModern/icon-1.png';
import FeatureIcon2 from '../../assets/image/saasModern/icon-2.png';
import FeatureIcon3 from '../../assets/image/saasModern/icon-3.png';
import FeatureIcon4 from '../../assets/image/saasModern/icon-4.png';
import FeatureIcon5 from '../../assets/image/saasModern/icon-5.png';
import FeatureIcon6 from '../../assets/image/saasModern/icon-6.png';

import Screenshot1 from '../../assets/image/saasModern/updatescreen1.png';
import Screenshot2 from '../../assets/image/saasModern/updatescreen2.png';
import Screenshot3 from '../../assets/image/saasModern/updatescreen3.png';

import AuthorOne from '../../assets/image/saasModern/author-1.jpg';
import AuthorTwo from '../../assets/image/saasModern/author-2.jpg';
import AuthorThree from '../../assets/image/saasModern/author-3.jpg';

import icon1 from '../../assets/image/saasModern/area_chart.svg';
import icon2 from '../../assets/image/saasModern/business.svg';
import icon3 from '../../assets/image/saasModern/library.svg';
import { ic_monetization_on } from 'react-icons-kit/md/ic_monetization_on';
import { ic_settings } from 'react-icons-kit/md/ic_settings';
import { pieChart } from 'react-icons-kit/icomoon/pieChart';

export const MENU_ITEMS = [{
        label: 'Home',
        path: '#banner_section',
        offset: '0',
    },
    {
        label: 'Features',
        path: '#feature_section',
        offset: '0',
    },

    {
        label: 'FAQ',
        path: '#faq_section',
        offset: '0',
    },
];

export const PROCESS_ITEMS = [{
        image: icon1,
        title: ' Conduct Research',
        description: 'Openstreet provides top-level ratings matrix for stocks and stock-specific research broken down into company analysis, insider analysis and institutional analysis. Watch how the wealth in the company changes over time.',
    },
    {
        image: icon2,
        title: 'Build Portfolios',
        description: 'Openstreet provides the ability to screen securities and create portfolios with the desired allocation.',
    },
    {
        image: icon3,
        title: 'Execute and Track Portfolios',
        description: 'Openstreet provides the ability to send orders to enter into position for a portfolio as well as rebalance and exit positions.We also have the ability to track how the wealth in our portfolio grows.',
    },
];

export const MONTHLY_PRICING_TABLE = [{
        freePlan: true,
        name: 'Basic Account',
        description: 'For Small teams or group who need to build website ',
        price: '$0',
        priceLabel: 'Only for first month',
        buttonLabel: 'CREATE FREE ACCOUNT',
        url: '#',
        listItems: [{
                content: 'Drag & Drop Builder',
            },
            {
                content: '1,000s of Templates Ready',
            },
            {
                content: 'Blog Tools',
            },
            {
                content: 'eCommerce Store ',
            },
            {
                content: '30+ Webmaster Tools',
            },
        ],
    },
    {
        name: 'Business Account',
        description: 'For Mediums teams or group who need to build website ',
        price: '$9.87',
        priceLabel: 'Per month & subscription yearly',
        buttonLabel: 'START FREE TRIAL',
        url: '#',
        listItems: [{
                content: 'Drag & Drop Builder',
            },
            {
                content: '1,000s of Templates Ready',
            },
            {
                content: 'Blog Tools',
            },
            {
                content: 'eCommerce Store ',
            },
            {
                content: '30+ Webmaster Tools',
            },
        ],
    },
    {
        name: 'Premium Account',
        description: 'For Large teams or group who need to build website ',
        price: '$12.98',
        priceLabel: 'Per month & subscription yearly',
        buttonLabel: 'START FREE TRIAL',
        url: '#',
        listItems: [{
                content: 'Drag & Drop Builder',
            },
            {
                content: '1,000s of Templates Ready',
            },
            {
                content: 'Blog Tools',
            },
            {
                content: 'eCommerce Store ',
            },
            {
                content: '30+ Webmaster Tools',
            },
        ],
    },
];

export const YEARLY_PRICING_TABLE = [{
        freePlan: true,
        name: 'Basic Account',
        description: 'For a single client or team who need to build website ',
        price: '$0',
        priceLabel: 'Only for first month',
        buttonLabel: 'CREATE FREE ACCOUNT',
        url: '#',
        listItems: [{
                content: 'Drag & Drop Builder',
            },
            {
                content: '1,000s of Templates Ready',
            },
            {
                content: 'Blog Tools',
            },
            {
                content: 'eCommerce Store ',
            },
            {
                content: '30+ Webmaster Tools',
            },
        ],
    },
    {
        name: 'Business Account',
        description: 'For Small teams or group who need to build website ',
        price: '$6.00',
        priceLabel: 'Per month & subscription yearly',
        buttonLabel: 'START FREE TRIAL',
        url: '#',
        listItems: [{
                content: 'Unlimited secure storage',
            },
            {
                content: '2,000s of Templates Ready',
            },
            {
                content: 'Blog Tools',
            },
            {
                content: '24/7 phone support',
            },
            {
                content: '50+ Webmaster Tools',
            },
        ],
    },
    {
        name: 'Premium Account',
        description: 'For Large teams or group who need to build website ',
        price: '$9.99',
        priceLabel: 'Per month & subscription yearly',
        buttonLabel: 'START FREE TRIAL',
        url: '#',
        listItems: [{
                content: 'Drag & Drop Builder',
            },
            {
                content: '3,000s of Templates Ready',
            },
            {
                content: 'Advanced branding',
            },
            {
                content: 'Knowledge base support',
            },
            {
                content: '80+ Webmaster Tools',
            },
        ],
    },
];

export const FAQ_DATA = [{
        "expend": true,
        "title": "What kind of research does openstreet provide?",
        "description": "Openstreet provides top-level ratings matrix for stocks as well as Stock-specific research which is broken down into company analysis, insider analysis and institutional analysis. "
    },
    {
        "title": "What does the top-level ratings matrix consist of and how is it computed?",
        "description": "The top-level rating matrix is computed through the aggregation of the metrics in the following 8 risk categories by listing, then calculation of the CDF for each of the listings, based on the distribution obtained. "
    },
    {
        "title": "What is the universe of stocks that are screened in this report?",
        "description": "Openstreet mainly analyzes stocks in the S&P 500 index. These stocks are the major movers of the stock market."
    },
    {
        "title": "What data is used to prepare the research report?",
        "description": "OpenStreet derives analytics from Quandl, Sharadar fundamental data which is extracted, standardized and organized from the company filings."
    }
];

export const FOOTER_WIDGET = [{
        title: 'About Us',
        menuItems: [{
                url: '#',
                text: 'Support Center',
            },
            {
                url: '#',
                text: 'Customer Support',
            },
            {
                url: '#',
                text: 'About Us',
            },
            {
                url: '#',
                text: 'Copyright',
            },
            {
                url: '#',
                text: 'Popular Campaign',
            },
        ],
    },
    {
        title: 'Our Information',
        menuItems: [{
                url: '#',
                text: 'Return Policy',
            },
            {
                url: '#',
                text: 'Privacy Policy',
            },
            {
                url: '#',
                text: 'Terms & Conditions',
            },
            {
                url: '#',
                text: 'Site Map',
            },
            {
                url: '#',
                text: 'Store Hours',
            },
        ],
    },
    {
        title: 'My Account',
        menuItems: [{
                url: '#',
                text: 'Press inquiries',
            },
            {
                url: '#',
                text: 'Social media directories',
            },
            {
                url: '#',
                text: 'Images & B-roll',
            },
            {
                url: '#',
                text: 'Permissions',
            },
            {
                url: '#',
                text: 'Speaker requests',
            },
        ],
    },
    {
        title: 'Policy',
        menuItems: [{
                url: '#',
                text: 'Application security',
            },
            {
                url: '#',
                text: 'Software principles',
            },
            {
                url: '#',
                text: 'Unwanted software policy',
            },
            {
                url: '#',
                text: 'Responsible supply chain',
            },
        ],
    },
];

export const FEATURES = [{
        icon: FeatureIcon1,
        title: 'Breakthrough Research',
        description: 'Openstreet provides breakthrough research that is both intuitive and perceptive.',
    },
    {
        icon: FeatureIcon2,
        title: 'Elite Wealth Management',
        description: 'Openstreet is an elite wealth management tool that helps track and rebalance wealth in portfolios.',
    },
    {
        icon: FeatureIcon3,
        title: 'Customer Support',
        description: 'Openstreet provides fast and efficient technical support from some of our most experienced personnel.',
    },
    {
        icon: FeatureIcon4,
        title: 'Fast and Secure',
        description: 'Openstreet runs on high end servers and is secured end to end.',
    },
    {
        icon: FeatureIcon5,
        title: 'Stylish UI',
        description: 'Openstreet runs on react with UI that is eye- catching and pleasing.',
    },
];

export const SCREENSHOTS = [{
        icon: pieChart,
        title: 'Conduct Research',
        image: Screenshot1,
    },
    {
        icon: ic_settings,
        title: 'Build Portfolios',
        image: Screenshot2,
    },
    {
        icon: ic_monetization_on,
        title: 'Track Wealth',
        image: Screenshot3,
    }
];

export const TESTIMONIALS = [{
        title: 'Modern look & trending design',
        review: 'Get working experience to work with this amazing team & in future want to work together for bright future projects and also make deposit to freelancer.',
        name: 'Jon Doe',
        designation: 'CEO of Dell Co.',
        avatar: `${AuthorOne}`,
    },
    {
        title: 'Modern look & trending design',
        review: 'Lorem ipsum dolor sit amet consectetur adipisicing elit sed eiusmod tempor incididunt labore dolore features Lorem ipsum dolor sit amet consectetur.',
        name: 'Jon Doe',
        designation: 'Co Founder of IBM',
        avatar: `${AuthorTwo}`,
    },
    {
        title: 'Modern look & trending design',
        review: 'Get working experience to work with this amazing team & in future want to work together for bright future projects and also make deposit to freelancer.',
        name: 'Jeny Doe',
        designation: 'Manager of Hp co.',
        avatar: `${AuthorThree}`,
    },
];