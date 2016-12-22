var html5client={};
html5client.webdb={};
html5client.webdb.db=null;

createDatabase=function()
{
    var dbsize=5*1024*1024;
    html5client.webdb.db=openDatabase("socialdb","1.0","socialdb",dbsize);
};

createTables=function()
{
    var db=html5client.webdb.db;
    db.transaction(function(tx)
    {
        tx.executeSql("create table if not exists register_info(uid int primary key,name varchar(1000),phone varchar(255),email varchar(255),city varchar(255))",[],function(){ });
        
        tx.executeSql("create table if not exists work_info(id int primary key,name varchar(1000),wdate date,imgpath varchar(1000),desc longtext, update_date long)",[],function(){ });
       
        tx.executeSql("create table if not exists job_info(id int primary key,name varchar(1000),jdate date,imgpath varchar(1000),desc longtext)",[],function(){ });
        
        tx.executeSql("create table if not exists event_info(id int primary key,name varchar(1000),edate date,imgpath varchar(1000),desc longtext)",[],function(){ });
        
        tx.executeSql("create table if not exists gallary_info(id int primary key,name varchar(1000),idate date,imgpath varchar(1000),desc longtext)",[],function(){ });

       // tx.executeSql("create table if not exists brimage_info(id int auto_increment primary key,name varchar(1000))",[],function(){  });
    
    });
};

function init_client()
{
    createDatabase();  
    createTables();
};

function getUserId()
{
    var db=html5client.webdb.db;                   
        
    db.transaction(function(tx)
    {         
        tx.executeSql("select * from register_info",[],function(tx,rs){
            
            var email=$.trim(rs.rows.item(0).email);
            $("#userid").text(email);
            if(email=="")
            {
                $("#slide-out #userid").parent().css("display","none");
            }
           
        });
    });
    
}

function checkUserRegistration()
{
    var db=html5client.webdb.db;                   
        
    db.transaction(function(tx)
    {         
        tx.executeSql("select * from register_info",[],function(tx,rs){
            
            var len=+rs.rows.length;
            if(len>0)
            {
               window.location.href="wel.html";
            }
            else
            {
               window.location.href="register.html";
            }
        
        });
    });
}


function registerUser(uid,name,phone,email,city)
{
    var db=html5client.webdb.db;                   
        
    db.transaction(function(tx)
    {         
        tx.executeSql("insert into register_info(uid,name,phone,email,city) values(?,?,?,?,?)",[uid,name,phone,email,city],function(tx,rs){
            
            $("#regres").text("Registration done successfully");
            updateByUser();
        
        });
    });
}

function updateByUser()
{
    sessionStorage.setItem("isauto","NO");
    updateWorkList();
    //updateEventList();
    // updateGallaryList();
    //updateJobList();
    // window.location.href="index.html";
}
function autoUpdate()
{
    sessionStorage.setItem("isauto","YES");
    updateWorkList();
    //updateEventList();
    // updateGallaryList();
    //updateJobList();
    // window.location.href="index.html";
}

function getRegistrationDetails()
{
    var db=html5client.webdb.db;                   
        
    db.transaction(function(tx)
    {         
        tx.executeSql("select * from register_info",[],function(tx,rs){
        
            var name=rs.rows.item(0).name;
            var phone=rs.rows.item(0).phone;
            
            $("#enquiryform input[name=ename]").val(name);
            $("#enquiryform input[name=ename]").focusin();
            $("#enquiryform input[name=contact]").val(phone);
            $("#enquiryform input[name=contact]").focusin();
            
        });
    });
}

//work details//
function getWorkList()
{
    var db=html5client.webdb.db;                   
        
    db.transaction(function(tx)
    {         
        tx.executeSql("select * from work_info order by id desc",[],function(tx,rs){
            
            var len=+rs.rows.length;
            if(len>0)
            {
                var idarr=[];
                var namearr=[];
                var datearr=[];
                var imgptarr=[];
                var updtarr=[];
                for(var i=0;i<+len;i++)
                {
                    idarr[i]=rs.rows.item(i).id;
                    namearr[i]=rs.rows.item(i).name;
                    datearr[i]=rs.rows.item(i).wdate;
                    imgptarr[i]=rs.rows.item(i).imgpath;
                    updtarr[i]=rs.rows.item(i).update_date;
                }
                showWorkList(idarr,namearr,datearr,imgptarr,updtarr);
                
            }
        
        });
    });
    
}

function showWorkList(idarr,namearr,datearr,imgptarr,updtarr)
{
            $("#work_listid").children(li).remove();
            for(var i=0;i<+idarr.length;i++)
            {
                var li=document.createElement("li");  
                li.classList.add("collection-item","avatar");
                
                var imgpath=localStorage.getItem("fullDirPath")+imgptarr[i];
                
                var img=document.createElement("img");
                if(imgptarr[i]!=="")
                {
                    img.src=imgpath;
                }
                else
                {
                    img.src="images/vikas.png";
                }
                img.src=imgpath;
                img.alt="";
                img.className="circle";

                var span=document.createElement("span"); 
                span.classList.add("title","bl");
                span.innerHTML=namearr[i];
                
                var p=document.createElement("p"); 
                p.className="title";
                var dt=datearr[i].split('-');
                p.innerHTML=dt[2]+"-"+dt[1]+"-"+dt[0];
                
                var a=document.createElement("a"); 
                a.href="#";
                a.value=idarr[i];
                a.classList.add("secondary-content","mdi-content-send","o-text"); 
              
                li.appendChild(img);
                li.appendChild(span);                             
                li.appendChild(p);                                               
                li.appendChild(a);
                   
                var newmsg=document.createElement("img"); 
                newmsg.className="newmsg";
                newmsg.src="images/new.gif";
                  
                var tdaydt=new Date().getTime();
                var diffdt=+tdaydt-(+updtarr[i]);                                
                
                if(+diffdt<=172800000)
                {
                   li.appendChild(newmsg);
                }

                $("#work_listid").append(li);
            }
}

function updateWorkList()
{ 
    var db=html5client.webdb.db;  
                           
    db.transaction(function(tx)
    {
        tx.executeSql("select * from work_info",[],function(tx,rs){
            var len=rs.rows.length;
            var idlist="";
            for(var i=0;i<+len;i++)
            {
                if(i==0)
                {
                    idlist=rs.rows.item(0).id;
                }
                else
                {
                    idlist=idlist+","+rs.rows.item(i).id;
                }
            }   
            if(idlist=="")
            {
                idlist="-1";
            }
            
            $.ajax({
                type:"POST",
                url:"http://46.165.245.224/~letstalk/ElectionRoom/worklist.php",
                data:{"idlist":idlist},
                dataType:"json",
                success:function(response,testStatus,jqXHR)
                {
                    var id=response.id;
                    var name=response.name;
                    var date=response.date;
                    var imgpath=response.imgpath;
                    var desc=response.desc;
                    
                    insertWorkList(id,name,date,imgpath,desc);
                },
                error:function(response,testStatus,jqXHR)
                {
                   localStorage.setItem("net","ERROR");
                }
            });
            
        });
    });
        
}

function insertWorkList(id,name,date,imgpath,desc)
{
    var db=html5client.webdb.db;                   
        
    db.transaction(function(tx)
    {
        for(var i=0;i<+id.length;i++)
        {
            downloadWork("http://46.165.245.224/~letstalk/ElectionRoom/uploads/"+imgpath[i]);
            var dt=new Date().getTime();
            tx.executeSql("insert into work_info(id,name,wdate,imgpath,desc,update_date) values(?,?,?,?,?,?)",[id[i],name[i],date[i],imgpath[i],desc[i],dt],function(){ });
            
        }   
        var isauto=sessionStorage.getItem("isauto");
        if(isauto==="NO")
        {
            window.location.href="index.html";
        }
        
    });
}

function getWorkDetailsById(wid)
{
    var db=html5client.webdb.db;                   
        
    db.transaction(function(tx)
    {
        tx.executeSql("select * from work_info where id=?",[wid],function(tx,rs){
            $("#work_detailsid .card-title").html(rs.rows.item(0).name);        
            $("#work_detailsid .card-content").children("p").html(rs.rows.item(0).desc);   
            
            var imgpath=localStorage.getItem("fullDirPath")+rs.rows.item(0).imgpath;
            if(rs.rows.item(0).imgpath==="")
            {
                img.src="images/vikas.png";
            }
            $("#work_detailsid img").prop("src",imgpath);
        });
        
    });
}

function createDir(Folder_Name)
{
     window.requestFileSystem(LocalFileSystem.PERSISTENT, 50*1024*1024, fileSystemSuccess, fileSystemFail);

    function fileSystemSuccess(fileSystem)
    {
        var rootDir = fileSystem.root; 
        rootDir.getDirectory(Folder_Name, { create: true, exclusive: false }, onDirectorySuccess, onDirectoryFail); 
    }

    function onDirectorySuccess(dirEntry) 
    {
        localStorage.setItem("isDirSet","YES");
        localStorage.setItem("fullDirPath",dirEntry.nativeURL);
    }

    function onDirectoryFail(error)
    {
        localStorage.setItem("isDirSet","NO");
    }

    function fileSystemFail(evt)
    {
    }
}
            
function downloadWork(URL)
{
    var fileTransfer = new FileTransfer();
    var download_link = encodeURI(URL);
    var File_Name = download_link.substr(download_link.lastIndexOf('/') + 1);
    
    var dest=localStorage.getItem("fullDirPath")+File_Name;
    fileTransfer.download(download_link, dest, function (entry) {  }, function (error) { });
}


//gallary info
function getGallaryList()
{
    var db=html5client.webdb.db;                   
        
    db.transaction(function(tx)
    {         
        tx.executeSql("select * from gallary_info order by id desc",[],function(tx,rs){
            
            var len=+rs.rows.length;
            if(len>0)
            {
                var idarr=[];
                var namearr=[];
                var datearr=[];
                var imgptarr=[];
                for(var i=0;i<+len;i++)
                {
                    idarr[i]=rs.rows.item(i).id;
                    namearr[i]=rs.rows.item(i).name;
                    datearr[i]=rs.rows.item(i).idate;
                    imgptarr[i]=rs.rows.item(i).imgpath;
                }
                showGallaryList(idarr,namearr,datearr,imgptarr);
                
            }
        
        });
    });    
}

function showGallaryList(idarr,namearr,datearr,imgptarr)
{
            for(var i=0;i<+idarr.length;i++)
            {               
                var div1=document.createElement("div");  
                div1.classList.add("col","s6");
                
                var div2=document.createElement("div");  
                div2.classList.add("gallery-box","z-depth-1");
                
                var imgpath=localStorage.getItem("fullDirPath")+imgptarr[i];
                
                var img=document.createElement("img");
                if(imgptarr[i]!=="")
                {
                    img.src=imgpath;
                }
                else
                {
                    img.src="images/rd.jpg";
                }
                img.width="250";
                img.className="materialboxed";                

                div2.appendChild(img);
                div1.appendChild(div2);
                           
                $("#gallay_id").append(div1);
            }
}

function updateGallaryList()
{ 
    var db=html5client.webdb.db;  
                           
    db.transaction(function(tx)
    {
        tx.executeSql("select * from gallary_info",[],function(tx,rs){
            var len=rs.rows.length;
            var idlist="";
            for(var i=0;i<+len;i++)
            {
                if(i==0)
                {
                    idlist=rs.rows.item(0).id;
                }
                else
                {
                    idlist=idlist+","+rs.rows.item(i).id;
                }
            }   
            if(idlist=="")
            {
                idlist="-1";
            }
            
            $.ajax({
                type:"POST",
                url:"http://46.165.245.224/~letstalk/ElectionRoom/gallerylist.php",
                data:{"idlist":idlist},
                dataType:"json",
                success:function(response,testStatus,jqXHR)
                {
                    var id=response.id;
                    var name=response.name;
                    var date=response.date;
                    var imgpath=response.imgpath;
                    
                    insertGallaryList(id,name,date,imgpath);
                },
                error:function(response,testStatus,jqXHR)
                {
                   localStorage.setItem("net","ERROR");
                }
            });
            
        });
    });
        
}

function insertGallaryList(id,name,date,imgpath)
{
    var db=html5client.webdb.db;                   
        
    db.transaction(function(tx)
    {
        for(var i=0;i<+id.length;i++)
        {
            downloadGallary("http://46.165.245.224/~letstalk/ElectionRoom/uploads/"+imgpath[i]);
            
            tx.executeSql("insert into gallary_info(id,name,idate,imgpath,desc) values(?,?,?,?,?)",[id[i],name[i],date[i],imgpath[i],'desc'],function(){ });            
        }        
        
    });
}

function downloadGallary(URL)
{
    var fileTransfer = new FileTransfer();
    var download_link = encodeURI(URL);
    var File_Name = download_link.substr(download_link.lastIndexOf('/') + 1);
    
    var dest=localStorage.getItem("fullDirPath")+File_Name;
    fileTransfer.download(download_link, dest, function (entry) {  }, function (error) { });
}

