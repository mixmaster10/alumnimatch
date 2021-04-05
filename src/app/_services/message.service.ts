import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/database';
import { ApiService } from 'src/app/_services/api.service';

declare var JSON, Date;

@Injectable({
    providedIn: 'root'
})

export class MessageService {
    messagesCount: any = [];
    unreadMessagesCount = 0;

    constructor(
        private db: AngularFireDatabase,
        private api: ApiService
    ) { }

    getCurrentUser() {
        return JSON.parse(localStorage.getItem('user'));
    }

    getMessages() {
        let me_uid = this.getCurrentUser().id;
        return this.db.object('/accounts/user_'+me_uid + '/conversations').valueChanges();
    }

    getConversation(uid) {
        let me_uid = this.getCurrentUser().id;
        return this.db.object('/accounts/user_'+me_uid + '/conversations/' + 'user_'+uid).valueChanges();
    }

    getMessage(convId) {
        return this.db.object('/conversations/' + convId).valueChanges();
    }

    setMessagesRead(user, count) {
        let me_uid = this.getCurrentUser().id;
        this.db.object('/accounts/user_'+me_uid + '/conversations/' + 'user_'+user.id).update({
            messagesRead: count
        })
    }

    getUserMessageCount() {
        this.getMessages().subscribe((conv: any) => {
            if (conv) {
                for (let c in conv) {
                    let convId = conv[c].conversationId;
                    this.getMessage(convId).subscribe((msg: any) => {
                        if (msg && msg.messages) {
                            conv[c].unreadMessagesCount = msg.messages.length - conv[c].messagesRead;
                            this.addUpdateMessagesCount(conv[c]);
                        }
                        
                    })
                }
            }
        })
    }

    addUpdateMessagesCount(conv) {
        let i = -1;
        this.messagesCount.forEach((m, idx) => {
            if (m.user.id == conv.user.id) {
                i = idx;
            }
        })    
        if (i > -1) {
            this.messagesCount[i] = conv
        } else {
            this.messagesCount.push(conv)
        }
    }

    get unreads() {        
        let n = 0;
        this.messagesCount.forEach((m, idx) => {
            if (m.unreadMessagesCount > 0) {
                n ++;
            }
        })
        document.title = "AlumniMatch";
        if (n) {
            document.title = "(" + n + ") AlumniMatch";
        }
        return n;
    }
    
    uploadImage(base64) {
        
    }

    sendMessage(messageText, type, messages, user, convId, image=null) {
        let me_uid = this.getCurrentUser().id;
        let newMessage = {
            date: new Date().toString(),
            sender: me_uid,
            type: type,
            message: messageText,
            image: type=='image' ? image : null
        }
        messages.push(newMessage);
        let num = messages.length - 1;
        if (convId) {
            this.db.object('/conversations/' + convId + '/messages/' + num).update(newMessage);
            let data = {
                uid: me_uid,
                rid: user.id,
                title: messageText
            };
            this.api.post('message/sendPush', data).subscribe((res: any) => {
                console.log('push notification sent: '+data.uid+' to '+data.rid);
            }, (err) => {
                if(!(err.status <=200 && err.status <= 299))
                    console.error('send push error: '+data.uid+' to '+data.rid, err);
                console.log('push notification sent: '+data.uid+' to '+data.rid);
            });
        } else {
            this.db.list('/conversations').push({
                dateCreated: new Date().toString(),
                messages: messages
            }).then((res) => {
                this.db.object('/accounts/user_'+me_uid + '/conversations/' + 'user_'+user.id).update({
                    conversationId: res.key,
                    user: user,
                    messagesRead: 1
                })
                this.db.object('/accounts/user_'+user.id + '/conversations/' + 'user_'+me_uid).update({
                    conversationId: res.key,
                    user: this.getCurrentUser(),
                    messagesRead: 0
                })
            })
            let data = {
                uid: me_uid,
                rid: user.id,
                title: messageText
            };
            this.api.post('message/sendPush', data).subscribe((res: any) => {
                console.log('push notification sent: '+data.uid+' to '+data.rid);
            }, (err) => {
                if(!(err.status <=200 && err.status <= 299))
                    console.error('send push error: '+data.uid+' to '+data.rid, err);
                console.log('push notification sent: '+data.uid+' to '+data.rid);
            });
        }
    }
    
    urlDetectReplace(message) {
        if (!message || message == '') return '';
        if (message.substr(0, 3) == '<p>') return message;
        message = message.replace(/<(.|\n)*?>/g, '');
        var rowAry = message.split("\n");
        if (rowAry.length > 0) {
            for (var i = 0; i < rowAry.length; i++) {
                var wordAry = rowAry[i].split(" ");
                if (wordAry.length > 0) {
                    for (var k = 0; k < wordAry.length; k++) {
                        if (/\w+[\.]\w+/.test(wordAry[k])) {
                            if (wordAry[k].includes("http")) {
                                wordAry[k] = '<a href="' + wordAry[k] + '" target="_blank">' + wordAry[k] + '</a>';
                            } else {
                                wordAry[k] = '<a href="http://' + wordAry[k] + '" target="_blank">' + wordAry[k] + '</a>';
                            }
                        }
                    };
                }
                rowAry[i] = wordAry.join(" ");
            }
        }
        var replacedMessage = rowAry.join("\n");
        // if (this.isMobile) {
        //     setTimeout(() => {
        //         $("body").on("click", "a", function (e) { e.preventDefault() });
        //     }, 300);
        // }
        return replacedMessage;
    }

}