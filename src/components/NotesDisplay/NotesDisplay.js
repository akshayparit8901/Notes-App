import React, { useEffect, useRef, useState } from 'react'
import arrow from '../../assets/arrow.png'
import arrow2 from '../../assets/arrow2.png'
import back_arrow from '../../assets/back_arrow.png'
import styles from './NotesDisplay.module.css'
import { generateInitials } from '../../utils/constants'

export const NotesDisplay = (props) => {
    const [displayNotes, setDisplayNotes] = useState(() => {
        const storedData = JSON.parse(localStorage.getItem("createdGroups"));
        return Array.isArray(storedData) ? storedData : [];
    }); // load previously stored notes
    const [currentNote, setCurrentNote] = useState() // auxillary note for temp store
    const [note, setNote] = useState(displayNotes[props.groupId] || { notes: [] });
    const [enableSubmitButton, setEnableSubmitButton] = useState(false)
    const text = useRef(null);

    useEffect(() => {
        // Retrieve data from local storage
        const storedData = JSON.parse(localStorage.getItem("createdGroups"));
        const cleanData = Array.isArray(storedData) ? storedData : [];

        // Update displayNotes state
        setDisplayNotes(cleanData);

        // Update note state using the callback function
        setNote(prevNote => cleanData[props.groupId] || { notes: [] });

        // Log the updated note text
    }, [props.groupId, setDisplayNotes]);


    const handleText = (e) => {
        
        if((e.target.value).trim().length > 0){
            setCurrentNote((e.target.value).trim())
            setEnableSubmitButton(true)
        }else{
            setEnableSubmitButton(false)
        }
        
    }

    const handleSaveNotes = (e) => {
        const newNote = {
            text: currentNote,
            date: new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }),
            time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }),
        };

        if (currentNote && currentNote.length !== 0) {
            setDisplayNotes((prevNotes) => {
                const updatedNotes = [...prevNotes];
                updatedNotes[props.groupId].notes.push(newNote);
                localStorage.setItem("createdGroups", JSON.stringify(displayNotes))
                text.current.value = ""
                setCurrentNote("")
                return updatedNotes;
            });
        } else {
            return;
        }

    }
    return (
        <div className={styles.main}>
            <div className={styles.header}>
               <img onClick={()=>props.goBack()} src={back_arrow} alt="back button" />
               <p style={{ backgroundColor: `${note.color}` }}>{generateInitials(note.text)}</p>
               <h1>{note?.text} </h1>
            </div>
            <div className={styles.notes_section}>
                {note.notes.length > 0 && note.notes.map((note, idx) => (
                    <div key={idx} className={styles.notes}>
                        <p>{note.text}</p>
                        <h4>{note.date} &bull; {note.time}</h4>
                    </div>
                ))}
            </div>
            <div className={styles.text_area}>
                <textarea onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        setEnableSubmitButton(false)
                        handleSaveNotes();
                    }
                }} ref={text} onChange={(e) => handleText(e)} name="" id="" cols="130" rows="10" placeholder='Enter text here...'></textarea>
                <img onClick={handleSaveNotes} src={enableSubmitButton ? arrow2 : arrow} alt="" />
            </div>
        </div>
    )
}
