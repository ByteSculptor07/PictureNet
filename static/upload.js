window.onload = function() {
const dropArea = document.querySelector('.drag-area');
const dragText = document.querySelector('.header');
let button = dropArea.querySelector('.button');
let input = dropArea.querySelector('input');
let publish_btn = document.getElementById("publish");
var upload_form = document.getElementById('form');
var preview_area = document.getElementById('preview');
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
            let imgTag = `<img src="${fileURL}" alt="">`;
            preview_area.innerHTML = imgTag;
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
    var field = document.createElement('input');
    field.setAttribute("type", "hidden");
    field.setAttribute("name", "tags");
    field.setAttribute("value", tag_list.toString());
    
    upload_form.appendChild(field);
    upload_form.submit();
});
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
