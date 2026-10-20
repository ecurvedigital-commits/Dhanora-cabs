#!/bin/bash
set -e
export DEBIAN_FRONTEND=noninteractive
apt-get update -y
apt-get install -y postgresql postgresql-contrib
service postgresql start
sudo -u postgres psql -tc "SELECT 1 FROM pg_user WHERE usename = 'dehradun'" | grep -q 1 || sudo -u postgres psql -c "CREATE USER dehradun WITH PASSWORD 'dehradun_dev' SUPERUSER;"
sudo -u postgres psql -tc "SELECT 1 FROM pg_database WHERE datname = 'dehradun_dev'" | grep -q 1 || sudo -u postgres psql -c "CREATE DATABASE dehradun_dev OWNER dehradun;"
sudo -u postgres psql -tc "SELECT 1 FROM pg_database WHERE datname = 'dehradun_test'" | grep -q 1 || sudo -u postgres psql -c "CREATE DATABASE dehradun_test OWNER dehradun;"
echo "PostgreSQL setup completed successfully."
