# ============================================
# CONVERTIR LES IMAGES BASE64 EN URLS IMGBB
# ============================================
# Ce script lit les utilisateurs avec des photos en base64,
# les upload sur ImgBB, et met à jour Firestore avec les URLs.
# ============================================

Write-Host "🚀 Conversion des images base64 vers ImgBB..." -ForegroundColor Cyan

# Ton API key ImgBB
$IMGBB_API_KEY = "YOUR_IMGBB_API_KEY"

# Lire les utilisateurs depuis Firestore (nécessite firebase-admin ou l'API REST)
# Note: Ce script nécessite d'être adapté selon ta méthode d'accès à Firestore

Write-Host "`n⚠️  INSTRUCTIONS MANUELLES :" -ForegroundColor Yellow
Write-Host "1. Va sur https://api.imgbb.com/ et récupère ta clé API" -ForegroundColor White
Write-Host "2. Pour chaque utilisateur avec une photo base64 :" -ForegroundColor White
Write-Host "   a. Copie la valeur base64" -ForegroundColor White
Write-Host "   b. Va sur https://imgbb.com/ et upload l'image" -ForegroundColor White
Write-Host "   c. Copie l'URL directe de l'image" -ForegroundColor White
Write-Host "   d. Mets à jour le champ 'photos' dans Firestore avec l'URL" -ForegroundColor White
Write-Host "`n💡 Alternative : Utilise le script Node.js ci-dessous" -ForegroundColor Cyan

