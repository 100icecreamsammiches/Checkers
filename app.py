from flask import Flask, render_template, url_for

app = Flask(__name__)

@app.route("/")
def main():
    return render_template("index.html")

async def init():
    app.run(debug=True)

if __name__ == "__main__":
    init()