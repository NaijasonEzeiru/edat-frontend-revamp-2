import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import EventBus from "../../utils/eventBus";
import Profile from "../../components/student/Profile";
import EditProfileForm from "../../components/student/EditProfileForm";
import ProtectedRoute from "../../components/route/ProtectedRoute";
import DefaultLayout from "../../layouts/DefaultLayout";
import { useLazyUserProfileUpdateQuery } from "../../services/studentApi";
import { useLazyGetUserQuery } from "@/services/onBoardApi";
import { useAppSelector } from "@/store/hooks";

const StudentProfile = () => {
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
    try {
      const response = await updateProfile({
        userId: user.user_id,
        orgCode: user.org_code,
        data: {
          about_me: updatedData.about_me,
          // subjects: "",
          // tutor_group: "",
          // previous_grade: "",
          // current_grade: "",
        },
      });
      setIsEditing(false);
      EventBus.emit("CLASSROOM", "fetchProfileData");
      EventBus.emit("ALERT", {
        message: "Profile updated successfully",
        alertType: "success",
        openStatus: true,
      });
      router.replace("/students/profile");
    } catch (error) {
      EventBus.emit("ALERT", {
        message: "Profile updated failed",
        alertType: "error",
        openStatus: true,
      });
    }

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
    //saveRouteState('routeState', router.asPath);

    if (user.isLoggedIn) {
      fetchProfileData();

      EventBus.on("CLASSROOM", fetchProfileData);
      return () => {
        EventBus.off("CLASSROOM", fetchProfileData);
      };
    }
  }, [user]);

  return (
    <ProtectedRoute allowedRoles={["student"]}>
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
                    studentData={data}
                    onSave={handleSave}
                    onClose={cancelEdit}
                  />
                ) : (
                  data && <Profile studentData={data} onEdit={handleEdit} />
                )}
              </>
            )}
          </>
        }
      />
    </ProtectedRoute>
  );
};

export default StudentProfile;
