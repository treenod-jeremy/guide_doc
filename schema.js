const countries = {'': "ALL", 'ja': "JAPAN", 'en': "GLOBAL", 'ta': "TA"}

const scheme = ({key, title, value}, secondIdx, {firstIdx, length, headline, date}) => {

    let element = '';
    switch (key) {
        case 'onAirFlag':
            element =
                ['<tr>', (!firstIdx && !secondIdx ? `<td rowspan="UPDATE_ME">${date}</td>` : ''), (!secondIdx ? `<td rowspan="${length}"><h3>${headline}</h3></td>` : ''),
                    ` <td><p>${title}</p></td>
                    <td><p>${value ? 'ON' : 'OFF'}</p></td>
                    <td><p/></td>
                </tr>`].join('')
            break

        case 'countryFilter':
            element = `
                <tr>
                    <td><p>${title}</p></td>
                    <td><p>${countries[value]}</p></td>
                    <td><p/></td>
                </tr>`
            break

        default:
            element = ['<tr>', (!firstIdx && !secondIdx ? `<td rowspan="UPDATE_ME">${date}</td>` : ''), (!secondIdx ? `<td rowspan="${length}"><h3>${headline}</h3></td>` : ''),
                ` <td><p>${title}</p></td>
                    <td><p>${value}</p></td>
                    <td><p/></td>
                </tr>`].join('')
            break

    }
    return element
}

const parser = ({ko, en, list}, firstIdx, date) => {

    const headline = `${en}(${ko})`

    const flags = [list.some(x => x.key === 'onAirFlag'), list.some(x => x.key === 'extraData'), list.some(x => x.key === 'countryFilter')]
    let length = list.length

    //Event일 때
    if (flags[0]) {
        //Version 필터가 없다면
        if (!flags[1]) {
            length += 1
        }
        //CountryFilter 가 없다면
        if (!flags[2]) {
            length += 1
        }
    }

    const extraInfo = {
        firstIdx,
        length,
        headline,
        date
    }

    let schemeList = list.map((x, idx) => scheme(x, idx, extraInfo))

    if (flags[0]) {
        if (!flags[1]) {
            schemeList.splice(1, 0, `
    <tr>
        <td><p>Version</p></td>
        <td><p>DEFAULT</p></td>
        <td><p/></td>
    </tr>
`)}
        if (!flags[2]) {
            schemeList.splice(1, 0, `
    <tr>
       <td><p>Country</p></td>
       <td><p>ALL</p></td>
       <td><p/></td>
    </tr>
`)}
    }

    const rowSum = schemeList.length
    return [schemeList.join(''), rowSum]
}


export {parser}






