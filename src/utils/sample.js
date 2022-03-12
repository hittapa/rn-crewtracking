// const sampleTrip = {
//     vessel: 1,
//     trip_detection: false,
//     auto_resume: false,
//     resume_date: 1625374800000,
//     onboard_service: 12,
//     leave: 12,
//     yard: 11,
//     underway: 256,
//     watchkeeping: 23,
//     standby: 21,
//     av_hours_underway_per_day: 5,
//     av_distance_offshore: 2234,
//     seaward: 0,
//     shoreward: 0,
//     lakes: 0,
//     start_date: 1625374800000,
//     end_date: 1625374800000,
//     leave_start: 1625374800000,
//     leave_end: 1625374800000,
//     yard_start: 1625374800000,
//     yard_end: 1625374800000,
//     trip_note: 1625374800000,
//     start_location: "US OAK",
//     end_location: "US SFO",
//     total_nmiles: 46728,
//     customStartLocode: '',
//     customEndLocode: '',
//     flag: 'sample',
// };
const sampleTrip = {
    "auto_resume": false,
    "av_distance_offshore": 12,
    "av_hours_underway_per_day": 12,
    "created_at": "2021-05-10T10:30:00.000000Z",
    "customEndLocode": null,
    "customStartLocode": null,
    "end_date": "1623894046000",
    "end_location": null,
    "flag": null,
    "id": 12,
    "lakes": null,
    "leave": null,
    "onboard_service": 0,
    "resume_date": null,
    "seaward": 12,
    "shoreward": 12,
    "standby": 12,
    "start_date": "1622894046000",
    "start_location": 77571,
    "total_nmiles": 145570,
    "trip_detection": false,
    "trip_note": null,
    "underway": 10,
    "updated_at": "2021-05-10T10: 30: 00.000000Z",
    "vessel": 66,
    "watchkeeping": 20,
    "yard": null,
}


const sampleVessel = {
    "user": 1,
    "type": 'Dive Vessel',
    "detailedType": 'Supply Tender',
    "mmsiNumber": null,
    "imoNumber": null,
    "name": "Felix",
    "length": 234,
    "ol_unit": 'ft',
    "is_signedon": false,
    "brand": null,
    "grossTonnage": 1500,
    "flag": 'PO',
    "onBoardStartDate": 1625450692300,
    "onBoardEndDate": 1625482592300,
    "showWatchkeeping": true,
    "autologWatchkeeping": true,
    "showStandbyService": true,
    "showUscgStatistics": true,
    "isDefault": false,
    "service_periods": null,
    "leave_end": null,
    "leave_start": null,
    "yard_end": null,
    "yard_start": null
};

const sampleDeparture = {
    country_code: "US",
    locode: "OAK",
    name: "OAK",
    lat: 39.352922,
    long: -74.474409
};

const sampleDestination = {
    country_code: "US",
    locode: "SFO",
    name: "SFO",
    lat: 36.826203,
    long: -75.992590
}

export {
    sampleTrip, sampleVessel, sampleDeparture, sampleDestination
}