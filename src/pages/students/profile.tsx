import { useState, useEffect } from "react";
import EventBus from "../../utils/eventBus";
import Profile from "../../components/student/Profile";
import EditProfileForm from "../../components/student/EditProfileForm";
import ProtectedRoute from "../../components/route/ProtectedRoute";
import DefaultLayout from "../../layouts/DefaultLayout";
import { useLazyGetUserQuery } from "@/services/onBoardApi";
import { useAppSelector } from "@/store/hooks";

const StudentProfile = () => {
  const user = useAppSelector((state) => state.auth);
  const [isEditing, setIsEditing] = useState(false);
  const [getUser, { isLoading, data, error }] = useLazyGetUserQuery();

  const handleEdit = () => {
    setIsEditing(true);
  };
  const cancelEdit = () => {
    setIsEditing(false);
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
                  <EditProfileForm studentData={data} onClose={cancelEdit} />
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
