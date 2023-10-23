# udemy_curso_tdd
API desenvolvida em curso API Rest em Node.js aplicando testes TDD desde o princípio - UDEMY

# comandos create migrate

## Criao arquivo migrate com o nome especificado em: create_table_transactions
node_modules/.bin/knex migrate:make create_table_transactions --env test

## Atualiza as tabelas do banco de dados
node_modules/.bin/knex migrate:latest --env test
### DataBase connection

    test: {
        client: 'client database',
        connection: {
            host: 'ip/localhost',
            port: port,
            user: 'user',
            password: 'password',
            database: 'databasename'
        }
    }