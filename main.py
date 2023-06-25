from flask import Flask, render_template, request, url_for, redirect, flash, send_file, jsonify
from deta import Deta
import random, string, requests
import hashlib, os, base64

deta = Deta()
app = Flask(__name__)

identity = deta.Base("identity")
img_drive = deta.Drive("imgs")
cdn = deta.Base("images")
images = deta.Drive("images")

@app.route("/")
def index():
    if not identity.get("u"):
        return redirect(url_for("login"))
    else:
        return redirect(url_for("home"))

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
        item = cdn.put(
            {
                "ext": extension,
                "visibility": True,
                "embed": [{"title": "", "colour": "000000"}],
            },
        )
        id = item["key"]
        images.put(f"{id}.{extension}", base64.b64decode(image_data_encoded))
        url = f"{request.scheme}://{request.host}/cdn/{id}.{extension}"
        return jsonify({"image": url, "id": id})


@app.route("/view/<img>")
def view(img):
    response = img_drive.get(img + ".txt")
    content = response.read()
    ii = base64.b64decode(content).decode("utf-8")
    return render_template('img.html', image_data=ii)

@app.route("/cdn/<image>", methods=["GET"])
def image_cdn(image):
    img = images.get(image).read()
    #return image + ": " + str(img)
    
    
    return send_file(
        img,
        mimetype=f"image/{image.split('.')[1]}",
    )
    
