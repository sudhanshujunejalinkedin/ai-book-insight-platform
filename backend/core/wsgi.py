import os
from django.core.wsgi import get_wsgi_application

# Agar tumhare folder ka naam 'core' nahi hai, toh niche 'core.settings' badal dena
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')

application = get_wsgi_application()