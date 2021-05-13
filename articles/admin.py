from django.contrib import admin

from .models import FinalCSV, UserPortfolio, UserPortfolioStats, TDState, Strategies, Crypto, BinanceAPI 

admin.site.register(FinalCSV)
admin.site.register(UserPortfolio)
admin.site.register(Strategies)
admin.site.register(UserPortfolioStats)
admin.site.register(TDState)
admin.site.register(Crypto)
admin.site.register(BinanceAPI)