var MyForm = {
    elem: document.getElementById('myForm'),

    validate: function () {
        var data = {isValid: true, errorFields: []};
        var fields = MyForm.getData();

        var fio = fields.fio;
        var nWords = fio.trim().replace(/\s{2,}/g, ' ').split(" ").length;

        if (nWords !== 3) {
            data.errorFields.push('fio');
            data.isValid = false;
        }

        var email = fields.email;

        if (!(isEmail(email) && isYaEmail(email))) {
            data.errorFields.push('email');
            data.isValid = false;
        }

        var phone = fields.phone;

        if (!(isPhone(phone) && sumNumbers(phone.replace(/\D+/g,"")) <= 30)){
            data.errorFields.push('phone');
            data.isValid = false;
        }

        return data;
    },

    getData: function () {
        var data = {};
        data.phone = document.getElementsByName("phone")[0].value;
        data.fio = document.getElementsByName("fio")[0].value;
        data.email = document.getElementsByName("email")[0].value;
        return data;
    },

    setData: function (data) {
        document.getElementsByName("phone")[0].value = data.phone;
        document.getElementsByName("fio")[0].value = data.fio;
        document.getElementsByName("email")[0].value = data.email;
    },

    submit: function (e) {
        try {
            e.preventDefault();
        } catch (z) {

        }

        var valid = MyForm.validate();

        if (valid.isValid){
            document.getElementById('submitButton').disabled = ' ';

            $.get( MyForm.elem.action, function( data ) {

                var t = data;

                if (t.status == "progress") {
                    document.getElementById('resultContainer').classList.add('progress');
                    wait(data.timeout);
                } else {
                    checkStatus(data)
                }

            });
        } else {
            valid.errorFields.forEach(function(item) {
                document.getElementsByName(item)[0].classList.add("error");
            });
        }

    }
};

$( MyForm.elem ).submit(function( e ) {
    MyForm.submit(e);
});

var inputs = document.getElementsByTagName('input');
for(var i = 0, l = inputs.length; i < l; i++) {
    inputs[i].onchange = function (e) {
        e.target.classList.remove("error");
    }
}

function wait(timeout){
    var timerlive = setInterval(function() {

        $.get( MyForm.elem.action, function( data ) {

            if (data.status !== "progress") {
                clearTimeout(timerlive);
                document.getElementById('resultContainer').classList.remove('progress');
                checkStatus(data);
            }

        });

    }, timeout);
}

function checkStatus(response) {
    switch (response.status) {
        case "success":
            document.getElementById('resultContainer').classList.add('success');
            document.getElementById('resultContainer').innerHTML="Success";
            break;
        case "error":
            document.getElementById('resultContainer').classList.add('error');
            document.getElementById('resultContainer').innerHTML=response.reason;
            break;
    }
}

function sumNumbers(string) {
    var s = 0;

    for(var i = 0, l = string.length; i < l; i++) {
        s += parseInt(string.charAt(i));
    }

    return s;
}

function isPhone(phone) {
    return /^\+7\(([0-9]{3})\)([0-9]{3})-([0-9]{2})-([0-9]{2})$/.test(phone);
}

function isEmail(email){
    return /^([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22))*\x40([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d))*$/.test( email );
}

function isYaEmail(email) {
    return !!email.match(/@ya.ru|@yandex.ru|@yandex.ua|@yandex.by|@yandex.kz|@yandex.com/ig);
}