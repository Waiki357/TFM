import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { Message } from './models/message';
import { DataService } from './services/data-services';
import { Title } from '@angular/platform-browser';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpTransportType, HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { ActivatedRoute } from '@angular/router';
import { UsuarioChatResumen } from './models/usuarioChatResumen';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {

  public title: any;
  public res: any;
  public resmessage!: string;
  public loggedUserid: number = 0;
  public loggedUsername!: string;

  //API
  public chatUrl: string = '/api/usuario/userChat';

  //Chat
  public onlineUser: UsuarioChatResumen[] = [];
  public chatUsername!: string;
  public chatConnection!: string;
  public chatMessages: any = [];
  public chatMessage: Message = {
    senderid: '',
    receiverid: '',
    message: '',
    messagestatus: '',
    messagedate: new Date,
    IsGroup: false,
    IsPrivate: true,
    IsMultiple: false,
  };
  public _hubConnection!: HubConnection;

  @ViewChild('scrollMe') private myScrollContainer!: ElementRef;

  constructor(
    private titleService: Title,
    private dataService: DataService,
    private jwtHelper: JwtHelperService,
    private activatedRoute: ActivatedRoute  ) {

    const token = localStorage.getItem("jwt");

    if (token) {
      var loggedUser = this.jwtHelper.decodeToken(token);
      this.loggedUsername = loggedUser['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'];
      this.loggedUserid = loggedUser['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/sid'];
    }
  }

  ngOnInit() {
    this.titleService.setTitle("Chat");
    this.signalrConn();

    this.activatedRoute.queryParams.subscribe(params => {
      if (params['userEmail'])
        this.chooseUser(params['userEmail']);
    });

    this.dataService.getListaUsuarios().subscribe(
      item => { this.onlineUser = item },
      error => { console.log('oops', error) }
    );
  }

  signalrConn() {
    //Init Connection
    this._hubConnection = new HubConnectionBuilder().withUrl("http://localhost:44427/hubs/chat?user=" + this.loggedUsername, HttpTransportType.ServerSentEvents).build();    

    this._hubConnection.on('UpdateUserList', (onlineuser) => {      
      this.dataService.getListaUsuarios().subscribe(
        item => { this.onlineUser = item},
        error => { console.log('oops', error) }
      );
    });

    //Call client methods from hub to update User
    this._hubConnection.on('ReceiveMessage', (message: Message) => {
      this.chatUsername = message.senderid;
      this.chatLog();
    });

    //Start Connection
    this._hubConnection
      .start()
      .then(function () {
        console.log("Connected");
      });
  }

  sendMessage(message: string) {
    //Send Message
    if (message != '') {

      var chatMessage: Message = {
        senderid: this.loggedUsername,
        receiverid: this.chatUsername,
        message: message,
        messagestatus: "sent",
        messagedate: new Date,
        IsGroup: false,
        IsPrivate: true,
        IsMultiple: false,
      };

      this.chatMessages.push(chatMessage);
      this._hubConnection.invoke('SendMessage', chatMessage);      
    }
  }

  chooseUser(user: any) {
    this.chatUsername = user;
    this.chatLog();
    this.scrollToBottom();
  }

  chatLog() {
    //ChatLog
    var param = { Senderid: this.loggedUsername, Receiverid: this.chatUsername };
    var getchatUrl = this.chatUrl + '?param=' + JSON.stringify(param);
    this.dataService.get(getchatUrl)
      .subscribe(
        response => {
          this.res = response;
          if (this.res != null) {
            var chatLog = this.res.resdata;
            this.chatMessages = [];
            if (chatLog.length > 0) {
              for (var i = 0; i < chatLog.length; i++) {
                if (this.loggedUsername === chatLog[i].senderid) {
                  chatLog[i].messagestatus = "sent";
                }
                else {
                  chatLog[i].messagestatus = "received";
                }

                //Push-Data
                this.chatMessages.push(chatLog[i]);
              }
            }
          }
        }, error => {
          console.log(error);
        }
    );    
  }

  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) { }
  }

  ngOnDestroy() {
    //Stop Connection
    this._hubConnection
      .stop()
      .then(function () {
        console.log("Stopped");
      }).catch(function (err: { toString: () => any; }) {
        return console.error(err.toString());
      });
  }

}
