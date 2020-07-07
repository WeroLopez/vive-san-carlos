export class AddClientErrors {
    noName: boolean
    noLastName: boolean
    noEmail: boolean
    incorrectCountry: boolean

    constructor(){
        this.noName = true
        this.noLastName = true
        this.noEmail = true
        this.incorrectCountry = true
    }
}