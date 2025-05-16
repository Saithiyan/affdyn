$Server = "172.30.10.100"  # Adresse IP du contrôleur HD-E62
$Port = 6101  # Port d'écoute

# Créer un socket UDP
$UdpClient = New-Object System.Net.Sockets.UdpClient
$UdpClient.Connect($Server, $Port)

# Commandes binaires pour ON (start) et OFF (stop)
$startCommand = [System.IO.File]::ReadAllBytes("C:\Users\admin\OneDrive - sophie-barat.net\Tutos\LED\Nouvelles-commandes\Start_Stop\Start.bin")  # Remplace par le chemin du fichier binaire pour 'start'


# Envoyer la commande ON (start)
$UdpClient.Send($startCommand, $startCommand.Length)
Write-Host "Commande ON (start) envoyée"


# Fermer le socket UDP
$UdpClient.Close()
