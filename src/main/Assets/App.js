/* =========================================================
   PETCARE
   Login + Pet Profile + Reminders + Snooze + Theme
   ========================================================= */


/* ================= DATA ================= */

let userData =
    JSON.parse(localStorage.getItem("petCareUser")) || null;

let petData =
    JSON.parse(localStorage.getItem("petData")) || {
        name: "",
        species: "Bird",
        dob: "",
        photo: ""
    };

let reminders =
    JSON.parse(localStorage.getItem("petCareReminders")) || [];

let loggedIn =
    localStorage.getItem("petCareLoggedIn") === "true";


/* ================= START ================= */

document.addEventListener("DOMContentLoaded", () => {

    loadTheme();

    setToday();

    loadPet();

    renderReminders();

    if (loggedIn && userData) {
        showApp();
    } else {
        showAuth();
    }

});


/* ================= AUTH ================= */

function showAuth() {

    document
        .getElementById("authScreen")
        .classList.remove("hidden");

    document
        .getElementById("app")
        .classList.add("hidden");
}


function showApp() {

    document
        .getElementById("authScreen")
        .classList.add("hidden");

    document
        .getElementById("app")
        .classList.remove("hidden");

    updateUser();

}


function showSignup() {

    document
        .getElementById("loginBox")
        .classList.add("hidden");

    document
        .getElementById("signupBox")
        .classList.remove("hidden");

    clearMessage();

}


function showLogin() {

    document
        .getElementById("signupBox")
        .classList.add("hidden");

    document
        .getElementById("loginBox")
        .classList.remove("hidden");

    clearMessage();

}


function signupUser() {

    const name =
        document
            .getElementById("signupName")
            .value
            .trim();

    const email =
        document
            .getElementById("signupEmail")
            .value
            .trim();

    const password =
        document
            .getElementById("signupPassword")
            .value;


    if (!name || !email || !password) {

        message("Fill all fields.");

        return;
    }


    if (!email.includes("@")) {

        message("Enter a valid email.");

        return;
    }


    if (password.length < 6) {

        message(
            "Password must be at least 6 characters."
        );

        return;
    }


    userData = {
        name,
        email,
        password
    };


    localStorage.setItem(
        "petCareUser",
        JSON.stringify(userData)
    );


    localStorage.setItem(
        "petCareLoggedIn",
        "true"
    );


    loggedIn = true;

    showApp();

}


function loginUser() {

    const email =
        document
            .getElementById("loginEmail")
            .value
            .trim();

    const password =
        document
            .getElementById("loginPassword")
            .value;


    const saved =
        JSON.parse(
            localStorage.getItem("petCareUser")
        );


    if (!saved) {

        message(
            "No account found. Create an account first."
        );

        return;
    }


    if (
        saved.email !== email ||
        saved.password !== password
    ) {

        message(
            "Incorrect email or password."
        );

        return;
    }


    userData = saved;

    loggedIn = true;


    localStorage.setItem(
        "petCareLoggedIn",
        "true"
    );


    showApp();

}


function logoutUser() {

    if (!confirm("Log out from PetCare?")) {
        return;
    }


    localStorage.removeItem(
        "petCareLoggedIn"
    );


    loggedIn = false;

    closeProfile();

    showAuth();

}


function togglePassword(id) {

    const input =
        document.getElementById(id);

    input.type =
        input.type === "password"
            ? "text"
            : "password";

}


function message(text) {

    document
        .getElementById("authMessage")
        .textContent = text;

}


function clearMessage() {

    document
        .getElementById("authMessage")
        .textContent = "";

}


/* ================= USER ================= */

function updateUser() {

    document
        .getElementById("welcomeName")
        .textContent =
        userData?.name || "Pet Parent";

}


/* ================= NAV ================= */

function navigate(page) {

    document
        .querySelectorAll(".page")
        .forEach(p => p.classList.remove("active"));


    const target =
        document.getElementById(page);


    if (target) {
        target.classList.add("active");
    }


    document
        .querySelectorAll(".nav")
        .forEach(n => n.classList.remove("active"));


    const active =
        document.querySelector(
            `.nav[data-page="${page}"]`
        );


    if (active) {
        active.classList.add("active");
    }


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


/* ================= DATE ================= */

function setToday() {

    const today = new Date();

    document
        .getElementById("todayDate")
        .textContent =
        today.toLocaleDateString(
            "en-IN",
            {
                day: "numeric",
                month: "short"
            }
        );

}


/* ================= PET ================= */

function openProfile() {

    document
        .getElementById("profileModal")
        .classList.remove("hidden");


    document
        .getElementById("petNameInput")
        .value = petData.name || "";


    document
        .getElementById("petSpeciesInput")
        .value = petData.species || "";


    document
        .getElementById("petDobInput")
        .value = petData.dob || "";


    updatePhotos();

}


function closeProfile() {

    document
        .getElementById("profileModal")
        .classList.add("hidden");

}


function saveProfile() {

    petData.name =
        document
            .getElementById("petNameInput")
            .value
            .trim();


    petData.species =
        document
            .getElementById("petSpeciesInput")
            .value
            .trim() || "Bird";


    petData.dob =
        document
            .getElementById("petDobInput")
            .value;


    localStorage.setItem(
        "petData",
        JSON.stringify(petData)
    );


    loadPet();

    closeProfile();

}


function loadPet() {

    const saved =
        localStorage.getItem("petData");


    if (saved) {
        petData = JSON.parse(saved);
    }


    const name =
        petData.name || "your pet";


    document
        .getElementById("heroPetName")
        .textContent = name;


    document
        .getElementById("profilePetName")
        .textContent =
        petData.name || "Your Pet";


    document
        .getElementById("profilePetSpecies")
        .textContent =
        petData.species || "Add pet information";


    document
        .getElementById("infoSpecies")
        .textContent =
        petData.species || "—";


    document
        .getElementById("infoDob")
        .textContent =
        petData.dob || "—";


    document
        .getElementById("infoAge")
        .textContent =
        petData.dob
            ? calculateAge(petData.dob)
            : "—";


    updatePhotos();

}


function calculateAge(date) {

    const birth = new Date(date);
    const now = new Date();

    let years =
        now.getFullYear() -
        birth.getFullYear();

    let months =
        now.getMonth() -
        birth.getMonth();

    let days =
        now.getDate() -
        birth.getDate();


    if (days < 0) {

        months--;

        days += new Date(
            now.getFullYear(),
            now.getMonth(),
            0
        ).getDate();

    }


    if (months < 0) {

        years--;

        months += 12;

    }


    if (years > 0) {
        return `${years}y ${months}m`;
    }


    if (months > 0) {
        return `${months}m ${days}d`;
    }


    return `${days}d`;

}


/* ================= PHOTO ================= */

function choosePetPhoto() {

    document
        .getElementById("petPhotoInput")
        .click();

}


function handlePhotoUpload(event) {

    const file =
        event.target.files[0];

    if (!file) return;


    if (!file.type.startsWith("image/")) {

        alert("Select an image.");

        return;
    }


    const reader =
        new FileReader();


    reader.onload = e => {

        petData.photo =
            e.target.result;


        localStorage.setItem(
            "petData",
            JSON.stringify(petData)
        );


        updatePhotos();

    };


    reader.readAsDataURL(file);

}


function removePetPhoto() {

    if (!petData.photo) return;


    if (!confirm("Remove pet photo?")) {
        return;
    }


    petData.photo = "";


    localStorage.setItem(
        "petData",
        JSON.stringify(petData)
    );


    updatePhotos();

}


function updatePhotos() {

    const images = [

        document.getElementById("homePetPhoto"),

        document.getElementById("profilePetPhoto"),

        document.getElementById("modalPetPhoto")

    ];


    const placeholders = [

        document.getElementById("homePetPlaceholder"),

        document.getElementById("profilePetPlaceholder"),

        document.getElementById("modalPetPlaceholder")

    ];


    images.forEach(img => {

        if (!img) return;


        if (petData.photo) {

            img.src = petData.photo;

            img.classList.remove("hidden");

        } else {

            img.classList.add("hidden");

        }

    });


    placeholders.forEach(box => {

        if (!box) return;


        if (petData.photo) {
            box.classList.add("hidden");
        } else {
            box.classList.remove("hidden");
        }

    });

}


/* ================= CARE ================= */

function completeTask(type, button) {

    const status =
        document.getElementById(
            type + "Status"
        );


    if (button.classList.contains("done")) {

        button.classList.remove("done");

        status.textContent =
            "Tap to complete";

        return;
    }


    button.classList.add("done");

    status.textContent =
        "Completed today";

}


/* ================= REMINDERS ================= */

function addReminder() {

    const title =
        document
            .getElementById("reminderTitle")
            .value
            .trim();

    const date =
        document
            .getElementById("reminderDate")
            .value;

    const time =
        document
            .getElementById("reminderTime")
            .value;

    const repeat =
        document
            .getElementById("reminderRepeat")
            .value;


    if (!title || !date || !time) {

        alert(
            "Enter reminder name, date and time."
        );

        return;
    }


    const when =
        new Date(`${date}T${time}`);


    if (when <= new Date()) {

        alert(
            "Choose a future date and time."
        );

        return;
    }


    const reminder = {

        id: Date.now(),

        title,

        date,

        time,

        repeat,

        timestamp:
            when.getTime()

    };


    reminders.push(reminder);


    saveReminders();


    scheduleNativeReminder(reminder);


    document
        .getElementById("reminderTitle")
        .value = "";


    renderReminders();


    alert(
        "Reminder set successfully."
    );

}


function saveReminders() {

    localStorage.setItem(
        "petCareReminders",
        JSON.stringify(reminders)
    );

}


function renderReminders() {

    const list =
        document.getElementById(
            "reminderList"
        );


    if (!list) return;


    list.innerHTML = "";


    if (reminders.length === 0) {

        list.innerHTML = `
            <div class="empty-reminder glass"
                 style="padding:25px;text-align:center;border-radius:20px">
                <div style="color:var(--muted);font-size:11px">
                    No reminders yet.
                </div>
            </div>
        `;

        return;
    }


    reminders
        .sort((a,b) => a.timestamp - b.timestamp)
        .forEach(reminder => {

            const item =
                document.createElement("div");


            item.className =
                "reminder-item glass";


            item.innerHTML = `

                <div class="reminder-bell">
                    <svg viewBox="0 0 24 24">
                        <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/>
                        <path d="M10 21h4"/>
                    </svg>
                </div>

                <div class="reminder-info">
                    <b>${escapeHtml(reminder.title)}</b>

                    <span>
                        ${formatReminderDate(reminder)}
                    </span>
                </div>

                <button
                    class="delete-reminder"
                    onclick="deleteReminder(${reminder.id})"
                >
                    <svg viewBox="0 0 24 24">
                        <path d="M4 7h16"/>
                        <path d="M10 11v6M14 11v6"/>
                        <path d="M6 7l1 14h10l1-14"/>
                        <path d="M9 7V4h6v3"/>
                    </svg>
                </button>
            `;


            list.appendChild(item);

        });

}


function formatReminderDate(reminder) {

    const d =
        new Date(reminder.timestamp);


    const date =
        d.toLocaleDateString(
            "en-IN",
            {
                day: "numeric",
                month: "short",
                year: "numeric"
            }
        );


    let repeatText =
        "Once";


    if (reminder.repeat === "daily") {
        repeatText = "Every day";
    }

    if (reminder.repeat === "weekly") {
        repeatText = "Every week";
    }


    return `${date} · ${reminder.time} · ${repeatText}`;

}


function deleteReminder(id) {

    reminders =
        reminders.filter(
            r => r.id !== id
        );


    saveReminders();

    renderReminders();

}


/* ================= NATIVE NOTIFICATION BRIDGE ================= */

function scheduleNativeReminder(reminder) {

    /*
       MainActivity.java will expose:
       AndroidPetCare.scheduleReminder(...)
    */

    if (
        window.AndroidPetCare &&
        AndroidPetCare.scheduleReminder
    ) {

        AndroidPetCare.scheduleReminder(
            String(reminder.id),
            reminder.title,
            String(reminder.timestamp),
            reminder.repeat
        );

    }

}


/* ================= LOCATION ================= */

function getLocation() {

    const status =
        document.getElementById(
            "locationStatus"
        );


    if (!navigator.geolocation) {

        status.textContent =
            "Location unavailable";

        return;
    }


    status.textContent =
        "Detecting...";


    navigator.geolocation.getCurrentPosition(

        position => {

            status.textContent =
                `${position.coords.latitude.toFixed(3)}, ` +
                `${position.coords.longitude.toFixed(3)}`;

        },

        () => {

            status.textContent =
                "Permission denied";

        }

    );

}


/* ================= VET ================= */

function searchVet() {

    window.open(
        "https://www.google.com/maps/search/veterinary+hospital+near+me",
        "_blank"
    );

}


function searchAvianVet() {

    window.open(
        "https://www.google.com/maps/search/avian+veterinarian+near+me",
        "_blank"
    );

}


/* ================= CAMERA ================= */

function connectCamera() {

    const ip =
        prompt(
            "Enter ESP32-CAM IP address:"
        );


    if (!ip) return;


    localStorage.setItem(
        "esp32CameraIP",
        ip
    );


    alert(
        "Camera IP saved. Live stream integration comes next."
    );

}


/* ================= THEME ================= */

function toggleTheme() {

    document.body.classList.toggle("dark");


    localStorage.setItem(
        "theme",
        document.body.classList.contains("dark")
            ? "dark"
            : "light"
    );

}


function loadTheme() {

    if (
        localStorage.getItem("theme")
        === "dark"
    ) {

        document.body.classList.add("dark");

    }

}


/* ================= HELPERS ================= */

function escapeHtml(text) {

    const div =
        document.createElement("div");

    div.textContent = text;

    return div.innerHTML;

}
