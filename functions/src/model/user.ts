import { jugnu, DocumentField, DocumentKey, FirebaseCollection } from "@fire-fly/jugnu";

@FirebaseCollection()
export class User {

    @DocumentKey(jugnu.Types.DocumentKeyType.UserDefined)
    uuid: string;

    @DocumentField
    temp: {
        u: string,
        p: string
    };

    constructor(id: string){
        this.uuid = id;
        this.temp = {
            u: "",
            p: ""
        };
    }
}
