#!/bin/bash
set -e
echo "listen_addresses = '*'" >> /etc/postgresql/18/main/postgresql.conf
echo "host all all 0.0.0.0/0 md5" >> /etc/postgresql/18/main/pg_hba.conf
echo "host all all 0.0.0.0/0 scram-sha-256" >> /etc/postgresql/18/main/pg_hba.conf
echo "host all all all trust" >> /etc/postgresql/18/main/pg_hba.conf
service postgresql restart
service postgresql status
echo "Postgres configured and running."
