var count = 1;
var oldContentHeight = 0;
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
	var bottom =  contentHeight - 10 <= scrollTop;
        if (bottom || firstload) {
            firstload = false;
	    const xhttp = new XMLHttpRequest();
            xhttp.onload = function() {
                count ++;
		if (this.responseText.includes(";")) {
		    var urllist = this.responseText.split(";");
		    var loop_count = urllist.length;
		    for(var i = 0; i < loop_count; i++) {
		        var item = urllist[i].split(",")[0];
                        var likes = urllist[i].split(",")[1];
			var prompt = urllist[i].split(",")[2];
			var liked = urllist[i].split(",")[3];
			    
		        var imgcon = document.createElement('div');
                        var heartcon = document.createElement('div');
                        var heartcen = document.createElement('div');
			var aicon = document.createElement('div');
                        var heartbtn = document.createElement('button');
                        var heartico = document.createElement('i');
                        var heartcou = document.createElement('p');
            
                        imgcon.className = 'img-container';
                        heartcon.className = 'heart-container';
                        heartcen.className = 'center-div';
                        heartbtn.className = 'heart-button';
			aicon.className = 'ai-container';
			aicon.innerHTML = "ai";
			if (liked == "0") {
                            heartico.className = 'ph-bold ph-heart-straight heart';
			} else {
			    heartico.className = 'ph-fill ph-heart-straight heart';
			};
                        heartcou.className = 'counter';
            
                        heartbtn.setAttribute("onclick", "heart_click(this)");
                        heartcou.innerHTML = likes;
		        imgcon.style.backgroundImage = "url('" + item + "')";
                    
                        heartbtn.appendChild(heartico);
                        heartbtn.appendChild(heartcou);
                        heartcen.appendChild(heartbtn);
                        heartcon.appendChild(heartcen);
                        imgcon.appendChild(heartcon);
			if (prompt != "") {
			    imgcon.appendChild(aicon);
			}
            
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
