from flask import Flask, render_template, request
from deta import Deta

app = Flask(__name__)
deta = Deta()

identity = deta.Base("identity")

@app.route("/"):
def index():
    if not identity.get("u"):
        return redirect(url_for("login"))
    else:
        return redirect(url_for("home"))

@app.route("/login", methods=['POST', 'GET'])
def login():
    if request.method == "GET":
        return render_template("login.html")
    else:
        user = request.form["user"]
        return "Hello, " + user
    
@app.route("/home")
def home():
    return render_template("home.html")
