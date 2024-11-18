python3 manage.py runserver (to run django, install python3 & django)

# DATA
# to export bdd
python3 manage.py dumpdata > data.json
# to export specific data
python3 manage.py dumpdata <app_name.ModelName> --indent 2 > data.json

# to import bdd
python3 manage.py loaddata data.json

# to connect postgres
sudo -u postgres psql
sudo -u postgres psql transcendance_db <!-- to access directly bdd  -->

### if connected to postgres ###
# to print all bdd
\l
# to connect bdd
\c <bdd_name>
# to print all tables
\dt
\dt+ <!-- for more detail -->
# to print table's structure
\d <table_name>
# to print table's content
SELECT * FROM <table_name>;
# to clear terminal
\! clear
# to quit postgres
\q

