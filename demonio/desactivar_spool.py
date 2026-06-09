##desactivar_spool.py

#!/usr/bin/env python2
import subprocess

printer = "Brother_4520_1"

subprocess.call(["sudo", "cupsdisable", "-r", "Pausada por el usuario", printer])
print("Spool desactivado")