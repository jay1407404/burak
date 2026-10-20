function initializeSignupImage() {
    const input = document.querySelector(".member-image");
    if (!input) return;

    input.addEventListener("change", function () {
        const file = input.files[0];
        const preview = document.querySelector(".upload-img-frame");
        const filename = document.querySelector(".upload-name");
        preview.src = "/img/default.jpeg";
        filename.value = "Choose image";

        // Cancelling the file picker can leave the input without a file.
        if (!file) return;
        if (!["image/jpeg", "image/png"].includes(file.type)) {
            alert("Please choose a JPG, JPEG, or PNG image.");
            input.value = "";
            return;
        }

        filename.value = file.name;
        const reader = new FileReader();
        reader.onload = function () {
            // Ignore an old preview if another file was selected while reading.
            if (input.files[0] === file) preview.src = reader.result;
        };
        reader.readAsDataURL(file);
    });
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeSignupImage);
} else {
    initializeSignupImage();
}

function validateSignupForm() {
    const memberNick = document.querySelector(".member-nick").value.trim();
    const memberPhone = document.querySelector(".member-phone").value.trim();
    const memberPassword = document.querySelector(".member-password").value;
    const confirmPassword = document.querySelector(".confirm-password").value;
    const image = document.querySelector(".member-image").files[0];

    if (!memberNick || !memberPhone || !memberPassword || !confirmPassword) {
        alert("Please fill in all required fields.");
        return false;
    }
    if (memberPassword !== confirmPassword) {
        alert("Passwords do not match. Please check them.");
        return false;
    }
    if (!image) {
        alert("Please choose a restaurant image.");
        return false;
    }
    if (!["image/jpeg", "image/png"].includes(image.type)) {
        alert("Please choose a JPG, JPEG, or PNG image.");
        return false;
    }
    return true;
}
