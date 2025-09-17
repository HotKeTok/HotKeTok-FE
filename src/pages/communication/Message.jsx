import MessageTemplate from "../../templates/communication/MessageTemplate";
import { EXAMPLE_SENT_MESSAGE_LIST, EXAMPLE_RECEIVED_MESSAGE_LIST } from "../../mocks/communication/message";

export default function Message(){

    return (
        <MessageTemplate
            receivedMessages={EXAMPLE_RECEIVED_MESSAGE_LIST}
            sentMessages={EXAMPLE_SENT_MESSAGE_LIST}
        />
    )
}