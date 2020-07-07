// Angular
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AngularFirestore } from '@angular/fire/firestore';
// Dialogs
import { DialogAddClientComponent } from 'src/app/components/dialog-add-client/dialog-add-client.component';
// Entities
import { Client } from 'src/app/entities/client';
import { Constants } from 'src/app/constants';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss']
})
export class ClientsComponent implements OnInit {

  clients: Client[] = []
  selectedClient: Client = new Client()
  selectedClientIndex = -1;

  searchtext: string = ""
  allClients: Client[] = []

  constructor(
    public dialog: MatDialog,
    private db: AngularFirestore) { }

  ngOnInit(): void {
    this.reloadClients()
  }

  reloadClients(){
    let clientsRef = this.db.collection("clients")
    clientsRef.ref.orderBy('name').get().then(snapshot => {
      snapshot.forEach(doc => {
        //console.log(doc.id, '=>', doc.data());
        let pushClient = doc.data() as Client
        pushClient.id = doc.id
        if (!pushClient.telephone) pushClient.telephone = "-"
        if (!pushClient.country) pushClient.country = "-"
        if (!pushClient.city) pushClient.city = "-"
        this.clients.push(pushClient)
      })
      this.allClients = this.clients
    })
    .catch(err => {
      console.log('Error getting documents', err);
      Constants.SAError("Error", "No se pudieron obtener los datos de Firestore")
    });
  }

  selectClient(index: number) {
    this.selectedClientIndex = index
    this.selectedClient = this.clients[index]
  }

  add(){
    let dialogRef = this.dialog.open(DialogAddClientComponent, {
      width: '500px',
      data: new Client()
    })
    dialogRef.afterClosed().subscribe(result => {
      if(result) { 
        switch(result.event) {
          case 'ok':
            this.clients.push(result.data)
            this.clients.sort((a, b) => a.name.localeCompare(b.name))
            break;
          default: break;
        }
      }
    })
  }

  showBookings(){

  }

  edit(){
    let dialogRef = this.dialog.open(DialogAddClientComponent, {
      width: '500px',
      data: this.selectedClient
    })
    dialogRef.afterClosed().subscribe(result => {
      if(result) { 
        switch(result.event) {
          case 'ok':
            this.selectedClient = result.data
            this.clients.sort((a, b) => a.name.localeCompare(b.name))
            break;
          default: break;
        }
      }
    })
  }

  delete(){
    Constants.SAQuestion('¿Eliminar cliente?',"Se eliminarán también sus reservaciones", true).then((result) => {
      if (result.value) {
        let deletePromise = this.db.collection('clients').doc(this.selectedClient.id).delete()
        deletePromise.then(result => {
          console.log("Cliente eliminado: " + this.selectedClient.id + " - " + result)
          Constants.SAGood("Éxito al eliminar", "Se eliminó el cliente")
          this.clients.splice(this.selectedClientIndex, 1)
          this.selectedClientIndex = -1
          this.selectedClient = null
        })
        .catch(err => {
          console.log('Error deleting documents', err);
          Constants.SAError("Error al eliminar", Constants.firestoreError)
        })
      }
    })
  }
  
  search(){
    console.log(this.searchtext)
    this.clients = this.allClients.filter(client => {
      let name = client.name + " " + client.lastname
      name = name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      return name.includes(this.searchtext.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""))
    })
  }
  clearSearch(){
    console.log(this.searchtext)
    this.clients = this.allClients
  }

  filter(){
    
  }


}
