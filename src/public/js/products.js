const { get } = require("http");
const { ProductVolume } = require("../../libs/types/enums/product.enum");

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

    $("#process-btn").on("click", () => {
        $(".dish-container").slideToggle(500);
        $("#process-btn").css("display", "none");
    });

    $("#cancel-btn").on("click", () => {
        $(".dish-container").slideToggle(500);
        $("#process-btn").css("display", "flex");
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