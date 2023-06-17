from flask import Flask, render_template, request, url_for, redirect, flash
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
            identity.put({"user": user, "id": id, "tags": []}, "u")
            return redirect(url_for("index"))
            
    
@app.route("/home")
def home():
    if identity.get("u"):
        return render_template("home.html")
    else:
        return redirect(url_for("index"))
