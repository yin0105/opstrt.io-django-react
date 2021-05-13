from datetime import datetime
from apscheduler.schedulers.background import BackgroundScheduler
from articles.models import FinalCSV, FinalCSVTable, UserPortfolio, UserPortfolioStats, TDState, Strategies, Crypto, BinanceAPI
from articles.api.views import TDClientAuth
from datetime import datetime as dt
import yfinance as yf 
import talib
from pandas.tseries.offsets import BDay
import pandas as pd
from datetime import timedelta
from td.utils import TDUtilities
import json
import numpy as np
from binance.client import Client
from scheduler.indicators import indicators_c, indicators_hl, indicators_hlc, indicators_ohlc, price_columns
import inspect
from sklearn.neural_network import MLPClassifier
from sklearn.tree import DecisionTreeClassifier, DecisionTreeRegressor
# This is the function you want to schedule - add as many as you want and then register them in the start() function below

def crypto_trades():
    
    yesterday = dt.now() - timedelta(1)
    bday = yesterday - BDay(1)
    bday30 = yesterday - BDay(30)
    queryset = Crypto.objects.all()
    if len(queryset.values())>0:
        for query in queryset.values():
            api = BinanceAPI.objects.filter(user=query['user_id']).values()[0]
            client = Client(api['api_key'], api['api_secret'])
            klines = client.get_historical_klines("BTCUSDT", Client.KLINE_INTERVAL_1HOUR, "100 days ago UTC")
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
            
            X = train[columns][:-1]
            y = train['return_label'][:-1]
            X_test = train[columns].tail(1)
            
            
            clf = DecisionTreeClassifier(random_state=0).fit(X, y)
            #clf = MLPClassifier(random_state=1, max_iter=300).fit(X, y)
            
            signal = clf.predict(X_test)[0]
            #print( X_test['position'].to_csv('positions.csv'))
            avg_price = float(client.get_avg_price(symbol='BTCUSDT')['price'])
            print(avg_price)
            shares = query['cash']/avg_price
            print(signal, query['cash'])
            if( signal==1 and not query['in_position']):
                try:
                    client.create_order(symbol='BTCUSDT', side='BUY', type='MARKET', quantity=shares)
                    query['in_position']=True
                    query['shares_bought']=shares
                    query['cash'] = query['cash'] - client.get_asset_balance(asset='BTCUSDT')
                    query['holdings'] = client.get_asset_balance(asset='BTCUSDT')
                    query['allocation'] = query['cash'] + query['holdings']
                except:
                    print('some orders not placed')
                

            if((signal==0 and query['in_position'])): 
                try:
                    client.create_order(symbol='BTCUSDT', side='SELL', type='MARKET', quantity=query['shares_bought'])
                    query['in_position']=False
                    query['current_holding_period']=0
                    query['cash'] = query['cash'] + query['shares_bought']*avg_price
                    query['holdings'] = 0
                    query['allocation'] = query['cash']
                except:
                    print('some orders not placed')
            p = Crypto(**query)
            p.save()


            
def execute_trades():
    
    yesterday = dt.now() - timedelta(1)
    bday = yesterday - BDay(1)
    bday30 = yesterday - BDay(30)
    queryset = Strategies.objects.filter(is_live=True)
    print('execting scheduled trades')
    if len(queryset.values())>0:
        for query in queryset.values():
            print(query)
            TDSession = TDClientAuth(
                user=query['user_id'],
                client_id='BEBFCA5ZNBRXU4A60TP54AXWTEQQCHNS',
                redirect_uri='https://theopenstreet.com/portfolios/',
                )   
            return_state = TDSession.login_from_file()
            print(return_state)
            if(not return_state):
                print('not able to execute client')
            else:
                df = yf.download(query['ticker'],dt.strftime(bday30, '%Y-%m-%d'), dt.strftime(dt.now(), '%Y-%m-%d'))
                df['signal'] = 0
                for pattern in query['patterns']:
                    pattern_function = getattr(talib, pattern)
                    try:
                        df[pattern] = pattern_function(df['Open'], df['High'], df['Low'], df['Close'])
                        df['signal']+= df[pattern].astype(float)
                    except:
                        continue
                
                signal = df['signal'].tail(1).values[0]
                close = df['Close'].tail(1).values[0]
                shares = np.floor(query['cash']/close)
                accounts = TDSession.get_accounts(
                    account='all',
                    fields=['positions']
                    )
                accountId = (pd.DataFrame(accounts)['securitiesAccount'][0]['accountId'])
                if query['in_position']:
                    query['current_holding_period']+=1
                if( signal >0 and not query['in_position']):
                    order = {
                            "orderType": "MARKET",
                            "session": "NORMAL",
                            "duration": "DAY",
                            "orderStrategyType": "SINGLE",
                            "orderLegCollection": [{
                                    "instruction": "Buy",
                                    "quantity": shares,
                                    "instrument": {
                                        "symbol": query['ticker'],
                                        "assetType": "EQUITY"
                                    }
                                    }]
                            }
                    try:
                        TDSession.place_order(accountId, order)
                        query['in_position']=True
                        query['shares_bought']=shares
                        query['cash'] = query['cash'] - shares*close
                        query['holdings'] = shares*close
                        query['allocation'] = query['cash'] + query['holdings']
                    except:
                        print('some orders not placed')
                    

                if((signal<0 and query['in_position']) or (query['current_holding_period']>query['holding_period'])):
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
                        query['in_position']=False
                        query['current_holding_period']=0
                        query['cash'] = query['cash'] + query['shares_bought']*close
                        query['holdings'] = 0
                        query['allocation'] = query['cash'] + query['holdings']
                    except:
                        print('some orders not placed')
            p = Strategies(**query)
            p.save()        
                    

def start():
    scheduler = BackgroundScheduler()
    scheduler.add_job(execute_trades, 'interval', id='my_task1', hours=24)
    scheduler.add_job(crypto_trades, 'interval', id='my_task2', hours=1)
    scheduler.start()   