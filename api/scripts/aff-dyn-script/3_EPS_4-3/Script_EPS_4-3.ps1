$Server = "172.30.10.100"  # Adresse IP du contrôleur HD-E62
$Port = 6101  # Port d'écoute

# Créer un socket UDP
$UdpClient = New-Object System.Net.Sockets.UdpClient
$UdpClient.Connect($Server, $Port)

# Dossier contenant les paquets
$Folder = "C:\Users\saike\Desktop\pj-srvapi-affichageDynamique\api\scripts\aff-dyn-script\3_EPS_4-3\paquets"
$Files = Get-ChildItem -Path $Folder -Filter "*.bin" | Sort-Object Name

Write-Host "Nombre de paquets à envoyer : $($Files.Count)"

foreach ($File in $Files) {
    $FilePath = $File.FullName
    if (Test-Path $FilePath) {
        # Lire le fichier en binaire
        $Bytes = [System.IO.File]::ReadAllBytes($FilePath)
        
        # Envoyer les données au contrôleur
        $UdpClient.Send($Bytes, $Bytes.Length)
        Write-Host "✅ Paquet envoyé : $($File.Name) - Taille : $($Bytes.Length) octets"

        # Pause optionnelle si nécessaire
        Start-Sleep -Milliseconds 100  # Ajuster selon le besoin
    } else {
        Write-Host "❌ Erreur : fichier introuvable -> $FilePath"
    }
}

# Fermer le socket UDP
Write-Output "[Script terminé] EPS 4/3ème"
$UdpClient.Close()