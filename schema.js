const countries = {'': "ALL", 'ja': "JAPAN", 'en': "GLOBAL", 'ta': "TA"}

const scheme = ({key, title, value}, secondIdx, {firstIdx, length, headline, date}) => {

    let element = '';
    switch (key) {
        case 'onAirFlag':

            element =
                ['<tr>', (!firstIdx ? `<td rowspan="UPDATE_ME">${date}</td>` : ''), (!secondIdx ? `<td rowspan="${length}"><h3>${headline}</h3></td>` : ''),
                    ` <td><p>${title}</p></td>
                    <td><p>${value ? 'ON' : 'OFF'}</p></td>
                    <td><p/></td>
                </tr>`].join('')
            break

        case 'extraData':
            element = `
                <tr>
                    <td><p>${title}</p></td>
                    <td><p>${value ? value : 'DEFAULT'}</p></td>
                    <td><p/></td>
                </tr>`
            break

        case 'countryFilter':
            element = `
                <tr>
                    <td><p>${title}</p></td>
                    <td><p>${value ? countries[value] : 'ALL'}</p></td>
                    <td><p/></td>
                </tr>`
            break

        default:
            element = `
                <tr>
                    <td><p>${title}</p></td>
                    <td><p>${value}</p></td>
                    <td><p/></td>
                </tr>`
            break

    }
    return element
}

const parser = ({ko, en, list}, firstIdx, date) => {

    const headline = `${en}(${ko})`

    const flag = list.some(x=>x.key === 'extraData')

    const length = flag ? list.length : list.length + 1

    const extraInfo = {
        firstIdx,
        length,
        headline,
        date
    }

    let schemeList = list.map((x, idx) => scheme(x, idx, extraInfo))

    if(!flag){
        schemeList.splice(1,0, `<tr>
        <td><p>Version</p></td>
        <td><p>DEFAULT</p></td>
        <td><p/></td>
    </tr>`)
    }

    const rowSum = schemeList.length
    return [schemeList.join(''), rowSum]
}


export {parser}






