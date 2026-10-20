// This script runs in the browser; keep Node.js imports out of this file.
function initializeProductForm() {
    const form = document.querySelector(".dish-container");
    const newProductButton = document.getElementById("process-btn");
    const cancelButton = document.getElementById("cancel-btn");

    if (!form || !newProductButton || !cancelButton) return;

    newProductButton.addEventListener("click", function () {
        form.style.display = "flex";
        newProductButton.style.display = "none";
    });

    cancelButton.addEventListener("click", function () {
        form.style.display = "none";
        newProductButton.style.display = "";
    });
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeProductForm);
} else {
    initializeProductForm();
}

$(function () {
    $(".product-collection").on("change", () => {
        const selectedValue = $(".product-collection").val();
        if (selectedValue === "DRINK") {
            $("#product-collection").hide();
            $("#product-volume").show();
        } else {
            $("#product-volume").hide();
            $("#product-collection").show();
        }
    });

    $(".new-product-status").on("change", async function () {
        const select = this;
        const id = select.id;
        const productStatus = select.value;
        select.disabled = true;

        try {
            const response = await axios.post(`/admin/product/${id}`, { productStatus });
            if (!response.data.data) {
                throw new Error("Product update failed");
            }
            select.blur();
        } catch (err) {
            console.error("Product update failed:", err);
            alert("Product update failed! Please refresh and try again.");
        } finally {
            select.disabled = false;
        }
    });

});



function validateForm() {
    const productName = $(".product-name").val().trim();
    const productPrice = $(".product-price").val().trim();
    const productLeftCount = $(".product-left-count").val().trim();
    const productCollection = $(".product-collection").val().trim();
    const productDesc = $(".product-desc").val().trim();
    const productStatus = $(".product-status").val().trim();

    if (
        productName === "" ||
        productPrice === "" ||
        productLeftCount === "" ||
        productCollection === "" ||
        productDesc === "" ||
        productStatus === ""

    ) {
        alert("Please insert all details");
        return false;
    } else return true;
}

function previewFileHandler(input, order) {
    const imgClassName = input.className;
    console.log("input:", input);
    console.log("imgClassname:", imgClassName);

    const file = $(`.${imgClassName}`).get(0).files[0];
    const validImageType = ["image/jpg", "image/jpeg", "image/png"];

    if (!validImageType.includes(fileType)) {
        alert("Please insert only jpeg, jpg and png!");
    } else {
        if (file) {
            const reader = new FileReader();
            reader.onload = function () {
                $(`#image-section-${order}`).attr("src", reader.result);
            }
            reader.readAsDataURL(file);
        }
    }
}
