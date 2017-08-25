colObj = new SolidColor();
colObj.rgb.red = 128;
colObj.rgb.green = 255;
colObj.rgb.blue = 64;
documents.add(320,240);
activeDocument.selection.selectAll();
activeDocument.selection.fill(colObj,ColorBlendMode.NORMAL, 100, false);