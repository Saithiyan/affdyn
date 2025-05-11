# Chemin du fichier à supprimer (dans le même dossier que le script)
$scriptPath = $PSScriptRoot
$filePath = Join-Path $scriptPath "hello.txt"

# Vérifier si le fichier existe
if (Test-Path $filePath) {
    # Supprimer le fichier
    Remove-Item $filePath
    Write-Output "Le fichier $filePath a été supprimé avec succès"
} else {
    Write-Output "Le fichier $filePath n'existe pas"
}
