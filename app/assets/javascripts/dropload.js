var dropbox = document.getElementById("dropbox");
var droplabel = document.getElementById("droplabel");

$(function() {

	document.addEventListener("dragenter", stopEvent, false);
	document.addEventListener("dragexit", stopEvent, false);
	document.addEventListener("dragOver", stopEvent, false);
	document.addEventListener("drop", drop, false);
	
	dropbox = document.getElementById("dropbox");
	droplabel = document.getElementById("droplabel");
});

function stopEvent(e) {
	e.stopPropagation();
	e.preventDefault();
	
	console.log("Event Stopped");
}

function drop(e) {
	e.stopPropagation();
	e.preventDefault();
	
	var files = e.dataTransfer.files;
	
	var count = files.length;
	
	if(count > 0)
		handleFiles(files);
}

function handleFiles(files) {
	handleFile(files[0]);
}

function handleFile(file) {
	console.log("HandleFile("+file+")");
	droplabel.innerHTML = file.name + " is " + file.size + " bytes";
	
	const BYTES_PER_CHUNK = 1024 * 1024; // 1 MB
	const SIZE = file.size;
	const CHUNKS = Math.ceil(SIZE / BYTES_PER_CHUNK);
	
	var start = 0;
	var end = BYTES_PER_CHUNK;
	
	var chunkID = 0;
	
	$('#pbar_holder').html("");
	
	while(start < SIZE) {
		upload(file.slice(start, end), chunkID, SIZE, CHUNKS, file.name);
		
		start = end;
		end = start + BYTES_PER_CHUNK;
		chunkID++;
	}
}

function upload(chunk, chunkID, totalSize, numChunks, fileName) {
	console.log("Uploading chunk "+ chunkID +": " + chunk);
	
	var formData = new FormData();
	
	formData.append('chunkID', chunkID);
	formData.append('chunks', numChunks);
	formData.append('file', chunk);
	formData.append('fileName', fileName);
	formData.append('totalSize', totalSize);
	
	console.log(progressBar);
		
	var xhr = new XMLHttpRequest();
	
	
	xhr.open("POST", '/upload', true);
	
	xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'));
	
	xhr.onload = function(e) {
		data = JSON.parse(this.response);
		console.log(data);
		console.log("Upload Complete");
	};
	
	$('#pbar_holder').append(
		"<div class='progress progress-striped active' title='Chunk "+chunkID+"'>" +
		"<div class='bar' style='width: 0%;' id='pbar-"+chunkID+"'></div>" +
		"</div>");
		
	var progressBar = $('#pbar-'+chunkID);
	
	xhr.upload.onprogress = function(e) {
		if(e.lengthComputable) {
			var percent = (e.loaded/e.total) * 100;
			
			progressBar.width(percent + '%');
		}
	};
	
	xhr.send(formData);
}
