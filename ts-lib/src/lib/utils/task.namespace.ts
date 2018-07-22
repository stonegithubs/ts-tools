import { getRandomInt, throwError } from '.';

export namespace Task{
    export function dayAndNight(cb = throwError('回调参数缺失！') as any, msDayMin = 120000, msDayMax = 600000, msNightMin = 3000000, msNightMax = 7200000, thisArg = {}) {
        let hour = new Date().getHours() + 1;
        if (hour > 22 || hour < 7) {
            // 夜间
            setTimeout(() => {
                cb.call(thisArg);
                dayAndNight(...arguments);
            }, getRandomInt(msNightMax, msNightMin) as number);
        } else {
            // 白天
            setTimeout(() => {
                cb.call(thisArg);
                dayAndNight(...arguments);
            }, getRandomInt(msDayMax, msDayMin) as number);
        }
    }
}