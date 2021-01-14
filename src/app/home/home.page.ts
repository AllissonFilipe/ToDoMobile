import { Component } from '@angular/core';
import { ActionSheetController, AlertController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  tasks:any[] = [];
  constructor(
    private alertController: AlertController, 
    private toastController: ToastController,
    private actionSheetController: ActionSheetController
  ) {
    let taskJson = localStorage.getItem('taskDb');

    if(taskJson != null) {
      this.tasks = JSON.parse(taskJson);
    }
  }

  async showAdd() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'O que deseja fazer ?',
      inputs: [
        {
          name: 'task',
          type: 'text',
          placeholder: 'O que deseja fazer'
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Adicionar',
          handler: (form) => {
            // console.log('Confirm Ok');
            this.add(form.task);
          }
        }
      ]
    });

    await alert.present();
  }

  delete(task: any) {
    this.tasks = this.tasks.filter(item => task != item);
    this.updateLocalStorage();
  }

  async add(newTask: string) {
    if(newTask.trim().length < 1) {
      const toast = await this.toastController.create({
        message: 'Informe o que deseja fazer?',
        duration: 2000,
        position: 'top'
      });

      toast.present();
      return;
    }

    let task = { name: newTask, done: false };
    this.tasks.push(task);
    this.updateLocalStorage();
  }

  updateLocalStorage() {
    localStorage.setItem('taskDb', JSON.stringify(this.tasks));
  }

  async openActions(task: any) {
    const actionSheet = await this.actionSheetController.create({
      header: 'O QUE DESEJA FAZER ?',
      cssClass: 'my-custom-class',
      buttons: [{
        text: task.done? 'Desmarcar': 'Marcar',
        role: task.done? 'radio-button-off': 'checkmark-circle',
        icon: task.done? 'radio-button-off': 'checkmark-circle',
        handler: () => {
          task.done = !task.done;

          this.updateLocalStorage();
        }
      }, {
        text: 'Cancelar',
        icon: 'close',
        handler: () => {
          console.log('Share clicked');
        }
      }]
    });
    await actionSheet.present();
  }

}
