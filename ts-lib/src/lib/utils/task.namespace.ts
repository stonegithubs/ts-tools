import { getRandomInt, throwError, wait as fnWait, log } from '.';

export namespace Task {
  export async function dayAndNight(
    fn: any = throwError('回调参数缺失！'),
    {
      msDayMin = 120000, // 白天的最小触发时间  120000ms => 2min
      msDayMax = 600000, // 白天的最大触发时间  600000ms => 10min
      msNightMin = 3000000, // 夜晚的最小触发时间  3000000ms => 50min
      msNightMax = 7200000, // 夜晚的最大触发时间  7200000ms => 2h
      thisArg = null, // fn 的 this 对象
      fnStop = (): any => false, // 停止条件函数, 如果为 true 则会停止
      fnStopCb = (): any => {},  // 停止后的回调函数
      loop = Infinity, // 循环次数
      args = [], // fn 的参数
      wait = false, // 是否需要在每一轮循环中等待 fn 执行完成
      debug = true // 是否开启调试信息打印
    } = {}
  ) {
    let msAwaitTime, count = 0;
    do {
      let hour = new Date().getHours() + 1;
      let result = fn.apply(thisArg, Array.isArray(args) ? args : [args]);
      wait ? await result : result;

      // 计算下一次循环执行时间
      msAwaitTime = getRandomInt.apply({}, hour > 22 || hour < 8 ? [ msNightMax, msNightMin ] : [ msDayMax, msDayMin ]); // 时间在 23 点以后 到 8 点以前为夜间
      debug && log(`下一次将在${msAwaitTime / 1000 / 60}分钟后运行!`, 'warn');
    } while (await fnWait(msAwaitTime, !(await fnStop()) && ++count < loop));
    // 执行回调
    fnStopCb();
  }

  export async function task2_4(fn, { min = 2000, max = 4000, thisArg = null, args = [], debug = true, wait = false, loop = Infinity, fnStop = () => false, fnStopCb = () => {} } = {}) {
    dayAndNight(fn, { msDayMin: min, msDayMax: max, msNightMin: min, msNightMax: max, thisArg, fnStop, loop, args, wait, debug, fnStopCb });
  }
}
