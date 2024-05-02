import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import DefaultLayout from "@/layouts/DefaultLayout";
import { useLazyGetUserQuery } from "@/services/onBoardApi";
import { useRouter } from "next/router";
import ProtectedRoute from "@/components/route/ProtectedRoute";
import EditProfileForm from "@/components/parent/EditProfileForm";
import Profile from "@/components/parent/Profile";

const Parents = () => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [getUser, { isLoading, data, error }] = useLazyGetUserQuery();

  const handleEdit = () => {
    setIsEditing(true);
  };
  const cancelEdit = () => {
    setIsEditing(false);
  };
  useEffect(() => {
    // Perform localStorage action
    const item = localStorage.getItem("edat_token");
    if (!item) {
      router.push("/");
    } else {
      setToken(item);
    }
  }, []);

  useEffect(() => {
    if (token) {
      const userDetail: any = jwtDecode(token);
      getUser({
        userId: userDetail.user_id,
        orgCode: userDetail.org_code,
        token,
        role: userDetail.is_parent ? "parent" : userDetail.role,
        apiRoute: "profile",
      });
    }
  }, [token]);

  return (
    <ProtectedRoute allowedRoles={["parent"]}>
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
                    parentData={data}
                    // onSave={handleSave}
                    up
                    onClose={cancelEdit}
                  />
                ) : (
                  data && <Profile parentData={data} onEdit={handleEdit} />
                )}
              </>
            )}
          </>
        }
      ></DefaultLayout>
    </ProtectedRoute>
  );
};

export default Parents;
