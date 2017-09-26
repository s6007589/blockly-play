Blockly.Blocks['height_input'] = {
  init: function() {
    this.jsonInit({
      "message0": "ความสูง",
      "output": null,
      "colour": 345,
      "tooltip": "",
      "helpUrl": ""
    });
  }
};

Blockly.JavaScript['height_input'] = function(block) {
  var code = "getHeight()";
  return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
};
