import React, { useState, useEffect } from 'react';
import { db } from './firebase.js';
import { collection, getDocs, updateDoc, doc, addDoc, deleteDoc, deleteField } from 'firebase/firestore';
import './Excel.css';
import DropDown from "./DropDown.jsx";
import useStore from './store/store.js';
import ChatBot from './ChatBot.jsx';

const Excel = () => {
  const [data, setData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [editingCell, setEditingCell] = useState(null);
  const [error, setError] = useState(null);
  const [contextMenu, setContextMenu] = useState(null);  

  const selectedCollection = useStore((state) => state.dropdown);

  useEffect(() => {
    if (selectedCollection) {
      fetchData(selectedCollection);
    }
  }, [selectedCollection]);

  const fetchData = async (collectionName) => {
    try {
      const snapshot = await getDocs(collection(db, collectionName));
      const fetchedData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setData(fetchedData);

      const allKeys = fetchedData.reduce((keys, item) => {
        Object.keys(item).forEach(key => {
          if (key !== 'id' && !keys.includes(key)) {
            keys.push(key);
          }
        });
        return keys;
      }, []);

      setHeaders(allKeys);
    } catch (err) {
      setError(`Failed to fetch data from ${collectionName}. Please check your Firestore permissions.`);
      console.error(err);
    }
  };

  const handleCellClick = (row, col) => {
    setEditingCell({ row, col });
  };

  const handleCellChange = (e, row, col) => {
    const newData = [...data];
    newData[row][col] = e.target.value;
    setData(newData);
  };

  const handleCellBlur = async () => {
    if (editingCell) {
      const { row, col } = editingCell;
      try {
        const docRef = doc(db, selectedCollection, data[row].id);
        await updateDoc(docRef, { [col]: data[row][col] });
        setEditingCell(null);
      } catch (err) {
        setError('Failed to update data. Please check your Firestore permissions.');
        console.error(err);
      }
    }
  };

  const handleAddRow = async () => {
    try {
      const newRow = headers.reduce((acc, key) => ({ ...acc, [key]: '' }), {});
      const docRef = await addDoc(collection(db, selectedCollection), newRow);
      setData([...data, { id: docRef.id, ...newRow }]);
    } catch (err) {
      setError('Failed to add new row. Please check your Firestore permissions.');
      console.error(err);
    }
  };

  const handleAddColumn = async () => {
    const newColumnName = prompt('Enter new column name:');
    if (newColumnName && !headers.includes(newColumnName)) {
      setHeaders([...headers, newColumnName]);
      const updatedData = data.map(row => ({ ...row, [newColumnName]: '' }));
      setData(updatedData);

      try {
        for (const row of updatedData) {
          const docRef = doc(db, selectedCollection, row.id);
          await updateDoc(docRef, { [newColumnName]: '' });
        }
      } catch (err) {
        setError('Failed to add new column. Please check your Firestore permissions.');
        console.error(err);
      }
    }
  };

  const handleContextMenu = (e, row, col) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, row, col });
  };

  const handleDeleteCell = async () => {
    if (contextMenu) {
      const { row, col } = contextMenu;
      try {
        const docRef = doc(db, selectedCollection, data[row].id);
        await updateDoc(docRef, { [col]: deleteField() });
        const newData = [...data];
        delete newData[row][col];
        setData(newData);
      } catch (err) {
        setError('Failed to delete cell. Please check your Firestore permissions.');
        console.error(err);
      }
    }
    setContextMenu(null);
  };

  const handleDeleteRow = async () => {
    if (contextMenu) {
      const { row } = contextMenu;
      try {
        const docRef = doc(db, selectedCollection, data[row].id);
        await deleteDoc(docRef);
        const newData = data.filter((_, index) => index !== row);
        setData(newData);
      } catch (err) {
        setError('Failed to delete row. Please check your Firestore permissions.');
        console.error(err);
      }
    }
    setContextMenu(null);
  };

  return (
    <div className="excel" onClick={() => setContextMenu(null)}>    
      {error && <div className="error-message">{error}</div>}

      <DropDown />

      {selectedCollection && (
        <div className="excel-grid">
          <table>
            <thead>
              <tr>
                {headers.map(header => (
                  <th key={header}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, rowIndex) => (
                <tr key={row.id}>
                  {headers.map(header => (
                    <td 
                      key={header} 
                      onClick={() => handleCellClick(rowIndex, header)}
                      onContextMenu={(e) => handleContextMenu(e, rowIndex, header)}
                    >
                      {editingCell?.row === rowIndex && editingCell?.col === header ? (
                        <input
                          value={row[header] || ''}
                          onChange={(e) => handleCellChange(e, rowIndex, header)}
                          onBlur={handleCellBlur}
                          autoFocus
                        />
                      ) : (
                        row[header] || ''
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={handleAddRow} className="add-row-btn">Add Row</button>
          <button onClick={handleAddColumn} className="add-column-btn">Add Column</button>
        </div>
      )}
      {contextMenu && (
        <div 
          className="context-menu"
          style={{ top: contextMenu.y, left: contextMenu.x }}
        >
          <button onClick={handleDeleteCell}>Delete Cell</button>
          <button onClick={handleDeleteRow}>Delete Row</button>
        </div>
      )}
      <ChatBot/>
    </div>
  );
};

export default Excel;