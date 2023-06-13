from flask import Flask, render_template, request

app = Flask(__name__)

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
