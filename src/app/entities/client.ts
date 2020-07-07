export class Client {
    public id: string
    public name: string
    public lastname: string
    public email: string
    public telephone: string
    public country: string
    public city: string
    public bookings: Array<string>
    
    constructor() {
        this.id = ""
        this.name = ""
        this.lastname = ""
        this.email = ""
        this.telephone = ""
        this.country = ""
        this.city = ""
        this.bookings = []
     }
}