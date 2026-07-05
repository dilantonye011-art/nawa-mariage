# ============================================
# CRÉER UN ADMIN DANS FIRESTORE
# ============================================
# 
# IMPORTANT : Après avoir déployé les règles, tu dois créer un document
# dans la collection "admins" pour pouvoir gérer les vérifications.
#
# Dans la console Firebase :
# 1. Firestore Database → Collection "admins"
# 2. Créer un document avec l'UID de ton compte comme ID
# 3. Ajouter un champ : role = "admin"
#
# Exemple :
# Collection: admins
# Document ID: [ton UID Firebase]
# Fields:
#   - role: "admin" (string)
#   - createdAt: [timestamp]
# ============================================
