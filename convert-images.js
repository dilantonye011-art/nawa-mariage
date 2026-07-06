const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const axios = require('axios');
const FormData = require('form-data');

// Initialiser Firebase Admin (nécessite un service account)
// const serviceAccount = require('./serviceAccountKey.json');
// initializeApp({ credential: cert(serviceAccount) });
// const db = getFirestore();

const IMGBB_API_KEY = 'YOUR_IMGBB_API_KEY';

async function convertBase64ToImgBB() {
  console.log('🚀 Conversion des images base64 vers ImgBB...');
  
  // Récupérer tous les utilisateurs avec des photos en base64
  // const usersSnapshot = await db.collection('users').get();
  
  // for (const doc of usersSnapshot.docs) {
  //   const user = doc.data();
  //   if (user.photos && user.photos[0] && user.photos[0].startsWith('data:')) {
  //     const base64Data = user.photos[0].split(',')[1];
  //     
  //     // Upload sur ImgBB
  //     const form = new FormData();
  //     form.append('image', base64Data);
  //     
  //     const response = await axios.post(
  //       `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
  //       form,
  //       { headers: form.getHeaders() }
  //     );
  //     
  //     const imageUrl = response.data.data.url;
  //     
  //     // Mettre à jour Firestore
  //     await doc.ref.update({ photos: [imageUrl] });
  //     console.log(`✅ ${user.name} - Image convertie`);
  //   }
  // }
  
  console.log('✅ Conversion terminée !');
}

convertBase64ToImgBB().catch(console.error);
