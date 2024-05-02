import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import EventBus from "../../utils/eventBus";
import Profile from "../../components/teacher/Profile";
import EditProfileForm from "../../components/teacher/EditProfileForm";
import ProtectedRoute from "../../components/route/ProtectedRoute";
import DefaultLayout from "../../layouts/DefaultLayout";
import {
  useLazyGetTeacherProfileQuery,
  useLazyUserProfileUpdateQuery,
} from "../../services/teacherApi";
import { useAppSelector } from "@/store/hooks";
import { useLazyGetUserQuery } from "@/services/onBoardApi";

const TeacherProfile = () => {
  const router = useRouter();
  const user = useAppSelector((state) => state.auth);
  const [isEditing, setIsEditing] = useState(false);

  const [getUser, { isLoading, data, error }] = useLazyGetUserQuery();
  const [updateProfile] = useLazyUserProfileUpdateQuery();

  const handleEdit = () => {
    setIsEditing(true);
  };
  const cancelEdit = () => {
    setIsEditing(false);
  };

  const handleSave = async (updatedData, setSubmitting) => {
    updateProfile({
      userId: user.user_id,
      orgCode: user.org_code,
      data: updatedData,
    });
    setIsEditing(false);
    EventBus.emit("CLASSROOM", "fetchProfileData");
    EventBus.emit("ALERT", {
      message: "Profile updated successful",
      alertType: "success",
      openStatus: true,
    });
    router.replace("/teachers/profile");
    setSubmitting(false);
  };

  const fetchProfileData = () => {
    getUser({
      userId: user.user_id,
      orgCode: user.org_code,
      role: user.role,
      apiRoute: "profile",
    });
  };

  useEffect(() => {
    if (user.isLoggedIn) {
      fetchProfileData();
      EventBus.on("CLASSROOM", fetchProfileData);
      return () => {
        EventBus.off("CLASSROOM", fetchProfileData);
      };
    }
  }, [user]);

  return (
    <ProtectedRoute allowedRoles={["teacher"]}>
      <DefaultLayout
        children={
          <>
            {isLoading ? (
              <div>Loading...</div>
            ) : (
              <>
                {error && <div>Error loading profile</div>}
                {isEditing ? (
                  <EditProfileForm
                    teacherData={data}
                    onSave={handleSave}
                    onClose={cancelEdit}
                  />
                ) : (
                  data && <Profile teacherData={data} onEdit={handleEdit} />
                )}
              </>
            )}
          </>
        }
      />
    </ProtectedRoute>
  );
};

export default TeacherProfile;
