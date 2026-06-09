 ## activar_spool.py

#!/usr/bin/env python2
import subprocess

printer = "Brother_4520_1"   # cámbiala por la tuya

subprocess.call(["sudo", "cupsenable", printer])
print("Spool activado")