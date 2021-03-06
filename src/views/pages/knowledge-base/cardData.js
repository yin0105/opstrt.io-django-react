import img1 from "../../../assets/img/pages/graphic-1.png"
import img2 from "../../../assets/img/pages/graphic-2.png"
import img3 from "../../../assets/img/pages/graphic-3.png"
import img4 from "../../../assets/img/pages/graphic-4.png"
import img5 from "../../../assets/img/pages/graphic-5.png"
import img6 from "../../../assets/img/pages/graphic-6.png"

export const data = [{
        id: 1,
        img: img1,
        title: "Company Research Report",
        text: "Muffin lemon drops chocolate carrot cake chocolate bar sweet roll."
    },
    {
        id: 2,
        img: img2,
        title: "Portfolio Generation and Tracking",
        text: "Gingerbread sesame snaps wafer soufflé. Macaroon brownie ice cream."
    },
    {
        id: 3,
        img: img3,
        title: "Execution, Rebalancing and Exiting",
        text: "cotton candy caramels danish chocolate cake pie candy. Lemon drops tart.."
    }
]

export const categories = [{
        id: 1,
        did: 1,
        title: "Research Reports:",
        questions: [{
                qid: 11,
                question: 'What kind of research does openstreet provide?',
                answer: 'Openstreet provides top-level ratings matrix for stocks as well as Stock-specific research which is broken down into company analysis, insider analysis and institutional analysis.'
            },
            {
                qid: 12,
                question: 'What does the top-level ratings matrix consist of and how is it computed? ',
                answer: 'The top-level rating matrix is computed through the aggregation of the metrics in the following 8 risk categories by listing, then calculation of the CDF for each of the listings, based on the distribution obtained.'
            },
            {
                qid: 13,
                question: 'What is the universe of stocks that are screened in this report? ',
                answer: 'Openstreet mainly analyzes stocks in the S&P 500 index. These stocks are the major movers of the stock market.'
            },
            {
                qid: 14,
                question: 'What data is used to prepare the research report?',
                answer: 'OpenStreet derives analytics from Quandl, Sharadar fundamental data which is extracted, standardized and organized from the company filings.'
            },
            {
                qid: 15,
                question: 'How often are the research reports updated? ',
                answer: 'Research reports are updated quarterly. The underlying data that is derived from the company filings is also updated quarterly.'
            }
        ]
    },
    {
        id: 3,
        did: 1,
        title: "Insider Analysis: ",
        questions: [{
            qid: 31,
            question: 'What is provided under insider analysis?',
            answer: 'Insider Analysis provides the top 10 insider trades on the buy and sell-side and the trend in aggregate insider trades. '
        }, {
            qid: 32,
            question: 'Why is insider analysis important? ',
            answer: 'Academic studies with US data suggest insiders can earn above-normal profits on trades. Findings suggest that company insiders may be better informed than average investors about their firms’ prospects. Lakonishok and Lee, “Are Insider Trades Informative?” The Review of Financial Studies, spring 2001'
        }]
    },
    {
        id: 4,
        did: 1,
        title: "Institutional Analysis:",
        questions: [{
            qid: 41,
            question: 'What is provided under institutional analysis? ',
            answer: 'Institutional Analysis provides the aggregate institutional holdings by security type and the trend in institutional shares held. It also provides details of the top 10 institutions holding that company’s stock.'
        }, {
            qid: 42,
            question: 'Why is institutional analysis important? ',
            answer: 'Tracking and analyzing the flow of institutional funds into the company’s stock provides potentially profitable insights into where “smart money” is investing.'
        }]
    },
    {
        id: 2,
        did: 1,
        title: "Company Analysis:",
        questions: [{
                qid: 21,
                question: 'What is Company Health and how is it computed? ',
                answer: 'Company health helps assess the company’s good standing. OpenStreet examines:',
                subanswers: [
                    '5yr Revenue Growth calculated as an increase in sales in one year compared to sales of a previous year averaged over 5 years',
                    'Uncertainty in Revenue Growth measures annualized volatility in revenue growth',
                    '5yr Average Profit Margin represents the percentage of sales turned into profits, averaged over 5 years',
                    '5yr Average Market Share growth is the percent of total sales in an industry generated by this particular company, averaged over 5 years'
                ]
            },
            {
                qid: 22,
                question: 'What is Company Yield and how is it computed? ',
                answer: 'Company yield helps assess the company’s cash flow and how it decides to distribute yields among shareholders. OpenStreet examines:',
                subanswers: [
                    'The 5yr Average Dividend Yield, expressed as a percentage, shows how much the company pays out in dividends each year, relative to its stock price, averaged over 5 years ',
                    'A 5yr Average Earnings Yield refers to the earnings per share for the most recent 12-month period, divided by the current market price per share, averaged over 5 years',
                    'The 5yr Average Dividend Payout Ratio is the comparative ratio of the total amount of dividends paid out to shareholders relative to net income, averaged over 5 years',
                    'A 5yr Average Free Cash Flow (FCF) represents the cash a company generates after accounting for cash outflows to support operations and maintain its capital assets, averaged over 5 years'
                ]
            },
            {
                qid: 23,
                question: 'What is Company Quality and how is it computed?',
                answer: 'Company quality helps assess the company’s debt levels and return on equity. OpenStreet examines:',
                subanswers: [
                    'The 5yr Average Debt-to-Equity (D/E) ratio, calculated by dividing a company’s total liabilities by its shareholder equity, averaged over 5 years',
                    'A 5yr Average Return on Invested Capital (ROIC) is a calculation used to assess efficiency at allocating the capital under the company’s control toward profitable investments, averaged over 5 years',
                    'The 5yr Average Growth in Return on Equity (ROE) measures financial performance calculated by dividing net income by shareholder’s equity. OpenStreet calculates y-o-y growth and averages over 5 years',
                    'Uncertainty in ROE Growth measures the annualized volatility in ROE growth'
                ]
            },
            {
                qid: 24,
                question: 'What is Industry Rank and how is it computed? ',
                answer: 'Industry Rank helps assess how the company is fairing compared to its peers in the same industry. OpenStreet examines Value, Quality and Profitability to rank the stocks.',
                subanswers: [
                    'Value considers book-to-price, sales-to-price, and free cash flow',
                    'Quality considers return on equity, equity-to-debt, and return on invested capital',
                    'Profitability considers earnings yield and net profit margin'
                ]
            },
            {
                qid: 25,
                question: 'Why is industry Rank important? ',
                answer: 'Factors capture risk premia i.e., stocks and portfolios that historically demonstrate excess market returns in the long-term. These transparent, rules-based systems can help screen specific stocks with favorable characteristics. Backed by powerful empirical results, the industry rank factor provides replicability, simple implementation, and works for traditional active and passive mandates. '
            },
            {
                qid: 26,
                question: 'What is Fair Value and how is it computed? ',
                answer: 'Fair Value helps assess the fair price of the company’s stock. OpenStreet employs two methods:',
                subanswers: [
                    'Fair Value by Dividend Discount Model (DDM) based on the present value of expected dividends, adjusted for growth and volatility. The DDM model discounts expected future dividends to present values, thus estimating if shares are over or undervalued.',
                    'Fair Value by Free Cash Flow Model (FCFM) uses the company’s intrinsic value as equal to the present value of free cash flow. The net cash flow available for distribution to stockholders, adjusted for growth and volatility'
                ]
            },
            {
                qid: 27,
                question: 'What is Market Risk and how is it computed?',
                answer: 'Risk helps assess the uncertainty of the company’s stock price.',
                subanswers: [
                    'Annualized Volatility is the annualized uncertainty in price movements',
                    'Max Drawdown is the maximum downward movement over past 5 years',
                    'Correlation with Market is how closely the company’s stock tracks market movements'
                ]
            },
            {
                qid: 28,
                question: 'Why is Market Risk important?',
                answer: 'We track market risk to determine if other prospective shareholders might be willing to offer less to own a stock than your offer. We must protect ourselves from this risk by owning stocks with historically smaller drawdowns and less correlation with the market as a whole. '
            }
        ]
    },
    {
        id: 5,
        did: 2,
        title: "Portfolio and Portfolio Rule List:",
        questions: [{
            qid: 51,
            question: 'What is a portfolio and what are portfolio rules? ',
            answer: 'A portfolio is a group of assets that represent a person or entity’s holdings. Portfolio rules are a list of conditions applied on an asset universe to derive a portfolio. For Eg., rule: select stocks that have ‘company health’ greater than 90; selects stocks where the company health rating is greater than 90. You could chain two or more such rules to obtain a desirable portfolio.  '
        }, {
            qid: 52,
            question: 'What parameters are needed to generate a portfolio? ',
            answer: 'To generate a portfolio, you need the allocation or the amount of funds you would like to allocate to the portfolio. Next, you want the list of assets you would like to add to your holdings. You also need the weights for each assets that you are adding to the portfolio. In the openstreet form, you are also requested an effective date and name for the portfolio. The effective date determines when the portfolio comes into existence. If you enter an older date, the prices of assets from that date will be used as entry price for assets.'
        }]
    },
    {
        id: 6,
        did: 2,
        title: "Tracking performance: ",
        questions: [{
            qid: 61,
            question: 'What are the main stats and graphs that are used to track performance of a portfolio? ',
            answer: 'Performance of a portfolio is tracked using the portfolio wealth graph. The stats used are Net Value, Change, Historical Return, Historical Risk, Historical Sharpe, Aggregate Industry Rank, Portfolio Health, Portfolio Yield, Portfolio Quality, Insider Rating, Institutional Rating, Fair Value Rating and Aggregate Risk Rating. '
        }, {
            qid: 62,
            question: 'What is Historical Return and how is it computed? ',
            answer: 'Historical Return is the annualized return over the last 5 years for the portfolio. The annualized return formula is calculated as a geometric average to show what an investor would earn over a period of time if the annual return was compounded.'
        }, {
            qid: 63,
            question: 'What is Historical Risk and how is it computed? ',
            answer: 'Historical Risk is the annualized risk over the last 5 years for the portfolio. A stock\'s risk is the variation in its price over a period of time. For example, one stock may have a tendency to swing wildly higher and lower, while another stock may move in much steadier, less turbulent way. Both stocks may end up at the same price at the end of day, but their path to that point can vary wildly. To present this volatility in annualized terms, we simply need to multiply our daily standard deviation by the square root of 252.'
        }, {
            qid: 64,
            question: 'What is Sharpe ratio and how is it computed?',
            answer: 'The Sharpe ratio was developed by Nobel laureate William F. Sharpe and is used to help investors understand the return of an investment compared to its risk. The ratio is the average return earned in excess of the risk-free rate per unit of volatility or total risk.'
        }, {
            qid: 65,
            question: 'Why is Sharpe ratio important?',
            answer: 'The Sharpe ratio can help explain whether a portfolio\'s excess returns are due to smart investment decisions or a result of too much risk. Although one portfolio or fund can enjoy higher returns than its peers, it is only a good investment if those higher returns do not come with an excess of additional risk.'
        }, {
            qid: 66,
            question: 'How is the Wealth Graph computed?  ',
            answer: 'Wealth graph is the portfolio value computed daily over a historical period of 5 years. It is computed by aggregating the value for each stock in the portfolio everyday for 5 years.'
        }, {
            qid: 67,
            question: 'How are Aggregate Risk scores computed? ',
            answer: 'Aggregate risk scores are obtained by computing the weighted average of the risk rating across the stocks in the portfolio. '
        }]
    },
    {
        id: 7,
        did: 3,
        title: "Execution:",
        questions: [{
            qid: 71,
            question: 'How is the portfolio executed? ',
            answer: 'Portfolio is executed by placing market buy orders on the names in the portfolio with the given stock shares. In openstreet, portfolios are executed via TD Ameritrade API. User must first create an account with TD Ameritrade and then he/she will be prompted to connect the brokerage account with openstreet before executing the portfolio. '
        }, {
            qid: 72,
            question: 'How to check if the portfolio executed correctly?',
            answer: 'Once the portfolio is executed, the recent orders sent will be displayed on the portfolios page which shows the names of the executed portfolio. You could also check with your brokerage if the orders have been executed correctly.'
        }, {
            qid: 73,
            question: 'How to update the portfolio according to the executions? ',
            answer: 'You can update the portfolio according to the executions by hitting sync. Sync checks at your currently positions and makes changes in the portfolio saved on openstreet.'
        }]
    },
    {
        id: 8,
        did: 3,
        title: "Rebalancing:",
        questions: [{
            qid: 81,
            question: 'What is rebalancing? ',
            answer: 'Rebalancing is the process of realigning the weightings of a portfolio of assets. Rebalancing involves periodically buying or selling assets in a portfolio to maintain an original or desired level of asset allocation or risk.'
        }, {
            qid: 82,
            question: 'How is rebalancing carried out? ',
            answer: 'Rebalancing is carried out by re-applying the portfolio rules and making the necessary changes in the portfolio by buying and selling assets.'
        }, {
            qid: 83,
            question: 'How often can I rebalance? ',
            answer: 'It is recommended to rebalance quarterly or semi-annually. The underlying data changes quarterly.'
        }]
    },
    {
        id: 9,
        did: 3,
        title: "Exiting: ",
        questions: [{
            qid: 91,
            question: 'What is the process of exiting the portfolio allocations? ',
            answer: 'Exiting the portfolio involves selling all the stakes in the portfolio holdings. Once you hit the exit portfolio button, openstreet automatically sends orders to sell the portfolio constituents.'
        }, {
            qid: 92,
            question: 'What happens after I exit? ',
            answer: 'After exiting, the portfolio listing is returned to virtual portfolio state.'
        }, {
            qid: 93,
            question: 'Can I execute the portfolio again after exiting? ',
            answer: 'Yes, you can execute the portfolio again by hitting the execute button.'
        }]
    }
]