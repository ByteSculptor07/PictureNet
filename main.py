from flask import Flask, render_template, request

app = Flask(__name__)

@app.route("/login", methods=['POST', 'GET'])
def root():
    if request.method == "GET":
        return render_template("login.html")
    else:
        return request.form