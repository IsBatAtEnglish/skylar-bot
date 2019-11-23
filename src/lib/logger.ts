import moment from 'moment'
moment.locale('pt-br')

const log = (...data) : void => {
    const date = moment().format('LTS')
    console.log(date, data.join(' '))
}

export default log