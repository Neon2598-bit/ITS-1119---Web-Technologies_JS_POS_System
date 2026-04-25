const phoneRegex = new RegExp(/^[0]{1}[7]{1}[01245678]{1}[0-9]{7}$/gm);

const checkPhone =  (phoneNumber) => {
    return phoneRegex.test(phoneNumber);
}

export {checkPhone};