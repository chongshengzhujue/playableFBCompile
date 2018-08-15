// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

function dataURLtoBlob(dataurl) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(dataurl), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {type:mime});
}

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        // web加载数据方法
        let arrayBufferHandler = (item, callback) => {
            let data = (window as any).resMap[item.url];
            callback(null, dataURLtoBlob(data));
        };

        // web加载数据方法
        let jsonBufferHandler = (item, callback) => {
            let str = (window as any).resMap[item.url];
            callback(null, str);
        };

        // 添加加载函数
        cc.loader.addDownloadHandlers({
            png: arrayBufferHandler,
        });

        cc.loader.addDownloadHandlers({
            json: jsonBufferHandler,
        });
    }

    onLoad() {
        cc.director.loadScene("helloworld");
        let image = new Image();
    }

    // update (dt) {}
}