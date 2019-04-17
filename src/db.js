/**
 * @author 成雨
 * @date 2019/4/17 0017$
 * @Description:
 */

import low from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync';
import path from "path";

const adapter = new FileSync(path.join(__dirname, 'db.json'));
export const dbJSON = low(adapter);

