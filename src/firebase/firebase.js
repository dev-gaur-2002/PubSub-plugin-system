const admin = require("firebase-admin");
const { PubSub } = require("@google-cloud/pubsub");
const { publishNewMessage } = require("../publisher/pub");

const serviceAccount = require("./config.json")

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const fireStore = admin.firestore();
const userRef = fireStore.collection("Users");


const topic = "user_responses";
const psClient = new PubSub();

const readDoc = async (docId) => {
    try {
        const myDoc = await userRef.doc(docId).get();
        if (myDoc.exists) {
            console.log("document exists with id " + docId);
            return myDoc;
        } else {
            console.log("Document with given iod not found");
        }
    } catch (error) {
        console.log(error);
    }
};

const addDoc = async (newData, res) => {

    const existingDocs = await userRef
        .where("userName", "==", newData.userName)
        .get();

    if (existingDocs.empty) {
        const addedRecord = await userRef.add(newData).then(async(docRef)=>{
            let response =  await readDoc(docRef.id.toString());
            
            if(response){
                await publishNewMessage(psClient,topic,response)
            }
        });
        res.json({
            success:true,
            addedRecord
        })
        console.log("New document added.");
    } else {
        console.log("Similar document already exists.");
        res.json({
            success:false,
            error:"document already exists"
        })
    }
};

module.exports = {
    readDoc,
    addDoc,
};
