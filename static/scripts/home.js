var count = 1;
var firstload = true;
function heart_click(element) {
	var heart = element.firstChild;
	var counter = element.lastChild;
	var counter_num = counter.innerHTML;
    var img_url = element.parentElement.parentElement.parentElement.style.backgroundImage.slice(5, -2);
	if (heart.className == "ph-bold ph-heart-straight heart") {
	    heart.className = "ph-fill ph-heart-straight heart";
	    if (!Number.isNaN(counter_num)) {
	        counter.innerHTML = Number(counter_num) + 1;
		    const xhttp = new XMLHttpRequest();
		    xhttp.open("POST", "like");
            xhttp.send(img_url);
	    }
	} else {
		heart.className = "ph-bold ph-heart-straight heart";
		if (!Number.isNaN(counter_num)) {
		    counter.innerHTML = Number(counter_num) - 1;
            const xhttp = new XMLHttpRequest();
		    xhttp.open("POST", "unlike");
            xhttp.send(img_url);
		}
	};
};
window.onload = function() {
    document.getElementById('content').addEventListener('scroll', addpage);
    function addpage() {
        var scrollTop = document.getElementById('content').scrollTop;
        var scrollHeight = document.getElementById('content').scrollHeight;
        var offsetHeight = document.getElementById('content').offsetHeight;
        var contentHeight = scrollHeight - offsetHeight;
        if (contentHeight - contentHeight / 3 <= scrollTop || firstload) {
            firstload = false;
	    const xhttp = new XMLHttpRequest();
            xhttp.onload = function() {
		var urllist = this.responseText.split(",");
		var loop_count = urllist.length;
        //alert(loop_count)
		if (loop_count > 1) {
		    for(var i = 0; i < loop_count; i++) {
                count += 1;
		        var item = urllist[i];
		        //alert(item);
		        var imgcon = document.createElement('div');
                        var heartcon = document.createElement('div');
                        var heartcen = document.createElement('div');
                        var heartbtn = document.createElement('button');
                        var heartico = document.createElement('i');
                        var heartcou = document.createElement('p');
            
                        imgcon.className = 'img-container';
                        heartcon.className = 'heart-container';
                        heartcen.className = 'center-div';
                        heartbtn.className = 'heart-button';
                        heartico.className = 'ph-bold ph-heart-straight heart';
                        heartcou.className = 'counter';
            
                        heartbtn.setAttribute("onclick", "heart_click(this)");
                        heartcou.innerHTML = "99";
		        imgcon.style.backgroundImage = "url('" + item + "')";
                    
                        heartbtn.appendChild(heartico);
                        heartbtn.appendChild(heartcou);
                        heartcen.appendChild(heartbtn);
                        heartcon.appendChild(heartcen);
                        imgcon.appendChild(heartcon);
            
                        //imgcon.innerHTML += count;
                        document.getElementById('content').appendChild(imgcon);
		    }
	        }
            }
            xhttp.open("GET", "getimg/" + count.toString());
            xhttp.send();
        }
    }
    addpage()
};
