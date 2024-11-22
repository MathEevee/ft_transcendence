# BACKEND

# install python3
sudo apt update
sudo apt install python3 python3-pip python3-venv
# create virtual env
python3 -m venv myenv
# activate virtual env
source myenv/bin/activate
# install python dependances
pip install -r requirements.txt

<!-- next commands commented can use to have same versions for all dev_team -->
# pip freeze > requirements.txt


python3 manage.py runserver (to run django, install python3 & django)

# DATA
<!-- needs files .env and secrets -->

# install postgres
sudo apt update
sudo apt install postgresql postgresql-contrib

# create database
./data/create_db.sh
# init database
python3 data/setup_db.py

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

