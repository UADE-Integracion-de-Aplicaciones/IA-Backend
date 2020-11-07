CREATE USER tester WITH PASSWORD 'tester';
CREATE DATABASE "database_test" WITH OWNER "postgres" ENCODING 'UTF8';
GRANT ALL PRIVILEGES ON DATABASE database_test to tester;
