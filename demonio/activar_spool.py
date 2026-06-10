 ## activar_spool.py

#!/usr/bin/env python2
import subprocess
import os

printer = os.environ.get('PRINTER_1', 'Brother_4520_1')

subprocess.call(["sudo", "cupsenable", printer])
print("Spool activado")