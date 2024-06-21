import { Models } from "appwrite";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";

type UserCardProps = {
  creator: Models.Document;
};

const UserCard = ({ creator }: UserCardProps) => {
  return (
    <div className="flex flex-col flex-center ">
      <Link to={`/profile/${creator.$id}`}>
        <img
          src={creator.imageUrl || "/assets/icons/profile-placeholder.svg"}
          alt="logo"
          className="w-24 h-24 rounded-full mb-2 object-cover"
        />
      </Link>
      <h3 className="h3-bold">{creator.name}</h3>
      <p className=" body-medium text-light-3 my-3">@{creator.username}</p>
      <Button type="button" size="sm" className="shad-button_primary px-5">
        Follow
      </Button>
    </div>
  );
};

export default UserCard;
