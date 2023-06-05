from flask import Flask, render_tamplate

app = flask(__name__)

@app.route("/login")
def login():
  return render_template("src/login.html")
