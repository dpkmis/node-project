const express=require("express");
const res = require("express/lib/response");
const fs=require("fs");
const app=express();
var tickets;

//to fetch ticket.json
fs.readFile("./ticket.json",function(err,data){
    
    tickets=JSON.parse(data);
    
})

app.get("/ticket/v1/getAllTickets",(req,res)=>{
    res.json(tickets);
});

app.get("/ticket/v1/getAllTicketsWithPagination",paginatedResults(tickets),(req,res)=>{
    res.json(paginatedResults);
});

function paginatedResults(tickets){
    return(req,res,next)=>{
        const limit=5;
        const pages=tickets.length/limit;
        
        const startIndex=(page-1)*limit;
        const endIndex=page*limit;

        const results={};
        if(endIndex<tickets.length){
            results.next={
                page:page+1,
                limit:limit
            };
        }
        if(startIndex>0){
            results.previous={

                psge:page-1,
                limit:limit
            };
        }
    
    results.results=tickets.slice(startIndex,endIndex);
    res.paginatedResults=results;
    next();
    }

}



app.post("/ticket/v1/uniqueTags",uniqueTags(tickets),(req,res)=>{
    res.json(uniqueTags);
});

function uniqueTags(tickets)
{
    return(req,res,next)=>{
    var tagsArr=[];
    const results={};

    for(var arr of tickets)
    {
        for(var key in arr)
        {
            if(key==="tags")
                tagsArr.push(arr[key]); 
        }
    }

//to get the unique values


    for (var i=0; i<tagsArr.length; i++) {
        var listI = tagsArr[i];
        loopJ: for (var j=0; j<tagsArr.length; j++) {
            var listJ = tagsArr[j];
            if (listI === listJ) continue; //Ignore itself
            for (var k=listJ.length; k>=0; k--) {
                if (listJ[k] !== listI[k]) continue loopJ;
            }
            // At this point, their values are equal.
            tagsArr.splice(j, 1);

        }
        results.results=tagsArr;
        res.uniqueTags=results;
        next();
    }
    }
}