# Définition des paramètres
$ip = "172.30.10.100"  # Remplace par l'IP de ton contrôleur
$port = 6101

# Chemins des fichiers binaires pour les commandes start et stop
$startCmdFile = "C:\Users\admin\Documents\LED\Nouvelles-commandes\Start_Stop\Start.bin"  # Remplace par le chemin de ton fichier start.bin
$stopCmdFile  = "C:\Users\admin\Documents\LED\Nouvelles-commandes\Start_Stop\Stop.bin"   # Remplace par le chemin de ton fichier stop.bin

# Fichier pour suivre l'état ON/OFF
$statusFile = "$env:TEMP\hd_e62_status.txt"

# Déterminer quelle commande envoyer (toggle ON/OFF)
if (Test-Path $statusFile) {
    $commandFile = $stopCmdFile
    Remove-Item $statusFile -Force
} else {
    $commandFile = $startCmdFile
    New-Item -Path $statusFile -ItemType File -Force | Out-Null
}

# Vérifier si le fichier existe
if (-Not (Test-Path $commandFile)) {
    Write-Host "Erreur : Le fichier de commande $commandFile est introuvable."
    Exit
}

# Lire le fichier binaire
$bytes = [System.IO.File]::ReadAllBytes($commandFile)

# Vérification que la lecture a réussi
if ($bytes.Length -eq 0) {
    Write-Host "Erreur : Impossible de lire le fichier binaire."
    Exit
}

# Envoi de la commande en UDP
$udpClient = New-Object System.Net.Sockets.UdpClient
$udpClient.Connect($ip, $port)
$udpClient.Send($bytes, $bytes.Length) | Out-Null
$udpClient.Close()

Write-Host "Commande envoyée avec succès."
