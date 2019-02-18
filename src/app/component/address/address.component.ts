import { Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from "angularfire2/firestore";
import 'firebase/storage'
import * as firebase from 'firebase/app';
import 'rxjs/add/operator/map'
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import {AngularFireAuth} from 'angularfire2/auth';
import {UserService} from '../../services/user.service';
import {AddressModel} from '../address/address.model';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/toPromise';
import {Roles} from '../firestoreuser/firestoreuserrole.model';
@Component({
  selector: 'app-firestoreuser',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.css']
})
export class AddressComponent implements OnInit {
  UsersCollection: AngularFirestoreCollection<AddressModel>;
  user: Observable<AddressModel[]>;
  UsersDoc: AngularFirestoreDocument<AddressModel>;
  userModel: AddressModel;
  addUser: AddressModel = new AddressModel("", "",null,"","","", null, null);
  editState: boolean = false;
  itemToUpdate: AddressModel;

  constructor(private afs: AngularFirestore, public afAuth:AngularFireAuth, public userService:UserService) {
    
    }

  ngOnInit() {
    console.log("idToken--->"+this.afAuth.auth.currentUser.uid);
    this.UsersCollection = this.afs.collection(this.getUrls('users'));
    this.getUsers();

  }

  getUsers(){
    console.log('Nice, Inside Users!');
    console.log("currentUser--->"+this.afAuth.auth.currentUser.uid);
    this.user = this.UsersCollection.snapshotChanges().map(changes => {
     return changes.map(a => {
     const data = a.payload.doc.data() as AddressModel;
     data.id = a.payload.doc.id;
     return data;
     });
   });
  }

  logout() {
    this.afAuth
      .auth
      .signOut();
  }
  setData(data, url, docId?) {   
    // there is no need of a separate UPDATE function if docID is passed as optional parameters
      let id = this.afs.createId();
      if(docId) {id = docId;} else { data["updatedAt"] = this.getCurrentDate(); // is a new doc }
      data["id"] = id;
      data["createdAt"] = this.getCurrentDate();
      data["author"] = this.afAuth.auth.currentUser.uid;
      data["delete_flag"] = "N";
      if(docId){
        return this.afs.collection(this.getUrls(url)).doc(docId).update(data);
      }
      else{
        return this.afs.collection(this.getUrls(url)).doc(id).set(data, { merge: true });
      }
      
      
    }
  }
  clearState() {
    this.editState = false;
    this.itemToUpdate = null;
    }
  insert() {
    const userRole: Roles = { admin: true, subscriber: true,editor:true  };
    this.addUser.roles= userRole;
    let userData = { name: this.addUser.name, email_id: this.addUser.email_id, contact_number: this.addUser.contact_number, image: this.addUser.image, address: this.addUser.address,category: this.addUser.category,roles:this.addUser.roles };
    this.addUser = new AddressModel("", "",null,"","", null, null);
    this.setData(userData, "users");
   }
   
   delete(item: AddressModel) {
    this.UsersDoc = this.afs.doc(`users/${item.id}`);
    this.UsersDoc.delete();
   }
   
   edit(item: AddressModel) {
    this.editState = true;
    this.itemToUpdate = new AddressModel(item.name, item.email_id, item.contact_number, item.image,item.address,item.category, item.id);
    }
   
   update() {
    let userData = { name: this.itemToUpdate.name, email_id: this.itemToUpdate.email_id, contact_number: this.itemToUpdate.contact_number, image: this.itemToUpdate.image ,address: this.itemToUpdate.address,category: this.itemToUpdate.category,};
    this.UsersDoc = this.afs.doc(`payrollusers/${this.itemToUpdate.id}`);
    this.UsersDoc.update(userData);
    console.log('id is '+this.itemToUpdate.id);
    this.setData(userData, "users", this.itemToUpdate.id);
    this.clearState();
   }
   
   editPost(userModel) {
    console.info("editPost this.userService"+this.userService);
    if(this.userService.canEdit(userModel)) {
      //this.postRef.update({ title: 'Edited Title!'})
    } 
    else {
      console.error('you are not allowed to do that!')
    }
  
  }

   getCollDocs(data, url){
    //return this.afs.collection(this.getUrls(url)).doc(docId).valueChanges();
    return this.afs.collection(this.getUrls(url), ref => 
                          ref.where('id', '==', data.portal)
                          .where('delete_flag', '==', 'N')
                          ).valueChanges();
  }
  getLookupDocs(url){
  // another example where firestore is allow read: if isDocOwner()
    return this.afs.collection(this.getUrls(url), ref => 
                          ref.where('delete_flag', '==', 'N').where("author", "==", this.afAuth.auth.currentUser.uid)
                          ).valueChanges();
  }

  getUrls(urlString){
    // instead of hardcoding real url (Collections), put these in function here
    // this way, developer can easliy re-route collection or document paths without changing it everywhere
    if(urlString == 'portal') { return 'payrollportal'; }
    if(urlString == 'users') { return 'payrollusers'; }
    if(urlString == 'salary') { return 'payrollsalary'; }
  }
  getCurrentDate(){
    //return firebase.firestore.FieldValue.serverTimestamp;
    return new Date();
    
  }
}
