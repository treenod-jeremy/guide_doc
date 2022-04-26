import fetch from "node-fetch";
import express from 'express';
import bodyParser from 'body-parser'
import yaml from 'js-yaml'
import fs from 'fs'
import {parser} from "./schema.js";

let currVersion = 1;
let htmlText = '<h1>공사중</h1>';
let title = '';
let accessUrl = '';
let accessKey = '';
const app = express()
const port = 5252


const fetchDate = async () => {
    const response = await fetch('http://127.0.0.1:5000/time', {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
    return await response.json()
}

try{
    const doc = yaml.load(fs.readFileSync('urlSetting.yml', 'utf8'))

    const dateData = await fetchDate()
    const date = new Date(dateData.currentTime)
    const [year, month] = [date.getFullYear(), date.getMonth()+1]
    accessUrl = doc[year][month]
    accessKey = doc['jeremyKey']

}catch (e){
    console.log(e)
}


app.use(bodyParser.urlencoded({extended: true, limit: '1mb'}))
app.use(bodyParser.json({limit: '1mb'}))

app.get('/', (req, res) => {
    res.send('Create Guide Doc')
})

app.post('/', async (req, res) => {

    const {changedData, date} = req.body
    const dataList = JSON.parse(changedData)
    let length = 0
    const frameList = dataList.map((x, idx) => {
        const result = parser(x, idx, date)
        length += result[1]
        return result[0]
    })
    const newContent = frameList.join('').replace('UPDATE_ME', length)

    // 새로운 설정 페이지를 입력합니다.
    await fetchDoc();
    const htmlData = makeHtml(newContent)

    await updateDoc(htmlData);
    res.send('finished')
})


const addslashes = (string) => {
    return string.replace(/\\/g, '\\\\').replace(/\u0008/g, '\\b').replace(/\t/g, '\\t').replace(/\n/g, '\\n').replace(/\f/g, '\\f').replace(/\r/g, '\\r').replace(/'/g, '\\\'').replace(/"/g, '\\"');

}


const makeHtml = (newContent) => {

    const oneHtml = htmlText.slice(0, htmlText.indexOf('</tr>'))
    const otherHtml = htmlText.slice(htmlText.indexOf('</tr>') + 5)
    let newFrame = [oneHtml, '</tr>', newContent, otherHtml].join('')

    newFrame = addslashes(newFrame)
    return newFrame
}

// 설정 가이드 페이지를 갖고 옵니다
const fetchDoc = async () => {
    const response = await fetch(`https://treenod.atlassian.net/wiki/rest/api/content/${accessUrl}?expand=body.storage,version.number`, {
        method: 'GET',
        headers: {
            'Authorization': `Basic ${accessKey}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })

    console.log(`Response: ${response.status} ${response.statusText}`)
    const res = await response.json()

    currVersion = res.version.number;
    htmlText = res.body.storage.value;
    title = res.title;
}

// 설정 가이드 페이지를 업데이트 합니다
const updateDoc = async (htmlData) => {

    console.log(htmlData)
    const bodyData = `{
        "version" : {
            "number": ${currVersion + 1}
        },
        "type": "page",
        "title" : "${title}",
        "body": {
            "storage": {
                "value": "${htmlData}",
                "representation": "storage"
            }
        }
    }`;

    const response = await fetch(`https://treenod.atlassian.net/wiki/rest/api/content/${accessUrl}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Basic ${accessKey}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: bodyData
    })
    console.log(await response.json())
    console.log(`Response: ${response.status} ${response.statusText}`)
}

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`)
})







