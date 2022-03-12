import moment from "moment";

export const validateServicePeriod = (s, e, vessels, current_id = null, currentIndex = 0, edit = false, hasFutureService = false) => {
    if (typeof s == 'object') {
        s = s.timestamp;
        e = e ? e.timestamp : null;
    }
    if (typeof s == 'string') {
        s = parseInt(s);
        e = e ? parseInt(e) : null;
    }
    if (vessels == null || (vessels != null && vessels?.length == 0)) {
        return true;
    }
    // if (edit && hasFutureService && currentIndex == 0) {
    //     return true;
    // }
    let valid = true;
    if (edit) {
        var allPeriods = [];
        var curr;
        for (let i = 0; i < vessels?.length; i++) {
            const vessel = vessels[i];
            var periods = JSON.parse(vessel.service_periods) || null;
            if (periods && periods.length > 0) {
                for (let j = 0; j < periods.length; j++) {
                    const pid = periods[j];
                    if (current_id == vessel.id && j == currentIndex) {
                        curr = pid;
                    }
                    allPeriods.push(pid);
                }
            }
        }
        allPeriods.sort((a, b) => b.end == null ? 1 : (a.start >= b.end) ? -1 : ((b.end > a.start) ? 1 : 0));
        console.log("allPeriods", allPeriods);
        for (let i = 0; i < allPeriods.length; i++) {
            const pid = allPeriods[i];
            if (curr == pid) {
                var prev = allPeriods[i + 1];
                var next = allPeriods[i - 1];
                console.log(next, prev);
                if (prev && next) {
                    if (prev.end < s && next.start > e) {
                        valid = true;
                        break;
                    } else {
                        valid = false;
                        break;
                    }
                } else {
                    if (prev) {
                        console.log("Validation 0000000001");
                        if (s > prev.end) {
                            valid = true;
                            break;
                        }
                        if (s < prev.end) {
                            valid = false;
                            break;
                        }
                    } else if (next) {
                        console.log("Validation 0000000002");
                        console.log(e, next);
                        if (e < next.start) {
                            valid = true;
                            break;
                        } else {
                            valid = false;
                            break;
                        }
                    } else {
                        console.log("Validation 0000000003");
                        valid = true;
                        break;
                    }
                }
            }
        }
    } else {
        for (let i = 0; i < vessels?.length; i++) {
            const vessel = vessels[i];
            if (current_id && current_id == vessel.id) {
                var periods = JSON.parse(vessel.service_periods) || null;
                if (periods && periods.length > 0) {
                    for (let j = 0; j < periods.length; j++) {
                        const pid = periods[j];
                        if (vessel.is_signedon && j == 0) {
                            if (s && moment(s).diff(new Date(), 'hours') > 0) {
                                valid = false;
                                break;
                            }
                            if (currentIndex != 0 && ((s && s > pid.start) || (e && e > pid.start))) {
                                valid = false;
                                break;
                            }
                            continue;
                        }
                        if (!vessel.is_signedon && moment(pid.start).diff(new Date, 'hours') > 0) {
                            continue;
                        }
                        if (pid != null) {
                            if (pid.end != null) {
                                if (s && (s < pid.start && e == null)) {
                                    valid = false;
                                    break;
                                }
                                if (s && (s > pid.start && s < pid.end)) {
                                    valid = false;
                                    break;
                                }
                                if (e && (e > pid.start && e < pid.end)) {
                                    valid = false;
                                    break;
                                }
                                if (s && e && (s < pid.start && e > pid.end)) {
                                    valid = false;
                                    break;
                                }
                            } else {
                                if (s && e && (s > pid.start || e > pid.start)) {
                                    valid = false;
                                    break;
                                }
                            }
                        }
                    }
                    if (valid == false) {
                        break;
                    }
                }
                continue;
            }
            if (!current_id || current_id != vessel.id) {
                var periods = JSON.parse(vessel.service_periods) || null;
                if (periods && periods.length > 0) {
                    for (let j = 0; j < periods.length; j++) {
                        const pid = periods[j];
                        if (pid != null) {
                            if (pid.end != null) {
                                if (s && (s > pid.start && s < pid.end)) {
                                    valid = false;
                                    break;
                                }
                                if (e && (e > pid.start && e <= pid.end)) {
                                    valid = false;
                                    break;
                                }
                                if (s && e && (s < pid.start && e > pid.end)) {
                                    valid = false;
                                    break;
                                }
                            } else {
                                if (s > pid.start || e > pid.start) {
                                    valid = false;
                                    break;
                                }
                            }
                        }
                    }
                    if (valid == false) {
                        break;
                    }
                }
            }
        }
    }

    if (valid) {
        return true;
    } else {
        return false;
    }
}

export const validateService = (s, e, vessel, id, onboardPeriod) => {
    console.log("Validation services");
    console.log(s, onboardPeriod);
    let start = s?.timestamp;
    let end = e?.timestamp;
    let periods = vessel?.onboardServices;
    if (start == null && end == null) {
        return false;
    }
    let valid = true;
    if (start) {
        if (onboardPeriod?.start && onboardPeriod?.end) {
            if (start < onboardPeriod.start || start > onboardPeriod.end) {
                return false;
            }
            if (end) {
                if ((end - onboardPeriod.end) > 0) {
                    return false;
                }
            }
        }
        if (onboardPeriod?.start && !onboardPeriod?.end) {
            if ((start - onboardPeriod.start) < 0) {
                return false;
            } else {
                return true;
            }
        }
    }

    for (let i = 0; i < periods.length; i++) {
        const pid = periods[i];
        if (pid.id == id) continue;
        if (pid.started_at != null) {
            if (pid.ended_at != null) {
                if (start && (start > pid.started_at && start < pid.ended_at)) {
                    valid = false;
                    break;
                }
                if (end && (end > pid.started_at && end < pid.ended_at)) {
                    valid = false;
                    break;
                }
                if (start && end && (start < pid.started_at && end > pid.ended_at)) {
                    valid = false;
                    break;
                }
            } else {
                if (start > pid.started_at || end > pid.started_at) {
                    valid = false;
                    break;
                }
            }
        }
    }
    if (valid) {
        return true;
    } else {
        return false;
    }
}

export function isSameProvider(provider1, provider2) {
    if (provider1 == null) {
        return provider2 == null;
    }
    return provider1 == provider2;
}

export function isBetterLocation(location, currentBestLocation) {
    if (currentBestLocation == null) {
        return true;
    }
    var ONE_MINUTE = 60000;
    var timeDelta = location.timestamp - currentBestLocation.timestamp;
    var isSignificantlyNewer = timeDelta > ONE_MINUTE;
    var isSignificantlyOlder = timeDelta < -ONE_MINUTE;
    var isNewer = timeDelta > 0;
    if (isSignificantlyNewer) {
        // var accuracyDelta = location.coords?.accuracy - currentBestLocation.coords?.accuracy;
        // var isLessAccurate = accuracyDelta > 0;
        // var isMoreAccurate = accuracyDelta < 0;
        // var isSignificantlyLessAccurate = accuracyDelta > 200;
        // var isFromSameProvider = isSameProvider(location.provider,
        //     currentBestLocation.provider);
        // if (isMoreAccurate) {
        //     return true;
        // } else if (isNewer && !isLessAccurate) {
        //     return true;
        // } else if (isNewer && !isSignificantlyLessAccurate && isFromSameProvider) {
        //     return true;
        // }
        // return false;
        return true;
    } else {
        return false;
    }
}

export const emailValidation = (text) => {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
    if (reg.test(text) === false) {
        return false;
    }
    else {
        return true;
    }
}
