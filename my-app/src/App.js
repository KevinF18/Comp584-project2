import React, { useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";

export default function App() {
  const [fileData, setFileData] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);

  const fetchData = async () => {
    try {
      if (selectedFiles.length > 0) {
        const responses = [];

        for (const file of selectedFiles) {
          const formData = new FormData();
          formData.append("my_audio_file", file);

          const response = await axios.post(
            "http://localhost:8086/api/file_tempo",
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );

          responses.push(response.data);
        }

        setFileData((prevData) => [...prevData, ...responses]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const submitFiles = async () => {
    await fetchData();
  };

  const handleFileChange = (event) => {
    setSelectedFiles([...event.target.files]);
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(fileData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "FileTempoData");
    XLSX.writeFile(wb, "file_tempo_data.xlsx");
  };

  return (
    <div className="App p-4">
      <h1>File Tempo Data</h1>
      <form>
        <input type="file" onChange={handleFileChange} multiple />
        <br />
        <button
          onClick={submitFiles}
          type="button"
          className="mt-3 btn btn-primary"
        >
          Add files
        </button>
      </form>
      <h4 className="mt-3">Table</h4>
      <table className="mt-3 table table-striped">
        <thead>
          <tr>
            <th scope="col">filename</th>
            <th scope="col">overall_tempo</th>
            <th scope="col">peak_1</th>
            <th scope="col">peak_2</th>
          </tr>
        </thead>
        <tbody>
          {fileData.map((data, index) => (
            <tr key={index}>
              <td>{data.filename}</td>
              <td>{data.overall_tempo}</td>
              <td>{data.peak_1}</td>
              <td>{data.peak_2}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={exportToExcel} type="button" className="btn btn-success">
        Export to Excel
      </button>
    </div>
  );
}
