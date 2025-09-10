import React, { useRef, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { defineElement } from 'lord-icon-element';    
import lottie from "lottie-web";
defineElement(lottie);



// Define lord-icon custom element
defineElement(lottie);

const Manager = () => {
  const passwordRef = useRef();
  const [form, setForm] = useState({ site: "", username: "", password: "" });
  const [passwordArray, setPasswordArray] = useState([]);
  const [copied, setCopied] = useState({ col: null, index: null });
  const [visiblePasswords, setVisiblePasswords] = useState({});

  // Fetch passwords from server
  const getPasswords = async () => {
    try {
      const res = await fetch("http://localhost:3000/");
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const passwords = await res.json();
      setPasswordArray(passwords);
    } catch (err) {
      console.error("Error fetching passwords:", err);
    }
  };

  useEffect(() => {
    getPasswords();
  }, []);

  const showPassword = () => {
    if (passwordRef.current.type === "password") {
      passwordRef.current.type = "text";
    } else {
      passwordRef.current.type = "password";
    }
  };

  const savePassword = async () => {
    if (form.site.length > 3 && form.username.length > 3 && form.password.length > 3) {
      const newEntry = { ...form, id: uuidv4() };
      setPasswordArray([...passwordArray, newEntry]);

      try {
        await fetch("http://localhost:3000/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newEntry),
        });
        setForm({ site: "", username: "", password: "" });
        toast.success('🦄 Password Saved!');
      } catch (err) {
        console.error(err);
        toast.error('Error saving password');
      }
    } else {
      toast.error('Error: Please fill all fields correctly');
    }
  };

  const deletePassword = async (id) => {
    if (window.confirm("Do you really want to delete this password?")) {
      setPasswordArray(passwordArray.filter(item => item.id !== id));
      try {
        await fetch(`http://localhost:3000/?id=${id}`, { method: "DELETE" });
        toast.info('Password Deleted');
      } catch (err) {
        console.error(err);
        toast.error('Error deleting password');
      }
    }
  };

  const editPassword = (id) => {
    const entry = passwordArray.find(item => item.id === id);
    if (entry) {
      setForm(entry);
      setPasswordArray(passwordArray.filter(item => item.id !== id));
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCopy = (text, col, index) => {
    navigator.clipboard.writeText(text);
    setCopied({ col, index });
    setTimeout(() => setCopied({ col: null, index: null }), 2000);
  };

  const toggleVisibility = (index) => {
    setVisiblePasswords(prev => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <div
      className="p-3 md:mycontainer min-h-[88.2vh] inset-0 -z-10 bg-white"
      style={{
        backgroundImage: `repeating-linear-gradient(to right, #8080801a, #8080801a 1px, transparent 1px),
                          repeating-linear-gradient(to bottom, #8080801a, #8080801a 1px, transparent 1px)`,
        backgroundSize: "14px 24px",
      }}
    >
      <h1 className="text-4xl font-bold text-center">
        <span className="text-purple-500">&lt;</span>
        <span>Pass</span>
        <span className="text-purple-500">OP/&gt;</span>
      </h1>
      <p className="text-purple-900 text-lg text-center">
        Your own Password Manager
      </p>

      {/* Form Section */}
      <div className="text-black flex flex-col p-4 gap-8 items-center">
        <input
          value={form.site}
          onChange={handleChange}
          placeholder="Enter Website URL"
          className="rounded-full border border-purple-500 w-[700px] p-4 py-1"
          type="text"
          name="site"
        />
        <div className="flex flex-col md:flex-row justify-between gap-8">
          <input
            value={form.username}
            onChange={handleChange}
            placeholder="Enter Username"
            className="rounded-full w-[400px] border border-purple-500 p-4 py-1"
            type="text"
            name="username"
          />
          <div className="relative">
            <input
              ref={passwordRef}
              value={form.password}
              onChange={handleChange}
              placeholder="Enter Password"
              className="rounded-full w-[200px] border border-purple-500 p-4 py-1"
              type="password"
              name="password"
            />
            <span
              className="absolute right-[3px] top-[4px] cursor-pointer"
              onClick={showPassword}
            >
              <img
                className="p-1"
                width={30}
                src="/icons/openeye.png"
                alt="eye"
              />
            </span>
          </div>
        </div>
        <button
          onClick={savePassword}
          className="flex justify-center items-center text-white bg-purple-500 hover:bg-purple-300 rounded-full px-8 py-2 gap-2 border border-purple-900"
        >
          <lord-icon
            src="https://cdn.lordicon.com/ueoydrft.json"
            trigger="hover"
            colors="primary:#121331,secondary:#6c16c7,tertiary:#ebe6ef"
            style={{ width: "30px", height: "30px" }}
          ></lord-icon>
          Save Password
        </button>
      </div>

      {/* Passwords List */}
      <div className="passwords mt-8">
        <h2 className="font-bold text-2xl py-4 text-center">Your Passwords</h2>
        {passwordArray.length === 0 && <div className="text-center">No passwords to show</div>}
        {passwordArray.length > 0 && (
          <div className="flex justify-center">
            <table className="table-auto w-[800px] rounded-md overflow-hidden mb-10">
              <thead className="bg-purple-800 text-white">
                <tr>
                  <th className="w-1/2 border border-white text-center px-4 py-2 rounded-l-lg">Site</th>
                  <th className="w-1/3 border border-white text-center px-4 py-2">Username</th>
                  <th className="w-1/6 border border-white text-center px-4 py-2">Password</th>
                  <th className="w-1/6 border border-white text-center px-4 py-2 rounded-r-lg">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-purple-100">
                {passwordArray.map((item, index) => (
                  <tr key={item.id}>
                    {/* Site */}
                    <td className="px-4 py-2 border border-white text-center relative">
                      <a href={item.site} target="_blank" rel="noreferrer">{item.site}</a>
                      <button
                        onClick={() => handleCopy(item.site, "site", index)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer text-gray-600 hover:text-purple-700 text-sm"
                      >
                        <span className="material-symbols-outlined text-base">
                          {copied.col === "site" && copied.index === index ? "check" : "content_copy"}
                        </span>
                      </button>
                    </td>

                    {/* Username */}
                    <td className="px-4 py-2 border border-white text-center relative">
                      {item.username}
                      <button
                        onClick={() => handleCopy(item.username, "username", index)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer text-gray-600 hover:text-purple-700 text-sm"
                      >
                        <span className="material-symbols-outlined text-base">
                          {copied.col === "username" && copied.index === index ? "check" : "content_copy"}
                        </span>
                      </button>
                    </td>

                    {/* Password */}
                    <td className="px-4 py-2 border border-white text-center">
                      <div className="flex items-center justify-center gap-3">
                        <span className="font-mono">
                          {visiblePasswords[index] ? item.password : "••••"}
                        </span>
                        <button
                          onClick={() => toggleVisibility(index)}
                          className="cursor-pointer text-gray-600 hover:text-purple-700"
                        >
                          <span className="material-symbols-outlined text-base">
                            {visiblePasswords[index] ? "visibility_off" : "visibility"}
                          </span>
                        </button>
                        <button
                          onClick={() => handleCopy(item.password, "password", index)}
                          className="cursor-pointer text-gray-600 hover:text-purple-700"
                        >
                          <span className="material-symbols-outlined text-base">
                            {copied.col === "password" && copied.index === index ? "check" : "content_copy"}
                          </span>
                        </button>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="flex items-center justify-center py-2 border border-white text-center">
                      <span className="cursor-pointer mx-1" onClick={() => editPassword(item.id)}>
                        <lord-icon
                          src="https://cdn.lordicon.com/exymduqj.json"
                          trigger="hover"
                          colors="primary:#000000,secondary:#6c16c7"
                          style={{ width: "25px", height: "25px" }}
                        ></lord-icon>
                      </span>
                      <span className="cursor-pointer mx-1" onClick={() => deletePassword(item.id)}>
                        <lord-icon
                          src="https://cdn.lordicon.com/jzinekkv.json"
                          trigger="hover"
                          colors="primary:#000000,secondary:#6c16c7"
                          style={{ width: "25px", height: "25px" }}
                        ></lord-icon>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick={false}
        pauseOnHover
        draggable
        theme="light"
      />
    </div>
  );
};

export default Manager;
