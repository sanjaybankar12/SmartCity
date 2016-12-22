//event details//
function getEventList()
{
    var db=html5client.webdb.db;                   
        
    db.transaction(function(tx)
    {         
        tx.executeSql("select * from event_info order by id desc",[],function(tx,rs){
            
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
                    datearr[i]=rs.rows.item(i).edate;
                    imgptarr[i]=rs.rows.item(i).imgpath;
                }
                showEventList(idarr,namearr,datearr,imgptarr);
                
            }
        
        });
    });
    
}

function showEventList(idarr,namearr,datearr,imgptarr)
{
            $("#event_listid").children(li).remove();
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
                    img.src="images/rally.png";
                }
                img.src=imgpath;
                img.alt="";
                img.className="circle";

                var span=document.createElement("span"); 
                span.className="title";
                span.innerHTML=namearr[i];
                
                var p=document.createElement("p"); 
                p.className="title";
                p.innerHTML=datearr[i];
                
                var a=document.createElement("a"); 
                a.href="#";
                a.value=idarr[i];
                a.classList.add("secondary-content","mdi-content-send","o-text");                              
                li.appendChild(img);
                li.appendChild(span);
                li.appendChild(p);
                li.appendChild(a);

                $("#event_listid").append(li);
            }
}

function updateEventList()
{ 
    var db=html5client.webdb.db;  
                           
    db.transaction(function(tx)
    {
        tx.executeSql("select * from event_info",[],function(tx,rs){
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
                url:"http://46.165.245.224/~letstalk/ElectionRoom/rallylist.php",
                data:{"idlist":idlist},
                dataType:"json",
                success:function(response,testStatus,jqXHR)
                {
                    var id=response.id;
                    var name=response.name;
                    var date=response.date;
                    var imgpath=response.imgpath;
                    var desc=response.desc;
                    
                    insertEventList(id,name,date,imgpath,desc);
                },
                error:function(response,testStatus,jqXHR)
                {
                   localStorage.setItem("net","ERROR");
                }
            });
            
        });
    });
        
}

function insertEventList(id,name,date,imgpath,desc)
{
    var db=html5client.webdb.db;                   
        
    db.transaction(function(tx)
    {
        for(var i=0;i<+id.length;i++)
        {
            downloadEvent("http://46.165.245.224/~letstalk/ElectionRoom/uploads/"+imgpath[i]);
            
            tx.executeSql("insert into event_info(id,name,edate,imgpath,desc) values(?,?,?,?,?)",[id[i],name[i],date[i],imgpath[i],desc[i]],function(){ });
        }       
        
    });
}

function getEventDetailsById(eid)
{
    var db=html5client.webdb.db;                   
        
    db.transaction(function(tx)
    {
        tx.executeSql("select * from event_info where id=?",[eid],function(tx,rs){
            $("#event_detailsid .card-title").html(rs.rows.item(0).name);        
            $("#event_detailsid .card-content").children("p").html(rs.rows.item(0).desc);   
            
            var imgpath=localStorage.getItem("fullDirPath")+rs.rows.item(0).imgpath;
            if(rs.rows.item(0).imgpath==="")
            {
                img.src="images/rally.png";
            }
            $("#event_detailsid img").prop("src",imgpath);
        });
        
    });
}

function downloadEvent(URL)
{
    var fileTransfer = new FileTransfer();
    var download_link = encodeURI(URL);
    var File_Name = download_link.substr(download_link.lastIndexOf('/') + 1);
    
    var dest=localStorage.getItem("fullDirPath")+File_Name;
    fileTransfer.download(download_link, dest, function (entry) {  }, function (error) { });
}
   