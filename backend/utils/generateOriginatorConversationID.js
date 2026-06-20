import {v4 as uuidv4} from "uuid"

export const generateOriginatorConversationID = () => {
    const id = uuidv4().replace(/-/g, "")
    console.log(`ID ORIG ${id}`)
    return id
}