from django.apps import AppConfig


class ArticlesConfig(AppConfig):
    name = 'articles'
    
    def ready(self):
        from scheduler import scheduler
        scheduler.start()
        
