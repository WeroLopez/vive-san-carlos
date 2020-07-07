import { Component, OnInit, HostListener, SystemJsNgModuleLoader } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Constants } from '../../constants'
import { Client } from 'src/app/entities/client';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map, first } from 'rxjs/operators';
import { Booking } from 'src/app/entities/booking';
import { Day } from 'src/app/entities/day';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.scss']
})
export class BookingComponent implements OnInit {

  clients: Client[] = []
  selectedClient: Client
  myControl = new FormControl()
  clientsNames: string[] = []
  filteredClients: Observable<string[]>
  client: string = ""

  displayedMonth = "Mes"
  displayedMonthNumber: number
  displayedYear: number
  weekDays = Constants.weekDays
  date = new Date()
  days: Day[] = []
  canGoBack = false

  firstDaySelected: Day
  secondDaySelected: Day

  price: number = 250
  totalDays: number = 0
  totalPrice: string = "0.00"

  bookings: Booking[] = []
  selectedBooking: Booking = new Booking()

  constructor(private db: AngularFirestore) { }

  ngOnInit() {
    this.date = new Date(this.date.getFullYear(), this.date.getMonth(), 1)
    this.reloadCalendar(this.date)
    this.loadClients()
    this.filteredClients = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterClients(value))
    )
    this.reloadBookings(this.date)
  }

  // ------------ calendar methods ------------ //
  /**
   * Reaload the calender with the month of the giving date
   * @param date 
   */
  reloadCalendar(date: Date){
    this.days = []
    this.updateCalendarHeader()
    let firstIndexOfMonth = this.getFirstDay(date)
    var daysCount = this.getDaysCount(date)
    var calendarDate = new Date(this.date.getFullYear(), date.getMonth(), 1) 
    for (let i=0; i<daysCount+firstIndexOfMonth; i++){
      let d = new Day() 
      if (i>=firstIndexOfMonth){
        d.date = this.addDays(calendarDate, i-firstIndexOfMonth)
        d.state = "blank"
      } else {
        d.date = new Date(1000, 0, 1)
        d.state = "invisible"
      }
      this.days.push(d)
    }
    this.reloadBookings(date)
  }

  /**
   * Reloads the header of the calendar with the global date
   */
  updateCalendarHeader(){
    this.displayedYear = this.date.getFullYear()
    this.displayedMonthNumber = this.date.getMonth()
    this.displayedMonth = Constants.monthNames[this.displayedMonthNumber]
  }
  // ------------ calendar methods ------------ //


  // ------------ selected methods ------------ //
  /**
   * What happens when user clicks a day cell
   * @param index 
   * @param day 
   */
  clickDay(index:number, day:Day){
    //id day is booked
    switch(this.days[index].state){
      case "booked": case "bookedSelected":
        this.firstDaySelected = null
        this.secondDaySelected = null
        this.cleanHoverDays()
        this.showBookingInfoWithDay(day)
        break;
      case "apart": case "apartSelected":
        this.firstDaySelected = null
        this.secondDaySelected = null
        this.cleanHoverDays()
        this.showBookingInfoWithDay(day)
        break;
      case "invalid":
        Constants.SAError("Error de selección", "Uno de estos días ya está reservado.")
        break;
      default:
        //if there isn't a selected day, select it
        if (!this.firstDaySelected) {
          this.clearInfo()
          this.days[index].state = "selected"
          this.days[index].selectedType = "start"
          this.firstDaySelected = this.days[index]
        }
        //if the first day is selected
        else if (!this.secondDaySelected) {
          //check if one of the days is invalid
          for(let i = 0; i<this.days.length; i++){
            if(this.days[i].state == "invalid"){
              Constants.SAError("Error de selección", "Uno de estos días ya está reservado.")
              return
            }
          }
          //if the second day is greater than the first, select it
          if (day.date > this.firstDaySelected.date) {
            this.days[index].state = "selected"
            this.days[index].selectedType = "end"
            this.secondDaySelected = this.days[index]
          }
          //if not, select a new first day
          else{
            this.firstDaySelected.state = "blank"
            this.firstDaySelected.selectedType = "none"
            this.days[index].state = "selected"
            this.days[index].selectedType = "start"
            this.firstDaySelected = this.days[index]
          }
        }
        //if both days are selected, start again
        else {
          //clean past hover selected days
          this.cleanHoverDays()
          this.clearInfo()
          //select first day
          this.days[index].state = "selected"
          this.days[index].selectedType = "start"
          this.firstDaySelected = this.days[index]
          //de-select second day
          this.secondDaySelected.state = "blank"
          this.secondDaySelected.selectedType = "none"
          this.secondDaySelected = null
        }
        break;
    }
    this.changePrice()
  }
  /**
   * What happens when the mouse enters a day cell
   * @param index 
   * @param day 
   */
  mouseEnterDay(index:number, day:Day){
    if (this.firstDaySelected && !this.secondDaySelected) {
      //clean past hover selected days
      this.cleanHoverDays()
      //if entered day is greater than first day, paint the days
      if (day.date > this.firstDaySelected.date) {
        //get first selected day index
        var initialIndex
        for (let i=0; i<this.days.length; i++){
          if (this.days[i] == this.firstDaySelected) {
            initialIndex = i
            break
          }
        }
        //select the new hover days
        for (let i=initialIndex; i<=index; i++){
          switch(this.days[i].state) {
            case "booked": case "apart":
              this.days[i].state = "invalid"
              break
            default: 
              this.days[i].state = "selected"
              break
          }
          this.days[i].selectedType = "middle"
        }
        this.days[index].selectedType = "end"
        this.days[initialIndex].selectedType = "start"
      }
      //if else, re-select the first selected day
      else{
        this.firstDaySelected.state = "selected"
        this.firstDaySelected.selectedType = "start"
      }
    }
  }
  mouseLeaveDay(index:number, day:Day) {
  }
  /**
   * Clean hover selected days
   */
  cleanHoverDays(){
    for (let i=0; i<this.days.length; i++){
      switch(this.days[i].state) {
        case "selected": 
          this.days[i].state = "blank"
          this.days[i].selectedType = "none"
          break
        case "bookedSelected": 
          this.days[i].state = "booked"
          break
        case "apartSelected": 
          this.days[i].state = "apart"
          break
        case "invalid":
          switch(this.days[i].originalState) {
            case "booked": 
              this.days[i].state = "booked"
              break
            case "apart": 
              this.days[i].state = "apart"
              break
            default: break
          }
          switch(this.days[i].originalSelectedType) {
            case "start": 
              this.days[i].selectedType = "start"
              break
            case "middle":
              this.days[i].selectedType = "middle"
              break
            case "end": 
              this.days[i].selectedType = "end"
              break
            default: break
          }
          break
        default: break
      }
    }
  }
  /**
   * Shows the booking info of the selected booking
   * @param day day for search the booking
   */
  showBookingInfoWithDay(day: Day){
    //find the selected booking
    for(let i = 0; i < this.bookings.length; i++){
      let initialDate
      let endDate
      initialDate = this.getFirestoreDate(this.bookings[i].initialDate)
      endDate = this.getFirestoreDate(this.bookings[i].endDate)
      for (let d = initialDate; d <= endDate; d.setDate(d.getDate() + 1)) {
        //if booked is found
        if (day.date.getDate() == d.getDate()) {
          this.selectedBooking = this.bookings[i]
          //select days
          this.firstDaySelected = new Day()
          this.firstDaySelected.date = this.getFirestoreDate(this.selectedBooking.initialDate)
          this.secondDaySelected = new Day()
          this.secondDaySelected.date = this.getFirestoreDate(this.selectedBooking.endDate)
          //write the info
          this.totalDays = 1 + this.dateDiffInDays(this.firstDaySelected.date, this.secondDaySelected.date)
          this.price = this.selectedBooking.total / this.totalDays
          this.totalPrice = ((this.selectedBooking.total * 100) / 100).toFixed(2)
          if(this.days[i].originalState == "apart"){
            console.log(this.selectedBooking.payed)
          }
          //paint the calendar days
          let firstIndexOfMonth = this.getFirstDay(this.firstDaySelected.date)
          let firstBookedDay = this.firstDaySelected.date.getDate()
          let lastBookedDay = this.secondDaySelected.date.getDate()
          for (let i=firstIndexOfMonth+firstBookedDay-1; i<=lastBookedDay; i++){
            switch(this.days[i].originalState) {
              case "booked": 
                this.days[i].state = "bookedSelected"
                break
              case "apart":
                this.days[i].state = "apartSelected"
                break
              default: break
            }
          }
          //select the client
          this.selectedClient = this.clients.filter(client => client.id = this.selectedBooking.clientId)[0]
          return
        }
      }
    }
  }
  deSelectDays(){
    this.firstDaySelected = null
    this.secondDaySelected = null
    this.cleanHoverDays()
  }
  clearInfo() {
    this.selectedBooking = new Booking()
    this.totalDays = 0
    this.price = 250
    this.totalPrice = "0.00"
    this.selectedClient = null
  }
  @HostListener('document:keyup.escape', ['$event']) onKeyupHandler(event: KeyboardEvent) {
    this.deSelectDays()
    this.clearInfo()
  }
  // ------------ selected methods ------------ //
  
  
  // ---------------- buttons ----------------- //
  buttonSetLastMonth() {
    this.date = this.getLastMotnh(this.date)
    this.changeMotnh()
  }
  buttonSetNextMonth() {
    this.date = this.getNextMotnh(this.date)
    this.changeMotnh()
  }
  changeMotnh(){
    this.reloadCalendar(this.date)
  }
  // ---------------- buttons ----------------- //


  // ------------- date functions ------------- //
  getFirstDay(date: Date): number {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }
  getDaysCount(date: Date): number {
    return new Date(date.getFullYear(), date.getMonth()+1, 0).getDate();
  };
  getWeeksCount(date: Date):number {
    let firstOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    let lastOfMonth = new Date(date.getFullYear(), date.getMonth()+1, 0);
    let used = firstOfMonth.getDay() + lastOfMonth.getDate();
    return Math.ceil( used / 7);
  }
  getNextMotnh(date: Date):Date {
    return new Date(date.setMonth(date.getMonth()+1))
  }
  getLastMotnh(date: Date):Date {
    return new Date(date.setMonth(date.getMonth()-1))
  }
  addDays(date: Date, days: number) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }
  dateDiffInDays(a, b) {
    let _MS_PER_DAY = 1000 * 60 * 60 * 24;
    // Discard the time and time-zone information.
    let utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    let utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
    return Math.floor((utc2 - utc1) / _MS_PER_DAY);
  }
  getFirestoreDate(date: any):Date{
    try {
      let d = date.toDate()
      return d
    } catch(error) {
      return date
    }
  }
  // ------------- date functions ------------- //


  // ----------------- book ------------------- //
  /**
   * Save a booking to firestore
   */
  book() { 
    if (this.verifyData()){
      Constants.SAQuestion("¿Confirmar reservación?", "", false).then((result) => {
        if (result.value) {
          let booking = new Booking()
          booking.clientId = this.selectedClient.id
          booking.initialDate = new Date(this.firstDaySelected.date.getFullYear(), this.firstDaySelected.date.getMonth(), this.firstDaySelected.date.getDate()) 
          booking.endDate = new Date(this.secondDaySelected.date.getFullYear(), this.secondDaySelected.date.getMonth(), this.secondDaySelected.date.getDate()) 
          booking.total = +this.totalPrice
          booking.payed = +this.totalPrice
          booking.state = "booked"
          this.db.collection('bookings').add({...booking}).then(ref => {
            console.log('Added document with ID: ', ref.id);
            booking.id = ref.id
            this.bookings.push(booking)
            Constants.SAGood("Éxito", "Reservación agendada.")
            this.showNewBooking(booking)
            this.deSelectDays()
            this.clearInfo()
          }).catch(error => {
            console.log(error);
            Constants.SAError("Error al guardar", Constants.firestoreError)
          })
        }
      })
    }
  }
  /**
   * Save an aparted to firestore
   */
  apart() { 
    if (this.verifyData()){
      Constants.SAPriceQuestion("¿Con cuánto anticipo se va a apartar?", "").then( result => {
        if (result.value) {
          let booking = new Booking()
          booking.clientId = this.selectedClient.id
          booking.initialDate = this.firstDaySelected.date
          booking.endDate = this.secondDaySelected.date
          booking.total = +this.totalPrice
          booking.payed = +result.value
          booking.state = "apart"
          this.db.collection('bookings').add({...booking}).then(ref => {
            console.log('Added document with ID: ', ref.id);
            booking.id = ref.id
            this.bookings.push(booking)
            Constants.SAGood("Éxito", "Fecha apartada.")
            this.showNewBooking(booking)
            this.deSelectDays()
            this.clearInfo()
          }).catch(error => {
            console.log(error);
            Constants.SAError("Error al guardar", Constants.firestoreError)
          })
        }
      })
    }
  }
  verifyData(){
    let msg = ""
    if(!this.selectedClient) {
      msg += "Se requiere Cliente<br>"
    }
    if(!this.firstDaySelected || !this.secondDaySelected) {
      msg += "Seleccione un rango de días<br>"
    }
    if(this.totalPrice == "ERROR") {
      msg += "Hay error en el precio total<br>"
    }
    if (msg) {
      Constants.SAError("Error", msg)
      return false
    }
    return true
  }
  /**
   * Get the bookings from firestore from giving month
   * @param date date to get the month to reload
   */
  reloadBookings(date: Date){
    let initwhereDate = new Date(date.getFullYear(), date.getMonth(), 1)
    let endWhereDate = new Date(date.getFullYear(), date.getMonth() + 1, 1)
    this.bookings = []
    let bookingsRef = this.db.collection("bookings")
    bookingsRef.ref.where("initialDate", ">=", initwhereDate).where("initialDate", "<", endWhereDate).orderBy('initialDate').get().then(snapshot => {
      snapshot.forEach(doc => {
        let pushBooking = doc.data() as Booking
        pushBooking.id = doc.id
        this.bookings.push(pushBooking)
      })
      this.reloadCalendarBookings()
    })
    .catch(err => {
      console.log('Error getting bookings', err);
      Constants.SAError("Error", "No se pudieron obtener las reservaciones de Firestore")
    })
  }
  /**
   * Paint the bookings on the calendar 
   */
  reloadCalendarBookings(){
    this.days.forEach(day => {
      day.state = "blank"
      day.selectedType = "none"
      day.originalState = ""
      day.originalSelectedType = ""
    })
    let firstDay = this.getFirstDay(this.date) - 1
    this.bookings.forEach(booking => {
      let initialDate = booking.initialDate.toDate()
      let endDate = booking.endDate.toDate()
      let iDay = initialDate.getDate()
      let jDay = endDate.getDate()
      for (let i = iDay + firstDay; i <= jDay; i++) {
        this.days[i].state = booking.state
        this.days[i].selectedType = "middle"
        this.days[i].originalState = booking.state
        this.days[i].originalSelectedType = "middle"
      }
      this.days[iDay+firstDay].selectedType = "start"
      this.days[jDay+firstDay].selectedType = "end"
      this.days[iDay+firstDay].originalSelectedType = "start"
      this.days[jDay+firstDay].originalSelectedType = "end"
    })
  }
  /**
   * Paint a booking after saving it to firestore
   * @param booking 
   */
  showNewBooking(booking: Booking){
    let firstDay = this.getFirstDay(this.date) - 1
    let initialDate = this.getFirestoreDate(booking.initialDate)
    let endDate = this.getFirestoreDate(booking.endDate)
    let iDay = initialDate.getDate()
    let jDay = endDate.getDate()
    for (let i = iDay + firstDay; i <= jDay; i++) {
      this.days[i].state = booking.state
      this.days[i].originalState = booking.state
    }
  }
  deleteBooking() {
    let state = this.selectedBooking.state
    let title = "¿Eliminar " + (state == "booked" ? "reservación?" : "apartado?")
    let successMsg = "Se eliminó " + (state == "booked" ? "la reservación." : "el apartado.")
    Constants.SAQuestion(title, "", true).then((result) => {
      if (result.value) {
        let deletePromise = this.db.collection('bookings').doc(this.selectedBooking.id).delete()
        deletePromise.then(result => {
          console.log("Resevación/Apartado eliminado: " + this.selectedBooking.id + " - " + result)
          Constants.SAGood("Éxito al eliminar", successMsg)
          for(let i=0;i<this.bookings.length;i++){
            if(this.bookings[i].id == this.selectedBooking.id){
              this.bookings.splice(i, 1)
              break
            }
          }
          this.selectedBooking = new Booking()
          this.deSelectDays()
          this.clearInfo()
          this.reloadCalendarBookings()
        })
        .catch(err => {
          console.log('Error deleting bookings', err);
          Constants.SAError("Error al eliminar", Constants.firestoreError)
        })
      }
    })
  }
  liquidate() {
    Constants.SAQuestion("¿Confirmar liquidación?", "", false).then((result) => {
      if (result.value) {
        let update = { 
          payed: this.selectedBooking.total,
          total: this.selectedBooking.total,
          state: "booked" 
        }
        this.db.collection('bookings').doc(this.selectedBooking.id).update(update).then(ref => {
          console.log('Edited document with ID: ', this.selectedBooking.id)
          this.selectedBooking.payed = this.selectedBooking.total
          this.selectedBooking.state = "booked"
          Constants.SAGood("Éxito", "Reservación liquidada.")
          this.showNewBooking(this.selectedBooking)
          this.deSelectDays()
          this.clearInfo()
        }).catch(error => {
          console.log(error);
          Constants.SAError("Error al guardar", Constants.firestoreError)
        })
      }
    })
  }
  // ----------------- book ------------------- //


  // ---------------- Pricing ----------------- //
  /**
   * Change the total price based of the price and the selected days
   */
  changePrice() {
    if(this.firstDaySelected && this.secondDaySelected) {
      let castedPrice = +this.price
      if (castedPrice) {
        this.totalDays = 1 + this.dateDiffInDays(this.firstDaySelected.date, this.secondDaySelected.date)
        this.totalPrice = ((castedPrice * this.totalDays * 100) / 100).toFixed(2)
      } 
      else{
        this.totalPrice = "ERROR"
      }
    }
    else {
      this.totalDays = 0
      this.totalPrice = "0.00"
    }
  }
  // ---------------- Pricing ----------------- //
  
  
  // ---------------- Clients ----------------- //
  /**
   * Get the clients from firestore
   */
  loadClients(){
    let clientsRef = this.db.collection("clients")
    clientsRef.ref.orderBy('name').get().then(snapshot => {
      snapshot.forEach(doc => {
        let pushClient = doc.data() as Client
        pushClient.id = doc.id
        this.clients.push(pushClient)
      })
      //this.allClients = this.clients
      this.clientsNames = this.clients.map(client => client.name + " " + client.lastname)
    })
    .catch(err => {
      console.log('Error getting clients', err);
      Constants.SAError("Error", "No se pudieron obtener los clientes de Firestore")
    })
    /*let pushClient = new Client()
    pushClient.name = "Pancho Poncho"
    this.clients.push(pushClient)
    this.clientsNames = this.clients.map(client => client.name + " " + client.lastname)/*/
  }
  private _filterClients(value: string): string[] {
    let filterValue = value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    return this.clientsNames.filter(client => {
      client = client.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      return client.indexOf(filterValue) === 0
    })
  }
  onSelectionClientChange(event){
    let value = event.option.value
    let c = this.clients.filter(client => {
      let name = client.name + " " + client.lastname
      return name == value
    })
    if (c.length > 0){
      this.selectedClient = c[0]
    }
  }
  // ---------------- Clients ----------------- //

}