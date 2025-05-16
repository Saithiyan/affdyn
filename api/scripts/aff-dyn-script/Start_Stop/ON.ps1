# Définition des paramètres
$ip = "172.30.10.100"  # Remplace par l'IP de ton contrôleur
$port = 6101
$startCmdFile = "C:\Users\saike\Desktop\pj-srvapi-affichageDynamique\api\scripts\aff-dyn-script\Start_Stop\Start.bin"
$statusFile = "$env:TEMP\hd_e62_status.txt"

# Vérifier si le fichier existe
if (-Not (Test-Path $startCmdFile)) {
    Write-Host "Erreur : Le fichier de commande $startCmdFile est introuvable."
    Exit 1
}

# Lire le fichier binaire
$bytes = [System.IO.File]::ReadAllBytes($startCmdFile)

# Vérifier que la lecture a réussi
if ($bytes.Length -eq 0) {
    Write-Host "Erreur : Impossible de lire le fichier binaire."
    Exit 1
}

# Envoi de la commande en UDP
$udpClient = New-Object System.Net.Sockets.UdpClient
$udpClient.Connect($ip, $port)
$udpClient.Send($bytes, $bytes.Length) | Out-Null
$udpClient.Close()

# Sauvegarder l'état ON
New-Item -Path $statusFile -ItemType File -Force | Out-Null

Write-Host "Commande ON envoyée avec succès."