export const chunktext = (text , chunksize=500 , overlap=50)=>{
    if(!text || text.trim.length===0){
        return []
    }
    const cleanedtext = text.replace(/\r\n/g , '\n').replace(/\s+/g , ' ').replace(/\n /g , '\n').replace(/ \n/g , '\n').trim()
    const paragraphs = cleanedtext.split(/\n+/).filter(p=>p.trim().length>0) //  "Hello world\n\nThis is paragraph two\n\n\nThis is paragraph three"
// this will be converted into array using .split

 

    const chunks =[]
    let currentchunk = []
    let currentwordcount =0;
    let chunkindex = 0;    // [ "   Hello   world   from   AI   " , " hello insiya zaidi" ] - paragraphs 
//   "   Hello   world   from   AI   "  - paragraph ,,, .trim will remove front and back space .split will remove in btw spaces and 
// convert each word of paragraph into elements of array .. ["Hello", "world", "from", "AI"]

    for(const paragraph of paragraphs){
        const paragraphwords = paragraph.trim().split(/\s+/)  // paragraphwords will be an array .. 
const paragraphwordcount = paragraphwords.length  //  600 

// if single paragraph exceeds chunk size , split it by words 
if(paragraphwordcount>chunksize){ // 600>500 
    if(currentchunk.length>0){    // if currentchunk >0 .. yaani koi prev chunk bacha hua h  toh usko  save krlo phle 
        chunks.push({
            content:currentchunk.join('\n\n'),
            chunkindex: chunkindex++,
            pagenumber:0
        })
    }
    currentchunk=[];
    currentwordcount =0;
}

// split large paragraph into word based chunks                 // total word = 1000 , chunksize = 300 , overlap = 50 
for(let i =0 ; i<paragraphwords.length;i +=(chunksize-overlap)){   //   i = 0,  i = 250 , i = 500 , i = 750 , i= 1000
    const chunkwords = paragraphwords.slice(i , i+chunksize) // 0-249 words , 250-549 , 500-799, 750 - 1050  
    chunks.push({
        content:chunkwords.join(' '),
        chunkindex:chunkindex++,
        pagenumber:0
    })
    if(i+chunksize>= paragraphwords.length) break;  //yha pr bhi check krrha h ki agr size bda hogya toh vps iterate krne ki zaroorat nhi 
    // eg 750+300=1050>=1000 true - break ...  
}

continue;
    }



 // if adding this para exceeds chunk size , save current chunk 
if(currentwordcount+paragraphwordcount>chunksize && currentchunk.length>0 ){
    chunks.push({
            content:currentchunk.join('\n\n'),
            chunkindex: chunkindex++,
            pagenumber:0
        })

        // create overlap from previous chunk 
        const prevchunktext = currentchunk.join(' ')
            const prevword = prevchunktext.split(/\S+/)
            const overlaptext = prevword.slice(-Math.min(overlap , prevwords.length)).join(' ')
            currentchunk = [overlaptext ,paragraph.trim()]
            currentwordcount = overlaptext.split(/\S+/).length+paragraphwordcount
        
}
else {
    // add paragraph to current chunk 
    currentchunk.push(paragraph.trim())
    currentwordcount += paragraphwordcount
}


// add last chunk 
if(currentchunk.length>0){
     chunks.push({
            content:currentchunk.join('\n\n'),
            chunkindex: chunkindex++,
            pagenumber:0
        })
}

// fall back if no chunks created , split by words 
if(chunks.length ===0 && cleanedtext.length>0){
    const allwords = cleanedtext.split(/\S+/)
    for(let i = 0;i<allwords.length;i+=(chunksize-overlap)){
        const chunkwords = allwords.slice(i , i+chunksize)
        chunks.push(
            {
              content:currentchunk.join('\n\n'),
            chunkindex: chunkindex++,
            pagenumber:0   
            })
            if(i+chunksize>=allwords.length) break

    }
 
}
   return chunks
}

