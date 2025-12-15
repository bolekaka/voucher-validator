/**
 * Tujuan file    : Konfigurasi API
 * Bagian utama   : URL Endpoint Google Apps Script
 * Author         : Gemini AI
 * Last modified  : 2023-10-27
 */

// BISA DIUBAH - Ganti dengan URL Deployment Apps Script Anda
const SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbwi-GPN0umvr-aTau50C4ThZ12m6tSngvU7KN5Xiqus6dUZ2vO1Duw550rNeobVO6_xEQ/exec";

// JANGAN DIUBAH - Fungsi Fetch ke Backend
async function postToGoogleSheets(dataObj) {
  try {
    const response = await fetch(SCRIPT_URL, {
      method: "POST",
      body: JSON.stringify(dataObj),
      // mode: 'no-cors' dihindari agar bisa baca response JSON
    });

    // Apps Script redirect perlu ditangani, namun fetch modern biasanya handle follow redirect
    const jsonResponse = await response.json();
    return jsonResponse;
  } catch (error) {
    console.error("Error connecting to script:", error);
    return { result: "error", message: "Gagal terhubung ke server." };
  }
}
