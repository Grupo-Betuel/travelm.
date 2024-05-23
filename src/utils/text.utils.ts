export const copyText = (text: string) => {
    // @ts-ignore
    const dummy: any = document.createElement("textarea") || {} as any;
    // @ts-ignore
    document.body.appendChild(dummy);
    dummy.value = text;
    // @ts-ignore
    if (navigator.userAgent.match(/ipad|ipod|iphone/i)) {
        dummy.contentEditable = true;
        dummy.readOnly = true;
        // @ts-ignore
        const range = document.createRange();
        range.selectNodeContents(dummy);
        // @ts-ignore
        const selection = window.getSelection() || {} as any;
        selection.removeAllRanges();
        selection.addRange(range);
        dummy.setSelectionRange(0, 999999);
    } else {
        dummy.select();
    }

    // @ts-ignore
    document.execCommand("copy");
    // @ts-ignore
    document.body.removeChild(dummy);
    // @ts-ignore
    navigator.clipboard.writeText(text);
}

export const removeHTMLChars = (text: string) => {
    // @ts-ignore
    return text.replace( /(<([^>]+)>)/gi, '').replaceAll(/<\/?[^>]+(>|$)/gi, "");
}

export const removeExtraCharactersFromText = (text: string) => {
    return text.normalize("NFD").replace(/[\u0300-\u036f]/gi, "").replace(/&nbsp;/g, "")
}
export const extractNumbersFromText = (text: string): number => {
    if (!text) return 0;
    return Number(text.toString().replace(/[^0-9]/g, ''));
}

export function formatPhoneNumber(inputNumber: string): string | null {
    // Remove any non-numeric characters from the input
    const numericOnly: string = inputNumber.replace(/\D/g, '');

    // Check if the numericOnly value has at least 10 digits
    if (numericOnly.length < 10) {
        // @ts-ignore
        console.error('Invalid phone number');
        return null;
    }

    // Extract the first 10 digits
    const extractedDigits: string = numericOnly.slice(0, 11);

    // Format the phone number
    const formattedNumber: string = `+1 (${extractedDigits.slice(1, 4)}) ${extractedDigits.slice(4, 7)}-${extractedDigits.slice(7)}`;

    return formattedNumber;
}


export function generateCustomID() {
    // Generate a random number between 0 and 1,000,000
    const randomNumber = Math.floor(Math.random() * 1000000);

    // Convert the number to a string in hexadecimal format
    return  randomNumber.toString(16);

}