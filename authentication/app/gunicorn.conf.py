# Gunicorn config file

bind = "0.0.0.0:8080"
accesslog = "access.log" 
errorlog = "error.log"
loglevel = "info"
timeout = 30 # to serach later
max_requests = 1000 # to adjust later
workers = 5 # to communicate later with hamza
threaded = True  # to communicate later with hamza