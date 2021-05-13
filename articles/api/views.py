from rest_framework import viewsets
from rest_framework.response import Response
from articles.models import FinalCSV, FinalCSVTable, UserPortfolio, UserPortfolioStats, TDState, Strategies, Crypto, BinanceAPI
from .serializers import FinalCSVSerializer, FinalCSVTableSerializer, TableSerializer, PortfolioSerializer, StrategiesSerializer, PortfolioStatsSerializer, UserSerializer, CryptoSerializer
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
from pyfolio import timeseries as ts
import talib
import yfinance as yf 
import pandas as pd
import numpy as np
import quandl
import pytz
import json
from datetime import datetime as dt
from td.client import TDClient
from rest_framework import generics
from td.utils import TDUtilities
import requests
from datetime import timedelta
import datetime
from rest_framework import status
from pandas.tseries.offsets import BDay
from rest_framework.pagination import PageNumberPagination
from rest_framework.decorators import api_view
from django.http import HttpResponseNotFound
import datanews
pd.set_option('use_inf_as_na', True)
import requests
from binance.client import Client
from scheduler.indicators import indicators_c, indicators_hl, indicators_hlc, indicators_ohlc, price_columns
import inspect
from sklearn.neural_network import MLPClassifier
from sklearn.tree import DecisionTreeClassifier, DecisionTreeRegressor

import time
quandl.ApiConfig.api_key="XVyca-iwEKxHPLniCt5D"

class TDClientAuth(TDClient):
    def __init__(self, user, client_id: str, redirect_uri: str, account_number: str = None, 
                       auth_flow: str = 'default', _do_init: bool = True) -> None:     

        # Define the configuration settings.
        self.config = {
            'cache_state': True,
            'api_endpoint': 'https://api.tdameritrade.com',
            'api_version': 'v1',
            'auth_endpoint': 'https://auth.tdameritrade.com/auth',
            'token_endpoint': 'oauth2/token',
            'refresh_enabled': True
        }
        
        # Define the initalized state, these are the default values.
        self.state = {
            'access_token': None,
            'refresh_token': None,
            'logged_in': False
        }

        self.auth_flow = auth_flow
        self.client_id = client_id
        self.redirect_uri = redirect_uri
        self.account_number = account_number
        
        self.user = TDState.objects.filter(user=User(id=user))
        if(not self.user):
            self.user=TDState(user=User(id=user), td_state=json.loads("[]"))
        else:
            self.user = self.user[0]
        self._td_utilities = TDUtilities()

        
        self._flask_app = None
        
        # define a new attribute called 'authstate' and initialize to `False`. This will be used by our login function.
        self.authstate = False

        # call the state_manager method and update the state to init (initalized)
        if _do_init:
            self._state_manager('init')

        # Initalize the client with no streaming session.
        self.streaming_session = None

    def exchange_code_for_token(self, code: str, return_refresh_token: bool) -> dict:
        # Define the parameters of our access token post.
        data = {
            'grant_type': 'authorization_code',
            'client_id': self.client_id + '@AMER.OAUTHAP',
            'code': self.code,
            'redirect_uri': self.redirect_uri
        }

        if return_refresh_token:
            data['access_type'] = 'offline'

        # Make the request.
        response = requests.post(
            url="https://api.tdameritrade.com/v1/oauth2/token",
            headers={'Content-Type': 'application/x-www-form-urlencoded'},
            data=data
        )
        
        if response.ok:

            self._token_save(
                token_dict=response.json(),
                includes_refresh=True
            )

            return True

    def oauth(self, code) -> None:
        self.code = code

        # Exchange the Code for an Acess Token.
        self.exchange_code_for_token(
            code=self.code,
            return_refresh_token=True
        )
    def login_from_file(self) -> bool:
        """Logs the user into the TD Ameritrade API.

        Ask the user to authenticate  themselves via the TD Ameritrade Authentication Portal. This will
        create a URL, display it for the User to go to and request that they paste the final URL into
        command window. Once the user is authenticated the API key is valide for 90 days, so refresh
        tokens may be used from this point, up to the 90 days.

        ### Returns:
        ----
        {bool} -- Specifies whether it was successful or not.
        """

        # Only attempt silent SSO if the credential file exists.
        if self.user.td_state!=None and self._silent_sso():
            
            self.authstate = True
            return True
        else:
            return False
        
        if self._flask_app and self.auth_flow == 'flask':
            run(flask_client=self._flask_app, close_after=True)

    def _state_manager(self, action: str) -> None:
        """Manages the session state.

        Manages the self.state dictionary. Initalize State will set
        the properties to their default value. Save will save the 
        current state if 'cache_state' is set to TRUE.

        ### Arguments:
        ----
        action {str}: action argument must of one of the following:
            'init' -- Initalize State.
            'save' -- Save the current state.
        """

        # if they allow for caching and the file exists then load it.
        if action == 'init' and self.user.td_state!=None:
            self.state.update(self.user.td_state)

        # if they want to save it and have allowed for caching then load the file.
        elif action == 'save':    
            self.user.td_state = self.state
            self.user.save()

    def login_from_code(self, code) -> bool:
        """Logs the user into the TD Ameritrade API.

        Ask the user to authenticate  themselves via the TD Ameritrade Authentication Portal. This will
        create a URL, display it for the User to go to and request that they paste the final URL into
        command window. Once the user is authenticated the API key is valide for 90 days, so refresh
        tokens may be used from this point, up to the 90 days.

        ### Returns:
        ----
        {bool} -- Specifies whether it was successful or not.
        """

        # Only attempt silent SSO if the credential file exists.
        self.oauth(code)
        self.authstate = True
        return True
        
        if self._flask_app and self.auth_flow == 'flask':
            run(flask_client=self._flask_app, close_after=True)

    def validate_token(self) -> bool:
        """Validates whether the tokens are valid or not.

        ### Returns
        -------
        bool
            Returns `True` if the tokens were valid, `False` if
            the credentials file doesn't exist.
        """

        if 'refresh_token_expires_at' in self.state and 'access_token_expires_at' in self.state:

            # Grab the Expire Times.
            refresh_token_exp = self.state['refresh_token_expires_at']
            access_token_exp = self.state['access_token_expires_at']

            refresh_token_ts = datetime.datetime.fromtimestamp(refresh_token_exp)
            access_token_ts = datetime.datetime.fromtimestamp(access_token_exp)

            # Grab the Expire Thresholds.
            refresh_token_exp_threshold = refresh_token_ts - timedelta(days=2)
            access_token_exp_threshold = access_token_ts - timedelta(minutes=5)

            # Convert to Seconds.
            refresh_token_exp_threshold = refresh_token_exp_threshold.timestamp()
            access_token_exp_threshold = access_token_exp_threshold.timestamp()

            # See if we need a new Refresh Token.
            if datetime.datetime.now().timestamp() > refresh_token_exp_threshold:
                print("Grabbing new refresh token...")
                self.grab_refresh_token()

            # See if we need a new Access Token.
            if datetime.datetime.now().timestamp() > access_token_exp_threshold:
                print("Grabbing new access token...")
                self.grab_access_token()

            return True

        else:
            
            return False
    


class FinalCSVViewSet(viewsets.ModelViewSet):
    """
    A viewset for viewing and editing user instances.
    """
    serializer_class = FinalCSVSerializer

    def get_queryset(self):
        queryset = FinalCSV.objects.all()
        return queryset

    def apply_filters(self, queryset, min_health, min_yield, min_quality, min_risk, min_fair_value, industry, max_industry_rank, min_insider_rating, min_inst_rating):
        print('applying filters')
        if(industry):
            if(industry!=''):
                print('applying industry filter', str(industry))
                queryset = queryset.filter(industry__contains=industry)
        if(min_health):
            if(min_health!=0):
                print('applying health filter', min_health)
                queryset = queryset.filter(company_health__gt=float(min_health))
        if(min_yield):
            if(min_yield!=0):
                print('applying yield filter', min_yield)
                queryset = queryset.filter(company_yield__gt=float(min_yield))
        if(min_quality):
            if(min_quality!=0):
                print('applying quality filter',min_quality)
                queryset = queryset.filter(company_quality__gt=float(min_quality))
        if(max_industry_rank):
            if(max_industry_rank!=100):
                print('applying industry filter', max_industry_rank)
                queryset = queryset.filter(industry_rank__lt=float(max_industry_rank))
        if(min_fair_value):
            if(min_fair_value!=0):
                print('applying fair value filter', min_fair_value)
                queryset = queryset.filter(fair_value_score__gt=float(min_fair_value))
        if(min_risk):
            if(min_risk!=0):
                print('applying risk filter',min_risk)
                queryset = queryset.filter(risk_score__gt=min_risk)
        if(min_insider_rating):
            if(min_insider_rating!=0):
                print('applying insider filter',min_insider_rating)
                queryset = queryset.filter(net_value_executed_pct__gt=float(min_insider_rating))
        if(min_inst_rating):
            if(min_inst_rating!=0):
                print('applying inst filter',min_inst_rating)
                queryset = queryset.filter(net_holding_pct__gt=float(min_inst_rating))
        
        return queryset


    def get_empty_stats(self, portfolio_name, queryset_token):
        portfolio_wealth_graph = "[]"
        portfolio_constituents = "[]"
        ps = UserPortfolioStats(name=UserPortfolio(user=User(id=queryset_token.values()[0]['user_id']), portfolio_name=portfolio_name), portfolio_wealth_graph=json.loads(portfolio_wealth_graph), portfolio_constituents=json.loads(portfolio_constituents))
        serializer = PortfolioStatsSerializer(ps)
        ps.save()
        psquery = UserPortfolioStats.objects.filter(name=UserPortfolio(user=User(id=queryset_token.values()[0]['user_id']), portfolio_name=portfolio_name))  
        serializer = PortfolioStatsSerializer(psquery, many=True)
        return serializer

    def get_hypo_stats(self, portfolio, portfolio_name, queryset_token, allocation):
        portfolio_wealth_graph = "[]"
        portfolio['weight'] = (1/ len(portfolio['ticker']))
        portfolio_health = round((portfolio['weight'] * portfolio['company_health']).sum())
        portfolio_yield = round((portfolio['weight'] * portfolio['company_yield']).sum())
        portfolio_quality = round((portfolio['weight'] * portfolio['company_quality']).sum())
        portfolio_industry_rank = round((portfolio['weight'] * portfolio['industry_rank']).sum())
        portfolio_fair_value = round((portfolio['weight'] * portfolio['fair_value_score']).sum())
        portfolio_risk = round((portfolio['weight'] * portfolio['risk_score']).sum())
        portfolio_insider_rating = round((portfolio['weight'] * portfolio['net_value_executed_pct']).sum())
        portfolio_inst_rating = round((portfolio['weight'] * portfolio['net_holding_pct']).sum())
        portfolio['weight'] = round(portfolio['weight']*100,2)
        portfolio_constituents = json.dumps(portfolio[['ticker',
                'ticker_name',
                'initial_allocation',
                'weight', 
                'company_health',   
                'company_yield',
                'company_quality',
                'industry_rank',
                'fair_value_score',
                'risk_score',
                'net_value_executed_pct',
                'net_holding_pct']].to_dict('records'), allow_nan=False)
        ps = UserPortfolioStats(name=UserPortfolio(user=User(id=queryset_token.values()[0]['user_id']), portfolio_name=portfolio_name),
                            portfolio_change = 0,
                            portfolio_historical_return = None,
                            portfolio_historical_risk = None,
                            portfolio_historical_sharpe = None,
                            portfolio_allocation= allocation,
                            portfolio_wealth_graph=json.loads(portfolio_wealth_graph), 
                            portfolio_constituents=json.loads(portfolio_constituents),
                            portfolio_health = portfolio_health,
                            portfolio_yield =portfolio_yield,
                            portfolio_quality = portfolio_quality,
                            portfolio_industry_rank = portfolio_industry_rank,
                            portfolio_fair_value = portfolio_fair_value,
                            portfolio_risk = portfolio_risk,
                            portfolio_insider_rating = portfolio_insider_rating,
                            portfolio_inst_rating = portfolio_inst_rating)
        ps.save()
        psquery = UserPortfolioStats.objects.filter(name=UserPortfolio(user=User(id=queryset_token.values()[0]['user_id']), portfolio_name=portfolio_name))
        serializer = PortfolioStatsSerializer(psquery, many=True)
        return serializer

    def compute_shares(self, portfolio, allocation, price):
        portfolio = portfolio.merge(price[['ticker','close','volume']], how='left', on='ticker')
        portfolio = portfolio.dropna(subset=['close'])
        portfolio['weight'] = 1/portfolio['close'].count()
        portfolio['allocation'] = float(allocation)
        portfolio['shares'] = np.floor(portfolio['allocation']* portfolio['weight'] / (portfolio['close']))

        portfolio['initial_allocation'] = portfolio['shares']*portfolio['close']
        portfolio = portfolio.rename(columns={'close':'entry_price'})
        portfolio= portfolio[portfolio['shares']!=0].reset_index(drop=True)
        return portfolio

    def get_full_stats(self, portfolio, price_series, price_ref, portfolio_name, queryset_token, old_portfolio=None):
        price_series = portfolio[['shares','ticker']].merge(price_series[['ticker','date','close']], how='inner', on=['ticker'])
        portfolio_wealth = price_series.groupby(['date']).apply(lambda x: sum(x['shares']*x['close'])).sort_index().reset_index()
        portfolio_wealth = portfolio_wealth.rename(columns={0:'portfolio_wealth'})
        stats = ts.perf_stats(portfolio_wealth.set_index('date')['portfolio_wealth'].pct_change().dropna(), price_ref['Adj Close'].pct_change().dropna())
        stats['Annual return'] = stats['Annual return']*100
        stats['Annual volatility'] = stats['Annual volatility']*100
        stats['Max drawdown'] = stats['Max drawdown']*100
        stats = stats.apply(lambda x: round(x,2))
        portfolio_wealth['portfolio_wealth'] = portfolio_wealth['portfolio_wealth'].astype('float')
        portfolio_wealth['date'] = portfolio_wealth['date'].dt.strftime('%Y-%m-%d')
        portfolio_wealth = portfolio_wealth.dropna()
        portfolio_wealth_graph = json.dumps(portfolio_wealth.to_dict('records'), allow_nan=False)
        portfolio = portfolio.merge(price_series[price_series['date']==price_series['date'].max()][['ticker','close']].rename(columns={'close':'current_price'}), how='left', on='ticker')  
        portfolio = portfolio.assign(current_allocation = portfolio['shares']*portfolio['current_price'])
        portfolio['change'] = round(portfolio['current_allocation'] - portfolio['initial_allocation'],2)  
        portfolio['weight'] = portfolio['current_allocation'] / portfolio['current_allocation'].sum()
        portfolio_health = round((portfolio['weight'] * portfolio['company_health']).sum())
        portfolio_yield = round((portfolio['weight'] * portfolio['company_yield']).sum())
        portfolio_quality = round((portfolio['weight'] * portfolio['company_quality']).sum())
        portfolio_industry_rank = round((portfolio['weight'] * portfolio['industry_rank']).sum())
        portfolio_fair_value = round((portfolio['weight'] * portfolio['fair_value_score']).sum())
        portfolio_risk = round((portfolio['weight'] * portfolio['risk_score']).sum())
        portfolio_insider_rating = round((portfolio['weight'] * portfolio['net_value_executed_pct']).sum())
        portfolio_inst_rating = round((portfolio['weight'] * portfolio['net_holding_pct']).sum())
        portfolio['weight'] = round(portfolio['weight']*100,2)
        portfolio['current_allocation'] = round(portfolio['current_allocation'],2)
        portfolio_change = round(portfolio['change'].sum(),2)
        portfolio_allocation = round(portfolio['current_allocation'].sum(),2)
        portfolio_historical_return = round(((portfolio_allocation/portfolio_wealth.head(1)['portfolio_wealth'] )**(252/len(portfolio_wealth)) -1)*100, 2)
        portfolio_historical_risk = round(np.sqrt(252)*(np.std(portfolio_wealth['portfolio_wealth'].pct_change()))*100,2)
        portfolio_historical_sharpe = round(portfolio_historical_return / portfolio_historical_risk,2)
        columns=['ticker',
                'ticker_name',
                'shares',
                'entry_price', 
                'current_price',
                'initial_allocation',
                'current_allocation',
                'change',
                'weight',
                'company_health',
                'company_yield',
                'company_quality',
                'industry_rank',
                'fair_value_score',
                'risk_score',
                'net_value_executed_pct',
                'net_holding_pct']
        constituents = (portfolio[columns].fillna('nan'))
        portfolio_constituents = json.dumps(constituents.to_dict('records'), allow_nan=False)
        print(stats)
        pf_stats = json.dumps(pd.DataFrame(stats).dropna().transpose().to_dict('records'), allow_nan=False)
        ps = UserPortfolioStats(name=UserPortfolio(user=User(id=queryset_token.values()[0]['user_id']), portfolio_name=portfolio_name),
                            pf_stats = pf_stats,
                            portfolio_historical_return = portfolio_historical_return,
                            portfolio_historical_risk = portfolio_historical_risk,
                            portfolio_historical_sharpe = portfolio_historical_sharpe,
                            portfolio_change = portfolio_change,
                            portfolio_allocation= portfolio_allocation,
                            portfolio_wealth_graph=json.loads(portfolio_wealth_graph), 
                            portfolio_constituents=json.loads(portfolio_constituents),
                            old_portfolio_constituents=old_portfolio,
                            portfolio_health = portfolio_health,
                            portfolio_yield =portfolio_yield,
                            portfolio_quality = portfolio_quality,
                            portfolio_industry_rank = portfolio_industry_rank,
                            portfolio_fair_value = portfolio_fair_value,
                            portfolio_risk = portfolio_risk,
                            portfolio_insider_rating = portfolio_insider_rating,
                            portfolio_inst_rating = portfolio_inst_rating)
       
        UserPortfolioStats.objects.filter(name=UserPortfolio(user=User(id=queryset_token.values()[0]['user_id']), portfolio_name=portfolio_name)).delete()
        ps.save()
        psquery = UserPortfolioStats.objects.filter(name=UserPortfolio(user=User(id=queryset_token.values()[0]['user_id']), portfolio_name=portfolio_name))
        serializer = PortfolioStatsSerializer(psquery, many=True)
        
        
        return serializer

    def compute_portfolio(self):
        token = self.request.query_params.get('token', None)
        allocation = self.request.query_params.get('allocation', None)
        date_created = self.request.query_params.get('date_created', None)
        portfolio_name = self.request.query_params.get('portfolio_name', None)
        queryset_token = Token.objects.filter(key=token)
        bday = dt.strptime(date_created, '%Y-%m-%d') - BDay(1)
        ps = UserPortfolioStats.objects.filter(name=UserPortfolio(user=User(id=queryset_token.values()[0]['user_id']), portfolio_name=portfolio_name))
        
        if len(ps.values()):
            if(len(ps.values()[0]['portfolio_constituents'])):
                portfolio = pd.DataFrame(ps.values()[0]['portfolio_constituents'])
                if 'shares' not in portfolio.columns:
                    columns=['ticker',
                    'ticker_name',
                    'company_health',
                    'company_yield',
                    'company_quality',
                    'industry_rank',
                    'fair_value_score',
                    'risk_score',
                    'net_value_executed_pct',
                    'net_holding_pct']
                    portfolio = portfolio[columns]
                else:
                    columns=['ticker',
                    'ticker_name',
                    'shares',
                    'entry_price',
                    'company_health',
                    'company_yield',
                    'company_quality',
                    'industry_rank',
                    'fair_value_score',
                    'risk_score',
                    'net_value_executed_pct',
                    'net_holding_pct']
                    portfolio = portfolio[columns]
            else:
                queryset = FinalCSV.objects.all()
                min_health = self.request.query_params.get('min_health', None)
                min_yield = self.request.query_params.get('min_yield', None)
                min_quality = self.request.query_params.get('min_quality', None)
                min_risk = self.request.query_params.get('min_risk', None)
                min_fair_value = self.request.query_params.get('min_fair_value', None)
                industry = self.request.query_params.get('industry', None)
                max_industry_rank = self.request.query_params.get('max_industry_rank', None)
                min_insider_rating = self.request.query_params.get('min_insider_rating', None)
                min_inst_rating = self.request.query_params.get('min_inst_rating', None)
                queryset = self.apply_filters(queryset, min_health, min_yield, min_quality, min_risk, min_fair_value, industry, max_industry_rank, min_insider_rating, min_inst_rating)
                portfolio = pd.DataFrame(queryset.values()).infer_objects()
                
        else:
            queryset = FinalCSV.objects.all()
            min_health = self.request.query_params.get('min_health', None)
            min_yield = self.request.query_params.get('min_yield', None)
            min_quality = self.request.query_params.get('min_quality', None)
            min_risk = self.request.query_params.get('min_risk', None)
            min_fair_value = self.request.query_params.get('min_fair_value', None)
            industry = self.request.query_params.get('industry', None)
            max_industry_rank = self.request.query_params.get('max_industry_rank', None)
            min_insider_rating = self.request.query_params.get('min_insider_rating', None)
            min_inst_rating = self.request.query_params.get('min_inst_rating', None)
            queryset = self.apply_filters(queryset, min_health, min_yield, min_quality, min_risk, min_fair_value, industry, max_industry_rank, min_insider_rating, min_inst_rating)
            portfolio = pd.DataFrame(queryset.values()).infer_objects()
        if(portfolio.empty):
            if(len(ps.values())):
                ps.delete()
            serializer = self.get_empty_stats(portfolio_name, queryset_token)
            return serializer
        if 'shares' not in portfolio.columns:
            portfolio['initial_allocation'] = float(allocation) / len(portfolio['ticker'])
        else:
            portfolio['initial_allocation'] = (portfolio['shares']*portfolio['entry_price'])
        print("getting price series")
        price_series = quandl.get_table('SHARADAR/SEP', date={'gte':'2015-01-01'}, ticker=portfolio['ticker'], paginate=True)
        price_ref = yf.download('SPY','2015-01-01',dt.strftime(bday, '%Y-%m-%d'))
        #price_ref = quandl.get_table('SHARADAR/SEP', date={'gte':'2015-01-01'}, ticker='AAPL', paginate=True)
        price = quandl.get_table('SHARADAR/SEP', ticker=portfolio['ticker'], date=dt.strftime(bday, '%Y-%m-%d'), paginate=True)
        print("obtained price series")
        price = price.dropna(subset=['close'])
        if(price.empty):
            serializer = self.get_hypo_stats(portfolio, portfolio_name, queryset_token, allocation)
            return serializer
        if 'shares' not in portfolio.columns:
            portfolio = self.compute_shares(portfolio, allocation, price)
            if portfolio.empty:
                portfolio_wealth_graph = "[]"
                portfolio_constituents = "[]"
                ps = UserPortfolioStats(name=UserPortfolio(user=User(id=queryset_token.values()[0]['user_id']), portfolio_name=portfolio_name), portfolio_wealth_graph=json.loads(portfolio_wealth_graph), portfolio_constituents=json.loads(portfolio_constituents))
                serializer = PortfolioStatsSerializer(ps)
                ps.save()
                psquery = UserPortfolioStats.objects.filter(name=UserPortfolio(user=User(id=queryset_token.values()[0]['user_id']), portfolio_name=portfolio_name))  
                serializer = PortfolioStatsSerializer(psquery, many=True)
                return serializer
        print(portfolio)
        serializer = self.get_full_stats(portfolio, price_series, price_ref, portfolio_name, queryset_token)
        return serializer

    def rebalance_portfolio(self):
        yesterday = dt.now() - timedelta(1)
        bday = yesterday - BDay(1)
        token = self.request.query_params.get('token', None)
        queryset_token = Token.objects.filter(key=token)
        allocation = self.request.query_params.get('allocation', None)
        date_created = self.request.query_params.get('date_created', None)
        portfolio_name = self.request.query_params.get('portfolio_name', None)
        min_health = self.request.query_params.get('min_health', None)
        min_yield = self.request.query_params.get('min_yield', None)
        min_quality = self.request.query_params.get('min_quality', None)
        min_risk = self.request.query_params.get('min_risk', None)
        min_fair_value = self.request.query_params.get('min_fair_value', None)
        industry = self.request.query_params.get('industry', None)
        max_industry_rank = self.request.query_params.get('max_industry_rank', None)
        min_insider_rating = self.request.query_params.get('min_insider_rating', None)
        min_inst_rating = self.request.query_params.get('min_inst_rating', None)
        queryset = FinalCSV.objects.all()
        queryset = self.apply_filters(queryset, min_health, min_yield, min_quality, min_risk, min_fair_value, industry, max_industry_rank, min_insider_rating, min_inst_rating)
        portfolio = pd.DataFrame(queryset.values()).infer_objects()
        ps = UserPortfolioStats.objects.filter(name=UserPortfolio(user=User(id=queryset_token.values()[0]['user_id']), portfolio_name=portfolio_name))
        if len(ps.values()):
            if(len(ps.values()[0]['portfolio_constituents'])):
                old_portfolio = ps.values()[0]['portfolio_constituents']
        else:
            old_portfolio = None
        if(portfolio.empty):
            serializer = self.get_empty_stats(portfolio_name, queryset_token)
            return serializer
        portfolio['initial_allocation'] = float(allocation) / len(portfolio['ticker'])
        print("getting price series")
        price_series = quandl.get_table('SHARADAR/SEP', date={'gte':'2015-01-01'}, ticker=portfolio['ticker'], paginate=True)
        price = quandl.get_table('SHARADAR/SEP', ticker=portfolio['ticker'], date=dt.strftime(bday, '%Y-%m-%d'), paginate=True)
        print("obtained price series")
        price = price.dropna(subset=['close'])
        if(price.empty):
            serializer = self.get_hypo_stats(portfolio, portfolio_name, queryset_token, allocation)
            return serializer
        if 'shares' not in portfolio.columns:
            portfolio = self.compute_shares(portfolio, allocation, price)
            if portfolio.empty:
                portfolio_wealth_graph = "[]"
                portfolio_constituents = "[]"
                ps = UserPortfolioStats(name=UserPortfolio(user=User(id=queryset_token.values()[0]['user_id']), portfolio_name=portfolio_name), portfolio_wealth_graph=json.loads(portfolio_wealth_graph), portfolio_constituents=json.loads(portfolio_constituents))
                serializer = PortfolioStatsSerializer(ps)
                ps.save()
                psquery = UserPortfolioStats.objects.filter(name=UserPortfolio(user=User(id=queryset_token.values()[0]['user_id']), portfolio_name=portfolio_name))  
                serializer = PortfolioStatsSerializer(psquery, many=True)
                return serializer
        po = UserPortfolio.objects.get(user=User(id=queryset_token.values()[0]['user_id']), portfolio_name=portfolio_name)
        po.date_created= dt.strftime(bday, '%Y-%m-%d')
        po.save()
        
        serializer = self.get_full_stats(portfolio, price_series, portfolio_name, queryset_token, old_portfolio)
        return serializer

    def list(self, request, *args, **kwargs):
        action = self.request.query_params.get('action', None)
        if action=='prices':
            ticker = self.request.query_params.get('ticker', None)
            price_series = quandl.get_table('SHARADAR/SEP', date={'gte':'2015-01-01'}, ticker=ticker, paginate=True)
            price_series = price_series.sort_values(by=['date']).reset_index(drop=True)
            price_series['value'] = (price_series['close'].pct_change()+1)

            price_series['value'].loc[0]=100
            price_series = price_series.dropna(subset=['value','close'])
            price_series['value'] = price_series['value'].cumprod().apply(lambda x:round(x,2))
            price_series['time'] = price_series['date'].dt.strftime('%Y-%m-%d')
            return Response({'last_price':price_series['close'].tail(1) ,'prices':price_series.to_dict('records')})
        if action=='news':
            datanews.api_key = '08qu938b4y5v8dem2w521v76v'
            response = datanews.headlines(q='finance', source='wsj.com', language=['en'], sortBy='date')
            return Response(response)
        if action=='compute':
            serializer = self.compute_portfolio()
            return Response(serializer.data)
        elif action=='execute':
            serializer = self.compute_portfolio()
            return Response(serializer.data)
        elif action=='rebalance':
            serializer_new = self.rebalance_portfolio()
            return Response(serializer_new.data)
        elif action=='search':
            allocation = self.request.query_params.get('allocation', None)
            date_created = self.request.query_params.get('date_created', None)
            portfolio_name = self.request.query_params.get('portfolio_name', None)
            min_health = self.request.query_params.get('min_health', None)
            min_yield = self.request.query_params.get('min_yield', None)
            min_quality = self.request.query_params.get('min_quality', None)
            min_risk = self.request.query_params.get('min_risk', None)
            min_fair_value = self.request.query_params.get('min_fair_value', None)
            industry = self.request.query_params.get('industry', None)
            max_industry_rank = self.request.query_params.get('max_industry_rank', None)
            min_insider_rating = self.request.query_params.get('min_insider_rating', None)
            min_inst_rating = self.request.query_params.get('min_inst_rating', None)
            queryset = FinalCSV.objects.all()
            queryset = self.apply_filters(queryset, min_health, min_yield, min_quality, min_risk, min_fair_value, industry, max_industry_rank, min_insider_rating, min_inst_rating)
            serializer = TableSerializer(queryset, many=True)
            return Response(serializer.data)
        

class PortfolioViewSet(viewsets.ModelViewSet):
    """
    A viewset for viewing and editing user instances.
    """
    serializer_class = PortfolioSerializer

    def create(self, request):
        token = self.request.query_params.get('token', None)
        queryset_token = Token.objects.filter(key=token)
        po = UserPortfolio.objects.filter(pk=request.data['portfolio_name'])
        request.data['user'] = User(pk=queryset_token.values()[0]['user_id'])
        if len(po.values())==0:
            if(request.data['custom_portfolio']):
                p = UserPortfolio(user=request.data['user'], custom_portfolio=request.data['custom_portfolio'], portfolio_name=request.data['portfolio_name'], allocation=request.data['allocation'], date_created=request.data['date_created'])
                p.save()
                p_serializer = PortfolioSerializer(p)
                portfolio = pd.DataFrame(request.data['portfolio'])
                portfolio['initial_allocation'] = float(request.data['allocation']) / len(portfolio['ticker'])
                ps_serializer = FinalCSVViewSet().get_hypo_stats(portfolio, request.data['portfolio_name'], queryset_token, request.data['allocation'])
                return Response(p_serializer.data)
            else:
                p = UserPortfolio(**request.data)
                p.save()
                p_serializer = PortfolioSerializer(p)
                return Response(p_serializer.data)
        else:
            return HttpResponseNotFound("portfolio name already in use") 

    def get_queryset(self):
        token = self.request.query_params.get('token', None)
        queryset_token = Token.objects.filter(key=token)
        queryset = UserPortfolio.objects.filter(user=queryset_token.values()[0]['user_id'])
        return queryset
        
    def retrieve(self, request, *args, **kwargs):
        token = self.request.query_params.get('token', None)
        portfolio_name = kwargs['pk']
        queryset_token = Token.objects.filter(key=token)
        queryset = UserPortfolio.objects.filter(user=queryset_token.values()[0]['user_id'], portfolio_name=portfolio_name)
        serializer = PortfolioSerializer(queryset, many=True)
        return Response(serializer.data)

    def list(self, request, *args, **kwargs):
        token = self.request.query_params.get('token', None)
        queryset_token = Token.objects.filter(key=token)
        action = self.request.query_params.get('action', None)

        if action=='delete':
            portfolio_name = self.request.query_params.get('portfolio_name', None)
            queryset = UserPortfolio.objects.filter(user=queryset_token.values()[0]['user_id'], portfolio_name=portfolio_name)
            queryset.delete()
            print(queryset)
            return Response(status=status.HTTP_204_NO_CONTENT)
        else:
            queryset = UserPortfolio.objects.filter(user=queryset_token.values()[0]['user_id'])
            serializer = PortfolioSerializer(queryset, many=True)
            return Response(serializer.data)
        

class UserViewSet(viewsets.ModelViewSet):
    serializer_class = UserSerializer

    def get_queryset(self, token):
        queryset_token = Token.objects.filter(key=token)
        try:
            return User.objects.get(id=queryset_token.values()[0]['user_id'])
        except Exception as e:
            return Response({'message':str(e)})

    def retrieve(self, request, *args, **kwargs):
        token = self.request.query_params.get('token', None)
        user = self.get_queryset(token) 
        serializer = UserSerializer(user)
        return Response(serializer.data) 
    
    def list(self, request, *args, **kwargs):
        token = self.request.query_params.get('token', None)
        user = self.get_queryset(token) 
        serializer = UserSerializer(user)
        return Response(serializer.data)

    def put(self,request,format=None):
        token = self.request.query_params.get('token', None)
        user = self.get_queryset(token) 
        serializer = self.serializer_class(user,data=request.data)

        if serializer.is_valid():            
            serializer.save()
            user.set_password(serializer.data.get('password'))
            user.save()
            return Response(serializer.data)    
        return Response({'message':True})
    

class PortfolioStatsViewSet(viewsets.ModelViewSet):
    """
    A viewset for viewing and editing user instances.
    """
    serializer_class = PortfolioStatsSerializer
    queryset = UserPortfolioStats.objects.all()

    def create(self, request, *args, **kwargs):
        
        token = self.request.query_params.get('token', None)
        action = self.request.query_params.get('action', None)
        queryset_token = Token.objects.filter(key=token)
        if action=='connect':
            if 'code' in request.data:
                TDSession = TDClientAuth(
                user=queryset_token.values()[0]['user_id'],
                client_id='BEBFCA5ZNBRXU4A60TP54AXWTEQQCHNS',
                redirect_uri='https://theopenstreet.com/portfolios/',
                )
                return_state = TDSession.login_from_code(request.data['code'])
                return Response({'message':return_state})
            else:
                TDSession = TDClientAuth(
                user=queryset_token.values()[0]['user_id'],
                client_id='BEBFCA5ZNBRXU4A60TP54AXWTEQQCHNS',
                redirect_uri='https://theopenstreet.com/portfolios/',
                )   
                return_state = TDSession.login_from_file()
                print(return_state)
                return Response({'message':return_state})
        elif action=='execute':
            portfolio_name = self.request.query_params.get('portfolio_name', None)
            queryset = UserPortfolioStats.objects.filter(name=UserPortfolio(user=User(id=queryset_token.values()[0]['user_id']), portfolio_name=portfolio_name))
            serializer = PortfolioStatsSerializer(queryset, many=True)
            query=queryset.values()[0]
            query['execute_portfolio']= request.data['execute_portfolio']
            ps = UserPortfolioStats(**query)
            ps.save()
            TDSession = TDClientAuth(
            user=queryset_token.values()[0]['user_id'],
            client_id='BEBFCA5ZNBRXU4A60TP54AXWTEQQCHNS',
            redirect_uri='https://theopenstreet.com/portfolios/',
            )   
            return_state = TDSession.login_from_file()
            print(return_state)
            if(not return_state):
                return Response({'message':return_state})
            else:
                
                constituents = pd.DataFrame(queryset.values()[0]['portfolio_constituents'])
                modify_cons = request.data['execute_portfolio']
                if modify_cons:
                    for key in modify_cons:
                        constituents.loc[constituents['ticker_name']==key, 'shares'] = float(modify_cons[key])
                accounts = TDSession.get_accounts(
                account='all',
                fields=['positions']
                )
                accountId = (pd.DataFrame(accounts)['securitiesAccount'][0]['accountId'])
                order_message = 'orders placed'
                for key, row in constituents.iterrows():
                    order = {
                            "orderType": "MARKET",
                            "session": "NORMAL",
                            "duration": "DAY",
                            "orderStrategyType": "SINGLE",
                            "orderLegCollection": [{
                                    "instruction": "Buy",
                                    "quantity": row['shares'],
                                    "instrument": {
                                        "symbol": row['ticker'],
                                        "assetType": "EQUITY"
                                    }
                                    }]
                            }
                    try:
                        TDSession.place_order(accountId, order)
                    except:
                        order_message = 'some orders not placed'
                orders = TDSession.get_accounts(
                account=accountId,
                fields=['orders']
                )
                orders_df = pd.DataFrame(orders['securitiesAccount']['orderStrategies'])
                orders_df.loc[:, 'orderDetails'] = orders_df.orderLegCollection.map(lambda x: x[0])
                orders_df = pd.concat([orders_df, orders_df['orderDetails'].apply(pd.Series)], axis=1)
                orders_df = pd.concat([orders_df, orders_df['instrument'].apply(pd.Series)], axis=1)

                orders_df = orders_df[(orders_df['status']=='FILLED')|(orders_df['status']=='OPEN')].reset_index(drop=True)

                p_queryset = UserPortfolio.objects.get(user=User(id=queryset_token.values()[0]['user_id']), portfolio_name=portfolio_name)
                p_queryset.execute_code= 1
                p_queryset.save()
                query=queryset.values()[0]
                query['execute_portfolio']= request.data['execute_portfolio']
                ps = UserPortfolioStats(**query)
                ps.save()
                return Response({'message':return_state, "orders": orders_df[['orderId','session','duration','orderType','symbol','instruction','quantity','filledQuantity','status','enteredTime']].to_dict('records'), "order_message": order_message})
        elif action=='exit':
            portfolio_name = self.request.query_params.get('portfolio_name', None)
            queryset = UserPortfolioStats.objects.filter(name=UserPortfolio(user=User(id=queryset_token.values()[0]['user_id']), portfolio_name=portfolio_name))
            serializer = PortfolioStatsSerializer(queryset, many=True)
            TDSession = TDClientAuth(
            user=queryset_token.values()[0]['user_id'],
            client_id='BEBFCA5ZNBRXU4A60TP54AXWTEQQCHNS',
            redirect_uri='https://theopenstreet.com/portfolios/',
            )   
            return_state = TDSession.login_from_file()
            print(return_state)
            if(not return_state):
                return Response({'message':return_state})
            else:
                
                constituents = pd.DataFrame(queryset.values()[0]['portfolio_constituents'])
                accounts = TDSession.get_accounts(
                account='all',
                fields=['positions']
                )
                accountId = (pd.DataFrame(accounts)['securitiesAccount'][0]['accountId'])
                order_message = 'orders placed'
                for key, row in constituents.iterrows():
                    order = {
                            "orderType": "MARKET",
                            "session": "NORMAL",
                            "duration": "DAY",
                            "orderStrategyType": "SINGLE",
                            "orderLegCollection": [{
                                    "instruction": "Sell",
                                    "quantity": row['shares'],
                                    "instrument": {
                                        "symbol": row['ticker'],
                                        "assetType": "EQUITY"
                                    }
                                    }]
                            }
                    try:
                        TDSession.place_order(accountId, order)
                    except:
                        order_message = 'some orders not placed'
                orders = TDSession.get_accounts(
                account=accountId,
                fields=['orders']
                )
                orders_df = pd.DataFrame(orders['securitiesAccount']['orderStrategies'])
                orders_df.loc[:, 'orderDetails'] = orders_df.orderLegCollection.map(lambda x: x[0])
                orders_df = pd.concat([orders_df, orders_df['orderDetails'].apply(pd.Series)], axis=1)
                orders_df = pd.concat([orders_df, orders_df['instrument'].apply(pd.Series)], axis=1)
                orders_df = orders_df[(orders_df['status']=='FILLED')|(orders_df['status']=='OPEN')].reset_index(drop=True)
                p_queryset = UserPortfolio.objects.get(user=User(id=queryset_token.values()[0]['user_id']), portfolio_name=portfolio_name)
                p_queryset.execute_code= 0
                p_queryset.save()
                return Response({'message':return_state, "orders": orders_df[['orderId','session','duration','orderType','symbol','instruction','quantity','filledQuantity','status','enteredTime']].to_dict('records'), "order_message": order_message})
        elif action=='sync':
            portfolio_name = self.request.query_params.get('portfolio_name', None)
            queryset = UserPortfolioStats.objects.filter(name=UserPortfolio(user=User(id=queryset_token.values()[0]['user_id']), portfolio_name=portfolio_name))
            TDSession = TDClientAuth(
            user=queryset_token.values()[0]['user_id'],
            client_id='BEBFCA5ZNBRXU4A60TP54AXWTEQQCHNS',
            redirect_uri='https://theopenstreet.com/portfolios/',
            )
            return_state = TDSession.login_from_file()
            print(return_state)
            if(not return_state):
                return Response({'message':return_state})
            else:
                constituents = pd.DataFrame(queryset.values()[0]['portfolio_constituents'])
                accounts = TDSession.get_accounts(
                account='all',
                fields=['positions']
                )
                print(accounts[0]['securitiesAccount'])
                execute_portfolio = pd.DataFrame(accounts[0]['securitiesAccount']['positions'])
                constituents['shares'] = 0
                if len(execute_portfolio)!=0:
                    print('syncing')
                    execute_portfolio = pd.concat([execute_portfolio, execute_portfolio['instrument'].apply(pd.Series)], axis=1)
                    execute_portfolio = execute_portfolio[execute_portfolio['symbol'].isin(constituents['ticker'])]
                    for key, row in execute_portfolio.iterrows():
                        constituents.loc[constituents['ticker']==row['instrument']['symbol'], 'shares'] = float(row['longQuantity'])
                        constituents.loc[constituents['ticker']==row['instrument']['symbol'], 'entry_price'] = float(row['averagePrice'])
                constituents = constituents[constituents['shares']!=0].reset_index(drop=True)
                qs = queryset.values()[0]
                qs['portfolio_constituents'] = json.loads(json.dumps(constituents.to_dict('records'), allow_nan=False))
                
                ps = UserPortfolioStats(**qs)
                ps.save()
                return Response({'message':return_state})
        elif action=='rebalance':
            portfolio_name = self.request.query_params.get('portfolio_name', None)
            queryset = UserPortfolioStats.objects.filter(name=UserPortfolio(user=User(id=queryset_token.values()[0]['user_id']), portfolio_name=portfolio_name))
            TDSession = TDClientAuth(
            user=queryset_token.values()[0]['user_id'],
            client_id='BEBFCA5ZNBRXU4A60TP54AXWTEQQCHNS',
            redirect_uri='https://theopenstreet.com/portfolios/',
            )
            return_state = TDSession.login_from_file()
            print(return_state)
            if(not return_state):
                return Response({'message':return_state})
            else:
                
                constituents = pd.DataFrame(queryset.values()[0]['portfolio_constituents'])
                modify_cons = request.data['execute_portfolio']
                if modify_cons:
                    for key in modify_cons:
                        constituents.loc[constituents['ticker_name']==key, 'shares'] = float(modify_cons[key])
                old_cons = pd.DataFrame(queryset.values()[0]['old_portfolio_constituents'])
                old_cons = old_cons.rename(columns={'shares':'shares_old'})
                constituents = constituents.merge(old_cons[['ticker','shares_old']], on='ticker', how='left')
                constituents['shares'] = constituents['shares'].fillna(0)
                constituents['shares'] = constituents['shares'] - constituents['shares_old']
                print(constituents)
                accounts = TDSession.get_accounts(
                account='all',
                fields=['positions']
                )
                accountId = (pd.DataFrame(accounts)['securitiesAccount'][0]['accountId'])
                order_message = 'orders placed'
                for key, row in constituents[constituents['shares']>0].iterrows():
                    order = {
                            "orderType": "MARKET",
                            "session": "NORMAL",
                            "duration": "DAY",
                            "orderStrategyType": "SINGLE",
                            "orderLegCollection": [{
                                    "instruction": "Buy",
                                    "quantity": row['shares'],
                                    "instrument": {
                                        "symbol": row['ticker'],
                                        "assetType": "EQUITY"
                                    }
                                    }]
                            }
                    try:
                        TDSession.place_order(accountId, order)
                    except:
                        order_message = 'some orders not placed'
                short_portfolio = constituents[constituents['shares']<0]
                short_portfolio['shares'] = np.abs(short_portfolio['shares'])
                for key, row in short_portfolio.iterrows():
                    order = {
                            "orderType": "MARKET",
                            "session": "NORMAL",
                            "duration": "DAY",
                            "orderStrategyType": "SINGLE",
                            "orderLegCollection": [{
                                    "instruction": "Sell",
                                    "quantity": row['shares'],
                                    "instrument": {
                                        "symbol": row['ticker'],
                                        "assetType": "EQUITY"
                                    }
                                    }]
                            }
                    try:
                        TDSession.place_order(accountId, order)
                    except:
                        order_message = 'some orders not placed'

                orders = TDSession.get_accounts(
                account=accountId,
                fields=['orders']
                )
                orders_df = pd.DataFrame(orders['securitiesAccount']['orderStrategies'])
                orders_df.loc[:, 'orderDetails'] = orders_df.orderLegCollection.map(lambda x: x[0])
                orders_df = pd.concat([orders_df, orders_df['orderDetails'].apply(pd.Series)], axis=1)
                orders_df = pd.concat([orders_df, orders_df['instrument'].apply(pd.Series)], axis=1)
                orders_df = orders_df[(orders_df['status']=='FILLED')|(orders_df['status']=='OPEN')].reset_index(drop=True)
                p_queryset = UserPortfolio.objects.get(user=User(id=queryset_token.values()[0]['user_id']), portfolio_name=portfolio_name)
                p_queryset.execute_code= 1
                p_queryset.save()
                return Response({'message':return_state, "orders": orders_df[['orderId','session','duration','orderType','symbol','instruction','quantity','filledQuantity','status','enteredTime']].to_dict('records'), "order_message": order_message})
            
            query=queryset.values()[0]
            query['execute_portfolio']= request.data['execute_portfolio']
            ps = UserPortfolioStats(**query)
            ps.save()


class StrategiesViewSet(viewsets.ModelViewSet):
    """
    A viewset for viewing and editing user instances.
    """
    serializer_class = PortfolioSerializer

    def create(self, request):
        token = self.request.query_params.get('token', None)
        queryset_token = Token.objects.filter(key=token)
        po = Strategies.objects.filter(pk=request.data['strategy_name'])
        request.data['user'] = User(pk=queryset_token.values()[0]['user_id'])
        if len(po.values())==0:
            p = Strategies(**request.data)
            p.save()
            p_serializer = StrategiesSerializer(p)
            return Response(p_serializer.data)
        else:
            return HttpResponseNotFound("strategy name already in use") 

    def get_queryset(self):
        token = self.request.query_params.get('token', None)
        queryset_token = Token.objects.filter(key=token)
        queryset = Strategies.objects.filter(user=queryset_token.values()[0]['user_id'])
        return queryset
        
    def retrieve(self, request, *args, **kwargs):
        token = self.request.query_params.get('token', None)
        strategy_name = kwargs['pk']
        queryset_token = Token.objects.filter(key=token)
        queryset = Strategies.objects.filter(user=queryset_token.values()[0]['user_id'], strategy_name=strategy_name)
        serializer = StrategiesSerializer(queryset, many=True)
        return Response(serializer.data)

    def list(self, request, *args, **kwargs):
        token = self.request.query_params.get('token', None)
        queryset_token = Token.objects.filter(key=token)
        action = self.request.query_params.get('action', None)
        if action=='delete':
            strategy_name = self.request.query_params.get('strategy_name', None)
            queryset = Strategies.objects.filter(user=queryset_token.values()[0]['user_id'], strategy_name=strategy_name)
            queryset.delete()
            print(queryset)
            return Response(status=status.HTTP_204_NO_CONTENT)
        elif action=='exit':
            strategy_name = self.request.query_params.get('strategy_name', None)
            queryset = Strategies.objects.filter(user=queryset_token.values()[0]['user_id'], strategy_name=strategy_name)
            TDSession = TDClientAuth(
            user=queryset_token.values()[0]['user_id'],
            client_id='BEBFCA5ZNBRXU4A60TP54AXWTEQQCHNS',
            redirect_uri='https://theopenstreet.com/portfolios/',
            )
            
            return_state = TDSession.login_from_file()
            print(return_state)
            if(not return_state):
                return Response({'message':return_state})
            else:
                accounts = TDSession.get_accounts(
                    account='all',
                    fields=['positions']
                    )
                accountId = (pd.DataFrame(accounts)['securitiesAccount'][0]['accountId'])
                query = queryset.values()[0]
                if query['in_position']:
                    execute_portfolio = pd.DataFrame(accounts[0]['securitiesAccount']['positions'])
                    execute_portfolio = execute_portfolio[execute_portfolio['symbol']==query['ticker']]
                    order = {
                            "orderType": "MARKET",
                            "session": "NORMAL",
                            "duration": "DAY",
                            "orderStrategyType": "SINGLE",
                            "orderLegCollection": [{
                                    "instruction": "Sell",
                                    "quantity": query['shares_bought'],
                                    "instrument": {
                                        "symbol": query['ticker'],
                                        "assetType": "EQUITY"
                                    }
                                    }]
                            }
                    try:
                        TDSession.place_order(accountId, order)
                        query['is_live']=False
                        query['in_position']=False
                        query['current_holding_period']=0
                        query['cash'] = query['cash'] + query['shares_bought']*execute_portfolio.head(1).values[0]['averagePrice']
                        query['holdings'] = 0
                        query['allocation'] = query['cash'] + query['holdings']
                    except:
                        print('unable to exit')
                        return Response({'message':'unable to exit'})
                    p = Strategies(**query)
                    p.save()
                    return Response({'message':return_state})
                else:
                    print('not in position, taking offline')
                    query['is_live']=False
                    p = Strategies(**query)
                    p.save()
                    return Response({'message':return_state})
        elif action=='sync':
            strategy_name = self.request.query_params.get('strategy_name', None)
            queryset = Strategies.objects.filter(user=queryset_token.values()[0]['user_id'], strategy_name=strategy_name)
            TDSession = TDClientAuth(
            user=queryset_token.values()[0]['user_id'],
            client_id='BEBFCA5ZNBRXU4A60TP54AXWTEQQCHNS',
            redirect_uri='https://theopenstreet.com/portfolios/',
            )
            return_state = TDSession.login_from_file()
            print(return_state)
            if(not return_state):
                return Response({'message':return_state})
            else:
                query = queryset.values()[0]
                if query['in_position']:
                    accounts = TDSession.get_accounts(
                    account='all',
                    fields=['positions']
                    )
                    print(accounts[0]['securitiesAccount'])
                    execute_portfolio = pd.DataFrame(accounts[0]['securitiesAccount']['positions'])
                    if len(execute_portfolio)!=0:
                        print('syncing')
                        execute_portfolio = pd.concat([execute_portfolio, execute_portfolio['instrument'].apply(pd.Series)], axis=1)
                        execute_portfolio = execute_portfolio[execute_portfolio['symbol']==query['ticker']]
                        query['holdings'] = query['shares_bought']*float(execute_portfolio.head(1).values[0]['averagePrice'])
                    ps = Strategies(**query)
                    ps.save()
                    return Response({'message':return_state})
                else:
                    return Response({'message':return_state})
        elif action=='golive':
            strategy_name = self.request.query_params.get('strategy_name', None)
            queryset = Strategies.objects.filter(user=queryset_token.values()[0]['user_id'], strategy_name=strategy_name)
            query = queryset.values()[0]
            query['cash'] = query['allocation']
            query['holdings'] = 0
            query['is_live'] = True
            p = Strategies(**query)
            p.save()
            return Response({'is_live':query['is_live']})
        elif action=='backtest':
            strategy_name = self.request.query_params.get('strategy_name', None)
            queryset = Strategies.objects.filter(user=queryset_token.values()[0]['user_id'], strategy_name=strategy_name)
            df = yf.download(queryset.values()[0]['ticker'],'2015-01-01',dt.strftime(dt.now(), '%Y-%m-%d'))
            price_ref = yf.download('SPY','2015-01-01',dt.strftime(dt.now(), '%Y-%m-%d'))
            df['signal'] = 0
            for pattern in queryset.values()[0]['patterns']:
                pattern_function = getattr(talib, pattern)
                try:
                    df[pattern] = pattern_function(df['Open'], df['High'], df['Low'], df['Close'])
                    df['signal']+= df[pattern].astype(float)
                except:
                    continue
            df['allocation'] = queryset.values()[0]['allocation']
            if queryset.values()[0]['holding_period']:
                max_holding = queryset.values()[0]['holding_period']
            else:
                max_holding=200
            position = 0
            positions = []
            holding_period = 0
            orders = pd.DataFrame()
            for key, row in df.iterrows():
                positions.append(position)
                if position==1:
                    holding_period+=1
                if(row['signal']>0 and position==0):
                    print('buy')
                    row['position'] = 'BUY'
                    row['Date'] = dt.strftime(key, '%Y-%m-%d')
                    orders = orders.append(row)
                    position = 1

                if((row['signal']<0 and position==1) or (holding_period>max_holding)):
                    print('close')
                    row['position'] = 'CLOSE'
                    row['Date'] = dt.strftime(key, '%Y-%m-%d')
                    orders = orders.append(row)
                    position = 0
                    holding_period=0
            orders['ticker'] = queryset.values()[0]['ticker']
            orders['Close'] = round(orders['Close'],2)    
            df['position'] = positions
            df['returns'] = (df['Close'].pct_change()*df['position'])
            # cerebro = bt.Cerebro()
            # data = CustomPandasData(dataname=df,dtformat=2, compression=1, timeframe=bt.TimeFrame.Days)
            # cerebro.adddata(data)
            # cerebro.addstrategy(PatternStrategy)
            # cerebro.addanalyzer(bt.analyzers.PyFolio, _name='pyfolio')
            # results = cerebro.run()
            # strat = results[0]
            # pyfoliozer = strat.analyzers.getbyname('pyfolio',)
            # returns, positions, transactions, gross_lev = pyfoliozer.get_pf_items()
            wealt_graph = df.reset_index()[['Date','returns']]

            wealt_graph['value'] = 1 + wealt_graph['returns']
            wealt_graph['value'].loc[0] = queryset.values()[0]['allocation']
            wealt_graph = wealt_graph.dropna(subset=['value'])
            wealt_graph['value'] = wealt_graph['value'].cumprod()
            wealt_graph['time'] = wealt_graph['Date']
            stats = ts.perf_stats(df['returns'].dropna(), price_ref['Close'].pct_change().dropna())
            stats['Annual return'] = stats['Annual return']*100
            stats['Annual volatility'] = stats['Annual volatility']*100
            stats['Max drawdown'] = stats['Max drawdown']*100
            stats = stats.apply(lambda x: round(x,2))
            print(stats)
            return Response({'stats':pd.DataFrame(stats).dropna().transpose().to_dict('records'), 'wealth_graph':wealt_graph[['time','value']].to_dict('records'), 'orders': orders.to_dict('records')})
            #return Response({'message':'done'})
        else:
            queryset = Strategies.objects.filter(user=queryset_token.values()[0]['user_id'])
            serializer = StrategiesSerializer(queryset, many=True)
            return Response(serializer.data)

class CryptoViewSet(viewsets.ModelViewSet):
    """
    A viewset for viewing and editing user instances.
    """
    serializer_class = CryptoSerializer

    def create(self, request):
        token = self.request.query_params.get('token', None)
        queryset_token = Token.objects.filter(key=token)
        action = self.request.query_params.get('action', None)
        if action=='connect':
            api = BinanceAPI.objects.filter(user=queryset_token.values()[0]['user_id']).values()
            if(len(api)>0):
                try:
                    print(api[0])
                    client = Client(api[0]['api_key'], api[0]['api_secret'])
                    return Response({'message':True})
                except:
                    return Response({'message':False})
            else:
                try:
                    client = Client(request.data['api_key'], request.data['api_secret'])
                    a = BinanceAPI(user=queryset_token.values()[0]['user_id'], api_key = request.data['api_key'], api_secret = request.data['api_secret'])
                    a.save()
                    return Response({'message':True})
                except:
                    return Response({'message':False})
                
        else:
            po = Crypto.objects.filter(strategy_name=request.data['strategy_name'], user=queryset_token.values()[0]['user_id'])
            request.data['user'] = User(pk=queryset_token.values()[0]['user_id'])
            if len(po.values())==0:
                request.data['cash'] = request.data['allocation']
                request.data['holdings'] = 0
                p = Crypto(**request.data)
                p.save()
                p_serializer = CryptoSerializer(p)
                return Response(p_serializer.data)
            else:
                return HttpResponseNotFound("strategy name already in use") 

    def get_queryset(self):
        token = self.request.query_params.get('token', None)
        queryset_token = Token.objects.filter(key=token)
        queryset = Crypto.objects.filter(user=queryset_token.values()[0]['user_id'])
        return queryset
        
    def retrieve(self, request, *args, **kwargs):
        token = self.request.query_params.get('token', None)
        strategy_name = kwargs['pk']
        queryset_token = Token.objects.filter(key=token)
        queryset = Crypto.objects.filter(user=queryset_token.values()[0]['user_id'], strategy_name=strategy_name)
        serializer = CryptoSerializer(queryset, many=True)
        return Response(serializer.data)

    def list(self, request, *args, **kwargs):
        token = self.request.query_params.get('token', None)
        queryset_token = Token.objects.filter(key=token)
        action = self.request.query_params.get('action', None)
        if action=='delete':
            strategy_name = self.request.query_params.get('strategy_name', None)
            queryset = Crypto.objects.filter(user=queryset_token.values()[0]['user_id'], strategy_name=strategy_name)
            queryset.delete()
            print(queryset)
            return Response(status=status.HTTP_204_NO_CONTENT)
        elif action=='sync':
            strategy_name = self.request.query_params.get('strategy_name', None)
            queryset = Crypto.objects.filter(user=queryset_token.values()[0]['user_id'], strategy_name=strategy_name)
            query = queryset.values()[0]
            if query['in_position']:
                api = BinanceAPI.objects.filter(user=queryset_token.values()[0]['user_id']).values()[0]
                client = Client(api['api_key'], api['api_secret'])
                avg_price = float(client.get_avg_price(symbol='BTCUSDT')['price'])
                print('syncing')
                query['holdings'] = query['shares_bought']*avg_price
                ps = Crypto(**query)
                ps.save()
                return Response({'message':return_state})
            else:
                return Response({'message':return_state})
        elif action=='exit':
            strategy_name = self.request.query_params.get('strategy_name', None)
            queryset = Crypto.objects.filter(user=queryset_token.values()[0]['user_id'], strategy_name=strategy_name)
            query = queryset.values()[0]
            api = BinanceAPI.objects.filter(user=queryset_token.values()[0]['user_id']).values()[0]
            client = Client(api['api_key'], api['api_secret'])
            avg_price = float(client.get_avg_price(symbol='BTCUSDT')['price'])
            if query['in_position']:
                try:
                    client.create_order(symbol='BTCUSDT', side='SELL', type='MARKET', quantity=query['shares_bought'])
                    query['in_position']=False
                    query['current_holding_period']=0
                    query['cash'] = query['cash'] + query['shares_bought']*close
                    query['holdings'] = 0
                    query['allocation'] = query['cash'] + query['holdings']
                except:
                    print('unable to exit')
                    return Response({'message':'unable to exit'})
                p = Crypto(**query)
                p.save()
                return Response({'message':True})
            else:
                print('not in position, taking offline')
                queryset.delete()
                return Response(status=status.HTTP_204_NO_CONTENT)
        elif action=='backtest':
            strategy_name = self.request.query_params.get('strategy_name', None)
            allocation = self.request.query_params.get('allocation', None)
            price_ref = yf.download('SPY','2015-01-01',dt.strftime(dt.now(), '%Y-%m-%d'))
            api = BinanceAPI.objects.filter(user=queryset_token.values()[0]['user_id']).values()[0]
            client = Client(api['api_key'], api['api_secret'])
            klines = client.get_historical_klines("BTCUSDT", Client.KLINE_INTERVAL_1HOUR, "5 year ago UTC")
            df = pd.DataFrame(klines)[list(range(0,7))]
            df.columns = ['open_time', 'open','high','low','close','volume', 'close_time']
            df['close_time'] = df['close_time']/1000
            df = df.sort_values('close_time')
            indicators = {}
            for indicator in indicators_c.keys():
                indicator_function = getattr(talib, indicator)
                ind_list = [indicator_function(df['close'])]
                if len(ind_list[0])<4:
                    [ind_list] = ind_list
                for ind,i in zip(ind_list, range(0, len(ind_list))):
                    indicators[indicator + '-'+ str(i)] = ind

            for indicator in indicators_hl.keys():
                indicator_function = getattr(talib, indicator)
                ind_list = [indicator_function(high = df['high'], low = df['low'])]
                if len(ind_list[0])<4:
                    [ind_list] = ind_list
                for ind,i in zip(ind_list, range(0, len(ind_list))):
                    indicators[indicator + '-'+ str(i)] = ind

            for indicator in indicators_hlc.keys():
                indicator_function = getattr(talib, indicator)
                ind_list = [indicator_function(high = df['high'], low = df['low'], close= df['close'])]
                if len(ind_list[0])<4:
                    [ind_list] = ind_list
                for ind,i in zip(ind_list, range(0, len(ind_list))):
                    indicators[indicator + '-'+ str(i)] = ind 
            
            for indicator in indicators_ohlc.keys():
                indicator_function = getattr(talib, indicator)
                ind_list = [indicator_function(open= df['open'], high = df['high'], low = df['low'], close= df['close'])]
                if len(ind_list[0])<4:
                    [ind_list] = ind_list
                for ind,i in zip(ind_list, range(0, len(ind_list))):
                    indicators[indicator + '-'+ str(i)] = ind
            ind_df = pd.DataFrame(indicators)
            train = ind_df.copy()
            columns = list(train.columns)
            train['price'] = df['close'].astype('float')
            train['close_time'] = df['close_time']
            train['return'] = df['close'].astype('float').pct_change()[1:].reset_index(drop=True)
            train = train.sort_values('close_time')
            train = train.dropna().reset_index(drop=True)
            for column in price_columns:
                train[column]-=train['price']
            train['return_label'] = 0
            train.loc[train['return']>0, 'return_label'] = 1
            split = int(-1 *len(train)/10)
            
            X = train[columns][:split]
            y = train['return_label'][:split]
            X_test = train[columns][split:]
            y_test = train['return_label'][split:]
            
            clf = DecisionTreeClassifier(random_state=0).fit(X, y)
            #clf = MLPClassifier(random_state=1, max_iter=300).fit(X, y)
            
            result = clf.predict_proba(X_test)    
            X_test['position'] = [i[1] for i in result]
            #print( X_test['position'].to_csv('positions.csv'))
            X_test.loc[X_test['position']>0.8, 'position'] = 1
            X_test.loc[X_test['position']<=0.8, 'position'] = 0
            X_test['Date'] = train['close_time'][split:]
            X_test['price_return'] = train['return'][split:]
            X_test['returns'] = X_test['position']*X_test['price_return']
            wealth_graph = X_test.reset_index()[['Date','returns']]
            wealth_graph['value'] = 1 + wealth_graph['returns']
            wealth_graph['value'].loc[0] = float(allocation)
            wealth_graph = wealth_graph.dropna(subset=['value'])
            wealth_graph['value'] = wealth_graph['value'].cumprod()
            wealth_graph['time'] = wealth_graph['Date']
            wealth_graph = wealth_graph.sort_values('time')
            stats = ts.perf_stats(X_test[['returns','Date']].set_index('Date').dropna()['returns'], df[['close','close_time']].set_index('close_time')['close'].astype('float').pct_change().dropna())
            stats['Annual return'] = stats['Annual return']*100
            stats['Annual volatility'] = stats['Annual volatility']*100
            stats['Max drawdown'] = stats['Max drawdown']*100
            stats = stats.apply(lambda x: round(x,2))
            print(stats)
            return Response({'stats':pd.DataFrame(stats).dropna().transpose().to_dict('records'), 'wealth_graph':wealth_graph[['time','value']].to_dict('records')})

        else:
            queryset = Crypto.objects.filter(user=queryset_token.values()[0]['user_id'])
            serializer = CryptoSerializer(queryset, many=True)
            return Response(serializer.data)
