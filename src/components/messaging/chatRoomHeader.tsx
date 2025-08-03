import { getProfileImgUrl } from "../../services/users.services";

interface Props {
  receiverImage: string;
  receiverUsername: string;
}

const ChatRoomHeader = ({ receiverImage, receiverUsername }: Props) => {
  return (
    <div className="border-b p-4 flex items-center gap-4">
      <img
        src={getProfileImgUrl(receiverImage)}
        alt="receiver"
        className="w-10 h-10 rounded-full object-cover"
      />
      <h2 className="font-semibold">{receiverUsername}</h2>
    </div>
  );
};

export default ChatRoomHeader;
