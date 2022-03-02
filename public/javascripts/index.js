function makeOTP(length) {
    var result           = '';
    var characters       = '0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    
    return result;
}

async function submit() {
    const student = {
        name: document.getElementById("name").value,
        rollno: document.getElementById("rollno").value,
        college: document.getElementById("college").value,
        aadhar: document.getElementById("aadhar").value,
        phone: document.getElementById("phone").value,
        email: document.getElementById("email").value,
        otp: makeOTP(6)
    };

    console.log(student);

    openModal();
    hideQRCode();
    showSpinner();

    axios.post('/api/store', student).then((response) => {
        console.log(response);
        let inviteURL = response.data.invitation;
        setQRCodeImage(inviteURL);
        setOTPMsg(student);
        hideSpinner();
        showQRCode();
    });
}

function openModal() {
    modal.style.display = "block";
}

function closeModal() {
    modal.style.display = "none";
}

function hideQRCode() {
    let qrImage = document.getElementsByClassName("qr-image")[0];
    if (qrImage) {
        qrImage.remove();
    }
    qr.style.display = "none";
}

function showQRCode() {
    qr.style.display = "block";
}

function setQRCodeImage(url) {
    let svgElement = document.createElement("div");
    let s = QRCode.generateSVG(url, {
        ecclevel: "M",
        fillcolor: "#FFFFFF",
        textcolor: "#373737",
        margin: 4,
        modulesize: 8,
    });
    s.classList.add("qr-image");
    svgElement.appendChild(s);
    qr.appendChild(s);
}

function setOTPMsg(student) {
    let content = `<pre><code>GEN ${student.rollno} ${student.college} ${student.otp}</code></pre>`;
    otpMsg.innerHTML = content;
}

function hideSpinner() {
    spinner1.style.display = "none";
    spinner2.style.display = "none";
}

function showSpinner() {
    spinner1.style.display = "block";
    spinner2.style.display = "block";

}
