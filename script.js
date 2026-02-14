const BASE_URL = "https://rtqi-multiple-kit-remote.vercel.app/kit";

let selectedDevice = null;

/* ---------------- LOAD DEVICES ---------------- */

async function loadDevices() {
  try {
    const res = await fetch(`${BASE_URL}/get-devices`);
    if (!res.ok) return;

    const data = await res.json();
    if (!data.success || !data.devices) return;

    const select = document.getElementById("deviceSelect");

    // 🔥 Save current selected device
    const previousSelection = selectedDevice;

    // Clear dropdown
    select.innerHTML = "";

    if (data.devices.length === 0) {
      select.innerHTML = "<option>No Devices</option>";
      selectedDevice = null;
      return;
    }

    // Add new options
    data.devices.forEach(device => {
      const option = document.createElement("option");
      option.value = device.name;
      option.textContent = device.name;
      select.appendChild(option);
    });

    const deviceNames = data.devices.map(d => d.name);

    // 🔥 Restore previous selection if it still exists
    if (previousSelection && deviceNames.includes(previousSelection)) {
      selectedDevice = previousSelection;
    } else {
      selectedDevice = deviceNames[0];
    }

    select.value = selectedDevice;

  } catch (err) {
    console.error("Device refresh error:", err);
  }
}

/* ---------------- DROPDOWN CHANGE ---------------- */

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("deviceSelect")
    .addEventListener("change", function () {
      selectedDevice = this.value;
      fetchStatus();
    });

  loadDevices();
});

/* ---------------- ADD DEVICE ---------------- */

async function addDevice() {
  const name = document.getElementById("deviceNameInput").value.trim();
  if (!name) return alert("Enter device name");

  try {
    const res = await fetch(`${BASE_URL}/create-device`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name })
    });

    const data = await res.json();
    alert(data.message);

    if (data.success) {
      closeModal();
      document.getElementById("deviceNameInput").value = "";
      loadDevices();
    }
  } catch (err) {
    alert("Error creating device");
    console.error(err);
  }
}

/* ---------------- CONTROL ---------------- */

async function sendControl(action) {
  if (!selectedDevice) {
    alert("Select device first");
    return;
  }

  try {
    const res = await fetch(`${BASE_URL}/update-control`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: selectedDevice,
        control: action
      })
    });

    const data = await res.json();

    if (data.success) {
      alert(`✅ ${action.toUpperCase()} sent to ${selectedDevice}`);
    } else {
      alert(`❌ Failed: ${data.message}`);
    }

  } catch (err) {
    alert("❌ Error sending command");
    console.error(err);
  }
}

/* ---------------- STATUS ---------------- */

async function fetchStatus() {
  if (!selectedDevice) return;

  try {
    const res = await fetch(`${BASE_URL}/get-status?name=${selectedDevice}`);
    const data = await res.json();

    document.getElementById("status").innerText =
      `Status: ${data.status || "Unknown"}`;
  } catch {
    document.getElementById("status").innerText = "Status: Error";
  }
}

/* ---------------- AUTO REFRESH ---------------- */

// Status every 1 second
setInterval(fetchStatus, 1000);

// Device list every 1 second
setInterval(loadDevices, 1000);

/* ---------------- MODAL ---------------- */

function openModal() {
  document.getElementById("modal").style.display = "flex";
}

function closeModal() {
  document.getElementById("modal").style.display = "none";
}