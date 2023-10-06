import os
import threading
import signal
import time
import subprocess

current_dir = os.getcwd()
frontend_server_thread1 = None
backend_server_thread2 = None
# Define a signal handler function to kill the thread on CTRL+C
def signal_handler(signal, frame):
    print("Stopping thread...")
    global frontend_server_thread1
    global backend_server_thread2
    frontend_server_thread1.cancel()
    backend_server_thread2.cancel()

def localfrontend():

    os.system('npx kill-port 8001')
    print("add execution flag ")
    os.system('chmod u+x frontendlocal.command')

    
    cmd = f'./frontendlocal.command {current_dir}'
    frontend_server = lambda:  subprocess.Popen(cmd, shell=True)
    global frontend_server_thread1
    frontend_server_thread1 = threading.Thread(target=frontend_server)
    frontend_server_thread1.start()
    

def localbackend():

    os.system('npx kill-port 8000')
    os.system('chmod u+x backendlocal.command')
    cmd = f'./backendlocal.command {current_dir}'
    backend_server = lambda: subprocess.Popen(cmd, shell=True)
    global backend_server_thread2
    backend_server_thread2 = threading.Thread(target=backend_server)
    print("starting backend")
    backend_server_thread2.start()




# Wait for the thread to finish
signal.signal(signal.SIGINT, signal_handler)

localbackend()
localfrontend()
