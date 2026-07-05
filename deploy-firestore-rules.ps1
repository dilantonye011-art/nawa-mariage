# ============================================
# DÉPLOIEMENT DES RÈGLES FIRESTORE
# ============================================
# IMPORTANT : Exécute ce script dans PowerShell
# Nécessite Firebase CLI installé : npm install -g firebase-tools
# ============================================

Write-Host "🚀 Déploiement des règles Firestore..." -ForegroundColor Cyan

# Se connecter à Firebase (si pas déjà fait)
# firebase login

# Déployer les règles
firebase deploy --only firestore:rules

Write-Host "`n✅ RÈGLES DÉPLOYÉES !" -ForegroundColor Green
Write-Host "`n📋 Vérification dans la console Firebase :" -ForegroundColor Cyan
Write-Host "   1. Va sur https://console.firebase.google.com" -ForegroundColor White
Write-Host "   2. Ton projet → Firestore Database → Règles" -ForegroundColor White
Write-Host "   3. Vérifie que les règles sont bien là" -ForegroundColor White
