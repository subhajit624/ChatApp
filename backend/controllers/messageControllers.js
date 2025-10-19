import {Conversation} from "../models/conversionModel.js";
import { Message } from "../models/messageModel.js";


export const getAllMessages = async (req, res) => {
       try {
            const {id: receiverId} = req.params;
            const senderId = req.user._id;
            if (!receiverId) {
                  return res.status(400).json({ error: "Receiver ID is required" });
            }
            const conversion = await Conversation.findOne({ participants:{ $all: [senderId, receiverId] } }).populate("messages");
            if (!conversion) return res.status(200).json([]);
            const messages = conversion.messages;
            res.status(200).json(messages);
       } catch (error) {
              console.log("Error in getAllMessages controller: ", error.message);
              res.status(500).json({ error: "Internal server error" });
       }

}


export const sendMessage = async (req, res) => {
        try {
            const {id: receiverId} = req.params;
            const {message} = req.body;
            const senderId = req.user._id;
            if (!receiverId || !message) {
                return res.status(400).json({ error: "Receiver ID and message are required" });
            }
            let conversation = await Conversation.findOne({ participants: { $all: [senderId, receiverId] } });
            if(!conversation){
                 conversation = await Conversation.create({
                    participants: [senderId, receiverId],
                    messages: []
                });
            }
            const newMessage = await Message.create({
                sender: senderId,
                receiver: receiverId,
                message
            });
            if(newMessage){
			conversation.messages.push(newMessage._id);
		    }
            await conversation.save();
            res.status(201).json({ message: "Message sent successfully", success: true, newMessage });
        } catch (error) {
            console.log("Error in sendMessage controller: ", error.message);
            res.status(500).json({ error: "Internal server error" });
        }
}