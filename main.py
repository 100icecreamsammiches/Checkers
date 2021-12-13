from flask import Flask, render_template, url_for
from flask_socketio import SocketIO, emit
import json

async_mode = None

full = True

app = Flask(__name__)
socketio = SocketIO(app, async_mode=async_mode)

@app.route("/")
def main():
    return render_template("index.html", sync_mode=socketio.async_mode)

connected = 0

@socketio.event
def joined():
    print("hello")

@socketio.event
def connect():
    print("joined")
    global connected
    connected += 1
    global full
    if full:
        grid = [
	        [1,0,2,0,3,0,4,0],
	        [0,5,0,6,0,7,0,8],
	        [9,0,10,0,11,0,12,0],
	        [0,0,0,0,0,0,0,0],
	        [0,0,0,0,0,0,0,0],
	        [0,13,0,14,0,15,0,16],
	        [17,0,18,0,19,0,20,0],
	        [0,21,0,22,0,23,0,24]
        ]
        event = {"grid": grid, "isRed": True}
        emit("init", json.dumps(event), broadcast=True)
    else:
        emit("fetch", json.dumps({"fetching": "fetching"}), broadcast=True)
    full = not full
    print("someone joined, full? {}, remaining? {}".format(full, connected))

@socketio.event
def turn(json):
    emit("turn", json, broadcast=True)

@socketio.event
def init(data):
    emit("init", data, broadcast=True, include_self=False)

@socketio.event
def win(data):
    emit("win", data, broadcast=True, include_self=False)

@socketio.event
def disconnect():
    global full
    full = not full
    global connected
    connected -= 1
    print("left, full? {}, remaining? {}".format(full, connected))


if __name__ == "__main__":
    socketio.run(app, debug=True, host="0.0.0.0")