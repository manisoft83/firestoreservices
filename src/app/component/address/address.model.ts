import { Roles } from '../firestoreuser/firestoreuserrole.model'
export class AddressModel {

  constructor(public name: string, public email_id: string, public contact_number: number
    , public image: string, public address: string, public category: string, public id?: string, public roles?: Roles, ) {
  }
  
}
