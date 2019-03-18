/**
 * @author 成雨
 * @date 2019/3/18 0018$
 * @Description:
 */

import {ipcMain, dialog} from 'electron';

ipcMain.on('open-file-dialog', (event) => {
    dialog.showOpenDialog({
        properties: ['openFile', 'openDirectory']
    }, (files) => {
        if (files) {
            event.sender.send('selected-dir', files);
        }
    });
});