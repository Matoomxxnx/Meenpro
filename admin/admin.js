const USER = "admin";
const PASS = "1234";

// ตรวจสอบ login
function checkAuth() {
  if (!localStorage.getItem("adminLogin")) {
    window.location.href = "login.html";
  }
}

// login
function login() {
  const u = document.getElementById("username").value;
  const p = document.getElementById("password").value;

  if (u === USER && p === PASS) {
    localStorage.setItem("adminLogin", true);
    window.location.href = "index.html";
  } else {
    document.getElementById("error").innerText = "ข้อมูลไม่ถูกต้อง";
  }
}

// logout
function logout() {
  localStorage.removeItem("adminLogin");
  window.location.href = "login.html";
}

// โหลดสมาชิก
async function loadMembers() {
  checkAuth();
  const res = await fetch("members.json");
  const data = await res.json();
  displayMembers(data);
}

function displayMembers(data) {
  const table = document.getElementById("memberTable");
  table.innerHTML = "";
  data.forEach(m => {
    table.innerHTML += `
      <tr>
        <td>${m.id}</td>
        <td>${m.name}</td>
        <td>${m.phone}</td>
        <td><button onclick="alert('ลบได้เมื่อมี backend')">ลบ</button></td>
      </tr>
    `;
  });
}

function searchMembers() {
  const keyword = document.getElementById("search").value.toLowerCase();
  fetch("members.json")
    .then(res => res.json())
    .then(data => {
      const filtered = data.filter(m => m.name.toLowerCase().includes(keyword));
      displayMembers(filtered);
    });
}

if (window.location.pathname.includes("members.html")) {
  loadMembers();
}