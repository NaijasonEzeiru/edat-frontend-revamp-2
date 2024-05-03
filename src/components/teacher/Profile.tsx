import React from "react";
import Image from "next/image";
import { Button } from "../ui/button";
// import { useUserProfilePictureUpdateMutation } from "@/services/studentApi";
import { FaSpinner } from "react-icons/fa";
import { useAppSelector } from "@/store/hooks";
import { useUserProfilePictureUpdateMutation } from "@/services/onBoardApi";
import { PencilLine } from "lucide-react";

const Profile = ({ teacherData, onEdit }: any) => {
  const user = useAppSelector((state) => state.auth);
  const [updateProfileImage, { data, isLoading, isError }] =
    useUserProfilePictureUpdateMutation();

  const updateProfilePicture = async (value: File | null) => {
    const formData = new FormData();
    if (value) {
      formData.append("image", value);
    }
    updateProfileImage({
      userId: teacherData.user_id,
      orgCode: teacherData.org_code,
      role: user.role,
      data: formData,
    });
  };

  return (
    <>
      <h2 className="text-2xl font-semibold md:text-center">Your Profile</h2>
      <div className="flex gap-4 md:gap-16 flex-col md:flex-row mt-5 md:mt-10">
        <div className=" mx-auto md:w-72 h-full relative md:hidden">
          {isLoading ? (
            <div className="animate-spin flex justify-center items-center h-48 text-4xl text-slate-500 duration-1000">
              <FaSpinner />
            </div>
          ) : (
            <Image
              alt={`photo of ${teacherData.first_name}`}
              src={teacherData?.image_url || "/profile.png"}
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
                  {teacherData.first_name}
                </p>
              </span>
              <span className="w-full">
                <p className="font-semibold">LAST NAME:</p>
                <p className="py-2.5 px-2 w-full bg-[#DDD] rounded-md">
                  {teacherData.last_name}
                </p>
              </span>
            </div>
            <div className="flex flex-col md:flex-row gap-4">
              <span className="w-full">
                <p className="font-semibold">GENDER:</p>
                <p className="py-2.5 px-2 w-full bg-[#DDD] rounded-md">
                  {teacherData.gender}
                </p>
              </span>
              <span className="w-full">
                <p className="font-semibold">DATE OF BIRTH:</p>
                <p className="py-2.5 px-2 w-full bg-[#DDD] rounded-md">
                  {teacherData.dob}
                </p>
              </span>
            </div>
            <span className="w-full">
              <p className="font-semibold">EMAIL:</p>
              <p className="py-2.5 px-2 w-full bg-[#DDD] rounded-md">
                {teacherData.email}
              </p>
            </span>

            {teacherData.qualification && (
              <span className="w-full">
                <p className="font-semibold">QUALIFICATION:</p>
                <p className="py-2.5 px-2 w-full bg-[#DDD] rounded-md">
                  {teacherData.qualification}
                </p>
              </span>
            )}
            {teacherData.previous_school && (
              <span className="w-full">
                <p className="font-semibold">PREVIOUS SCHOOL:</p>
                <p className="py-2.5 px-2 w-full bg-[#DDD] rounded-md">
                  {teacherData.previous_school}
                </p>
              </span>
            )}
            {teacherData.tutor_group && (
              <span className="w-full mb-2">
                <p className="font-semibold">TUTOR GROUP:</p>
                <p className="py-2.5 px-2 w-full bg-[#DDD] rounded-md">
                  {teacherData.tutor_group}
                </p>
              </span>
            )}
          </div>
          {!!teacherData?.about_me && (
            <span className="w-full mt-2">
              <p className="font-semibold">About Me:</p>
              <p className="py-2.5 px-2 w-full bg-[#DDD] rounded-md">
                {teacherData.about_me}
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
