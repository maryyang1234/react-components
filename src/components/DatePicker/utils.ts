import moment, { Moment } from 'moment';
import { TDate } from '@z-r/calendar/types/interface';

import { isDateDisabled, getValidDate } from 'src/components/Calendar/utils';

type Range = [TDate | void | null, TDate | void | null];
type Precision = 'second' | 'minute' | 'hour' | 'date' | 'month' | 'year';

export interface Rules {
    range?: Range;
    custom?: (date: Moment, value?: Moment | null) => boolean;
}

export const formatToShort = (format: string): string => {
    return format
        .replace('YYYY', 'YY')
        .replace('MM', 'M')
        .replace('DD', 'D')
        .replace('HH', 'H')
        .replace('mm', 'm')
        .replace('ss', 's');
};

const isRangeDateValid = (
    value: [TDate | null, TDate | null],
    rules: {
        range?: Range;
        maxRange?: any;
        minRange?: any;
    },
    precision?: Precision | null
) => {
    const [start, end] = value;
    const inner_start = start == null ? null : moment(+start);
    const inner_end = end == null ? null : moment(+end);
    if (precision) {
        inner_start && inner_start.startOf(precision);
        inner_end && inner_end.startOf(precision);
    }
    const { range, maxRange, minRange } = rules;
    if (range) {
        const  [s, e] = range;
        const inner_s = s == null ? null : moment(+s);
        const inner_e = e == null ? null : moment(+e);
        if (precision) {
            inner_s && inner_s.startOf(precision);
            inner_e && inner_e.startOf(precision);
        }
        if (inner_s != null && start != null && start < inner_s) {
            return 'rangeError';
        }
        if (inner_e != null && end != null && end > inner_e) {
            return 'rangeError';
        }
    }

    if (inner_start == null || inner_end == null) {
        return true;
    }
    if (inner_start > inner_end) {
        return 'startGreaterThanEnd';
    }
    if (maxRange && moment(inner_start).add(maxRange) < inner_end) {
        return 'maxRangeError';
    }
    if (minRange && moment(inner_end).subtract(minRange) < inner_start) {
        return 'minRangeError';
    }
    return true;
};

const isDateValid = (date: TDate, value?: TDate | null, rules?: Rules) => {
    const inner_date = moment(+date);
    if (!rules) {
        return false;
    }
    const { range, custom } = rules;
    if (range) {
        let [start, end] = range;
        if (start != null) start = moment(+start).startOf('second');
        if (end != null) end = moment(+end).startOf('second');
        const v = inner_date.startOf('second');

        if ((start != null && v < start) || (end != null && v > end)) {
            return true;
        }
    }
    if (custom) {
        return custom(inner_date, value == null ? value : moment(+value));
    }
};

export { isDateDisabled, getValidDate, isDateValid, isRangeDateValid };
