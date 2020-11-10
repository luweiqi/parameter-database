document.addEventListener("DOMContentLoaded", function(event)
{
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.onload = function() {
        if (xhr.status == 200) {
            var json = xhr.response;
            console.log(json);

            var table = document.getElementById('parameter-data');
            var tbody = document.createElement('tbody');

	        var upload = document.getElementById('parameter-upload');

	       	var token = document.createElement('input');
		    token.setAttribute('type', 'text');
		    token.setAttribute('name', 'token');
		    token.setAttribute('hidden', true);
		    token.setAttribute('value', window.location.search.substr(1).replace('token=',''));
			upload.appendChild(token);

            if(Object.keys(json).length > 0)
            {
            	if(json['error'] == undefined)
            	{
		            var category = [];
		            var t = 0;

		            for(var key in json)
		            {
		                if(t == 0)
		                {
		                    var row = document.createElement('thead');
		                    row.className = 'thead-inverse';

							if(json['DIFF'] != undefined)
		                    {
								var col = document.createElement('th');
			                    col.textContent = 'update';
			                    row.appendChild(col);
		                    }
		                    var col = document.createElement('th');
		                    col.textContent = 'parameter';
		                    row.appendChild(col);

		                    colspan = Object.keys(json[key]);
		                    for (i = 1; i < colspan.length-2; i++)
		                    {
		                    	if(json['DIFF'] != undefined)
		                    	{
			                    	if (i == 1){
			                    		var col = document.createElement('th');
				                        col.textContent = 'old value';
				                        row.appendChild(col);
				                        var col = document.createElement('th');
				                        col.textContent = 'new value';
				                        row.appendChild(col);
				                        continue;
			                    	}
			                    }
			                   var col = document.createElement('th');
		                        col.textContent = colspan[i];
		                        row.appendChild(col);
		                    }

		                    var col = document.createElement('th');
		                    col.textContent = colspan[0];
		                    row.appendChild(col);

		                    table.appendChild(row);
		                }
		                
		                if(!category.includes(json[key].category)) //create table header
		                {
		                    //console.log(json[key].category);
		                    if(json[key].category != undefined)
		                    {
		                        category.push(json[key].category);

		                        var row = document.createElement('tr');
		                        row.className = 'text-light bg-secondary';
		                        
		                        var colspan = Object.keys(json[key]).length;
		                        if(json['DIFF'] != undefined)
		                        	colspan += 2;
		                        var col = document.createElement('td');
		                        col.setAttribute('colspan', colspan);
		                        col.textContent = json[key].category;

		                        row.appendChild(col);
		                        tbody.appendChild(row);
		                    }
		                }
		                
		                var row = document.createElement('tr');
		                if(json[key].category != undefined)
		                {
		                	if(json['DIFF'] != undefined)
		                    {
								var col = document.createElement('td');

		                    	if(json['DIFF'][key] != undefined) {
		                    		if (json['DIFF'][key].value.old != undefined)
		                    		{
		                    			row.className = 'bg-warning';
		                    		}else if (json['DIFF'][key].value.delete != undefined) {
		                    			row.className = 'bg-danger';
		                    		}
		                    		row.className = 'bg-warning';
		                    		var checkbox = document.createElement('input');
			                        checkbox.className = 'form-check-input';
			                        checkbox.setAttribute('type', 'checkbox');
			                        checkbox.setAttribute('id', 'u' + key);
			                        checkbox.checked = true;
			                        col.appendChild(checkbox);
		                    	}

		                        row.appendChild(col);
		                    }
		                    var col = document.createElement('td');
		                    col.textContent = key;
		                    row.appendChild(col);

		                    colspan = Object.keys(json[key]);
		                    for (i = 1; i < colspan.length-2; i++)
		                    {
		                    	if(json['DIFF'] != undefined) {
				                    if (i == 1) {
										var col = document.createElement('td');
										if(json['DIFF'][key] != undefined){
											col.textContent = json['DIFF'][key].value.old;
										}
				                        row.appendChild(col);
				                    }
				                    var col = document.createElement('td');
				                    col.textContent = json[key][colspan[i]];
				                    row.appendChild(col);
		                    	}else{
			                        var col = document.createElement('td');
			                        col.textContent = json[key][colspan[i]];
			                        row.appendChild(col);
			                    }
		                    }

		                    var col = document.createElement('td');
		                    col.textContent = json[key][colspan[0]];
		                    row.appendChild(col);
		                }
		                tbody.appendChild(row);
		                
		                t++;
		            }

	            	var qxhr = new XMLHttpRequest();
				    qxhr.responseType = 'json';
				    qxhr.onload = function() {
				        if (qxhr.status == 200) {
				            var json = qxhr.response;
				            console.log(json);

							var form = document.getElementById('parameter-questions');

							var h = document.createElement('h2');
					    	h.textContent = 'Questions';
					    	form.appendChild(h);

							buildQuestionForm(json,form, [], [1,3]);

					        var fieldset = document.createElement('div');
				            fieldset.className = 'form-group';
							var textarea = document.createElement('textarea');
							textarea.className = 'form-control mb-3';
				            textarea.setAttribute('name', 'notes');
				            textarea.setAttribute('id', 'notes');
				            textarea.setAttribute('placeholder', 'Notes');
							//textarea.style = 'min-width: 100%';
				    		fieldset.appendChild(textarea);
				    		form.appendChild(fieldset);

				    		var submit = document.createElement('button');
				            submit.setAttribute('type', 'submit');
				            submit.setAttribute('name', 'submit');
							submit.className = 'btn btn-primary';
							submit.textContent = 'Submit Query';
							form.appendChild(submit);
				        }
				    };
				    qxhr.open('GET', 'api.php?questions&' + window.location.search.substr(1), true);
				    qxhr.send();
				}else if(json['error'] == 'login') {
					upload.appendChild(buildLogin());
				}else if(json['error'] == 'hardware') {
					var error = document.createElement('div');
					error.className = 'bg-danger text-light mt-4';
					error.textContent = 'Hardware mismatch. Cannot update parameters for different Hardware.';
					upload.appendChild(error);
				}else{
					var error = document.createElement('div');
					error.className = 'bg-danger text-light mt-4';
					error.textContent = 'Upload Error. Requires full JSON output with categories. Snapshot files are not valid.';
					upload.appendChild(error);
				}
            }

            table.appendChild(tbody);
        }
    };
    xhr.open('GET', 'api.php?submit&' + window.location.search.substr(1), true);
    xhr.send();
});