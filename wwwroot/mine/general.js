var inputQuantity = [];
$(function () {
    $(".numberChecking").each(function (i) {
        inputQuantity[i] = this.defaultValue;
        $(this).data("idx", i); // save this field's index to access later
    });
    $(".numberChecking").on("input", function (e) {
        var $field = $(this),
            val = this.value,
            $thisIndex = parseInt($field.data("idx"), 10); // retrieve the index
        //        window.console && console.log($field.is(":invalid"));
        //  $field.is(":invalid") is for Safari, it must be the last to not error in IE8
        if (this.validity && this.validity.badInput || isNaN(val) || $field.is(":invalid")) {
            this.value = inputQuantity[$thisIndex];
            return false;
        }
        if (val.length > Number($field.attr("maxlength"))) {
            val = val.slice(0, 5);
            $field.val(val);
        }
        inputQuantity[$thisIndex] = val;
    });
});

function decodeData(html) {
    var txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
}

function calculateAgeByDOB(dateString) {
    if (!dateString) {
        return 0;
    }

    var today = new Date();
    var birthDate = new Date(dateString);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }

    return age;
}

function calculateDOBByAge(age) {
    if (age && age > 0) {
        var today = new Date();
        var year = today.getFullYear() - age;
        return year + "-" + pad(today.getMonth() + 1, 2) + "-" + pad(today.getDate(), 2);
    }

    return '';
}

function pad(num, count) {
    return ("0" + num).slice(-(count));
}

$.fn.extend({
    clearFiles: function () {
        $(this).each(function () {
            var isIE = (window.navigator.userAgent.indexOf("MSIE ") > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./));
            if ($(this).prop("type") == 'file') {
                if (isIE == true) {
                    $(this).replaceWith($(this).val('').clone(true));
                } else {
                    $(this).val("");
                }
            }
        });
        return this;
    }
});