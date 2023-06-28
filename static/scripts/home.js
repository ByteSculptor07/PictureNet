var count = 1;
function heart_click(element) {
	var heart = element.firstChild;
	var counter = element.lastChild;
	var counter_num = counter.innerHTML;
	if (heart.className == "ph-bold ph-heart-straight heart") {
	    heart.className = "ph-fill ph-heart-straight heart";
	    if (!Number.isNaN(counter_num)) {
	        counter.innerHTML = Number(counter_num) + 1;
	    }
	} else {
		heart.className = "ph-bold ph-heart-straight heart";
		if (!Number.isNaN(counter_num)) {
		    counter.innerHTML = Number(counter_num) - 1;
		}
	};
};
window.onload = function() {
document.getElementById('content').addEventListener('scroll',
    function() {
        var scrollTop = document.getElementById('content').scrollTop;
        var scrollHeight = document.getElementById('content').scrollHeight;
        var offsetHeight = document.getElementById('content').offsetHeight;
        var contentHeight = scrollHeight - offsetHeight;
        if (contentHeight - 10 - contentHeight / 3 <= scrollTop) {
	    const xhttp = new XMLHttpRequest();
            xhttp.onload = function() {
                //document.getElementById("content").innerHTML = this.responseText;
		var urllist = this.responseText.split(",");
		var loop_count = urllist.length;
		if loop_count > 0 {
		    for(var i = 0; i < loop_count; i++) {
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
	    xhttp.setRequestHeader("Access-Control-Allow-Origin", "*");
            xhttp.send();
	    count += 1;
        }
    }, false
)
};
