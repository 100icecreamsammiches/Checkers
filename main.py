from flask import Flask, render_template, url_for
from flask_socketio import SocketIO, emit, send

app = Flask(__name__)

@app.route("/")
def main():
    return render_template("index.html")
socketio = SocketIO(app)

connected = []

@socketio.on("connect") 
def connect(data):
    print("someone connected")

@socketio.on("message")
def turn(data):
    print(data)
    emit(data, broadcast=True)


if __name__ == "__main__":
    app.run(debug=True)