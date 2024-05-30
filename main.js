let xmlhttp;
  
xmlhttp= new XMLHttpRequest();
xmlhttp.open('GET', "README.md", false);
xmlhttp.send();

document.getElementById('content').innerHTML = marked.parse(xmlhttp.responseText);