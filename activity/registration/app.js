const form = document.querySelector("#registrationForm");
const submitButton = document.querySelector("#submitButton");
const statusBox = document.querySelector("#formStatus");
const otherInput = document.querySelector("#sourceOther");

function showError(name, message) {
  const target = document.querySelector(`[data-error-for="${name}"]`);
  if (target) target.textContent = message;
  const input = document.querySelector(`#${name}`);
  if (input) input.classList.toggle("invalid", Boolean(message));
}

function clearErrors() {
  document.querySelectorAll(".field-error").forEach((el) => { el.textContent = ""; });
  document.querySelectorAll(".invalid").forEach((el) => el.classList.remove("invalid"));
  statusBox.className = "status";
  statusBox.textContent = "";
}

function validate() {
  let valid = true;
  const required = [
    ["email", "請輸入有效的電子郵件地址。"],
    ["name", "請輸入姓名。"],
    ["phone", "請輸入聯絡電話或手機。"],
    ["organization", "請輸入服務單位名稱。"],
    ["jobTitle", "請輸入職稱。"]
  ];
  required.forEach(([id, message]) => {
    const el = document.querySelector(`#${id}`);
    if (!el.value.trim() || (id === "email" && !el.validity.valid)) {
      showError(id, message); valid = false;
    }
  });
  if (!document.querySelector("#consent").checked) { showError("consent", "須同意個人資訊使用聲明才能完成報名。"); valid = false; }
  const source = document.querySelector('input[name="source"]:checked');
  if (!source) { showError("source", "請選擇一項得知活動的管道。"); valid = false; }
  else if (source.value === "其他" && !otherInput.value.trim()) { showError("source", "請填寫其他得知管道。"); valid = false; }
  return valid;
}

document.querySelectorAll('input[name="source"]').forEach((radio) => {
  radio.addEventListener("change", () => {
    otherInput.disabled = radio.value !== "其他" || !radio.checked;
    if (!otherInput.disabled) otherInput.focus();
  });
});
otherInput.disabled = true;

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  clearErrors();
  if (!validate()) {
    document.querySelector(".field-error:not(:empty)")?.scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }

  const apiUrl = window.REGISTRATION_CONFIG?.API_URL || "";
  if (!apiUrl.startsWith("https://script.google.com/")) {
    statusBox.className = "status error";
    statusBox.textContent = "網站尚未完成後端設定，請聯絡主辦單位。";
    return;
  }

  const data = new FormData(form);
  const selectedSource = data.get("source");
  const payload = {
    email: String(data.get("email") || "").trim(),
    consent: "同意",
    name: String(data.get("name") || "").trim(),
    phone: String(data.get("phone") || "").trim(),
    organization: String(data.get("organization") || "").trim(),
    jobTitle: String(data.get("jobTitle") || "").trim(),
    source: selectedSource === "其他" ? `其他：${otherInput.value.trim()}` : selectedSource,
    website: String(data.get("website") || "")
  };

  submitButton.disabled = true;
  submitButton.classList.add("loading");
  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload),
      redirect: "follow"
    });
    const result = await response.json();
    if (!response.ok || !result.ok) throw new Error(result.message || "送出失敗");
    form.reset();
    otherInput.disabled = true;
    statusBox.className = "status success";
    statusBox.textContent = "報名成功！我們已收到您的資料。";
    statusBox.scrollIntoView({ behavior: "smooth", block: "center" });
  } catch (error) {
    statusBox.className = "status error";
    statusBox.textContent = "目前無法送出報名資料，請稍後再試或聯絡主辦單位。";
  } finally {
    submitButton.disabled = false;
    submitButton.classList.remove("loading");
  }
});
