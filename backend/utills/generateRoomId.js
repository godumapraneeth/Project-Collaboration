import {nanoid} from "nanoid";

export default function generateRoomId(){
    return nanoid(10);
}