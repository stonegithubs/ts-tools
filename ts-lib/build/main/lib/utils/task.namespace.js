"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
var Task;
(function (Task) {
    function dayAndNight(cb = _1.throwError('回调参数缺失！'), msDayMin = 120000, msDayMax = 600000, msNightMin = 3000000, msNightMax = 7200000, thisArg = {}) {
        let hour = new Date().getHours() + 1;
        if (hour > 22 || hour < 7) {
            // 夜间
            setTimeout(() => {
                cb.call(thisArg);
                dayAndNight(...arguments);
            }, _1.getRandomInt(msNightMax, msNightMin));
        }
        else {
            // 白天
            setTimeout(() => {
                cb.call(thisArg);
                dayAndNight(...arguments);
            }, _1.getRandomInt(msDayMax, msDayMin));
        }
    }
    Task.dayAndNight = dayAndNight;
})(Task = exports.Task || (exports.Task = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFzay5uYW1lc3BhY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvbGliL3V0aWxzL3Rhc2submFtZXNwYWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsd0JBQTZDO0FBRTdDLElBQWlCLElBQUksQ0FpQnBCO0FBakJELFdBQWlCLElBQUk7SUFDakIscUJBQTRCLEVBQUUsR0FBRyxhQUFVLENBQUMsU0FBUyxDQUFRLEVBQUUsUUFBUSxHQUFHLE1BQU0sRUFBRSxRQUFRLEdBQUcsTUFBTSxFQUFFLFVBQVUsR0FBRyxPQUFPLEVBQUUsVUFBVSxHQUFHLE9BQU8sRUFBRSxPQUFPLEdBQUcsRUFBRTtRQUN6SixJQUFJLElBQUksR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDLFFBQVEsRUFBRSxHQUFHLENBQUMsQ0FBQztRQUNyQyxJQUFJLElBQUksR0FBRyxFQUFFLElBQUksSUFBSSxHQUFHLENBQUMsRUFBRTtZQUN2QixLQUFLO1lBQ0wsVUFBVSxDQUFDLEdBQUcsRUFBRTtnQkFDWixFQUFFLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO2dCQUNqQixXQUFXLENBQUMsR0FBRyxTQUFTLENBQUMsQ0FBQztZQUM5QixDQUFDLEVBQUUsZUFBWSxDQUFDLFVBQVUsRUFBRSxVQUFVLENBQVcsQ0FBQyxDQUFDO1NBQ3REO2FBQU07WUFDSCxLQUFLO1lBQ0wsVUFBVSxDQUFDLEdBQUcsRUFBRTtnQkFDWixFQUFFLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO2dCQUNqQixXQUFXLENBQUMsR0FBRyxTQUFTLENBQUMsQ0FBQztZQUM5QixDQUFDLEVBQUUsZUFBWSxDQUFDLFFBQVEsRUFBRSxRQUFRLENBQVcsQ0FBQyxDQUFDO1NBQ2xEO0lBQ0wsQ0FBQztJQWZlLGdCQUFXLGNBZTFCLENBQUE7QUFDTCxDQUFDLEVBakJnQixJQUFJLEdBQUosWUFBSSxLQUFKLFlBQUksUUFpQnBCIn0=