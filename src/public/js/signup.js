console.log("Signup frontend javascript file");


function validateSignupForm() {
    const memberNick = $(".member-nick").val().trim();
    const memberPhone = $(".member-phone").val().trim();
    const memberPassword = $(".member-password").val();
    const confirmPassword = $(".confirm-password").val();

    if (!memberNick || !memberPhone || !memberPassword || !confirmPassword) {
        alert("Please insert all required inputs");
        return false;
    }

    if (memberPassword !== confirmPassword) {
        alert("Passwords differ, please check!");
        return false;
    }

    return true;
}