var blockTypes = [
  "first_element",
  "ith_element",
  "array_loop",
  "array_loop_skip_first"
];
var blockDescriptions = [{
  "message0": "ข้อมูลในรายการตัวแรก",
  "inputsInline": false,
  "output": "Number",
  "colour": 0,
  "tooltip": "",
  "helpUrl": ""
},
{
  "message0": "ข้อมูลในรายการตัวที่ %1 %2",
  "args0": [
    {
      "type": "input_dummy"
    },
    {
      "type": "input_value",
      "name": "INDEX",
      "check": "Number",
      "align": "RIGHT"
    }
  ],
  "inputsInline": true,
  "output": "Number",
  "colour": 0,
  "tooltip": "",
  "helpUrl": ""
},
{
  "message0": "พิจารณาข้อมูลในรายการ %1 ใช้ตัวแปร %2 แทนข้อมูล %3",
  "args0": [
    {
      "type": "input_dummy"
    },
    {
      "type": "field_variable",
      "name": "LOOPVAR",
      "variable": "X"
    },
    {
      "type": "input_statement",
      "name": "DO"
    }
  ],
  "inputsInline": true,
  "previousStatement": null,
  "nextStatement": null,
  "colour": 230,
  "tooltip": "",
  "helpUrl": ""
},
{
  "message0": "พิจารณาข้อมูลในรายการ ตั้งแต่ตัวที่สอง %1 ใช้ตัวแปร %2 แทนข้อมูล %3",
  "args0": [
    {
      "type": "input_dummy"
    },
    {
      "type": "field_variable",
      "name": "LOOPVAR",
      "variable": "X"
    },
    {
      "type": "input_statement",
      "name": "DO"
    }
  ],
  "inputsInline": true,
  "previousStatement": null,
  "nextStatement": null,
  "colour": 230,
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

Blockly.JavaScript['first_element'] = function(block) {
  // TODO: Assemble JavaScript into code variable.
  var code = '...';
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript['ith_element'] = function(block) {
  var value_index = Blockly.JavaScript.valueToCode(block, 'INDEX', Blockly.JavaScript.ORDER_ATOMIC);
  // TODO: Assemble JavaScript into code variable.
  var code = '...';
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript['array_loop'] = function(block) {
  var variable_loopvar = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('LOOPVAR'), Blockly.Variables.NAME_TYPE);
  var statements_statement = Blockly.JavaScript.statementToCode(block, 'DO');

  var branch = Blockly.JavaScript.statementToCode(block, 'DO');
  branch = Blockly.JavaScript.addLoopTrap(branch, block.id);

  var forVar = Blockly.JavaScript.variableDB_.getDistinctName('count', Blockly.Variables.NAME_TYPE);

  var code = '';
  code += 'for (var ' + forVar + ' = 0; ' + forVar + ' < 20; ' + forVar + '++) {\n' +
    variable_loopvar + ' = a[' + forVar + '];\n' + 
    branch + '}\n';
  return code;
};

Blockly.JavaScript['array_loop_skip_first'] = function(block) {
  var variable_loopvar = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('LOOPVAR'), Blockly.Variables.NAME_TYPE);
  var statements_statement = Blockly.JavaScript.statementToCode(block, 'DO');
  // TODO: Assemble JavaScript into code variable.
  var code = '...;\n';
  return code;
};
