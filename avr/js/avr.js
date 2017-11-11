var inputArray = [];
var inputArraySize = 0;

var workspace = Blockly.inject(
  'blocklyDiv',
  { media: '../media/',
    toolbox: document.getElementById('toolbox'),
    trashcan: true }
);

var workspaceBlocks = document.getElementById("workspaceBlocks");
Blockly.Xml.domToWorkspace(workspace, workspaceBlocks);

function generateCode(forDisplay) {
  if(forDisplay) {
    Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
    MaxCustomBlock.ARRAY_VARIABLE_NAME = 'A';
  } else {
    Blockly.JavaScript.INFINITE_LOOP_TRAP =
      'if (--window.LoopTrap == 0) throw "Infinite loop.";\n';
    Blockly.JavaScript.STATEMENT_PREFIX = 'highlightBlock(%1);\n';
    Blockly.JavaScript.addReservedWords('highlightBlock');

    MaxCustomBlock.HIGHLIGHT_ARRAY_ACCESS = true;
    MaxCustomBlock.HIGHLIGHT_VARIABLE_SET = true;
    Blockly.JavaScript.addReservedWords('highlightArrayAccess');
    Blockly.JavaScript.addReservedWords('highlightVariableSet');
  }

  var code = Blockly.JavaScript.workspaceToCode(workspace);

  if(forDisplay) {
    MaxCustomBlock.ARRAY_VARIABLE_NAME = 'myArray';
  } else {
    var total = 0;
    for(var i = 0; i < inputArraySize; i++) {
      total += inputArray[i];
    }
    var solution = (total / inputArraySize).toFixed(3);
    code = 'var myArray = [' + inputArray.join(',') + '];\n' +
           code + '\n' +
           'alert("โปรแกรมคืนค่า " + (Avr != undefined ? Avr.toFixed(3) : 0) + "\\n" + \n' +
           '"คำตอบที่ถูกคือ ' + solution + '");\n';

    Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
    Blockly.JavaScript.STATEMENT_PREFIX = null;
    MaxCustomBlock.HIGHLIGHT_ARRAY_ACCESS = false;
    MaxCustomBlock.HIGHLIGHT_VARIABLE_SET = false;
  }
  return code;
}

function showCode() {
  var code = generateCode(true);
  alert(code);
}

function highlightArrayAccess(idx) {
  var tdid = '#array_val_' + idx.toString();
  $(tdid).css('background-color','#77ff77');
  window.setTimeout(function() {
    $(tdid).css('background-color','');
  }, 500);
}

function highlightVariableSet(varName, value) {
  var vname = '';
  var varMap = {'Total': 'total',
                'X': 'x',
                'Avr': 'avr',
                'Count': 'count'};
  if(varMap[varName] !== undefined) {
    vname = varMap[varName];
  }
  if(vname != '') {
    $('#var_' + vname + '_id .variable-values').text(value.toString());
    $('#var_' + vname + '_id').css('background-color','#ff7777');
    window.setTimeout(function() {
      $('#var_' + vname + '_id').css('background-color','');
    }, 500);
  }
}

function initApi(interpreter, scope) {
  var wrapper = function(text) {
    text = text ? text.toString() : '';
    return interpreter.createPrimitive(alert(text));
  };
  interpreter.setProperty(scope, 'alert',
                          interpreter.createNativeFunction(wrapper));

  wrapper = function(text) {
    text = text ? text.toString() : '';
    return interpreter.createPrimitive(prompt(text));
  };
  interpreter.setProperty(scope, 'prompt',
                          interpreter.createNativeFunction(wrapper));

  wrapper = function(id) {
    id = id ? id.toString() : '';
    return interpreter.createPrimitive(workspace.highlightBlock(id));
  };
  interpreter.setProperty(scope, 'highlightBlock',
                          interpreter.createNativeFunction(wrapper));

  // highlightArrayAccess
  wrapper = function(idx) {
    console.log('Access array[' + idx + ']');
  }
  interpreter.setProperty(scope, 'highlightArrayAccess',
                          interpreter.createNativeFunction(highlightArrayAccess));
  // highlightVariableSet
  wrapper = function(varName, value) {
    console.log('Set ' + varName + ' = ' + value.toString());
  }
  interpreter.setProperty(scope, 'highlightVariableSet',
                          interpreter.createNativeFunction(highlightVariableSet));
}

var interpreter = null;

function nextStep() {
  if (interpreter.step()) {
    window.setTimeout(nextStep, 5);
  }
}

function runCode() {
  // Generate JavaScript code and run it.
  window.LoopTrap = 1000;

  var displayGeneratedCode = generateCode(true);
  $("#codeDiv").text(displayGeneratedCode);

  var generatedCode = generateCode(false);

  interpreter = new Interpreter(generatedCode, initApi);
  nextStep();
}

function randomArray(randomLength) {
  var arrayLen;
  if(randomLength) {
    arrayLen = 21 + Math.floor(Math.random() * 20);
  } else {
    arrayLen = 40;
  }
  $(".array-values").text("");
  inputArray = [];
  for(var i = 0; i < arrayLen; i++) {
    inputArray[i] = Math.floor(Math.random() * 100);
    $('#array_val_' + i.toString()).text(inputArray[i]);
  }
  inputArraySize = arrayLen;
  $('#num_elements_id').text(inputArraySize);
}

function randomArraySize() {
  randomArray(true);
}

$(function(){
  randomArray(false);
});
