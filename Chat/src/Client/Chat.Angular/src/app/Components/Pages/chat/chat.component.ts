import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { AuthService } from '../../../Services/Auth/auth.service';
import { Router, RouterLink } from '@angular/router';
import { ProfileInfoDTO } from '../../../Model/profile-info-dto';
import { error } from 'console';
import { Message } from '../../../Model/message';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent implements OnInit {
  
  private connection: HubConnection;
  public messages: string[] = [];
  public message: string = "";
  profile: ProfileInfoDTO | undefined;


  constructor(private authService:AuthService,private router:Router) {
    this.connection = new HubConnectionBuilder()
      .withUrl('https://localhost:7139/chathub',
      {
        accessTokenFactory:() => this.authService.getAccessToken()!
      })
      .configureLogging(LogLevel.Information)
      .build();
  }

  async ngOnInit() {
    this.getProfile();

    this.authService.getAllMessages().subscribe(
      (messages:Message[]) =>{
        console.log(messages)
        this.messages = messages.map(message =>message.senderId +':'+ message.text);
      }
    )

    this.connection.on('ReceiveMessage', (user, message) => {
      this.messages.push(`${user}: ${message}`);
    });

    try {
      await this.connection.start();
      console.log('Connected to SignalR hub');
    } catch (error) {
      console.error('Failed to connect to SignalR hub', error);
    }
  }

  async sendMessage() {
    if (!this.message) return;
    await this.connection.invoke('SendMessage', this.message);
    this.message = '';
  }

  getProfile() {
    this.authService.getProfileInfo().subscribe(
      (profile: ProfileInfoDTO) => {
        this.profile = profile;
        console.log('Profile Info:', this.profile);
      },
      (error) => {
        console.error('Error fetching profile:', error);
      }
    );
  }

  LogOut(){
    window.localStorage.clear();
    this.router.navigate(['/login'])
  }
}
