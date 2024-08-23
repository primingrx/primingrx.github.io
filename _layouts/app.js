// Firebase configuration

 const firebaseConfig = {
    apiKey: "AIzaSyAEzy2prGjqqahSTb0beDYncThESROhYhw",
    authDomain: "findpartner-160xr.firebaseapp.com",
    projectId: "findpartner-160xr",
    storageBucket: "findpartner-160xr.appspot.com",
    messagingSenderId: "493851035745",
    appId: "1:493851035745:web:d2841311a12a7e0ebbc220",
    measurementId: "G-R2QEVZSV2Q"
  };


// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Show the login form initially
document.getElementById('login-container').style.display = 'block';

// Login event
document.getElementById('login-btn').addEventListener('click', () => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    auth.signInWithEmailAndPassword(email, password)
        .then(userCredential => {
            document.getElementById('login-container').style.display = 'none';
            document.getElementById('travel-form').style.display = 'block';
        })
        .catch(error => console.error('Error signing in:', error));
});

// Sign up event
document.getElementById('signup-btn').addEventListener('click', () => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    auth.createUserWithEmailAndPassword(email, password)
        .then(userCredential => {
            document.getElementById('login-container').style.display = 'none';
            document.getElementById('travel-form').style.display = 'block';
        })
        .catch(error => console.error('Error signing up:', error));
});

// Submit travel plan
document.getElementById('submit-plan').addEventListener('click', () => {
    const userId = auth.currentUser.uid;
    const departure = document.getElementById('departure').value;
    const destination = document.getElementById('destination').value;
    const startDate = document.getElementById('start-date').value;
    const endDate = document.getElementById('end-date').value;

    db.collection('travelPlans').add({
        userId,
        departure,
        destination,
        startDate,
        endDate,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
    }).then(() => {
        findMatchingPlans(departure, destination, startDate, endDate);
    }).catch(error => console.error('Error adding document:', error));
});

// Find matching plans
function findMatchingPlans(departure, destination, startDate, endDate) {
    const startRange = new Date(startDate);
    const endRange = new Date(endDate);
    startRange.setMonth(startRange.getMonth() - 1);
    endRange.setMonth(endRange.getMonth() + 1);

    db.collection('travelPlans')
        .where('departure', '==', departure)
        .where('destination', '==', destination)
        .where('startDate', '>=', startRange.toISOString().split('T')[0])
        .where('endDate', '<=', endRange.toISOString().split('T')[0])
        .get()
        .then(querySnapshot => {
            const matchList = document.getElementById('match-list');
            matchList.innerHTML = '';
            querySnapshot.forEach(doc => {
                const data = doc.data();
                const listItem = document.createElement('li');
                listItem.textContent = `Departure: ${data.departure}, Destination: ${data.destination}, Dates: ${data.startDate} - ${data.endDate}`;
                matchList.appendChild(listItem);
            });
            document.getElementById('matches').style.display = 'block';
        })
        .catch(error => console.error('Error getting documents:', error));
}
