(function () {

    function boot () {

        var settings = window._CCSettings;
        window._CCSettings = undefined;

        if ( !settings.debug ) {
            var uuids = settings.uuids;

            var rawAssets = settings.rawAssets;
            var assetTypes = settings.assetTypes;
            var realRawAssets = settings.rawAssets = {};
            for (var mount in rawAssets) {
                var entries = rawAssets[mount];
                var realEntries = realRawAssets[mount] = {};
                for (var id in entries) {
                    var entry = entries[id];
                    var type = entry[1];
                    // retrieve minified raw asset
                    if (typeof type === 'number') {
                        entry[1] = assetTypes[type];
                    }
                    // retrieve uuid
                    realEntries[uuids[id] || id] = entry;
                }
            }

            var scenes = settings.scenes;
            for (var i = 0; i < scenes.length; ++i) {
                var scene = scenes[i];
                if (typeof scene.uuid === 'number') {
                    scene.uuid = uuids[scene.uuid];
                }
            }

            var packedAssets = settings.packedAssets;
            for (var packId in packedAssets) {
                var packedIds = packedAssets[packId];
                for (var j = 0; j < packedIds.length; ++j) {
                    if (typeof packedIds[j] === 'number') {
                        packedIds[j] = uuids[packedIds[j]];
                    }
                }
            }
        }

        // init engine
        var canvas;

        if (cc.sys.isBrowser) {
            canvas = document.getElementById('GameCanvas');
        }

        function setLoadingDisplay () {
            // Loading splash scene
            var splash = document.getElementById('splash');
            var progressBar = splash.querySelector('.progress-bar span');
            cc.loader.onProgress = function (completedCount, totalCount, item) {
                var percent = 100 * completedCount / totalCount;
                if (progressBar) {
                    progressBar.style.width = percent.toFixed(2) + '%';
                }
            };
            splash.style.display = 'block';
            progressBar.style.width = '0%';

            cc.director.once(cc.Director.EVENT_AFTER_SCENE_LAUNCH, function () {
                splash.style.display = 'none';
            });
        }

        var onStart = function () {
            cc.view.resizeWithBrowserSize(true);

            if (!false && !false) {
                // UC browser on many android devices have performance issue with retina display
                if (cc.sys.os !== cc.sys.OS_ANDROID || cc.sys.browserType !== cc.sys.BROWSER_TYPE_UC) {
                    cc.view.enableRetina(true);
                }
                if (cc.sys.isBrowser) {
                    setLoadingDisplay();
                }

                if (cc.sys.isMobile) {
                    if (settings.orientation === 'landscape') {
                        cc.view.setOrientation(cc.macro.ORIENTATION_LANDSCAPE);
                    }
                    else if (settings.orientation === 'portrait') {
                        cc.view.setOrientation(cc.macro.ORIENTATION_PORTRAIT);
                    }
                    cc.view.enableAutoFullScreen([
                        cc.sys.BROWSER_TYPE_BAIDU,
                        cc.sys.BROWSER_TYPE_WECHAT,
                        cc.sys.BROWSER_TYPE_MOBILE_QQ,
                        cc.sys.BROWSER_TYPE_MIUI,
                    ].indexOf(cc.sys.browserType) < 0);
                }

                // Limit downloading max concurrent task to 2,
                // more tasks simultaneously may cause performance draw back on some android system / brwosers.
                // You can adjust the number based on your own test result, you have to set it before any loading process to take effect.
                if (cc.sys.isBrowser && cc.sys.os === cc.sys.OS_ANDROID) {
                    cc.macro.DOWNLOAD_MAX_CONCURRENT = 2;
                }
            }

            // init assets
            cc.AssetLibrary.init({
                libraryPath: 'res/import',
                rawAssetsBase: 'res/raw-',
                rawAssets: settings.rawAssets,
                packedAssets: settings.packedAssets,
                md5AssetsMap: settings.md5AssetsMap
            });

            var launchScene = settings.launchScene;

            // load scene
            cc.director.loadScene(launchScene, null,
                function () {
                    if (cc.sys.isBrowser) {
                        // show canvas
                        canvas.style.visibility = '';
                        var div = document.getElementById('GameDiv');
                        if (div) {
                            div.style.backgroundImage = '';
                        }
                    }
                    cc.loader.onProgress = null;
                    console.log('Success to load scene: ' + launchScene);
                }
            );
        };

        // jsList
        // var jsList = settings.jsList;

        // var bundledScript = settings.debug ? 'src/project.dev.js' : 'src/project.js';
        // if (jsList) {
        //     jsList = jsList.map(function (x) {
        //         return 'src/' + x;
        //     });
        //     jsList.push(bundledScript);
        // }
        // else {
        //     jsList = [bundledScript];
        // }
        var jsList = [];

        var option = {
            //width: width,
            //height: height,
            id: 'GameCanvas',
            scenes: settings.scenes,
            debugMode: settings.debug ? cc.DebugMode.INFO : cc.DebugMode.ERROR,
            showFPS: (!false && !false) && settings.debug,
            frameRate: 60,
            jsList: jsList,
            groupList: settings.groupList,
            collisionMatrix: settings.collisionMatrix,
            renderMode: 0
        }

        cc.game.run(option, onStart);
    }

    



    if (window.document) {

        var __audioSupport = cc.sys.__audioSupport;
        var formatSupport = __audioSupport.format;
        var context = __audioSupport.context;

        // 转二进制Blob
        function base64toBlob(base64, type) {  
            // 将base64转为Unicode规则编码
            var bstr = atob(base64, type),  
            n = bstr.length,  
            u8arr = new Uint8Array(n);  
            while (n--) {  
                u8arr[n] = bstr.charCodeAt(n) // 转换编码后才可以使用charCodeAt 找到Unicode编码
            }  
            return new Blob([u8arr], {  
                type: type,
            })
        }

        // 转二进制
        function base64toArray(base64) {  
            // 将base64转为Unicode规则编码
            var bstr = atob(base64),  
            n = bstr.length,  
            u8arr = new Uint8Array(n);  
            while (n--) {  
                u8arr[n] = bstr.charCodeAt(n) // 转换编码后才可以使用charCodeAt 找到Unicode编码
            }

            return u8arr;
        }

        // 加载domaudio
        function loadDomAudio(item, callback) {
            var dom = document.createElement('audio');

            dom.muted = true;
            dom.muted = false;

            var data = window.resMap[item.url.split("?")[0]];
            data = base64toBlob(data, "audio/mpeg");

            if (window.URL) {
                dom.src = window.URL.createObjectURL(data);
            } else {
                dom.src = data;
            }
            

            var clearEvent = function () {
                clearTimeout(timer);
                dom.removeEventListener("canplaythrough", success, false);
                dom.removeEventListener("error", failure, false);
                if(__audioSupport.USE_LOADER_EVENT)
                    dom.removeEventListener(__audioSupport.USE_LOADER_EVENT, success, false);
            };
            var timer = setTimeout(function () {
                if (dom.readyState === 0)
                    failure();
                else
                    success();
            }, 8000);
            var success = function () {
                clearEvent();
                item.element = dom;
                callback(null, item.url);
            };
            var failure = function () {
                clearEvent();
                var message = 'load audio failure - ' + item.url;
                cc.log(message);
                callback(message, item.url);
            };
            dom.addEventListener("canplaythrough", success, false);
            dom.addEventListener("error", failure, false);
            if(__audioSupport.USE_LOADER_EVENT)
                dom.addEventListener(__audioSupport.USE_LOADER_EVENT, success, false);
        }

        // 加载webaudio
        function loadWebAudio(item, callback) {
            if (!context) callback(new Error('Audio Downloader: no web audio context.'));

            var data = window.resMap[item.url];
            data = base64toArray(data);

            if (data) {
                context["decodeAudioData"](data.buffer, function(buffer){
                    //success
                    item.buffer = buffer;
                    callback(null, item.id);
                }, function(){
                    //error
                    callback('decode error - ' + item.id, null);
                });
            } else {
                callback('request error - ' + item.id, null);
            }
        }

        // web加载数据方法
        var arrayBufferHandler = (item, callback, isCrossOrigin, img) => {
            var index = item.url.lastIndexOf(".");
            var strtype=item.url.substr(index + 1, 4); 
            strtype=strtype.toLowerCase(); 
            var data = window.resMap[item.url];

            var img = new Image();
            function loadCallback () {
                img.removeEventListener('load', loadCallback);
                img.removeEventListener('error', errorCallback);
    
                callback(null, img);
            }
            function errorCallback () {
                img.removeEventListener('load', loadCallback);
                img.removeEventListener('error', errorCallback);
    
                // Retry without crossOrigin mark if crossOrigin loading fails
                // Do not retry if protocol is https, even if the image is loaded, cross origin image isn't renderable.

                 callback(new Error('Load image (' + url + ') failed'));
            }
    
            img.addEventListener('load', loadCallback);
            img.addEventListener('error', errorCallback);
            img.src = data;
        };

        // web加载数据方法
        var jsonBufferHandler = (item, callback) => {
            var str = window.resMap[item.url];
            callback(null, str);
        };

        // web加载音频
        var audioBufferHandler = (item, callback) => {
            if (formatSupport.length === 0) {
                return new Error('Audio Downloader: audio not supported on this browser!');
            }
        
            item.content = item.url;
        
            // If WebAudio is not supported, load using DOM mode
            if (!__audioSupport.WEB_AUDIO || (item.urlParam && item.urlParam['useDom'])) {
                loadDomAudio(item, callback);
            }
            else {
                loadWebAudio(item, callback);
            }
        }

        // 添加加载函数
        cc.loader.addDownloadHandlers({
            png: arrayBufferHandler,
            jpg: arrayBufferHandler,
            jpeg: arrayBufferHandler,
        });

        cc.loader.addDownloadHandlers({
            json: jsonBufferHandler,
        });

        cc.loader.addDownloadHandlers({
            mp3: audioBufferHandler,
            ogg: audioBufferHandler,
            wav: audioBufferHandler,
            m4a: audioBufferHandler
        })

        var splash = document.getElementById('splash');
        splash.style.display = 'block';

        boot();
    }

})();
