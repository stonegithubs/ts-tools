"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
require("./Promise.extends");
var Task;
(function (Task) {
    async function dayAndNight(fn = _1.throwError('回调参数缺失！'), { msDayMin = 120000, // 白天的最小触发时间  120000ms => 2min
    msDayMax = 600000, // 白天的最大触发时间  600000ms => 10min
    msNightMin = 3000000, // 夜晚的最小触发时间  3000000ms => 50min
    msNightMax = 7200000, // 夜晚的最大触发时间  7200000ms => 2h
    dayStartHour = 8, // 白天从 8 点开始，夜晚结束
    dayEndHour = 22, // 白天从22点结束，夜晚开始
    thisArg = null, // fn 的 this 对象
    fnStop = () => false, // 停止条件函数, 如果为 true 则会停止
    fnStopCb = () => { }, // 停止后的回调函数
    loop = Infinity, // 循环次数
    args = [], // fn 的参数
    wait = false, // 是否需要在每一轮循环中等待 fn 执行完成
    debug = true // 是否开启调试信息打印
     } = {}) {
        let msAwaitTime, count = 0;
        do {
            let hour = new Date().getHours();
            let result = fn.apply(thisArg, Array.isArray(args) ? args : [args]);
            wait ? await result : result;
            // 计算下一次循环执行时间
            msAwaitTime = _1.getRandomInt.apply({}, hour < dayStartHour || hour >= dayEndHour ? [msNightMax, msNightMin] : [msDayMax, msDayMin]); // 时间在 23 点以后 到 8 点以前为夜间
            debug && _1.log(`下一次将在${msAwaitTime / 1000 / 60}分钟后运行!`, 'warn');
        } while (await _1.wait(msAwaitTime, ++count < loop) && !await fnStop());
        // 执行回调
        fnStopCb();
    }
    Task.dayAndNight = dayAndNight;
    async function task2_4(fn, { min = 2000, max = 4000, thisArg = null, args = [], debug = true, wait = false, loop = Infinity, fnStop = () => false, fnStopCb = () => { } } = {}) {
        dayAndNight(fn, { msDayMin: min, msDayMax: max, msNightMin: min, msNightMax: max, thisArg, fnStop, loop, args, wait, debug, fnStopCb });
    }
    Task.task2_4 = task2_4;
})(Task = exports.Task || (exports.Task = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFzay5uYW1lc3BhY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvbGliL3V0aWxzL3Rhc2submFtZXNwYWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsd0JBQWtFO0FBQ2xFLDZCQUEyQjtBQUUzQixJQUFpQixJQUFJLENBb0NwQjtBQXBDRCxXQUFpQixJQUFJO0lBQ1osS0FBSyxzQkFDVixLQUFVLGFBQVUsQ0FBQyxTQUFTLENBQUMsRUFDL0IsRUFDRSxRQUFRLEdBQUcsTUFBTSxFQUFFLDhCQUE4QjtJQUNqRCxRQUFRLEdBQUcsTUFBTSxFQUFFLCtCQUErQjtJQUNsRCxVQUFVLEdBQUcsT0FBTyxFQUFFLGdDQUFnQztJQUN0RCxVQUFVLEdBQUcsT0FBTyxFQUFFLDZCQUE2QjtJQUNuRCxZQUFZLEdBQUcsQ0FBQyxFQUFHLGlCQUFpQjtJQUNwQyxVQUFVLEdBQUcsRUFBRSxFQUFHLGdCQUFnQjtJQUNsQyxPQUFPLEdBQUcsSUFBSSxFQUFFLGVBQWU7SUFDL0IsTUFBTSxHQUFHLEdBQVEsRUFBRSxDQUFDLEtBQUssRUFBRSx3QkFBd0I7SUFDbkQsUUFBUSxHQUFHLEdBQVEsRUFBRSxHQUFFLENBQUMsRUFBRyxXQUFXO0lBQ3RDLElBQUksR0FBRyxRQUFRLEVBQUUsT0FBTztJQUN4QixJQUFJLEdBQUcsRUFBUyxFQUFFLFNBQVM7SUFDM0IsSUFBSSxHQUFHLEtBQUssRUFBRSx3QkFBd0I7SUFDdEMsS0FBSyxHQUFHLElBQUksQ0FBQyxhQUFhO01BQzNCLEdBQUcsRUFBRTtRQUVOLElBQUksV0FBVyxFQUFFLEtBQUssR0FBRyxDQUFDLENBQUM7UUFDM0IsR0FBRztZQUNELElBQUksSUFBSSxHQUFHLElBQUksSUFBSSxFQUFFLENBQUMsUUFBUSxFQUFFLENBQUM7WUFDakMsSUFBSSxNQUFNLEdBQUcsRUFBRSxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDcEUsSUFBSSxDQUFDLENBQUMsQ0FBQyxNQUFNLE1BQU0sQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDO1lBRTdCLGNBQWM7WUFDZCxXQUFXLEdBQUcsZUFBWSxDQUFDLEtBQUssQ0FBQyxFQUFFLEVBQUUsSUFBSSxHQUFHLFlBQVksSUFBSSxJQUFJLElBQUksVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFFLFVBQVUsRUFBRSxVQUFVLENBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBRSxRQUFRLEVBQUUsUUFBUSxDQUFFLENBQUMsQ0FBQyxDQUFDLHdCQUF3QjtZQUMvSixLQUFLLElBQUksTUFBRyxDQUFDLFFBQVEsV0FBVyxHQUFHLElBQUksR0FBRyxFQUFFLFFBQVEsRUFBRSxNQUFNLENBQUMsQ0FBQztTQUMvRCxRQUFRLE1BQU0sT0FBTSxDQUFDLFdBQVcsRUFBRSxFQUFFLEtBQUssR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sTUFBTSxFQUFFLEVBQUU7UUFDdkUsT0FBTztRQUNQLFFBQVEsRUFBRSxDQUFDO0lBQ2IsQ0FBQztJQTlCcUIsZ0JBQVcsY0E4QmhDLENBQUE7SUFFTSxLQUFLLGtCQUFrQixFQUFFLEVBQUUsRUFBRSxHQUFHLEdBQUcsSUFBSSxFQUFFLEdBQUcsR0FBRyxJQUFJLEVBQUUsT0FBTyxHQUFHLElBQUksRUFBRSxJQUFJLEdBQUcsRUFBRSxFQUFFLEtBQUssR0FBRyxJQUFJLEVBQUUsSUFBSSxHQUFHLEtBQUssRUFBRSxJQUFJLEdBQUcsUUFBUSxFQUFFLE1BQU0sR0FBRyxHQUFHLEVBQUUsQ0FBQyxLQUFLLEVBQUUsUUFBUSxHQUFHLEdBQUcsRUFBRSxHQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7UUFDbEwsV0FBVyxDQUFDLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLEdBQUcsRUFBRSxVQUFVLEVBQUUsR0FBRyxFQUFFLFVBQVUsRUFBRSxHQUFHLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFLENBQUMsQ0FBQztJQUMxSSxDQUFDO0lBRnFCLFlBQU8sVUFFNUIsQ0FBQTtBQUNILENBQUMsRUFwQ2dCLElBQUksR0FBSixZQUFJLEtBQUosWUFBSSxRQW9DcEIifQ==