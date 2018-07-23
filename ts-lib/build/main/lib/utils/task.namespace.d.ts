export declare namespace Task {
    function dayAndNight(fn?: any, { msDayMin, // 白天的最小触发时间  120000ms => 2min
    msDayMax, // 白天的最大触发时间  600000ms => 10min
    msNightMin, // 夜晚的最小触发时间  3000000ms => 50min
    msNightMax, // 夜晚的最大触发时间  7200000ms => 2h
    thisArg, // fn 的 this 对象
    fnStop, // 停止条件函数, 如果为 true 则会停止
    fnStopCb, // 停止后的回调函数
    loop, // 循环次数
    args, // fn 的参数
    wait, // 是否需要在每一轮循环中等待 fn 执行完成
    debug }?: {
        msDayMin?: number;
        msDayMax?: number;
        msNightMin?: number;
        msNightMax?: number;
        thisArg?: any;
        fnStop?: () => any;
        fnStopCb?: () => any;
        loop?: number;
        args?: any[];
        wait?: boolean;
        debug?: boolean;
    }): Promise<void>;
    function task2_4(fn: any, { min, max, thisArg, args, debug, wait, loop, fnStop, fnStopCb }?: {
        min?: number;
        max?: number;
        thisArg?: any;
        args?: any[];
        debug?: boolean;
        wait?: boolean;
        loop?: number;
        fnStop?: () => boolean;
        fnStopCb?: () => void;
    }): Promise<void>;
}
