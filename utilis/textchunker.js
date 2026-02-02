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
    if(i+chunksize>= paragraphwords.length) break;  //yha pr bhi check krrha h ki agr size bda hogya toh vps iterate krne ki zaroorat nhi // eg 750+300=1050>=1000 true - break ...  
    continue;   
 // is para ka kaam hogya  .. isko chunk krke save krlia .. ab next paragraph pr chle jaooo  
}
 
   
 // if adding this para exceeds chunk size , save current chunk 

if(currentwordcount+paragraphwordcount>chunksize && currentchunk.length>0 ){  // currentchunk - 260 h aur paragraphwordcount - 80 , 250+80-310 >300 
    chunks.push({  // leave the paragraphwordcount -80 kyu  ki limit cross horhi h bs currentchunk ko save krlo ... 
            content:currentchunk.join('\n\n'),
            chunkindex: chunkindex++,
            pagenumber:0
        })


        // create overlap from previous chunk 

        const prevchunktext = currentchunk.join(' ')   
 const prevwords = prevchunktext.split(/\s+/) // create array of that 260 words prev
  const overlaptext = prevwords.slice(-Math.min(overlap , prevwords.length)).join(' ')  // min (50 , 260) isliye kyu ki kya pta prevwords.length m 
           // 30 hote toh last ke 50 words ni le skte the .. 
           // taking eg .slice(50) .. yaani peece se 50 words utha lo ... 
           
            currentchunk = [overlaptext ,paragraph.trim()]  // ab currentchunk start hoga prev 50 words + new 80 words 
            currentwordcount = overlaptext.split(/\S+/).length+paragraphwordcount // 50+80=130.. this prevtext was taken to ensure overlapping must take place 
        
}

else {
    // add paragraph to current chunk if currentchunk can accomodate the new para 
    currentchunk.push(paragraph.trim()) //  Agar jagah hai chunk me
                           //toh paragraph simply add kar do
                            //aur word count update kar do.
    currentwordcount += paragraphwordcount
}

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
if(chunks.length ===0 && cleanedtext.length>0){ // in case koi chunk bna hi nhi h Text me proper paragraph break hi nahi mila

 //Pura text ek hi continuous string hai

 // Paragraph-based logic fail ho gaya

 // Toh:  // similar concept .. 
    const allwords = cleanedtext.split(/\s+/)  // eg allwords.length() - 1000 h 
    for(let i = 0;i<allwords.length;i+=(chunksize-overlap)){  // i -(0 to 300-50)
        const chunkwords = allwords.slice(i , i+chunksize)  // slice - (0 , 299) .. 
        chunks.push(
            {
              content:chunkwords.join('\n\n'),
            chunkindex: chunkindex++,
            pagenumber:0   
            })
            if(i+chunksize>=allwords.length) break

    }
 
}
   return chunks
}

