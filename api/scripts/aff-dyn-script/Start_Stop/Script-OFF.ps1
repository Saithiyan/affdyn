$Server = "172.30.10.100"  # Adresse IP du contrôleur HD-E62
$Port = 6101  # Port d'écoute

# Créer un socket UDP
$UdpClient = New-Object System.Net.Sockets.UdpClient
$UdpClient.Connect($Server, $Port)

# Commandes binaires pour ON (start) et OFF (stop)

$stopCommand = [System.IO.File]::ReadAllBytes("C:\Users\admin\OneDrive - sophie-barat.net\Tutos\LED\Nouvelles-commandes\Start_Stop\Stop.bin")    # Remplace par le chemin du fichier binaire pour 'stop'



# Envoyer la commande OFF (stop)
$UdpClient.Send($stopCommand, $stopCommand.Length)
Write-Host "Commande OFF (stop) envoyée"

# Fermer le socket UDP
$UdpClient.Close()