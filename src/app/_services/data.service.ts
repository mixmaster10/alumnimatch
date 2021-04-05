import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Subject } from 'rxjs/internal/Subject';
import { College } from '../profile/_components/ps-colleges/ps-colleges.component';


export interface UserInfo {
  user: {
    activated_at: string;
    avatar: string;
    college: College | any;
    coordinate: any;
    created_at: string;
    first_name: string;
    fr_count: number;
    freq_count: number;
    friends_count: number;
    events_count?: number;
    graduated: any;
    id: number;
    last_name: string;
    new_visits_count?: number;
    online: number;
    updated_at: string;
    verified_at: string;
    messages_count?: number;
    //rank?: number;
    visits_count?: number;
  },
  cl: any,
  ps: any,
  friends: any,
  messages?: any,
  nears?: any,
  visitors?: any,
  friend_requests?: any,
  //company: any
}

@Injectable({
  providedIn: 'root'
})
export class DataService {

  userInfo: UserInfo = {
    user: {
      activated_at: '',
      id: -1,
      first_name: 'First Name',
      last_name: 'Last Name',
      avatar: '',
      messages_count: -1,
      friends_count: -1,
      freq_count: -1,
      events_count: -1,
      visits_count: -1,
      new_visits_count: -1,
      //rank: -1,
      coordinate: -1,
      college: {},
      created_at: '', 
      fr_count: -1, 
      graduated: '',
      online: -1,
      updated_at: '', 
      verified_at: ''
    },
    cl: {},
    ps: {},
    friends: []
  }

  userStatus: BehaviorSubject<UserInfo> = new BehaviorSubject(null);
  userStatusObs = this.userStatus.asObservable()
  nearsChange: BehaviorSubject<any> = new BehaviorSubject(null);
  freqsChange: BehaviorSubject<any> = new BehaviorSubject(null);
  msgRead: BehaviorSubject<any> = new BehaviorSubject(null);

  alumni: any;

  constructor() { }

  initUserData(u: UserInfo) {
    console.log("Init user data", u)
    this.userInfo = {
      ...u
    };
    this.userStatus.next({...u});
    console.log("User data on init", this.userInfo)
  }

  updateUserData(update: any) {
    console.log("UPdate user data", update)
    Object.keys(update).forEach((key) => {
      this.userInfo[key] = {...this.userInfo[key], ...update[key]}
    })
    //this.userInfo = {...update, ...this.userInfo}
    this.userStatus.next(this.userInfo)
    console.log("User data", this.userInfo)
  }

  clearUser() {
    this.userStatus.next(null)
    this.userInfo = {
      user: {
        activated_at: '',
        id: -1,
        first_name: 'First Name',
        last_name: 'Last Name',
        avatar: '',
        messages_count: -1,
        friends_count: -1,
        freq_count: -1,
        events_count: -1,
        visits_count: -1,
        new_visits_count: -1,
        //rank: -1,
        coordinate: -1,
        college: {},
        created_at: '', 
        fr_count: -1, 
        graduated: '',
        online: -1,
        updated_at: '', 
        verified_at: ''
      },
      cl: {},
      ps: {},
      friends: []
    }
  }

  updateMessagesCount(isNew: boolean) {
    if (isNew) {
      this.userInfo.user.messages_count = (this.userInfo.user.messages_count || 0) + 1;
    } else if (this.userInfo.user.messages_count) {
      this.userInfo.user.messages_count--;
    } else {
      this.userInfo.user.messages_count = 0;
    }
    this.userStatus.next(this.userInfo);
  }

  markAsReadMessage(res, msgId) {
        if (this.userInfo.user.messages_count) {
          this.userInfo.user.messages_count--;
        } else {
          this.userInfo.user.messages_count = 0;
        }
        this.userStatus.next(this.userInfo);
        this.msgRead.next(msgId);
  }

  updateMessageNum(count: number) {
    this.userInfo.user.messages_count = count;
    this.userStatus.next(this.userInfo);
  }

  updateFreqCount(isNew: boolean) {
    if (isNew) {
      this.userInfo.user.freq_count = (this.userInfo.user.freq_count || 0) + 1;
    } else if (this.userInfo.user.freq_count) {
      this.userInfo.user.freq_count--;
    } else {
      this.userInfo.user.freq_count = 0;
    }
    this.userStatus.next(this.userInfo);
  }

  updateFriendsCount(isNew: boolean) {
    if (isNew) {
      this.userInfo.user.friends_count = (this.userInfo.user.friends_count || 0) + 1;
    } else if (this.userInfo.user.friends_count) {
      this.userInfo.user.friends_count--;
    } else {
      this.userInfo.user.friends_count = 0;
    }
    this.userStatus.next(this.userInfo);
  }

  updateEventsCount(isNew: boolean) {
    if (isNew) {
      this.userInfo.user.events_count = (this.userInfo.user.events_count || 0) + 1;
    } else if (this.userInfo.user.events_count) {
      this.userInfo.user.events_count--;
    } else {
      this.userInfo.user.events_count = 0;
    }
    this.userStatus.next(this.userInfo);
  }

  updateUserAvatar(avatar) {
    this.userInfo.user.avatar = avatar;
    this.userStatus.next(avatar);
  }

  updateUserCoordinate(coordiante) {
    this.userInfo.user.coordinate = coordiante;
  }

  updateNears(nears) {
    this.nearsChange.next(nears);
  }

  updateFriendRequest(reqs) {
    this.freqsChange.next(reqs);
  }

  getUserCoords() {
    return this.userInfo.user.coordinate;
  }

  updateUserCoords(coordinate) {
    return this.userInfo.user.coordinate = coordinate;
  }

  getUserInfo() {
    return this.userInfo
  }
}
