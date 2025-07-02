import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bounce, toast } from "react-toastify";
import axiosInstance from "../Config/Axios";
import EndPixPreloader from "../Components/EndPixPreloader";

const DashBoardProtector = ({ children }) => {
  const token = localStorage.getItem("token");
  const Navigate = useNavigate();

  const [isLoading, setisLoading] = useState(true);

  if (!token) {
    Navigate("/");
    localStorage.clear();
  }

  useEffect(() => {
    const checkUser = async () => {
      try {
        const res = await axiosInstance.get("/users/get-user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.status === 200) {
          setTimeout(() => {
            setisLoading(false);
          }, 4500);
        } else {
          localStorage.clear();
          Navigate("/");
        }
      } catch (error) {
        console.log(error);
        localStorage.clear();
        Navigate("/");
      }
    };

    checkUser();
  }, [token, Navigate]);

  if (isLoading) {
    return (
      <>
        <EndPixPreloader />;
      </>
    );
  }

  return <>{children}</>;
};

export default DashBoardProtector;
