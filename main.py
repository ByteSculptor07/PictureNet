from flask import Flask, render_template, request

app = Flask(__name__)

@app.route("/login")
def root():
    return render_template("login.html")

@app.route("/adduser", methods=['POST'])
def add_user():
    data = request.fo