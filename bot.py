import websocket
import json
import talib
import config
import numpy as np
from binance.client import Client
from binance.enums import *

SOCKET = "wss://stream.binance.com:9443/ws/ethusdt@kline_1m"
RSI_PERIOD = 14
RSI_OVERBOUGHT = 70
RSI_OVERSOLD = 30
TRADE_SYMBOL = 'ETHUSD'
TRADE_QUANTITY = 0.05

closes = []
in_position= False

client = Client(config.API_KEY, config.API_SECRET, tld='us')

def order(side, quantity, symbol,order_type=ORDER_TYPE_MARKET):
    try:
        print("sending order")
        order = client.create_order(symbol=symbol, side=side, type=order_type, quantity=quantity)
        print(order)
    except Exception as e:
        print("an exception occured - {}".format(e))
        return False

    return True


def on_open(ws):
    print('open conn')

def on_close(ws):
    print('closed conn')

def on_message(ws, message):
    global closes
    print('received message')
    json_message = json.loads(message)
    candle = json_message['k']
    is_candle_closed = candle['x']
    close =candle['c']
    if is_candle_closed:
        print("candle closed at", close)
        closes.append(float(close))

        if len(closes)> RSI_PERIOD:
            np_closes = np.array(closes)
            rsi = talib.RSI(np_closes, RSI_PERIOD)
            print(rsi)
            last_rsi = rsi[-1]

            if last_rsi > RSI_OVERBOUGHT:
                if in_position:
                    print('sell')
                    order_succeeded = order(SIDE_SELL, TRADE_QUANTITY, TRADE_SYMBOL)
                    if order_succeeded:
                        in_position = False
                else:
                    print('overbought not in position')

            if last_rsi < RSI_OVERSOLD:
                if in_position:
                    print('oversold in position')
                else:
                    print('buy')
                    order_succeeded = order(SIDE_BUY, TRADE_QUANTITY, TRADE_SYMBOL)
                    if order_succeeded:
                        in_position = True           


ws = websocket.WebSocketApp(SOCKET, on_open=on_open, on_close=on_close, on_message=on_message)
ws.run_forever()