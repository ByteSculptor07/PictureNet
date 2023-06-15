from flask import Flask, render_template, request, url_for, redirect
from deta import Deta
import random, string

app = Flask(__name__)
deta = Deta()

identity = deta.Base("identity")

@app.route("/")
def index():
    if not identity.get("u"):
        return redirect(url_for("login"))
    else:
        return redirect(url_for("home"))

@app.route("/login", methods=['POST', 'GET'])
def login():
    if request.method == "GET" and not identity.get("u"):
        return render_template("login.html")
    elif identity.get("u"):
        return redirect(url_for("index"))
    else:
        user = request.form["user"]
        id = "".join(random.choices(string.ascii_uppercase + string.ascii_lowercase + string.digits, k=20))
        identity.put({"user": user, "id": id, "tags": []}, "u")
        return "Hello, " + user
    
@app.route("/home")
def home():
    if identity.get("u"):
        return render_template("home.html")
    else:
        return redirect(url_for("index"))
