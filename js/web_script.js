/**
 * Tujuan file    : Logika Frontend & Interaksi User
 * Bagian utama   : Validasi, Deteksi IP/OS, Handle Submit
 * Author         : Gemini AI
 * Last modified  : 2023-10-27
 */

// Global Variables untuk menyimpan info sistem
let userIP = "loading...";
let userOS = "Unknown OS";

document.addEventListener("DOMContentLoaded", function () {
  // 1. Deteksi Sistem Operasi [cite: 160]
  detectOS();

  // 2. Deteksi IP Address [cite: 160]
  getIP();

  // 3. Dropdown Color Logic (Abu-abu ke Hitam) [cite: 161]
  const selects = document.querySelectorAll("select");
  selects.forEach((select) => {
    // Initial check
    if (select.value === "") select.classList.add("empty");

    select.addEventListener("change", function () {
      if (this.value !== "") {
        this.classList.remove("empty");
        this.style.color = "black";
      } else {
        this.classList.add("empty");
      }
    });
  });

  // 4. Form Submission Handler
  const form = document.getElementById("voucherForm");
  form.addEventListener("submit", handleFormSubmit);
});

// Fungsi deteksi OS sederhana [cite: 33]
function detectOS() {
  let userAgent = window.navigator.userAgent;
  if (userAgent.indexOf("Win") != -1) userOS = "Windows";
  else if (userAgent.indexOf("Mac") != -1) userOS = "MacOS";
  else if (userAgent.indexOf("Linux") != -1) userOS = "Linux";
  else if (userAgent.indexOf("Android") != -1) userOS = "Android";
  else if (userAgent.indexOf("like Mac") != -1) userOS = "iOS";
}

// Fungsi ambil IP via API publik [cite: 35]
async function getIP() {
  try {
    const response = await fetch("https://api.ipify.org?format=json");
    const data = await response.json();
    userIP = data.ip;
  } catch (e) {
    userIP = "Failed to detect";
    console.log("IP Detect Failed");
  }
}

async function handleFormSubmit(e) {
  e.preventDefault();

  // UI Loading [cite: 156]
  const submitBtn = document.getElementById("submitBtn");
  const loadingDiv = document.getElementById("loading");
  submitBtn.disabled = true;
  submitBtn.innerText = "Processing...";
  loadingDiv.style.display = "block";

  // Collect Data
  const formData = {
    nama: document.getElementById("nama").value,
    domisili: document.getElementById("domisili").value,
    telepon: "'" + document.getElementById("telepon").value, // Tambah kutip agar format di sheet string
    outlet: document.getElementById("outlet").value,
    platform: document.getElementById("platform").value,
    kode_voucher: document.getElementById("kode_voucher").value,
    system: userOS,
    ip_address: userIP,
  };

  // Kirim ke Google Apps Script
  const response = await postToGoogleSheets(formData);

  // Stop Loading
  loadingDiv.style.display = "none";
  submitBtn.disabled = false;
  submitBtn.innerText = "KIRIM DATA";

  // REVISI: Logic menampilkan pesan Text (bukan Alert)
  const msgBox = document.getElementById("responseMessage");

  // Set teks pesan dari respon server
  msgBox.innerText = response.message;

  // Cek status result
  if (response.result === "success") {
    // Beri warna hijau
    msgBox.className = "msg-success";

    // Reset form
    document.getElementById("voucherForm").reset();

    // Reset dropdown styling
    document.querySelectorAll("select").forEach((sel) => {
      sel.classList.add("empty");
      sel.style.color = "";
    });
  } else {
    // Beri warna merah (jika error/salah/sudah dipakai)
    msgBox.className = "msg-error";
  }
  // --- REVISI BARU: TIMER 3 DETIK ---
  // Hapus pesan & warna otomatis setelah 3000ms (3 detik)
  setTimeout(function () {
    msgBox.innerText = ""; // Kosongkan teks
    msgBox.className = ""; // Hapus class warna
  }, 3000);
  // ----------------------------------
}
