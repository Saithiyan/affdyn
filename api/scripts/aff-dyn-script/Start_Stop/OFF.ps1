# Définition des paramètres
$ip = "172.30.10.100"  # Remplace par l'IP de ton contrôleur
$port = 6101
$stopCmdFile = "C:\Users\saike\Desktop\pj-srvapi-affichageDynamique\api\scripts\aff-dyn-script\Start_Stop\Stop.bin"
$statusFile = "$env:TEMP\hd_e62_status.txt"

# Vérifier si le fichier existe
if (-Not (Test-Path $stopCmdFile)) {
    Write-Host "Erreur : Le fichier de commande $stopCmdFile est introuvable."
    Exit 1
}

# Lire le fichier binaire
$bytes = [System.IO.File]::ReadAllBytes($stopCmdFile)

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

# Supprimer l'état ON (indique que l'écran est éteint)
Remove-Item -Path $statusFile -Force -ErrorAction SilentlyContinue

Write-Host "Commande OFF envoyée avec succès."