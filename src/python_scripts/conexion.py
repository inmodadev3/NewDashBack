import pyodbc

def conectar():
    server = '192.168.1.127\\SQLEXPRESS'
    database = 'INMODANET'
    username = 'Hgi'
    password = 'Hgi'

    connection_string = f'DRIVER=ODBC Driver 17 for SQL Server;SERVER={server};DATABASE={database};UID={username};PWD={password}'
    connection = pyodbc.connect(connection_string)
    return connection
