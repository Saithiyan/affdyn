# Script PowerShell : Envoi UDP en broadcast de tous les fichiers .bin d'un dossier

$BroadcastAddress = "172.30.10.255"  # Adresse broadcast sur le réseau du contrôleur
$Port = 6101  # Port d'écoute

# Créer un socket UDP (Broadcast)
$UdpClient = New-Object System.Net.Sockets.UdpClient
$UdpClient.EnableBroadcast = $true
$UdpClient.Connect($BroadcastAddress, $Port)

# Dossier contenant les paquets
$Folder = "./paquets"
$Files = Get-ChildItem -Path $Folder -Filter "*.bin" | Sort-Object Name

Write-Host "Nombre de paquets à envoyer en broadcast : $($Files.Count)"

foreach ($File in $Files) {
    $FilePath = $File.FullName
    if (Test-Path $FilePath) {
        # Lire le fichier en binaire
        $Bytes = [System.IO.File]::ReadAllBytes($FilePath)
        # Envoyer les données en broadcast
        $UdpClient.Send($Bytes, $Bytes.Length)
        Write-Host "✅ Paquet envoyé (broadcast) : $($File.Name) - Taille : $($Bytes.Length) octets"
        Start-Sleep -Milliseconds 100  # Pause optionnelle
    } else {
        Write-Host "❌ Erreur : fichier introuvable -> $FilePath"
    }
}

# Fermer le socket UDP
$UdpClient.Close()
