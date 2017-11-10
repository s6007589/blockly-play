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

var MaxCustomBlock = {};
MaxCustomBlock.ARRAY_VARIABLE_NAME = 'myArray';
MaxCustomBlock.HIGHLIGHT_ARRAY_ACCESS = false;
MaxCustomBlock.HIGHLIGHT_VARIABLE_SET = false;

Blockly.JavaScript['first_element'] = function(block) {
  var code = MaxCustomBlock.ARRAY_VARIABLE_NAME + '[0]';
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript['ith_element'] = function(block) {
  var value_index = Blockly.JavaScript.valueToCode(block, 'INDEX', Blockly.JavaScript.ORDER_ATOMIC);
  var code = MaxCustomBlock.ARRAY_VARIABLE_NAME + '[' + value_index + ']';
  return [code, Blockly.JavaScript.ORDER_NONE];
};

var arrayLoopGenerator = function(block, startIndex) {
  var variableLoopvar = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('LOOPVAR'), Blockly.Variables.NAME_TYPE);

  var branch = Blockly.JavaScript.statementToCode(block, 'DO');
  branch = Blockly.JavaScript.addLoopTrap(branch, block.id);

  var forVar = Blockly.JavaScript.variableDB_.getDistinctName('i', Blockly.Variables.NAME_TYPE);

  var highlightAccessStatement = '';
  if(MaxCustomBlock.HIGHLIGHT_ARRAY_ACCESS) {
    highlightAccessStatement = 'highlightArrayAccess(' + forVar + ');\n'
  }
  if(MaxCustomBlock.HIGHLIGHT_VARIABLE_SET) {
    highlightAccessStatement = highlightAccessStatement +
      'highlightVariableSet("' + variableLoopvar + '",' + variableLoopvar + ');\n';
  }
  
  var code = '';
  code += 'for (var ' + forVar + ' = ' + startIndex.toString() + '; ' + forVar + ' < ' + MaxCustomBlock.ARRAY_VARIABLE_NAME + '.length; ' + forVar + '++) {\n' +
    variableLoopvar + ' = ' + MaxCustomBlock.ARRAY_VARIABLE_NAME + '[' + forVar + '];\n' +
    highlightAccessStatement + 
    branch + '}\n';
  return code;
}

Blockly.JavaScript['array_loop'] = function(block) {
  return arrayLoopGenerator(block, 0);
};

Blockly.JavaScript['array_loop_skip_first'] = function(block) {
  return arrayLoopGenerator(block, 1);
};

Blockly.JavaScript['variables_set'] = function(block) {
  // Variable setter.
  var argument0 = Blockly.JavaScript.valueToCode(block, 'VALUE',
                                                 Blockly.JavaScript.ORDER_ASSIGNMENT) || '0';
  var varName = Blockly.JavaScript.variableDB_.getName(
    block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);
  if(!MaxCustomBlock.HIGHLIGHT_VARIABLE_SET) {
    return varName + ' = ' + argument0 + ';\n';
  } else {
    return varName + ' = ' + argument0 + ';\n' +
      'highlightVariableSet("' + varName + '",' + varName + ');\n';
  }
};


Blockly.JavaScript['math_change'] = function(block) {
  // Add to a variable in place.
  var argument0 = Blockly.JavaScript.valueToCode(block, 'DELTA',
      Blockly.JavaScript.ORDER_ADDITION) || '0';
  var varName = Blockly.JavaScript.variableDB_.getName(
      block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);

  if(!MaxCustomBlock.HIGHLIGHT_VARIABLE_SET) {
    return varName + ' = (typeof ' + varName + ' == \'number\' ? ' + varName +
      ' : 0) + ' + argument0 + ';\n';
  } else {
    return varName + ' = (typeof ' + varName + ' == \'number\' ? ' + varName +
      ' : 0) + ' + argument0 + ';\n' +
      'highlightVariableSet("' + varName + '",' + varName + ');\n';
  }
};
