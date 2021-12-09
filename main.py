from flask import Flask, render_template, url_for
from flask_socketio import SocketIO, emit, send
import json


full = False

app = Flask(__name__)

@app.route("/")
def main():
    return render_template("index.html")
socketio = SocketIO(app)

connected = []

@socketio.on("connect") 
def connect(data):
    global full
    if not full:
        grid = [
	        [1,0,2,0,3,0,4,0],
	        [0,5,0,6,0,7,0,8],
	        [9,0,10,0,11,0,12,0],
	        [0,0,0,0,0,0,0,0],
	        [0,0,0,0,0,0,16,0],
	        [0,13,0,14,0,15,0,0],
	        [17,0,18,0,19,0,20,0],
	        [0,21,0,22,0,23,0,24]
        ]
        event = {"grid": grid, "isRed": True}
        emit("init", json.dumps(event), broadcast=True)
    else:
        emit("fetch", "fetching", broadcast=True)
    full = not full
    print("someone joined, full?{}".format(full))

@socketio.on("turn")
def turn(json):
    print("help")
    print(json)
    emit("turn", json, broadcast=True)

@socketio.on("init")
def init(data):
    print("sent init")
    emit("init", data, broadcast=True)

@socketio.on("disconnect")
def disconnect():
    global full
    full = not full
    print("left, full? {}".format(full))


if __name__ == "__main__":
    app.run(debug=True)