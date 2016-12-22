//Job details//
function getJobList()
{
    var db=html5client.webdb.db;                   
        
    db.transaction(function(tx)
    {         
        tx.executeSql("select * from job_info order by id desc",[],function(tx,rs){
            
            var len=+rs.rows.length;
            if(len>0)
            {
                var idarr=[];
                var namearr=[];
                var datearr=[];
                var descarr=[];
                for(var i=0;i<+len;i++)
                {
                    idarr[i]=rs.rows.item(i).id;
                    namearr[i]=rs.rows.item(i).name;
                    datearr[i]=rs.rows.item(i).jdate;
                    descarr[i]=rs.rows.item(i).desc;
                }
                showJobList(idarr,namearr,datearr,descarr);
                
            }
        
        });
    });
    
}

function showJobList(idarr,namearr,datearr,descarr)
{
            $("#job_listid").children(li).remove();
            for(var i=0;i<+idarr.length;i++)
            {
                var li=document.createElement("li");  
                li.classList.add("collection-item");
                
                
                var img=document.createElement("img");
                img.src="images/news1.jpg";
                img.alt="";
                img.className="circle";

                var span=document.createElement("span"); 
                span.classList.add("title","bl");
                span.innerHTML=namearr[i];
                
                var p=document.createElement("p"); 
                p.className="title";
                var dt=datearr[i].split('-');
                p.innerHTML=dt[2]+"-"+dt[1]+"-"+dt[0];
                
                var hr=document.createElement("hr"); 
                
                var a=document.createElement("a"); 
                a.href="#";
                a.value=idarr[i];
                a.classList.add("secondary-content","mdi-content-send","o-text");           
                var div=document.createElement("div"); 
                div.className="title";
                div.innerHTML=descarr[i];
                
                li.appendChild(img);
                li.appendChild(span);
                li.appendChild(p);
                li.appendChild(hr);
                li.appendChild(a);
                li.appendChild(div);


                $("#job_listid").append(li);
            }
}

function updateJobList()
{ 
    var db=html5client.webdb.db;  
                           
    db.transaction(function(tx)
    {                   
        tx.executeSql("select * from job_info",[],function(tx,rs){
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
                url:"http://46.165.245.224/~letstalk/ElectionRoom/joblist.php",
                data:{"idlist":idlist},
                dataType:"json",
                success:function(response,testStatus,jqXHR)
                {
                    var id=response.id;
                    var name=response.name;
                    var date=response.date;
                    var imgpath=response.imgpath;
                    var desc=response.desc;
                    
                    insertJobList(id,name,date,imgpath,desc);
                },
                error:function(response,testStatus,jqXHR)
                {
                   localStorage.setItem("net","ERROR");
                }
            });

        });
    });
        
}

function insertJobList(id,name,date,imgpath,desc)
{
    var db=html5client.webdb.db;                   

    db.transaction(function(tx)
    {
        for(var i=0;i<+id.length;i++)
        {
            downloadJob("http://46.165.245.224/~letstalk/ElectionRoom/uploads/"+imgpath[i]);
            
            tx.executeSql("insert into job_info(id,name,jdate,imgpath,desc) values(?,?,?,?,?)",[id[i],name[i],date[i],imgpath[i],desc[i]],function(){ });
        }
        var isauto=sessionStorage.getItem("isauto");
        if(isauto==="NO")
        {
            window.location.href="index.html";
        }
        
    });
}

function getJobDetailsById(jid)
{
    var db=html5client.webdb.db;                   
        
    db.transaction(function(tx)
    {
        tx.executeSql("select * from job_info where id=?",[jid],function(tx,rs){
            $("#job_detailsid .card-title").html(rs.rows.item(0).name);        
            $("#job_detailsid .card-content").children("p").html(rs.rows.item(0).desc);
            
            var imgpath=localStorage.getItem("fullDirPath")+rs.rows.item(0).imgpath;
            if(rs.rows.item(0).imgpath==="")
            {
                img.src="images/news1.jpg";
            }
            $("#job_detailsid img").prop("src",imgpath);
        });
        
    });
}

function downloadJob(URL)
{
    var fileTransfer = new FileTransfer();
    var download_link = encodeURI(URL);
    var File_Name = download_link.substr(download_link.lastIndexOf('/') + 1);
    
    var dest=localStorage.getItem("fullDirPath")+File_Name;
    fileTransfer.download(download_link, dest, function (entry) { }, function (error) { });
}