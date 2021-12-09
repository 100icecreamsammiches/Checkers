from flask import Flask, render_template, url_for
from flask_socketio import SocketIO, emit, send
import json

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
def recieve(data):
    print("recieved, sending")
    print(data)
    emit(json.dumps(data), broadcast=True)

@socketio.on("json")
def turn(json):
    print("help")
    print(json)
    emit("json", json, broadcast=True)


if __name__ == "__main__":
    app.run(debug=True)