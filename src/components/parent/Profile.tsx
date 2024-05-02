import { useUserProfilePictureUpdateMutation } from "@/services/onBoardApi";
import { PencilLine } from "lucide-react";
import Image from "next/image";
import { FaSpinner } from "react-icons/fa";
import { Button } from "../ui/button";

const Profile = ({ parentData, onEdit }: any) => {
  const [updateProfileImage, { isLoading }] =
    useUserProfilePictureUpdateMutation();

  const updateProfilePicture = async (value) => {
    const formData = new FormData();
    formData.append("image", value);
    updateProfileImage({
      userId: parentData.user_id,
      orgCode: parentData.org_code,
      role: "parent",
      data: formData,
    });
  };
  return (
    <>
      <h2 className="text-2xl font-semibold md:text-center">Your Profile</h2>
      <div className="flex gap-4 md:gap-16 flex-col md:flex-row mt-5 md:mt-10">
        <div className=" mx-auto md:w-72 h-full relative">
          {isLoading ? (
            <div className="animate-spin flex justify-center items-center h-48 text-4xl text-slate-500 duration-1000">
              <FaSpinner />
            </div>
          ) : (
            <Image
              alt={`photo of ${parentData.first_name}`}
              src={
                parentData.image_url == "https://example.com/image.jpg"
                  ? "/profile.png"
                  : parentData.image_url || "/profile.png"
              }
              width={200}
              height={200}
              className="object-cover rounded-md w-72 h-60 m-auto"
            />
          )}
          {!isLoading && (
            <label className="py-1.5 w-full absolute bottom-0 bg-[#00000045]">
              <p className="text-center text-white">Change photo</p>
              <input
                accept="image/*"
                // id="profile-image-upload"
                type="file"
                style={{ display: "none" }}
                onChange={(event) =>
                  updateProfilePicture(
                    event.target.files ? event.target.files[0] : null
                  )
                }
              />
            </label>
          )}
        </div>
        <div className="grow mt-4 md:mt-0">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row gap-4">
              <span className="w-full">
                <p className="font-semibold">FIRST NAME:</p>
                <p className="py-2.5 px-2 w-full bg-[#DDD] rounded-md">
                  {parentData?.first_name}
                </p>
              </span>
              <span className="w-full">
                <p className="font-semibold">LAST NAME:</p>
                <p className="py-2.5 px-2 w-full bg-[#DDD] rounded-md">
                  {parentData?.last_name}
                </p>
              </span>
            </div>
            <div className="flex flex-col md:flex-row gap-4">
              <span className="w-full">
                <p className="font-semibold">DATE OF BIRTH:</p>
                <p className="py-2.5 px-2 w-full bg-[#DDD] rounded-md">
                  {parentData?.dob}
                </p>
              </span>
              <span className="w-full">
                <p className="font-semibold">GENDER:</p>
                <p className="py-2.5 px-2 w-full bg-[#DDD] rounded-md">
                  {parentData?.gender}
                </p>
              </span>
            </div>
            <span className="w-full">
              <p className="font-semibold">EMAIL:</p>
              <p className="py-2.5 px-2 w-full bg-[#DDD] rounded-md">
                {parentData?.email}
              </p>
            </span>

            {!!parentData?.qualification && (
              <span className="w-full">
                <p className="font-semibold">QUALIFICATION:</p>
                <p className="py-2.5 px-2 w-full bg-[#DDD] rounded-md">
                  {parentData?.qualification}
                </p>
              </span>
            )}
            {!!parentData?.occupation && (
              <span className="w-full">
                <p className="font-semibold">OCCUPATION:</p>
                <p className="py-2.5 px-2 w-full bg-[#DDD] rounded-md">
                  {parentData?.occupation}
                </p>
              </span>
            )}
            {!!parentData?.spouse_name && (
              <span className="w-full">
                <p className="font-semibold">SPOUSE NAME:</p>
                <p className="py-2.5 px-2 w-full bg-[#DDD] rounded-md">
                  {parentData?.spouse_name}
                </p>
              </span>
            )}
            {!!parentData?.spouse_occupation && (
              <span className="w-full">
                <p className="font-semibold">SPOUSE OCCUPATION:</p>
                <p className="py-2.5 px-2 w-full bg-[#DDD] rounded-md">
                  {parentData?.spouse_occupation}
                </p>
              </span>
            )}
            {!!parentData?.spouse_contact_no && (
              <span className="w-full">
                <p className="font-semibold">SPOUSE CONTACT_NO:</p>
                <p className="py-2.5 px-2 w-full bg-[#DDD] rounded-md">
                  {parentData?.spouse_contact_no}
                </p>
              </span>
            )}
            {!!parentData?.no_of_children && (
              <span className="w-full">
                <p className="font-semibold">NUMBER OF CHILDREN:</p>
                <p className="py-2.5 px-2 w-full bg-[#DDD] rounded-md">
                  {parentData?.no_of_children}
                </p>
              </span>
            )}
          </div>
          {!!parentData?.about_me && (
            <span className="w-full mt-2">
              <p className="font-semibold mt-5">ABOUT ME:</p>
              <p className="py-2.5 px-2 w-full bg-[#DDD] rounded-md">
                {parentData?.about_me}
              </p>
            </span>
          )}
        </div>
      </div>
      <div className="text-center mt-8">
        <Button className="" onClick={onEdit}>
          <PencilLine className="mr-2 size-4" />
          Edit Profile
        </Button>
      </div>
    </>
  );
};

export default Profile;
