import LUCKYBI from "../luckybi";
import { log } from "../../../lib/utils";

async function task () {
  let lucky = new LUCKYBI('');
  let r = await lucky.task();
  log(r);
}

task();