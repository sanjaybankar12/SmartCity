var html5client={};
html5client.webdb={};
html5client.webdb.db=null;

createDatabase=function()
{
    var dbsize=5*1024*1024;
    html5client.webdb.db=openDatabase("smartcitydb","1.0","smartcitydb",dbsize);
};

createTables=function()
{
    var db=html5client.webdb.db;
    db.transaction(function(tx)
    {
        tx.executeSql("create table if not exists register_info(uid int primary key,name varchar(1000),phone varchar(255),city varchar(255))",[],function(){ });
        
    
    });
};

function init_client()
{
    createDatabase();  
    createTables();
};

