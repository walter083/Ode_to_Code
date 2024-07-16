import React, { useEffect, useState } from 'react';
import DropDown from './DropDown';
import useStore from './store/store.js';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { db } from './firebase.js'; // Make sure you import the Firebase app correctly
import './FileUpload.css';
import ChatBot from './ChatBot.jsx';

const FileUpload = () => {
  const [fileType, setFileType] = useState('');
  const [file, setFile] = useState();

  const dropdown = useStore((state) => state.dropdown);

  useEffect(() => {
    console.log(dropdown);
  }, [dropdown]);

  const handleUploadFile = () => {
    if (file) {
      const fileType = file.type;
      if (fileType === 'text/csv' || file.name.endsWith('.csv')) {
        setFileType('CSV');
        readCSVFile(file);
      } else if (
        fileType === 'application/vnd.ms-excel' ||
        fileType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
        file.name.endsWith('.xls') ||
        file.name.endsWith('.xlsx')
      ) {
        setFileType('Excel');
        readExcelFile(file);
      } else {
        console.error("This file is not acceptable");
        setFile('');
        setFileType('');
      }
    }
  }

  const readCSVFile = (file) => {
    Papa.parse(file, {
      complete: async (result) => {
        const data = result.data;
        console.log("Parsed CSV Data: ", data);

        await uploadDataToFirestore(data);
      },
      header: true,
    });
  };

  const readExcelFile = (file) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      console.log("Parsed Excel Data: ", jsonData);

      await uploadDataToFirestore(jsonData);
    };
    reader.readAsArrayBuffer(file);
  };

  const uploadDataToFirestore = async (data) => {    
    if(!dropdown)     {
      console.log("Please choose the category");
      return;
    }
    const collectionName = dropdown; 
    const collectionRef = collection(db, collectionName);

    try {
      for (const row of data) {
        await addDoc(collectionRef, row);
      }
      console.log("Data uploaded successfully to Firestore");
    } catch (error) {
      console.error("Error uploading data to Firestore: ", error);
    }
  };

  return (
    <div className='file-upload-body'>
      <div className="data-entry-container">
        <DropDown />
        <input type='file' className='file-reader' onChange={(e) => { setFile(e.target.files[0]) }} />
        <button onClick={handleUploadFile}>Upload file</button>
      </div>
      <ChatBot/>
    </div>
  );
}

export default FileUpload;
