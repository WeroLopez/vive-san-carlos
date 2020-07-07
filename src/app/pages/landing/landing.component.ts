import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {

  platformButtons: PlatformButton[] = []
  sections: Section[] = []
  comments: Comment[] = []

  constructor() { }

  ngOnInit() {
    this.platformButtons.push(new PlatformButton("airbnb", "https://www.airbnb.com"))
    this.platformButtons.push(new PlatformButton("homie", "https://www.homie.com"))
    this.platformButtons.push(new PlatformButton("instagram", "https://www.instagram.com"))
    this.platformButtons.push(new PlatformButton("facebook", "https://www.facebook.com"))
    
    this.sections.push(new Section("Live the experiencie", "experiencia", "", "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus pharetra tincidunt imperdiet. Etiam id nisl lobortis, pretium felis viverra, porta enim. Nam commodo ante rhoncus sodales blandit. Donec lacinia sodales efficitur. In ornare viverra eros eget sodales. Pellentesque placerat ligula lectus. Ut id sodales libero, ac tempor urna."))
    this.sections.push(new Section("The ideal house", "casa", "Take a look!", "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus pharetra tincidunt imperdiet. Etiam id nisl lobortis, pretium felis viverra, porta enim. Nam commodo ante rhoncus sodales blandit. Donec lacinia sodales efficitur. In ornare viverra eros eget sodales. Pellentesque placerat ligula lectus. Ut id sodales libero, ac tempor urna."))
    this.sections.push(new Section("Go into the sea", "yate", "Know the yatchs!", "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus pharetra tincidunt imperdiet. Etiam id nisl lobortis, pretium felis viverra, porta enim. Nam commodo ante rhoncus sodales blandit. Donec lacinia sodales efficitur. In ornare viverra eros eget sodales. Pellentesque placerat ligula lectus. Ut id sodales libero, ac tempor urna."))
    this.sections.push(new Section("For the entire family", "familia", "", "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus pharetra tincidunt imperdiet. Etiam id nisl lobortis, pretium felis viverra, porta enim. Nam commodo ante rhoncus sodales blandit. Donec lacinia sodales efficitur. In ornare viverra eros eget sodales. Pellentesque placerat ligula lectus. Ut id sodales libero, ac tempor urna."))
    this.sections.push(new Section("And much more", "kayak", "Discover!", "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus pharetra tincidunt imperdiet. Etiam id nisl lobortis, pretium felis viverra, porta enim. Nam commodo ante rhoncus sodales blandit. Donec lacinia sodales efficitur. In ornare viverra eros eget sodales. Pellentesque placerat ligula lectus. Ut id sodales libero, ac tempor urna."))

    this.comments.push(new Comment("Juan Pérez", "/assets/images/landing/avatar.png", 5, "Aenean interdum convallis nisl, eget rhoncus metus facilisis sed. Cras quis sem in nibh egestas efficitur vitae non nunc. Donec finibus quam nec pretium rutrum. Etiam vestibulum magna a nulla maximus tempor. In tristique posuere libero, id ultrices neque bibendum a. Phasellus fringilla massa in leo cursus porta. Mauris dignissim nisi at libero consequat, "))
    this.comments.push(new Comment("Pancho Poncho", "/assets/images/landing/avatar.png", 4, "Nunc interdum dolor ac dui imperdiet finibus. Praesent id tincidunt purus. Duis id convallis erat. Nulla convallis sem vulputate velit posuere feugiat. Donec pulvinar sapien dictum porttitor porttitor. Mauris sed mi ante. Curabitur ut lacus tincidunt, mattis quam quis, viverra lacus. "))
    this.comments.push(new Comment("Hernán Cortés", "/assets/images/landing/avatar.png", 4, "Vivamus sagittis justo leo, in pulvinar odio vehicula sit amet. Nullam id risus enim. Sed porta massa diam, et tempor lorem tristique eget. Donec ac diam justo. Nunc tincidunt placerat maximus. Vestibulum est nulla, mollis sit amet lorem sed, ornare iaculis felis. Nulla gravida volutpat varius. "))
    this.comments.push(new Comment("Agustín Melgar", "/assets/images/landing/avatar.png", 5, "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus pharetra tincidunt imperdiet. Etiam id nisl lobortis, pretium felis viverra, porta enim. Nam commodo ante rhoncus sodales blandit. Donec lacinia sodales efficitur. In ornare viverra eros eget sodales. Pellentesque placerat ligula lectus. Ut id sodales libero, ac tempor urna. "))
  }
  
  book() {
    
  }

}

export class PlatformButton {
  public title: string
  public link: string
  constructor(title: string, link: string){
    this.title = title
    this.link = link
  }
}

export class Section {
  public title: string
  public image: string
  public buttonTitle: string
  public text: string
  constructor(title: string, image: string, buttonTitle: string, text: string){
    this.title = title
    this.image = image
    this.buttonTitle = buttonTitle
    this.text = text
  }
}

export class Comment {
  public clientName: string
  public clientImage: string
  public stars: number[]
  public text: string
  constructor(clientName: string, clientImage: string, stars: number, text: string){
    this.clientName = clientName
    this.clientImage = clientImage
    this.stars = []
    for(let i=0; i<stars; i++){
      this.stars.push(1)
    }
    this.text = text
  }
}