export class Day {
    public date: Date
    public state: String //invalid, blank, selected, booked, apart, invisible, bookedSelected
    public selectedType: String //none, start, middle, end
    public originalState: String //booked, apart
    public originalSelectedType: String //start, middle, end
}