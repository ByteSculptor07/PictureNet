from flask import *
from deta import Deta
import random, string, requests
import hashlib, os, base64
import io

deta = Deta()
app = Flask(__name__)

identity = deta.Base("identity")
img_info = deta.Base("images")
images = deta.Drive("images")

@app.route("/")
def index():
    if not identity.get("u"):
        return redirect(url_for("login"))
    else:
        return redirect(url_for("home"))


@app.route('/favicon.ico')
def favicon():
    return send_from_directory(os.path.join(app.root_path, 'icons'), 'favicon.ico', mimetype='image/vnd.microsoft.icon')


@app.route("/login", methods=['POST', 'GET'])
def login():
    if request.method == "GET" and not identity.get("u"):
        return render_template("login.html", error=None)
    elif identity.get("u"):
        return redirect(url_for("index"))
    else:
        user = request.form["user"]
        if not len(user) >= 3 and len(user) <= 10:
            return render_template("login.html", error="Your username has to be<br>between 3 and 10 characters long.")
        elif not user.isalnum():
            return render_template("login.html", error="Your username can only<br>contain alphanumeric characters.")
        else:
            id = "".join(random.choices(string.ascii_uppercase + string.ascii_lowercase + string.digits, k=20))
            obj = {"user": user, "id": hashlib.sha256(id.encode("utf_8")).hexdigest(), "url": request.url_root}
            r = requests.post(api_url + "adduser", json=obj)
            if "user existing" in r.text:
                return render_template("login.html", error="The username is already existing.")
            elif not "success" in r.text:
                return render_template("login.html", error="An unknown error occurrented:<br>" + r.text)
            else:
                identity.put({"user": user, "id": id, "tags": []}, "u")
                return redirect(url_for("index"))
            
    
@app.route("/home")
def home():
    if identity.get("u"):
        return render_template("home.html")
    else:
        return redirect(url_for("index"))


@app.route("/upload", methods=['POST', 'GET'])
def upload():
    if request.method == "GET" and identity.get("u"):
        return render_template("upload.html")
    elif not identity.get("u"):
        return redirect(url_for("index"))
    else:
        image = request.files.get("uploadedIMG")
        extension = image.filename.split(".")[-1]
        image_data = image.read()
        image_data_encoded = base64.b64encode(image_data).decode("utf-8")
        item = img_info.put({"ext": extension})
        id = item["key"]
        images.put(f"{id}.{extension}", base64.b64decode(image_data_encoded))
        
        url = f"{request.url.scheme}://{request.url.hostname}/view/{id}.{extension}"
        #url= "h"
        tags = request.form["tags"]
        #return f"{id}.{extension}"
        return str(url) + " : " + str(tags)


@app.route("/view/<image>", methods=["GET"])
def view(image):
    img = images.get(image).read()
    return send_file(
        io.BytesIO(img),
        mimetype=f"image/{image.split('.')[1]}",
    )
    
