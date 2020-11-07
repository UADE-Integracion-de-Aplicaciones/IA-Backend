# IA-Backend

*** Agregar modelo con la cli de sequelize***
'cd src/sequelize' Nose metemos en la carpeta de sequelize
sequelize model:create --name [nombre del modelo] --attributes [atributo:tipo],[atributo2:tipo]

Por ejemplo
sequelize model:create --name usuario --attributes username:string,status:char



Como inicializar el servidor y generar la documentacion

npm run swagger-autogen

Y entrar a localhost:8080/doc


Para levantar la base de datos + servidor local, expone en puerto 8080

npm run compose:local