const countries = {'': "ALL", 'ja': "JAPAN", 'en': "GLOBAL", 'ta': "TA"}

const scheme = ({key, title, value}, secondIdx, {firstIdx, length, headline}) => {

    let element = '';
    switch (key) {
        case 'onAirFlag':

            element =
                ['<tr>', (!firstIdx ? `<td rowspan="UPDATE_ME"></td>` : ''), (!secondIdx ? `<td rowspan="${length}"><h3>${headline}</h3></td>` : ''),
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

const parser = ({ko, en, list}, firstIdx) => {

    const headline = `${en}(${ko})`

    const length = list.length

    const extraInfo = {
        firstIdx,
        length,
        headline
    }

    const schemeList = list.map((x, idx) => scheme(x, idx, extraInfo))
    const rowSum = schemeList.length

    return [schemeList.join(''), rowSum]
}


export {parser}






