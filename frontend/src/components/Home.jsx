import { Fragment, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

const Home = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [file, setFile] = useState(null);
  const [token, setToken] = useState("");
  const [dataList, setDataList] = useState([]);

  const handleDownload = async (id) => {
    const code = prompt("Enter the 6-digit code:");

    if (code) {
      try {
        const response = await fetch(
          `http://localhost:4000/api/private/file/${id}?code=${code}`,
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.ok) {
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = "";
          document.body.appendChild(a);
          a.click();
          a.remove();
        } else {
          const body = await response.json();
          alert(body.error);
        }
      } catch (error) {
        console.error(error);
        alert("Error downloading the file");
      }
    } else {
      alert("Please enter a valid code!");
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:4000/api/private/file/${id}`,
        {
          method: "delete",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const body = await response.json();

      if (response.ok) alert("file deleted!");
      else alert(body.error);
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      fetchData(token);
    }
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    } else alert("File not selected!");
  };

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/");
  };

  const handleSubmit = async () => {
    if (!file) return alert("Please select file!");

    try {
      const response = await fetch("http://localhost:4000/api/private/file", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": file.type || "application/octet-stream",
          "X-Original-Filename": file.name,
        },
        body: file,
      });

      const data = await response.json();

      if (response.ok) {
        fetchData(token);
        alert("file uploaded!");
      } else alert(data.error);
    } catch (error) {
      alert(error.message);
      console.error(error);
    } finally {
      setFile(null);
      fileInputRef.current.value = "";
    }
  };

  const fetchData = (token) => {
    fetch("http://localhost:4000/api/private/file", {
      method: "get",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.ok) return response.json();
        else throw new Error("Error fetching data!");
      })
      .then((data) => setDataList(data))
      .catch((error) => alert(error.message));
  };

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (token) {
      setToken(token);
      fetchData(token);
    } else {
      navigate("/");
    }
  }, []);

  return (
    <Fragment>
      <div className="home">
        <div className="main-container">
          <h2>Upload New File</h2>
          <input type="file" ref={fileInputRef} onChange={handleFileChange} />
          <button className="upload-button" onClick={handleSubmit}>
            Submit
          </button>
          <button className="upload-button" onClick={handleLogout}>
            Logout
          </button>
        </div>

        <h2>Uploaded Files</h2>

        <div className="card-container">
          {dataList?.map((item) => (
            <div key={item._id} className="card">
              <h2>{item.originalName}</h2>
              <p>{item.code}</p>
              <div className="button-group">
                <button onClick={() => handleDownload(item._id)}>
                  Download
                </button>
                <button onClick={() => handleDelete(item._id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Fragment>
  );
};

export default Home;
