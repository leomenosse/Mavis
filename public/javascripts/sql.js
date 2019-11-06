exports.conectar = function conectar(con){
    con.connect(function (err) {
        if (err) throw err;
        console.log('Conexão realizada com sucesso');        
    })
}

exports.criarDatabase = function criarDatabase(con, databaseName) {
    con.query("CREATE DATABASE IF NOT EXISTS " + databaseName, function (err, result) {
        if (err) throw err;
        console.log('Database criada com sucesso');
    })
}

exports.usarDatabase = function usarDatabase(con, databaseName){
    con.changeUser({ database: databaseName }, function (err) {
        if (err) throw err;
        console.log('Database da conexão alterada para ' + databaseName);
    })
}

exports.criarTabela = function criarTabela(con, tableName, fields, dataTypes){
    
    if(fields.length != dataTypes.length){
        console.error('Quantidade de campos é diferente da quantidade de tipos de dados');
        return;
    }

    let sql = 'CREATE TABLE IF NOT EXISTS ' + tableName + ' (';
    
    //cria o comando sql
    for(let i = 0; i < fields.length; i++){
        sql += fields[i];
        sql += ' ' + dataTypes[i];
        if(i == fields.length - 1){ //última iteração
            sql += ')';
        }
        else{
            sql += ', ';
        }
    }

    console.log('String do sql: '+sql);

    con.query(sql, function(err, result){
        if(err) throw err;
        console.log('Tabela '+tableName+' criada com sucesso');
    })

}

exports.mostrarTabelas = function mostrarTabelas(con, databaseName, callback){
    this.usarDatabase(con, databaseName);

    let sql = 'SHOW TABLES';
    con.query(sql, function(err, result){
        if (err) throw err;

        let tableNames = [];

        for(let i = 0; i < result.length; i++){
            tableNames.push(result[i]['Tables_in_'+databaseName]);
        }

        callback(tableNames);
    })
}

//descreve apenas uma coluna. Deve ser usada dentro da função descreverTabela
function descreverColuna(column){
    let desc = '';

    desc += 'Nome do campo: '+column.Field+'\n';
    desc += 'Tipo: '+column.Type+'\n';
    desc += 'Null: '+column.Null+'\n';
    desc += 'Key: '+column.Key+'\n';
    desc += 'Default: '+column.Default+'\n';
    desc += 'Extra: '+column.Extra;

    return desc;
}

//descreve todos os atributos da tabela (field, type, null, key, extra...)
exports.descreverTabela = function descreverTabela(con, tableName, callback){
    let sql = 'DESC '+tableName;
    let tableColumns = [];

    con.query(sql, function(err, result){
        if (err) throw err;

        for(let i = 0; i < result.length; i++){
            tableColumns.push(result[i]);
            //console.log('\n' + descreverColuna(tableColumns[i]));
        }
        callback(tableColumns);
    })
}

//no callback, retorna o nome das colunas da tabela de nome tableName
exports.atributosTabela = function atributosTabela(con, tableName, callback){
    let sql = 'DESC '+tableName;
    let columns = [];

    con.query(sql, function(err, result){
        if (err) throw err;

        for(let i = 0; i < result.length; i++){
            columns.push(result[i]['Field']);
        }
        callback(columns);
    })

}

//recebe uma coluna (field, type, null, key, extra...) e verifica se o tipo de dado é texto ou número
exports.identificarTipoAtributo = function identificarTipoAtributo(tableColumn, callback){
    let type = tableColumn.Type.toLowerCase();
    let response = 'undefined';

    if (type.includes('int') || type.includes('bit') || type.includes('decimal') || type.includes('numeric')
        || type.includes('float') || type.includes('real')){
            response = 'number'; //number
    }
    if (type.includes('varchar') || type.includes('text') || type.includes('date') || type.includes('time')
        || type.includes('year')){
            response = 'text'; //text
    }

    callback(response);
}

//retorna no callback os atributos de uma tabela que são do tipo texto e os que são numéricos
exports.separarEmTextoENumero = function separarEmTextoENumero(con, tableName, callback){
    let textAttributes = [];
    let numericAttributes = [];

    this.descreverTabela(con, tableName, (columns) => {
        let tableAttributes = columns;

        for(let i = 0; i < tableAttributes.length; i++){
            this.identificarTipoAtributo(tableAttributes[i], (res) => {
                if (res == "text")
                    textAttributes.push(tableAttributes[i].Field);
                else if (res == "number")
                    numericAttributes.push(tableAttributes[i].Field);
            });
        }

        callback(textAttributes, numericAttributes);
    })
}

exports.selecionarAtributo = function selecionarAtributo(con, tableName, attribute, callback){
    let sql = 'SELECT '+attribute+' FROM '+tableName;

    con.query(sql, function(err, result){
        if (err) throw err;
        callback(result);
    })
}

exports.montarQuery = function montarQuery(attributes, tableName){
    let sql = 'SELECT ';

    for(let i = 0; i < attributes.length; i++){
        sql += '`' + attributes[i] + '`';
        if(i !== attributes.length - 1){
            sql += ', '
        }
    }

    sql += ' FROM ' + tableName;

    return sql;
}