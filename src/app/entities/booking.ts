export class Booking {
    public id: string
    public initialDate: any
    public endDate: any
    public clientId: string
    public state: string
    public total: number
    public payed: number
    
    constructor() {
        this.state = ""
     }
}