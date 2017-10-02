var blockTypes = [
  'get_water_level',
  'signal_water_on',
  'signal_water_off'
];
var blockDescriptions = [{
  "message0": "อ่านระดับความชื้น",
  "inputsInline": false,
  "output": "Number",
  "colour": 345,
  "tooltip": "อ่านระดับความชื้นจากดิน",
  "helpUrl": ""
},
{
  "message0": "ส่งสัญญาณเปิดน้ำ",
  "previousStatement": null,
  "nextStatement": null,
  "colour": 180,
  "tooltip": "",
  "helpUrl": ""
},
{
  "message0": "ส่งสัญญาณปิดน้ำ",
  "previousStatement": null,
  "nextStatement": null,
  "colour": 180,
  "tooltip": "",
  "helpUrl": ""
}];

for(var i=0; i < blockDescriptions.length; i++) {
  var bdata = blockDescriptions[i];
  var t = blockTypes[i];
  Blockly.Blocks[t] = {
    baseData: bdata,
    init: function() {
      this.jsonInit(this.baseData);
    }
  };
}

Blockly.JavaScript['get_water_level'] = function(block) {
  var code = 'getWaterLevel()';
  return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
};

Blockly.JavaScript['signal_water_on'] = function(block) {
  var code = 'signalWaterOn();\n';
  return code;
};

Blockly.JavaScript['signal_water_off'] = function(block) {
  var code = 'signalWaterOff();\n';
  return code;
};
