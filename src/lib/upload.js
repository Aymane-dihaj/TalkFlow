import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "./firebase";

const upload = async (file) => {

    const date = new Date();

    const storageRef = ref(storage, `images/${date + '_' + file.name}`);

    const uploadTask = uploadBytesResumable(storageRef, file);


    return new Promise((resolve, rejected) => {

        uploadTask.on('state_changed', 
            (snapshot) => {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        }, 
        (error) => {
        // Handle unsuccessful uploads
            rejected("Something went wrong!");
        }, 
        () => {
        // Handle successful uploads on complete
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        resolve(downloadURL)
        });
        }
        );
    })
}


export default upload;