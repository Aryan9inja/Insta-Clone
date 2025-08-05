import { getProfileImgUrl } from "../../services/users.services";
import { StepBack } from "lucide-react";

interface Props {
  receiverImage: string;
  receiverUsername: string;
  onBack:()=>void;
}

const ChatRoomHeader = ({ receiverImage, receiverUsername,onBack }: Props) => {
  return (
    <div className="border-b p-4 flex items-center gap-4">
      <div><StepBack onClick={onBack} size={30}/></div>
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
