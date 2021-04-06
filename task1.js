const cheerio = require("cheerio");
const axios = require("axios");
const json2csv = require("json2csv").Parser;
const fs = require("fs")

const config = {
     header : {
    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.114 Safari/537.36 Edg/89.0.774.68",
    "authority": "scrapethissite.com",
    "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
    "accept-encoding": "gzip, deflate, br",
    "accept-language": "en-US,en;q=0.9",
},br:true};

const Url = 'https://scrapethissite.com/pages/simple/?fbclid=IwAR3R6JrcmQYeJ-x4zL0-VUgFBnOV-VTOXouuk0ff8KlbDw_ajS-8CtM78ho';

(async() => {
let Information = [];
const {data} = await axios.get(Url,config);
let $ = cheerio.load(data);

let list = []
const keys = [
    'country-name',
    'country-capital',
    'country-population',
    'country-area'
]


const row = "#countries > div > div"

$(row).each((parentIdx, parentElem) => {
  
    $(parentElem).children().each((childIdx, childElem) => {
        let keyIdx = 0;
        const details = {};

        $(childElem).children('#countries > div > div > div > h3').each((child2Idx,child2Elem) =>{
            country_name = $(child2Elem).text().trim();
           
            if (country_name){
                details[keys[keyIdx]] = country_name;

                keyIdx ++;
            }
        })
        
        $(childElem).children().each((child3Idx,child3Elem) =>
        {

                $(child3Elem).children('span[class="country-capital"]').each((child4Idx,child4Elem) =>{
                    
                    capital = $(child4Elem).text();
                  

                    if (capital){
                        details[keys[keyIdx]] = capital;
                    }
                     keyIdx ++;
                })


            $(child3Elem).children('span[class="country-population"]').each((child5Idx,child5Elem) =>{
                    
                population = $(child5Elem).text();
               
                if (population){
                    details[keys[keyIdx]] = population;              
                }
                 keyIdx ++;
            })

        $(child3Elem).children('span[class="country-area"]').each((child6Idx,child6Elem) =>{
                    
            area = $(child6Elem).text();
           
            if (area){
            details[keys[keyIdx]] = area;
            
            }
             keyIdx ++;
        })

      

    })
    if(!list.includes(details) ){

        list.push(details);
    }

  })

    

})


console.log(list)
const j2cp = new json2csv();
const csv = j2cp.parse(list);

fs.writeFileSync("./Countries.csv",csv, "utf-8");


})();