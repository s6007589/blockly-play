var inputArray = [];

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
    var target = $("#var_target_select_id").val();
    code = 'var myArray = [' + inputArray.join(',') + '];\n' +
           'var Target = ' + target + ';\n' +
           code + '\n';

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
  var relTop = $(tdid).position().top - $('#array_table_id').position().top;
  $('#array_table_container_id').scrollTop(relTop);
  $(tdid).css('background-color','#77ff77');
  window.setTimeout(function() {
    $(tdid).css('background-color','');
  }, 500);
  return true;
}

function highlightVariableSet(varName, value) {
  var vname = '';
  var varMap = {'X': 'x',
                'Best': 'best'};
  if(varMap[varName] !== undefined) {
    vname = varMap[varName];
  } else {
    if($('#var_' + varName + '_id').length == 0) {
      var item = '<div class="variables" id="var_' + varName + '_id" style="display: inline-block; padding-left: 5px; padding-right: 5px;">' + varName + ': <span class="variable-values">0</span></div>';
      $("#additional_vars_id").append(item);
    }
    vname = varName;
  }
  if(vname != '') {
    $('#var_' + vname + '_id .variable-values').text(value.toString());
    $('#var_' + vname + '_id').css('background-color','#ff7777');
    window.setTimeout(function() {
      $('#var_' + vname + '_id').css('background-color','');
    }, 500);
  }
  return true;
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
  interpreter.setProperty(scope, 'highlightArrayAccess',
                          interpreter.createNativeFunction(highlightArrayAccess));
  // highlightVariableSet
  interpreter.setProperty(scope, 'highlightVariableSet',
                          interpreter.createNativeFunction(highlightVariableSet));
}

var interpreter = null;
var stopInterpreter = null;

function nextStep() {
  if (interpreter.step()) {
    if(!stopInterpreter) {
      window.setTimeout(nextStep, 1);
    } else {
      stopInterpreter = null;
    }
  }
}

function runCode() {
  // Generate JavaScript code and run it.
  window.LoopTrap = 1000;

  var displayGeneratedCode = generateCode(true);
  $("#codeDiv").text(displayGeneratedCode);
  $("#additional_vars_id").empty();

  var generatedCode = generateCode(false);

  interpreter = new Interpreter(generatedCode, initApi);
  nextStep();
}

function stopCode() {
  stopInterpreter = true;
}

function compareNumbers(a, b) {
  return -(a - b);
}

function randomArray() {
  var arrayLen = 200;
  var used = {};
  for(var i = 0; i < arrayLen; i++) {
    var x = Math.floor(Math.random() * 500);
    var k = 'x' + x;
    while(used[k]) {
      x = Math.floor(Math.random() * 500);
      k = 'x' + x;
    }
    inputArray[i] = x;
    used[k] = true;
  }
  inputArray.sort(compareNumbers);
  for(var i = 0; i < arrayLen; i++) {
    var k = 'array_val_' + i.toString();
    if($('#' + k).length == 0) {
      var td = '<td id="' + k + '"></td>';
      var rid = Math.floor(i / 20);
      $('#array_table_id #row_'+rid).append(td);
    }
    $('#' + k).text(inputArray[i]);
  }
  generateTargetChoices();
}

function generateTargetChoices() {
  $('#var_target_select_id').empty();
  for(var i = 0; i < 200; i++) {
    var item = '<option value="' + inputArray[i] + '">' + inputArray[i] + '</option>';
    $("#var_target_select_id").append(item);
  }
  $("#var_target_select_id").val(inputArray[30]);
}

$(function(){
  randomArray();
});
