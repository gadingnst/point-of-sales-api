const moment = require('moment')

module.exports = {
    date: date => {
        date = date ? new Date(date) : new Date()
        date = date.toLocaleString('en-ID', { timeZone: 'Asia/Jakarta' })
        return String(new Date(date).toISOString().split('T')[0])
    },
    enumerateDateByPeriod: (start, end, interval) => {
        const intervals = {}
        const diffUnitOfTime = `${interval}s`

        while (moment(end).diff(start, diffUnitOfTime) > 0) {
            const currentEnd = moment(moment(start).add(1, diffUnitOfTime)).format('YYYY-MM-DD')
            Object.assign(intervals, { [start]: currentEnd })
            start = currentEnd
        }

        return intervals
    }   
}