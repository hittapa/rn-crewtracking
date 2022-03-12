import moment from 'moment';

export const dateStringToDate = (data) => {
    return parseInt(moment(data).utc().format('DD'));
}

export const dateStringToMonth = (data) => {
    return parseInt(moment(data).utc().format('MM'));
}

export const dateStringToYear = (data) => {
    return parseInt(moment(data).utc().format('YYYY'));
}

export const dateStringToMilli = (data) => {
    return parseInt(moment(data).utc().format('x'));
}

export const getDateString = (data) => {
    const string = moment(data).utc().format('YYYY-MM-DD')
    return string;
}

export const getTotalDays = (sdate, edate) => {
    let diff = 0;
    if (typeof sdate == 'object'){
        sdate = sdate.timestamp;
        edate = edate.timestamp;
    } else {
        sdate = parseInt(sdate);
        edate = parseInt(edate);
    }
    diff = Math.round(moment(edate).utc().diff(sdate, 'days', true));

    return diff + 1;
}

export const timeOffset = () => {
    var date = new Date();
    var offsetInHours = date.getTimezoneOffset()/60;
    return offsetInHours;
}