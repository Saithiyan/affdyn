$Server = "172.30.10.100"  # Adresse IP du contrôleur HD-E62
$Port = 6101  # Port d'écoute

# Créer un socket UDP
$UdpClient = New-Object System.Net.Sockets.UdpClient
$UdpClient.Connect($Server, $Port)

# Dossier contenant les paquets
$Folder = "api/scripts/aff-dyn-script/2_EPS_6-5/paquets"
$Files = Get-ChildItem -Path $Folder -Filter "*.bin" | Sort-Object Name

Write-Output "Nombre de paquets à envoyer : $($Files.Count)"

foreach ($File in $Files) {
    $FilePath = $File.FullName
    if (Test-Path $FilePath) {
        # Lire le fichier en binaire
        $Bytes = [System.IO.File]::ReadAllBytes($FilePath)
        
        # Envoyer les données au contrôleur
        $UdpClient.Send($Bytes, $Bytes.Length)
        Write-Output "✅ Paquet envoyé : $($File.Name) - Taille : $($Bytes.Length) octets"

        # Pause optionnelle si nécessaire
        Start-Sleep -Milliseconds 100  # Ajuster selon le besoin
    } else {
        Write-Output "❌ Erreur : fichier introuvable -> $FilePath"
    }
}

# Fermer le socket UDP
Write-Output "[Script terminé] EPS 6/5ème"
$UdpClient.Close()