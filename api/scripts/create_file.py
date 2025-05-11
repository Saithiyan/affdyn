#!/usr/bin/env python
import os

# Chemin du fichier à créer (dans le même dossier que le script)
file_path = os.path.join(os.path.dirname(__file__), "hello.txt")

# Créer le fichier et écrire dedans
with open(file_path, "w") as f:
    f.write("Hello World!")

print(f"Fichier créé : {file_path}")
print(f"Contenu : Hello World!")
