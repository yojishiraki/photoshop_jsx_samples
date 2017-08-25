/*
 * 各種変数
 */

var settingFileName = 'settings.tsv';
var outputDirName   = 'output';
var gifOutputPath   = outputDirName + '/gif';
var psdOutputPath   = outputDirName + '/psd';
var templatePath    = 'template/banner.psd';

(function(){

	/*
	 各種Pathの定義
	*/
	var scriptPath = String(getScriptPath());
	var basePath   = scriptPath.replace(/\/script\/.*/, '');
	log(scriptPath);


	/*
	 保存先フォルダの生成
	*/
	var newFolder;
	gifOutputPath = basePath + '/' + gifOutputPath;

	newFolder = new Folder(gifOutputPath);
	newFolder.create();

	psdOutputPath = basePath + '/' + psdOutputPath;

	newFolder = new Folder( basePath + '/' + psdOutputPath);
	newFolder.create();


	/*
	 テンプレート開く
	*/
	var templateFileObj = new File(basePath + '/' + templatePath);

	if(!open(templateFileObj)){
		alert("テンプレートファイルが読み込めませんでした。処理を中止します。");
		return false;
	}


	/*
	　設定ファイルの読み込み
	*/
	var settingFileObj = new File( basePath + '/script/' + settingFileName);
	if( !settingFileObj.open("r") ){
		alert("設定ファイルが読み込めませんでした。処理を中止します。");
		return false;
	}

    while( !settingFileObj.eof ){
        var line = settingFileObj.readln();
        var setting = line.toString().split("\t");
        var mainColor = setting[0];
        var cColor = complementary_color(mainColor);
        var word = setting[1];
        var i  = 1;
  
  
  
         // 念のため選択解除
        activeDocument.selection.deselect();
        
        // カラーオブジェクト生成
        var colObj = new SolidColor();
        colObj.rgb.red = parseInt(cColor.slice(0,2), 16);
        colObj.rgb.green = parseInt(cColor.slice(2,4), 16);
        colObj.rgb.blue = parseInt(cColor.slice(4,6), 16);
        
        // レイヤークリア
        activeDocument.activeLayer = activeDocument.layers["background"];
        activeDocument.selection.selectAll();
        activeDocument.selection.clear();
        
        // 色塗り
        activeDocument.selection.fill(colObj,ColorBlendMode.NORMAL, 100, false);
        
        
        
        
        
 
        // 念のため選択解除
        activeDocument.selection.deselect();
        
        // カラーオブジェクト生成
        var colObj = new SolidColor();
        colObj.rgb.red = parseInt(mainColor.slice(0,2), 16);
        colObj.rgb.green = parseInt(mainColor.slice(2,4), 16);
        colObj.rgb.blue = parseInt(mainColor.slice(4,6), 16);
        
        // レイヤークリア
        activeDocument.activeLayer = activeDocument.layers["background_A"];
        activeDocument.selection.selectAll();
        activeDocument.selection.clear();

        // アルファチャンネル選択
        var chObj = activeDocument.channels[3];
        activeDocument.selection.load(chObj);
        
        // 色塗り
        activeDocument.selection.fill(colObj,ColorBlendMode.NORMAL, 100, false);
        
        

        
        
        /*
            文字の置き換え
           */
        
        var placeholder = "{#placeholder}";
        var textLayer = activeDocument.layers["text"];
        var layerText = textLayer.textItem.contents;
        var regObj = new RegExp(placeholder, "g");

        if( layerText.match(regObj)){
            textLayer.textItem.contents = layerText.replace(regObj, word);
            textLayer.textItem.color = colObj;
        }


  

        /*
         GIF保存
        */
        var newFolder  = new Folder(gifOutputPath);
        newFolder.create();

        gifOpt                     = new GIFSaveOptions();
        gifOpt.colors              = 200;
        gifOpt.dither              = Dither.NONE;
        gifOpt.interlacted         = true;
        gifOpt.matte               = MatteType.WHITE;
        gifOpt.palette             = Palette.EXACT;
        gifOpt.preserveExactColors = false;
        gifOpt.transparency        = true;

        newGifFile = new File(gifOutputPath + '/' + word + '.gif' );
        activeDocument.saveAs(newGifFile, gifOpt, true, Extension.LOWERCASE);

        log("create " + word + '.gif');		



        
        /*
         PSD保存
        */
        psdOpt                   = new PhotoshopSaveOptions();
        psdOpt.alphaChannels     = true;
        psdOpt.annotations       = true;
        psdOpt.embedColorProfile = false;
        psdOpt.layers            = true;
        psdOpt.spotColors        = false;

        newPsdFile = new File(psdOutputPath +'/' + word + '.psd');
        activeDocument.saveAs(newPsdFile, psdOpt, true, Extension.LOWERCASE);

        log("create " + word + '.psd');


        /*
         後処理
        */
        textLayer.textItem.contents = placeholder;
    }

})();

function getScriptPath(){
    try {
    	app.documents.test()
    }catch(e) {
    	return File(e.fileName)
   	};
}


function log(string){
    $.writeln(string);
}


function complementary_color(color_code) {
    var R = parseInt(color_code.slice(0,2), 16);
    var G = parseInt(color_code.slice(2,4), 16);
    var B = parseInt(color_code.slice(4,6), 16);
    
    //各値全てが数値かつ0以上255以下
    if(!isNaN(R + G + B) && 0 <= R && R <=255 && 0 <= G && G <=255 && 0 <= B && B <=255) {
        var max = Math.max(R, Math.max(G, B));
        var min = Math.min(R, Math.min(G, B));
        var sum = max + min;
        var newR = sum - R;
        var newG = sum - G;
        var newB = sum - B;
        var comColor = newR.toString(16) + newG.toString(16) + newB.toString(16);
        return comColor;
    } else {
        return null;
    }
}
