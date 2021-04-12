import { Injectable } from '@angular/core';
import {
  Plugins,
  PushNotification,
  PushNotificationToken,
  PushNotificationActionPerformed,
  Capacitor
} from '@capacitor/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

const { PushNotifications } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class FcmService {

  constructor(private router: Router, private alertCtrl: AlertController) { }

  public initPush() {
    if (Capacitor.platform !== 'web') {
      this.registerPush();
    }
  }

  private registerPush() {
    //
    PushNotifications.requestPermission().then((permission) => {
      if (permission.granted) {
        // Register with Apple / Google to receive push via APNS/FCM
        PushNotifications.register();
      } else {
        // No permission for push granted
      }
    });
    //
    PushNotifications.addListener(
      'registration',
      (token: PushNotificationToken) => {
        console.log('My token: ' + JSON.stringify(token));
      }
    );
    //
    PushNotifications.addListener('registrationError', (error: any) => {
      console.log('Error: ' + JSON.stringify(error));
    });
    //
    PushNotifications.addListener(
      'pushNotificationReceived',
      async (notification: PushNotification) => {
        //
        console.log('Push received stringify->: ' + JSON.stringify(notification));
        console.log('notification',notification)
        //
        const alert = await this.alertCtrl.create({
          cssClass: 'my-custom-class',
          header: notification.title,
          message: notification.body,
          buttons: ['OK']
        });
        await alert.present();
/*
Push received: {"id":"0:1618166578891692%f615719df615719d","data":{"cargar":"1"},"title":"prueba android 2","body":"revisando android"}
*/
       
      }
    );
    //
    PushNotifications.addListener(
      'pushNotificationActionPerformed',
      async (notification: PushNotificationActionPerformed) => {
        const data = notification.notification.data;
        console.log('Action performed: ' + JSON.stringify(notification.notification));
        if (data.detailsId) {
          this.router.navigateByUrl(`/home/${data.detailsId}`);
        }
      }
    );
  }
  //
}