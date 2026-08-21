from flask import Flask, render_template, url_for

app = Flask(__name__)

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/mapa")
def visor_mapa():
    return render_template("mapa.html")

if __name__ == "__main__":
    app.run(debug=True)