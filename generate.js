var fields = Array()
var ignored_fields = Array();
var rows = Array();

function SuggestFields(input_name){
    var field_suggestion = document.getElementById(input_name);
    field_suggestion.innerHTML = "";

    fields.forEach(function(field) {
        // Create a new <option> element.
        var option = document.createElement('option');
        option.value = `%${field}%`;

        // attach the option to the datalist element
        field_suggestion.appendChild(option);
    });
}

function IgnoreField(field){
    var ignore_field = document.getElementById(`ignore_${field}`);
    if (ignore_field.checked){
        if (!ignored_fields.includes(field)){
            ignored_fields.push(field);
        }
    } else {
        if (ignored_fields.includes(field)){
            ignored_fields = ignored_fields.filter(function(value, index, arr){ 
                return value != field;
            });
        }
    }
}

function DisplayFields(){
    document.getElementById("field_list").innerHTML = ""
    fields.forEach(function(field)
    {    
        document.getElementById("field_list").innerHTML += `<li>${field}</li>`;
        document.getElementById("field_list").innerHTML += `<button class="button_remove_field" onclick="RemoveField('${field}')">-</button>`;
        document.getElementById("field_list").innerHTML += `<input type="checkbox" id="ignore_${field}" name="ignore_${field}" onclick=IgnoreField('${field}')>`;
        document.getElementById("field_list").innerHTML += `<label for="ignore_${field}">Ignore</label>`;        
    }
    )
}

function AddField(field){
    if (fields.includes(field)){
        console.log(`field ${field} already exists`);
    } else {
        fields.push(field);
    }
    DisplayFields();
}

function AddFieldFromInput(){
    var field = document.getElementById("input_field").value;
    AddField(field);
}

function AddCsv(){
    var csv = document.getElementById("input_csv").value.split("\n");
    var headers = csv[0].split(",");
    headers.forEach(function(field){
        AddField(field);
    })
    rows = Array();
    csv.slice(1).forEach(function(item){
        rows.push(item);
    })
    
    DisplayFields()
}


function RemoveField(field){
    if (fields.includes(field)){
        fields = fields.filter(function(value, index, arr){ 
            return value != field;
        });
    } else {
        console.log(`field ${field} doesn't exists`)
    }
    DisplayFields();
}

function Generate(){
    var output = "##Generated with love using DrawIOBuilder<br/>";

    output += `# label: ${document.getElementById("input_label").value}<br/>`
    output += `# style: shape=${document.getElementById("input_shape").value};fillColor=${document.getElementById("input_fillColor").value};strokeColor=${document.getElementById("input_strokeColor").value};<br/>`
    output += `# namespace: csvimport-<br/>`
    
    if (document.getElementById("input_from").value == "") {
        console.log("missing input from");
        return
    }

    if (document.getElementById("input_to").value == "") {
        console.log("missing input to");
        return
    }
    
    var input_from = document.getElementById("input_from").value;
    var input_to = document.getElementById("input_to").value;
    output += `# connect: {"from":"${input_from.slice(1, input_from.length - 1)}", "to":"${input_to.slice(1, input_to.length - 1)}", "invert":${document.getElementById("input_invert").value}, "style":"${document.getElementById("input_style").value}"}<br/>`

    output += `# width: ${document.getElementById("input_width").value}<br/>`
    output += `# heigth: ${document.getElementById("input_heigth").value}<br/>`
    output += `# padding: ${document.getElementById("input_padding").value}<br/>`

    output += `# ignore: ${ignored_fields.toString()}<br/>`

    output += `# nodespacing: ${document.getElementById("input_nodespacing").value}<br/>`
    output += `# levelspacing: ${document.getElementById("input_levelspacing").value}<br/>`
    output += `# edgespacing: ${document.getElementById("input_edgespacing").value}<br/>`

    output += `# layout: ${document.getElementById("input_layout").value}<br/>`
    output += "## CSV data starts below this line<br/>"
    output += `${fields.toString()}<br/>`
    rows.forEach(function(row){
        output += `${row}<br/>`
    })
    
    document.getElementById("output").innerHTML = output;
}