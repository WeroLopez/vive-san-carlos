// Angular
import { Component, OnInit, Inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';
// Entities
import { Client } from 'src/app/entities/client';
import { Constants } from 'src/app/constants';

@Component({
  selector: 'app-dialog-add-client',
  templateUrl: './dialog-add-client.component.html',
  styleUrls: ['./dialog-add-client.component.scss']
})
export class DialogAddClientComponent implements OnInit {

  myControl = new FormControl()
  countries: string[] = Constants.countryListES
  filteredCountries: Observable<string[]>
  country: string

  title = "Agregar cliente"
  editing = false

  constructor(
    private db: AngularFirestore,
    public dialogRef: MatDialogRef<DialogAddClientComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Client) {
      if (data.id) {
        this.title = "Editar cliente"
        this.editing = true
        if(data.country){
          this.country = data.country
          this.myControl.setValue( this.countries.filter(country => country == this.data.country) )
        }
      }
  }

  ngOnInit(): void {
    this.filteredCountries = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    )
  }
  
  private _filter(value: string): string[] {
    let filterValue = value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    return this.countries.filter(option => option.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").indexOf(filterValue) === 0);
  }
  
  onSelectionCountryChange(event){
    this.data.country = event.option.value
  }

  cancel() {
    this.dialogRef.close();
  }

  accept() {
    let msg = ""
    if (!this.data.name) {
      msg += "Se requiere Nombre<br>"
    }
    if (!this.data.lastname) {
      msg += "Se requiere Apellido<br>"
    }
    if (!this.data.email) {
      msg += "Se requiere Correo<br>"
    }
    if (!this.data.country) {
      msg += "Seleccione un país<br>"
    }
    if (!msg) {
      if (!this.editing){
        let addData = {
          name: this.data.name,
          lastname: this.data.lastname,
          email: this.data.email,
          telephone: this.data.telephone,
          country: this.data.country,
          city: this.data.city,
          bookings: []
        }
        this.db.collection('clients').add(addData).then(ref => {
          console.log('Added document with ID: ', ref.id);
          this.data.id = ref.id
          Constants.SAGood("Éxito", "Cliente guardado")
          this.dialogRef.close({event:'ok',data:this.data});
        }).catch(error => {
          console.log(error);
          Constants.SAError("Error al guardar", Constants.firestoreError)
        })
      }
      else {
        let editData = {
          name: this.data.name,
          lastname: this.data.lastname,
          email: this.data.email,
          telephone: this.data.telephone,
          country: this.data.country,
          city: this.data.city
        }
        this.db.collection('clients').doc(this.data.id).update(editData).then(ref => {
          console.log('Edited document with ID: ', this.data.id);
          Constants.SAGood("Éxito", "Cliente editado")
          this.dialogRef.close({event:'ok',data:this.data});
        }).catch(error => {
          console.log(error);
          Constants.SAError("Error al guardar", Constants.firestoreError)
        })
      }
    }
    else {
      Constants.SAError("Error al guardar", msg)
    }
  }

}
