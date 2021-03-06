document.addEventListener("DOMContentLoaded", function(event)
{
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.onload = function() {
        if (xhr.status == 200) {
            var json = xhr.response;
            //console.log(json);

			var table = document.getElementById('database-my-list');
            var tbody = document.createElement('tbody');

            if(Object.keys(json).length == 0)
            {
                var row = document.createElement('tr');
                var col = document.createElement('td');
                col.textContent = "No Results";
                row.appendChild(col);
                tbody.appendChild(row);
            }

            if(json['error'] == undefined)
            {
	    		for(var key in json)
		        {
		            //console.log(key);

	                if(key == 0) //create table header
	                {
	        			var row = document.createElement('thead');
	        			row.className = 'thead-inverse';

	                	for(var header in json[key])
				        {
		        			//console.log(header);
			        		var col = document.createElement('th');
			        		if(header != 'id') {
	    						col.textContent = header;
	    					}
							row.appendChild(col);
				        }
				        table.appendChild(row);
	                }

	                var row = document.createElement('tr');

	        		var id = 0;
	                for(var item in json[key])
				    {
				        //console.log(item);
				        var col = document.createElement('td');
				        if(item =='id') {
				        	id = json[key][item];
				        	var d = document.createElement('button');
				        	d.className = 'btn btn-danger btn-sm';
				        	d.setAttribute('title', 'Delete');
				        	d.setAttribute('onclick', 'window.location.href="api.php?remove&id=' + id + '"');
				        	d.textContent = 'X';
				        	col.appendChild(d);
				        }else if(item == 'Timestamp') {
				        	var a = document.createElement('a');
				        	a.setAttribute('href', 'view.html?id=' + id);
				        	a.textContent = json[key][item];
				        	col.appendChild(a);
				        }else if(item == 'Subscribers') {
				        	var s = document.createElement('button');
				        	s.className = 'btn btn-success btn-sm';
				        	s.setAttribute('title', 'Subscribers');
				        	s.setAttribute('onclick', 'window.location.href="subscribers.html?id=' + id + '"');
				        	s.textContent = json[key][item];
				        	col.appendChild(s);
				        }else{
	        				col.textContent = json[key][item];
						}
						row.appendChild(col);
				    }
				    tbody.appendChild(row);
		        }
		        buildPages();
	        }else{
                tbody.appendChild(buildLogin());
            }
            table.appendChild(tbody);
        }
    };
    xhr.open('GET', 'api.php?&my=list', true);
    xhr.send();
});