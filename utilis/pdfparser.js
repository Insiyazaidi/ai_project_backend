import fs from "fs/promises"
import { PDFParse } from "pdf-parse"
export const extracttextrfrompdf = async(filePath)=>{
    try{
        const databuffer = await fs.readFile(filePath)
        const parser = new PDFParse(new Uint8Array(databuffer))
        const data  = await parser.getText()
        return {
            text: data.text,
            numPages:data.numPages,
            info:data.info
        }
    }
    catch(error){
console.error("Pdf parsing error" ,  error)
throw new Error("Failed to extract text from PDF")
    }
}