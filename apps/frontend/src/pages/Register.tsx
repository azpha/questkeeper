import { useAuth } from "@/components/contexts/AuthContext";
import api from "@/utils/api";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const auth = useAuth();
  const navigate = useNavigate();

  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (auth.hasAuthLoaded && auth.currentUser) {
      navigate("/");
    }
  }, [auth]);
  useEffect(() => {
    api.checkRegistrationEligibility().then((res) => {
      if (!res) {
        navigate("/");
      }
    });
  }, []);
  useEffect(() => {
    if (error) {
      setTimeout(() => {
        setError("");
      }, 5000);
    }
  }, [error]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const name = formData.get("name");
    const email = formData.get("email");
    const password = formData.get("password");

    if (!name || !email || !password) {
      setError("Please fill out all inputs");
    } else {
      const registerResult = await api.registerAccount(
        email as string,
        password as string,
        name as string
      );
      if (registerResult) {
        auth.loadUserAuth();
        navigate("/");
      } else {
        setError("Something went wrong!");
      }
    }
  };

  return (
    <div className="bg-black flex justify-center items-center min-h-screen">
      <div className="flex flex-col space-y-2 items-center">
        <div className="bg-white rounded-lg p-2 text-center max-w-1/2">
          <h1 className="text-2xl font-bold">Welcome to QuestKeeper!</h1>
          <p>
            QuestKeeper is a simple solution for managing your ever-growing
            gaming backlog with ease.{" "}
          </p>
        </div>
        <div className="bg-white p-2 rounded-lg">
          <div className="my-2">
            <h1 className="text-center font-bold text-2xl">Register</h1>
            <hr />
          </div>

          <form onSubmit={(e) => onSubmit(e)}>
            <div className="space-y-1 text-center">
              <div className="block">
                <input
                  name="name"
                  placeholder="Name.."
                  type="text"
                  className="bg-black text-white rounded-lg p-2"
                />
              </div>
              <div className="block">
                <input
                  name="email"
                  placeholder="Email.."
                  type="text"
                  className="bg-black text-white rounded-lg p-2"
                />
              </div>
              <div className="block">
                <input
                  name="password"
                  placeholder="Password.."
                  type="password"
                  className="bg-black text-white rounded-lg p-2"
                />
              </div>
            </div>

            <div className="my-2 text-center">
              <button
                type="submit"
                className="bg-black text-white p-2 font-bold rounded-lg hover:cursor-pointer"
              >
                Submit
              </button>
              {error && <p className="text-red-500 font-semibold">{error}</p>}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
