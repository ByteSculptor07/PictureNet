window.onload = function() {
const dropArea = document.querySelector('.drag-area');
const dragText = document.querySelector('.hd');
let button = dropArea.querySelector('.button');
let input = dropArea.querySelector('input');
let publish_btn = document.getElementById("publish");
var preview_area = document.getElementById('preview');
var gen_btn = document.getElementById('genBtn');
var gen_start_btn = document.getElementById('genStartBtn');
var loader = document.getElementById('loader');
var prompt_container = document.getElementById('promptContainer');
var prompt_input = document.getElementById('promptInput');
var input_container = document.getElementById('inputContainer');
console.log(genBtn);
var dropText = document.querySelectorAll(".hide");
let file;
let fileURL;

// when file is inside drag area
dropArea.addEventListener('dragover', (event) => {
    event.preventDefault();
    dropArea.classList.add('active');
    dragText.textContent = 'Release to Upload';
});

// when file leave the drag area
dropArea.addEventListener('dragleave', () => {
    dropArea.classList.remove('active');
    dragText.textContent = 'Drag & Drop';
});

// when file is dropped
dropArea.addEventListener('drop', (event) => {
    event.preventDefault();
    file = event.dataTransfer.files[0];
    displayFile();
});

//when img is clicked
preview_area.addEventListener("click", () => {
  input.click();
});

function displayFile() {
    let fileType = file.type;
    let validExtensions = ['image/jpeg', 'image/jpg', 'image/png'];
    if (validExtensions.includes(fileType)) {
        let fileReader = new FileReader();
        fileReader.onload = () => {
            fileURL = fileReader.result;
            var image = new Image();
            image.src = fileURL;
            //let imgTag = `<img src="${fileURL}" alt="">`;
            preview_area.innerHTML = "";
   
              preview_area.appendChild(image)
              
              dropText.forEach(function(element) {
                  element.style.display = "none";
            });
        };
        fileReader.readAsDataURL(file);
    } else {
        alert('This is not an Image File');
        dropArea.classList.remove('active');
    }
}

button.onclick = () => {
    input.click();
};
// when browse
input.addEventListener('change', function () {	    
    file = this.files[0]
    dropArea.classList += ' active';
    displayFile();
});

publish_btn.addEventListener("click", function() {
    submitForm();
});

gen_btn.onclick = () => {
    input_container.style.display = 'flex';
    //preview_area.innerHTML = "";
    document.getElementById('genHide').style.display = "none";
        dropText.forEach(function(element) {
                  element.style.display = "none";
            });
};

gen_start_btn.onclick = () => {
    loader.style.display = "block";
    const xhttp = new XMLHttpRequest();
    xhttp.onload = function() {
        if (this.responseText.includes(",")) {
            esttime = this.responseText.split(";")[1];
            res_str = this.responseText.split(";")[0];
            dropArea.innerHTML += `<span class="gen" id="estTimeLabel"><br>estimated time:${esttime}</span>`;
            if (esttime.startsWith(" 1")) {
                interval = setInterval(getImage, 5000);
            } else {
                interval = setInterval(getImage, 10000);
            }
        };
    }
    var field = document.createElement('input');
    field.setAttribute("type", "hidden");
    field.setAttribute("name", "prompt");
    field.setAttribute("value", prompt_input.value);
    document.getElementById('form').appendChild(field);

    xhttp.open("GET", "generateimg/" + prompt_input.value.replaceAll(" ", "+"));
    xhttp.send();

    function getImage() {
        xhttp.onload = function() {
            if (this.responseText.includes("error")) {
                //pass
            } else {
                result = this.responseText;
                clearInterval(interval);
                const image = new Image();
            
                toDataURL(result.split(",")[0], function(dataURL){
                    image.src = dataURL;
                    add_img(image);
                });
        }
        }
        xhttp.open("GET", "getgeneratedimg/" + res_str);
        xhttp.send();
    }
};
};

function toDataURL(url, callback){
    var xhr = new XMLHttpRequest();
    xhr.open('get', url);
    xhr.responseType = 'blob';
    xhr.onload = function(){
      var fr = new FileReader();
    
      fr.onload = function(){
        callback(this.result);
      };
    
      fr.readAsDataURL(xhr.response); // async call
    };
    
    xhr.send();
}

function dataURLtoBlob(dataURL) {
    var arr = dataURL.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
}

function add_img(image) {
    console.log("Image loaded successfully");
    clearInterval(interval);
    loader.style.display = "none";
    document.getElementById('estTimeLabel').style.display = "none";
    document.getElementById('preview').appendChild(image);
    var blob = dataURLtoBlob(image.src);
    var file = new File([blob], 'bild.png', { type: blob.type });
    var dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);
    document.getElementById('imgInput').files = dataTransfer.files;
};

const tag_list = [];
function add_tag(element) {
    if(event.key === 'Enter') {
    	var desired = element.value.toLowerCase().replace(/[^\w]/gi, '');
    	if (desired != "" && desired.length >= 3 && desired.length <= 10) {
            var tag = document.createElement('button');
            tag.className = 'tag';
            tag.innerHTML = desired;
            tag.onclick = function(){remove_tag(tag)};
            
            tag_list.push(tag.innerHTML);
            
            document.getElementById('tag-area').appendChild(tag);
            element.value = "";
            element.style.border = "2px solid #00ccff";
        } else {
        	element.style.border = "2px solid #ff0000";
        };
    };
};
function remove_tag(element) {
    document.getElementById('tag-area').removeChild(element);
    var index = tag_list.indexOf(element.innerHTML);
    tag_list.splice(index, 1); 
};
function focus_tag() {
    input = document.getElementById("tag_input");
    input.focus();
};

function submitForm() {
    var field = document.createElement('input');
    field.setAttribute("type", "hidden");
    field.setAttribute("name", "tags");
    field.setAttribute("value", tag_list.toString());
    
    document.getElementById('form').appendChild(field);
    document.getElementById('form').submit();
}
