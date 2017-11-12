var blockTypes = [
  "target_value"
];
var blockDescriptions = [{
  "message0": "คะแนนของเพื่อน",
  "inputsInline": false,
  "output": "Number",
  "colour": 0,
  "tooltip": "",
  "helpUrl": ""
}]

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

Blockly.JavaScript['target_value'] = function(block) {
  var code = 'Target';
  return [code, Blockly.JavaScript.ORDER_NONE];
};
