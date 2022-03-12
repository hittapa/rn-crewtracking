import moment from "moment";

export const isInyard = (vessels) => {
    var inyard = false;
    for (let i = 0; i < vessels?.length; i++) {
        const vess = vessels[i];
        let periods = vess?.onboardServices;
        for (let j = 0; j < periods.length; j++) {
            const pid = periods[j];
            if (pid == null) continue;
            if (pid.type == 'trip') continue;
            if (moment(parseInt(pid.started_at)).diff(new Date(), 'hours') < 0 && moment(parseInt(pid.ended_at)).diff(new Date(), 'hours') > 0) {
                inyard = true;
                break;
            }
        }
        if (inyard)
            break;
    }

    if (inyard) {
        return true;
    } else {
        return false;
    }
}
