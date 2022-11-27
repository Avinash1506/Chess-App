import moment from 'moment'

const displayDateAndTime = (dateAndTime) => {
    return moment(dateAndTime).format('LLL');
}

export const displayYear = (dateAndTime) => {
    return moment(dateAndTime).format('YYYY');
}

export const currentYear = () => {
    return moment().format('YYYY');
}

export default displayDateAndTime;

