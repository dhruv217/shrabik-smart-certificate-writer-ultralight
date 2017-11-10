export class Student {
    _key: string;
    serialNumber: string;
    name: string;
    certificatePath: string;
    printed: boolean;


    constructor(_key: string, serialNo: string, name: string, certPath: string, printed: boolean) {
        this.serialNumber = serialNo;
        this.name = name;
        this.certificatePath = certPath;
        this.printed = printed;
    }

    cert_printed() {
        this.printed = true;
    }

    is_cret_printed() {
        return this.printed;
    }
}
